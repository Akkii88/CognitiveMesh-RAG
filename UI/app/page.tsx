"use client"

import { useState } from "react"
import { CRTTerminal, type TerminalLine } from "@/components/crt-terminal"
import { InputSections } from "@/components/input-sections"
import { Button } from "@/components/ui/button"
import { Github, Mail, Zap, Brain, Shield } from "lucide-react"

export default function Home() {
  const [terminalLogs, setTerminalLogs] = useState<TerminalLine[]>([
    { text: "CognitiveMesh-RAG v1.0.0", type: "system" },
    { text: "STATUS: ONLINE", type: "system" },
    { text: "system ready.", type: "system" },
    { text: "waiting for user command...", type: "system" }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const handleAddLogs = (newLogs: TerminalLine[]) => {
    setTerminalLogs((prev) => [...prev, ...newLogs])
  }

  const handleClear = () => {
    setTerminalLogs([
      { text: "CognitiveMesh-RAG v1.0.0", type: "system" },
      { text: "STATUS: ONLINE", type: "system" },
      { text: "system ready.", type: "system" },
      { text: "waiting for user command...", type: "system" }
    ])
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 relative overflow-visible">
      {/* Background gradient blobs */}
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>
      <div className="bg-blob-3"></div>

      {/* Hero Section - Full width, upper half */}
      <section className="min-h-[50vh] flex items-center px-6 py-16 relative z-10">
        <div className="mx-auto max-w-6xl w-full">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 animate-fade-in-down">
              <Zap className="size-4" />
              AI Engineering Assignment
            </div>

            <div className="animate-fade-in-up">
              <h1 className="text-balance text-5xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-6xl">
                Cognitive Mesh
                <span className="mt-1 block text-emerald-600 dark:text-emerald-400">Control System</span>
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-pretty text-xl leading-relaxed text-neutral-600 dark:text-neutral-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                A live demonstration of cognitive routing, LangGraph content generation, and RAG defense mechanisms. Control the system below and watch execution unfold in real-time.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Brain className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Persona Routing</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Zap className="size-4 text-cyan-600 dark:text-cyan-400" />
                <span>LangGraph Engine</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Shield className="size-4 text-amber-600 dark:text-amber-400" />
                <span>RAG Defense</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Button variant="outline" size="sm" asChild className="transition-transform hover:scale-105 active:scale-95">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 size-4" />
                  View Source
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild className="transition-transform hover:scale-105 active:scale-95">
                <a href="mailto:ankitdabur08@gmail.com">
                  <Mail className="mr-2 size-4" />
                  Contact
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* System Controls */}
      <section id="system-controls" className="relative overflow-visible px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">System Controls</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Interact with the inputs below to see live execution on the terminal
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[37%_63%] lg:items-start overflow-visible">
            <div className="max-w-[380px] space-y-4 pt-4">
              <InputSections onAddLogs={handleAddLogs} setIsTyping={setIsTyping} />
            </div>

            <aside className="hidden lg:block sticky top-6 self-start h-fit">
              <div className="w-full max-w-[760px] mx-auto" style={{ filter: 'drop-shadow(0 30px 40px rgba(0, 0, 0, 0.18))' }}>
                <CRTTerminal lines={terminalLogs} isTyping={isTyping} onClear={handleClear} />
              </div>
            </aside>

            {/* Mobile Terminal - Below Controls */}
            <div className="lg:hidden mt-12">
              <CRTTerminal lines={terminalLogs} isTyping={isTyping} onClear={handleClear} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center">
          <div className="text-sm text-gray-600">
            CognitiveMesh-RAG · Built for AI Engineering Assignment
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">Made by Ankit</span>
            <span className="mx-2">·</span>
            <a href="mailto:ankitdabur08@gmail.com" className="text-gray-500 hover:underline transition-colors">
              ankitdabur08@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
