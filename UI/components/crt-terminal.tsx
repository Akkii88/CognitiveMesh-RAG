"use client"

import { useEffect, useRef } from "react"

export interface TerminalLine {
  text: string
  type: "info" | "success" | "error" | "warning" | "system"
}

interface CRTTerminalProps {
  lines: TerminalLine[]
  isTyping: boolean
  onClear: () => void
}

export function CRTTerminal({ lines, isTyping, onClear }: CRTTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "success":
        return "text-emerald-400"
      case "error":
        return "text-red-400"
      case "warning":
        return "text-amber-400"
      case "system":
        return "text-cyan-400"
      default:
        return "text-emerald-300"
    }
  }

  return (
    <div className="relative w-full">
      {/* Computer Frame */}
      <div className="relative w-full min-h-[500px]">
        {/* Top bezel */}
        <div className="rounded-t-3xl bg-gradient-to-b from-neutral-300 to-neutral-400 px-8 py-4 dark:from-neutral-700 dark:to-neutral-800">
          <div className="flex items-center justify-center gap-2">
            <div className="size-2 rounded-full bg-neutral-500 dark:bg-neutral-600" />
            <span className="font-mono text-xs tracking-widest text-neutral-600 dark:text-neutral-400">
              COGNITIVE MESH TERMINAL
            </span>
            <div className="size-2 rounded-full bg-neutral-500 dark:bg-neutral-600" />
          </div>
        </div>

        {/* Screen Container */}
        <div className="relative bg-gradient-to-b from-neutral-400 to-neutral-500 px-6 pb-6 dark:from-neutral-800 dark:to-neutral-900 terminal-glow">
          {/* Inner Screen Bezel */}
          <div className="rounded-lg bg-neutral-900 p-2 shadow-[inset_0_2px_20px_rgba(0,0,0,0.8)]">
            {/* CRT Screen */}
            <div className="relative overflow-hidden rounded bg-neutral-950 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)] min-h-[360px]" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
              {/* Animated Scanlines overlay */}
              <div className="scanline"></div>
              <div
                className="pointer-events-none absolute inset-0 z-10 opacity-5"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16, 185, 129, 0.1) 2px, rgba(16, 185, 129, 0.1) 4px)",
                }}
              />

              {/* Screen glow */}
              <div className="pointer-events-none absolute inset-0 z-10 rounded bg-emerald-500/5" />

              {/* Terminal content */}
              <div
                ref={scrollRef}
                className="h-80 overflow-y-auto p-4 font-mono text-sm scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-700"
              >
                {lines.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-neutral-600">
                    <span className="animate-pulse">Awaiting input...</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {lines.map((line, index) => (
                      <div key={index} className={`${getLineColor(line.type)} leading-relaxed`}>
                        <span className="mr-2 text-neutral-600">{">"}</span>
                        {line.text}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex items-center gap-1 text-emerald-400">
                        <span className="text-neutral-600">{">"}</span>
                        <span className="inline-block h-4 w-2 animate-pulse bg-emerald-400" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bezel with controls */}
        <div className="rounded-b-3xl bg-gradient-to-b from-neutral-500 to-neutral-400 px-8 py-4 dark:from-neutral-900 dark:to-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Power LED */}
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-xs text-neutral-600 dark:text-neutral-400">PWR</span>
              </div>
              {/* Activity LED */}
              <div className="flex items-center gap-2">
                <div
                  className={`size-2 rounded-full transition-colors ${isTyping ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" : "bg-neutral-600"}`}
                />
                <span className="text-xs text-neutral-600 dark:text-neutral-400">ACT</span>
              </div>
            </div>

            <div className="flex gap-2">
            <button
              onClick={onClear}
              className="text-xs tracking-widest text-gray-600 hover:text-gray-900 px-2 py-1 rounded transition-colors hover:bg-black/5 uppercase"
            >
              CLEAR
            </button>
            <button
              onClick={() => {
                // Reset to initial boot logs
                onClear()
              }}
              className="text-xs tracking-widest text-gray-600 hover:text-gray-900 px-2 py-1 rounded transition-colors hover:bg-black/5 uppercase"
            >
              REPLAY
            </button>
              <button
                onClick={() => {
                  // Reset to initial boot logs
                  onClear()
                }}
                className="rounded bg-neutral-600 px-3 py-1 font-mono text-xs text-neutral-300 transition-all duration-200 hover:bg-neutral-500 hover:scale-105 active:scale-95 dark:bg-neutral-700 dark:hover:bg-neutral-600"
              >
                REPLAY
              </button>
            </div>
          </div>
        </div>

        {/* Stand */}
        <div className="mx-auto h-4 w-48 rounded-b-lg bg-gradient-to-b from-neutral-400 to-neutral-500 dark:from-neutral-800 dark:to-neutral-900" />
        <div className="mx-auto h-2 w-64 rounded-b-lg bg-gradient-to-b from-neutral-500 to-neutral-400 dark:from-neutral-900 dark:to-neutral-800" />
      </div>
    </div>
  )
}
