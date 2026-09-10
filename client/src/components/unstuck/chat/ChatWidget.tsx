"use client";

import { WorkflowCreator } from "@/components/WorkflowCreator";
import { useUnstuck } from "@/contexts/UnstuckContext";
import { parseGemini } from "@/lib/extract";
import { getSitemap } from "@/utils/siteMetadata";
import { useCallback, useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom/client";
import { MaximizedChat } from "./MaximizedChat";
import { MinimizedChat } from "./MinimizedChat";
import { NeedHelpButton } from "./NeedHelpButton";
import { ChatMessage, ChatState, ErrorState, LoadingState } from "./types";

// Extend window type for cross-browser SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function ChatWidget() {
  const [chatState, setChatState]           = useState<ChatState>("closed");
  const [isWorkflowActive, setIsWorkflowActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing]       = useState(false);
  const [chatMessages, setChatMessages]     = useState<ChatMessage[]>([]);
  const [input, setInput]                   = useState("");
  const [error, setError]                   = useState<ErrorState | undefined>();
  const [loading, setLoading]               = useState<LoadingState | undefined>();
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isRecording, setIsRecording]       = useState(false);
  const [isCallActive, setIsCallActive]     = useState(false);

  const { getCurrentContext, setUserQuery, apiKey, serverUrl } = useUnstuck();
  const currentAudioRef  = useRef<HTMLAudioElement | null>(null);
  const recognitionRef   = useRef<SpeechRecognition | null>(null);
  const isMounted        = useRef(true);

  const successMessages = [
    "Looks like we found what you were looking for. Let me know if you need anything else!",
    "Perfect! We've reached your destination. Need help with anything else?",
    "Mission accomplished! What else can I help you with?",
    "We made it! Feel free to ask me about anything else.",
    "Success! Is there anything else you'd like to explore?",
    "There we go! Don't hesitate to ask if you need more guidance.",
    "All set! I'm here if you need any other assistance.",
  ];

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const showError = (message: string) => {
    setError({ message, timestamp: Date.now() });
    setTimeout(() => setError(undefined), 5000);
  };

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
  }, []);

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      isMounted.current = false;
      stopRecognition();
    };
  }, []);

  useEffect(() => {
    if (isMounted.current && isCallActive && chatState !== "open") {
      console.log("pausing recognition due to chat state change");
      stopRecognition();
      setIsCallActive(false);
      setIsRecording(false);
    }
  }, [chatState, isCallActive, stopRecognition]);

  // ─── TTS ──────────────────────────────────────────────────────────────────

  const playTextToSpeech = async (text: string) => {
    if (!isVoiceEnabled) return;
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      const response = await fetch(`${serverUrl}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        showError(errorData.error || "Failed to play audio message");
        return;
      }
      const audioBlob = await response.blob();
      if (!audioBlob || audioBlob.size === 0)
        throw new Error("No audio data received");

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };
      await audio.play();
    } catch (error) {
      console.error("Error playing text-to-speech:", error);
      showError("Failed to play audio message");
    }
  };

  // ─── Speech Recognition (Web Speech API — 100% free, runs in browser) ────

  /**
   * Creates a SpeechRecognition instance.
   * onResult is called with the final transcript string.
   */
  const createRecognition = useCallback(
    (onResult: (transcript: string) => void): SpeechRecognition | null => {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        showError("Speech recognition not supported. Please use Chrome or Edge.");
        return null;
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous    = false;
      recognition.interimResults = false;
      recognition.lang          = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const last       = event.results.length - 1;
        const transcript = event.results[last][0].transcript.trim();
        if (event.results[last].isFinal && transcript) {
          console.log("Speech detected, transcript:", transcript);
          onResult(transcript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech" && event.error !== "aborted") {
          showError("Microphone error: " + event.error);
        }
        setIsCallActive(false);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsCallActive(false);
        setIsRecording(false);
      };

      return recognition;
    },
    []
  );

  // ─── Call mode (click mic → speak → auto-submit) ──────────────────────────

  const startCall = useCallback(async () => {
    try {
      stopRecognition();
      setIsCallActive(true);
      setChatState("open");
      console.log("Starting Web Speech API...");

      const recognition = createRecognition(async (transcript) => {
        stopRecognition();
        setIsCallActive(false);
        await handleHelp(transcript);
      });

      if (!recognition) {
        setIsCallActive(false);
        return;
      }

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error("Error starting call:", error);
      showError("Failed to start voice detection");
      setIsCallActive(false);
    }
  }, [createRecognition, stopRecognition]);

  // ─── Push-to-talk recording ───────────────────────────────────────────────

  const startRecording = async () => {
    try {
      stopRecognition();
      const recognition = createRecognition(async (transcript) => {
        stopRecognition();
        setIsRecording(false);
        await handleHelp(transcript);
      });

      if (!recognition) return;

      recognitionRef.current = recognition;
      setIsRecording(true);
      recognition.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      showError("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    stopRecognition();
    setIsRecording(false);
  };

  // ─── Main agent loop ──────────────────────────────────────────────────────

  const handleHelp = async (userQuery: string) => {
    setError(undefined);
    const sitemap = await getSitemap();
    console.log("sitemap: ", sitemap);
    setIsAnalyzing(true);
    setChatMessages((prev) => [...prev, { role: "user", content: userQuery }]);
    setLoading({ isLoading: true, message: "Thinking..." });

    console.log("starting agent loop");
    let taskAccomplished  = false;
    let iterations        = 0;
    let previousMessages: any[] = [];
    let isGeneralResponse = false;

    try {
      while (!taskAccomplished) {
        const { domString, screenshot } = await getCurrentContext();
        console.log("Iteration: ", iterations);
        console.log("previousMessages: ", previousMessages);

        const response = await fetch(`${serverUrl}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
          body: JSON.stringify({
            userQuery,
            screenshot,
            domString,
            previousMessages,
            sitemap,
          }),
        });

        if (!response.ok) throw new Error("Failed to analyze your request");

        const data          = await response.json();
        const parsedGemini  = parseGemini(data.result);
        console.log("parsedGemini: ", parsedGemini);

        if (parsedGemini.taskAccomplished && parsedGemini.actions.length === 0)
          break;

        const assistantMessage =
          parsedGemini.generalResponse ||
          parsedGemini.narration ||
          parsedGemini.reasoning ||
          "I'll help you with that.";

        setLoading(undefined);
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantMessage },
        ]);
        await playTextToSpeech(assistantMessage);

        if (parsedGemini.generalResponse) {
          isGeneralResponse = true;
          break;
        }

        if (parsedGemini.actions && parsedGemini.actions.length > 0) {
          const firstAction = parsedGemini.actions[0];
          setIsWorkflowActive(true);
          setChatState("minimized");

          const workflowPromise = new Promise<void>((resolve) => {
            const container = document.createElement("div");
            document.body.appendChild(container);
            const root = ReactDOM.createRoot(container);
            root.render(
              <WorkflowCreator
                elementId={firstAction}
                onComplete={() => {
                  requestAnimationFrame(() => {
                    root.unmount();
                    if (container.parentNode)
                      container.parentNode.removeChild(container);
                    resolve();
                  });
                }}
                autoStart={true}
              />
            );
          });

          await workflowPromise;
        }

        previousMessages  = data.messages;
        iterations++;
        taskAccomplished  = parsedGemini.taskAccomplished;

        if (!taskAccomplished)
          setLoading({ isLoading: true, message: "Thinking..." });
      }

      setIsWorkflowActive(false);
      const randomMessage =
        successMessages[Math.floor(Math.random() * successMessages.length)];
      if (!isGeneralResponse) await playTextToSpeech(randomMessage);

    } catch (error) {
      console.error("Error analyzing page:", error);
      showError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setIsWorkflowActive(false);
      setChatState("open");
    } finally {
      setIsAnalyzing(false);
      setLoading(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAnalyzing) return;
    const query = input;
    setInput("");
    await handleHelp(query);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed bottom-8 right-8 z-[999] pointer-events-none"
      id="chat-widget"
    >
      {/* Minimized view */}
      <div
        className={`
          transform transition-all duration-300 ease-out origin-bottom-right absolute bottom-0 right-0
          ${chatState === "minimized"
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "translate-y-4 opacity-0 scale-95"}
        `}
      >
        <MinimizedChat
          isWorkflowActive={isWorkflowActive}
          latestMessage={chatMessages[chatMessages.length - 1]?.content}
          error={error}
          loading={loading}
          onMaximize={() => setChatState("open")}
        />
      </div>

      {/* Main chat widget */}
      <div
        className={`
          transform transition-all duration-300 ease-out origin-bottom-right absolute bottom-0 right-0
          ${chatState !== "minimized"
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-4 opacity-0 scale-95"}
        `}
      >
        {/* Expanded chat */}
        <div
          className={`
            transform transition-all duration-300 ease-out origin-bottom-right
            ${chatState === "open"
              ? "scale-100 opacity-100 pointer-events-auto"
              : "scale-95 opacity-0"}
          `}
        >
          <MaximizedChat
            messages={chatMessages}
            isAnalyzing={isAnalyzing}
            input={input}
            error={error}
            loading={loading}
            isVoiceEnabled={isVoiceEnabled}
            isRecording={isRecording}
            isCallActive={isCallActive}
            onVoiceToggle={() => setIsVoiceEnabled(!isVoiceEnabled)}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            onMinimize={() => setChatState("minimized")}
            onClose={() => setChatState("closed")}
            onStartCall={startCall}
          />
        </div>

        {/* Need help button */}
        <div
          className={`
            transform transition-all duration-200 ease-out absolute bottom-0 right-0
            ${chatState === "closed"
              ? "scale-100 opacity-100 pointer-events-auto"
              : "scale-95 opacity-0"}
          `}
        >
          <NeedHelpButton onClick={() => setChatState("open")} />
        </div>
      </div>
    </div>
  );
}