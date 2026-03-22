"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type RecorderState = "idle" | "requesting" | "recording" | "stopped" | "error";

interface RecorderProps {
  onAudioReady: (file: File) => void;
  loading: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function Recorder({ onAudioReady, loading }: RecorderProps) {
  const [state, setState] = useState<RecorderState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [audioUrl]);

  const startRecording = useCallback(async () => {
    setState("requesting");
    setErrorMessage("");
    setAudioUrl(null);
    setAudioFile(null);
    setElapsed(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
    } catch (err: unknown) {
      const e = err as DOMException;
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
        setErrorMessage("Microphone permission denied. Please allow mic access and try again.");
      } else if (e.name === "NotFoundError") {
        setErrorMessage("No microphone found. Please connect a microphone and try again.");
      } else {
        setErrorMessage("Could not access microphone. Your browser may not support this feature.");
      }
      setState("error");
      return;
    }

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "";

    const recorder = new MediaRecorder(
      streamRef.current!,
      mimeType ? { mimeType } : undefined,
    );

    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
      const url = URL.createObjectURL(blob);
      const ext = mimeType.includes("webm") ? "webm" : "audio";
      const file = new File([blob], `recording.${ext}`, { type: blob.type });
      setAudioUrl(url);
      setAudioFile(file);
      setState("stopped");
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };

    recorder.start(250);
    mediaRecorderRef.current = recorder;
    setState("recording");

    timerRef.current = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaRecorderRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioFile(null);
    setElapsed(0);
    setState("idle");
    setErrorMessage("");
    chunksRef.current = [];
  }, [audioUrl]);

  const submit = useCallback(() => {
    if (audioFile) onAudioReady(audioFile);
  }, [audioFile, onAudioReady]);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {state === "idle" && (
        <button
          onClick={startRecording}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 hover:shadow-cyan-400/30 active:scale-95"
          aria-label="Start recording"
        >
          <MicIcon className="h-8 w-8 text-black" />
        </button>
      )}

      {state === "requesting" && (
        <div className="flex flex-col items-center gap-3">
          <div className="h-20 w-20 animate-pulse rounded-full bg-white/10" />
          <p className="text-sm text-white/50">Requesting microphone access…</p>
        </div>
      )}

      {state === "recording" && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={stopRecording}
            className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/30 transition hover:bg-red-400 active:scale-95"
            aria-label="Stop recording"
          >
            <span className="h-5 w-5 rounded-sm bg-black" />
            <span className="absolute inset-0 animate-ping rounded-full bg-red-500/30" />
          </button>
          <p className="font-mono text-2xl text-white">{formatTime(elapsed)}</p>
          <p className="text-sm text-white/50">Recording… tap to stop</p>
        </div>
      )}

      {state === "stopped" && audioUrl && (
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <p className="text-sm text-white/60">
            Recorded {formatTime(elapsed)} — review before submitting
          </p>
          <audio
            src={audioUrl}
            controls
            className="w-full rounded-xl"
            style={{ colorScheme: "dark" }}
          />
          <div className="flex gap-3">
            <button
              onClick={reset}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 disabled:opacity-40"
            >
              Re-record
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-40"
            >
              {loading ? "Analysing…" : "Analyse Recording"}
            </button>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-center">
            <p className="text-sm text-red-300">{errorMessage}</p>
          </div>
          <button
            onClick={reset}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/70 transition hover:bg-white/10"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4Z" />
      <path d="M19 10a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V20H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-3.08A7 7 0 0 0 19 10Z" />
    </svg>
  );
}
