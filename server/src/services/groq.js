// server/src/services/groq.js - Groq AI Analysis Service
// Uses Groq's free API with Llama 3.3 70B model

const OpenAI = require("openai");

/**
 * Trim DOM string to fit within Groq's free tier token limit.
 * Rough rule: 1 token ≈ 4 chars. We budget ~6000 tokens for DOM = 24000 chars.
 */
function trimDOM(domString, maxChars = 24000) {
  if (!domString || domString.length <= maxChars) return domString;

  console.log(`   ⚠️  DOM too large (${domString.length} chars), trimming to ${maxChars}...`);

  // Keep the trimmed portion and add a note
  return domString.substring(0, maxChars) + "\n<!-- DOM truncated to fit token limit -->";
}

/**
 * Process a user query using Groq AI
 * @param {Object} request - Analysis request object
 * @param {string} apiKey - Groq API key from environment
 * @returns {Promise<{result: string, messages: Array}>}
 */
async function processQuery(request, apiKey) {
  if (!apiKey) {
    throw new Error(
      "Groq API key not found. Add GROQ_API_KEY to .dev.vars"
    );
  }

  console.log("   API Key present:", apiKey.substring(0, 10) + "...");

  const openai = new OpenAI({
    apiKey: apiKey.trim(),
    baseURL: "https://api.groq.com/openai/v1",
  });

  const { userQuery, screenshot, domString: rawDOM, previousMessages, sitemap } = request;
  const domString = trimDOM(rawDOM);

  const userMessage = `
You are an AI assistant designed to help users navigate within this specific website. Your task is to understand the user's query and provide step-by-step guidance using the available UI elements on the page. You have access to the following information:

1. A sitemap of the website
2. The DOM structure of the page

Here is the sitemap of the website:
<sitemap>
${sitemap}
</sitemap>

Here is the current DOM structure of the page:
<dom_structure>
${domString}
</dom_structure>

Here is the user's query:
<user_query>
${userQuery}
</user_query>

Your goal is to explain what's on the page in simple terms to fulfill the user's request. Please follow these steps:

1. Analyze the user's query and the DOM structure.
2. Identify the interactive elements that are most relevant to the user's goal.
3. If there's no direct match for the user's query, plan intermediate steps that would lead to the desired outcome.
4. Determine the sequence of element IDs to interact with (click, input, etc.) to achieve the user's goal.

Wrap your analysis inside <analysis> tags before providing the final output and provide the final output inside <response> tags. In your analysis:
- Map the user's query to specific actions or goals
- Outline potential paths to achieve the goal
- Consider and note any obstacles or intermediate steps

Consider the following:
- How does the user's query relate to the available elements in the DOM?
- What are the possible paths to achieve the user's goal?
- Are there any potential obstacles or intermediate steps required?

After your analysis, provide your response in the following JSON format:

{
  "reasoning": "A detailed explanation of how you determined the action sequence",
  "actions": ["div-div-a-3", "nav-div-a-1", ...],
  "narration": "A brief, concise, but friendly description of what you're doing for the user. Be enthusiastic and patient!",
  "taskAccomplished": true or false
}

The "reasoning" field should contain your step-by-step explanation of how you arrived at the action sequence. The "actions" field should be an array of 'data-unstuck-id' values from the DOM elements that need to be interacted with, in order. The "narration" field should be a short, user-friendly explanation of what steps you're taking. The "taskAccomplished" field should be true if you believe the user's goal has been achieved. False otherwise.

Remember:
- It's okay if there's no direct match for the user's query. In such cases, focus on the steps that would most likely lead to the user's final goal.
- Your response should be based solely on the information provided in the user query and DOM structure.
- Keep the narration friendly, but mainly concise and clear. Keep it to the point and don't ramble!
- Don't apologize if you can't immediately find the answer it's normal and expected to have intermediate steps.
- Ensure that your action sequence is logical and achievable given the available elements.
- Only set taskAccomplished to true if you are completely done with the user's query.
- ONLY include data-unstuck-id values in the actions array OR YOU WILL DIE.
- DO NOT SAY I'M SORRY I CAN'T FIND THE ANSWER AND GIVE UP OR YOU WILL DIE. You must thoroughly explore and click around the page to find the answer.

Please provide your analysis and response now.
`;

  const messages = [
    ...previousMessages,
    {
      role: "user",
      content: userMessage, // Groq doesn't support content arrays, plain string only
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
      max_tokens: 1024,
    });

    if (!completion.choices[0].message.content) {
      throw new Error("No response from Groq API");
    }

    const result = completion.choices[0].message.content;

    const assistantMessage = {
      role: "assistant",
      content: result,
    };

    return {
      result,
      messages: [...messages, assistantMessage],
    };
  } catch (error) {
    if (error.message.includes("401") || error.message.includes("auth") || error.message.includes("invalid_api_key")) {
      throw new Error(
        `Groq API authentication failed: ${error.message}. Check your GROQ_API_KEY in .dev.vars`
      );
    }
    if (error.message.includes("429")) {
      throw new Error(
        `Groq rate limit hit. Free tier allows 14,400 requests/day. Try again shortly.`
      );
    }
    throw new Error(`Groq API error: ${error.message}`);
  }
}

module.exports = { processQuery };