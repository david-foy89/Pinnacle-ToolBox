"use client";

import { useEffect, useRef, useState } from "react";
import { ToolInput, ToolButton, ToolCheckbox } from "@/components/tools/ui";

function playAlert() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    for (let i = 0; i < 3; i++) {
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.4);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.4 + 0.2);
    }
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  } catch {
    /* audio unavailable */
  }
}

export default function CountdownTimerTool() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [loop, setLoop] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalRef = useRef(0);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          setFinished(true);
          playAlert();
          if (loop) {
            setTimeout(() => {
              setRemaining(totalRef.current);
              setRunning(true);
              setFinished(false);
            }, 500);
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, loop]);

  const handleStart = () => {
    if (remaining === 0) {
      totalRef.current = totalSeconds;
      setRemaining(totalSeconds);
    }
    if (totalRef.current === 0) totalRef.current = totalSeconds;
    setFinished(false);
    setRunning(true);
  };

  const handlePause = () => setRunning(false);

  const handleReset = () => {
    setRunning(false);
    setRemaining(0);
    totalRef.current = 0;
    setFinished(false);
  };

  const display = remaining > 0 ? remaining : totalSeconds;
  const h = Math.floor(display / 3600);
  const m = Math.floor((display % 3600) / 60);
  const s = display % 60;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <ToolInput label="Hours" value={hours} onChange={(v) => setHours(Math.max(0, Number(v) || 0))} type="number" min={0} max={99} />
        <ToolInput label="Minutes" value={minutes} onChange={(v) => setMinutes(Math.max(0, Math.min(59, Number(v) || 0)))} type="number" min={0} max={59} />
        <ToolInput label="Seconds" value={seconds} onChange={(v) => setSeconds(Math.max(0, Math.min(59, Number(v) || 0)))} type="number" min={0} max={59} />
      </div>

      <ToolCheckbox label="Loop timer when finished" checked={loop} onChange={setLoop} />

      <div className="text-center">
        <p className="text-5xl font-bold tabular-nums text-gray-900">
          {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </p>
        {finished && !loop && (
          <p className="mt-2 text-sm font-medium text-accent">Time&apos;s up!</p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {!running ? (
          <ToolButton onClick={handleStart} disabled={totalSeconds === 0 && remaining === 0}>Start</ToolButton>
        ) : (
          <ToolButton onClick={handlePause}>Pause</ToolButton>
        )}
        <ToolButton onClick={handleReset} variant="secondary">Reset</ToolButton>
      </div>
    </div>
  );
}
