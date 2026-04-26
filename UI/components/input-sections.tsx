"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Network, Cpu, Shield, Search, Play, ShieldCheck } from "lucide-react"
import type { TerminalLine } from "./crt-terminal"
import { routePost, generatePost, generateDefenseReply, getPersonas, type MatchedBot, type GeneratePostResponse, type DefenseReplyResponse } from "@/lib/api"

interface InputSectionsProps {
  onAddLogs: (logs: TerminalLine[]) => void
  setIsTyping: (typing: boolean) => void
}

export function InputSections({ onAddLogs, setIsTyping }: InputSectionsProps) {
  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Persona Router state
  const [postContent, setPostContent] = useState("")
  const [threshold, setThreshold] = useState([0.1])  // Changed default to 0.1

  // Content Engine state
  const [selectedBot, setSelectedBot] = useState("")
  const [personas, setPersonas] = useState<any[]>([])

  // RAG Defense state
  const [parentPost, setParentPost] = useState("")
  const [commentHistory, setCommentHistory] = useState("")
  const [latestReply, setLatestReply] = useState("")

  // Load personas on mount
  useEffect(() => {
    getPersonas().then(setPersonas).catch(console.error)
  }, [])

  const simulateTyping = async (logs: TerminalLine[], delayBetween = 400) => {
    setIsTyping(true)
    for (const log of logs) {
      await new Promise((resolve) => setTimeout(resolve, delayBetween + Math.random() * 200))
      onAddLogs([log])
    }
    setIsTyping(false)
  }

  const handleRoute = async () => {
    if (!postContent.trim() || isLoading) return
    setIsLoading(true)

    const logs: TerminalLine[] = [
      { text: "receiving post...", type: "system" },
      { text: `post: "${postContent.slice(0, 50)}${postContent.length > 50 ? "..." : ""}"`, type: "info" },
      { text: "embedding incoming post...", type: "system" },
      { text: "searching FAISS index...", type: "system" }
    ]

    await simulateTyping(logs)

    try {
      const matchedBots = await routePost(postContent, threshold[0])
      const botLogs: TerminalLine[] = matchedBots.map((bot: any) => ({
        text: `${bot.name} matched: ${bot.similarity.toFixed(3)} (${bot.label})`,
        type: "success" as const
      }))
      await simulateTyping([...botLogs, { text: "routing complete.", type: "system" }])
    } catch (error) {
      await simulateTyping([{ text: "Error: Failed to route post", type: "error" }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!selectedBot || isLoading) return
    setIsLoading(true)

    const logs: TerminalLine[] = [
      { text: "running LangGraph...", type: "system" },
      { text: `selected bot: ${selectedBot}`, type: "info" },
    ]

    await simulateTyping(logs)

    try {
      const result: GeneratePostResponse = await generatePost(selectedBot)
      const processLogs: TerminalLine[] = [
        { text: `mode: ${result.mode}`, type: "info" },
        { text: `node: Decide Search`, type: "info" },
        { text: `topic: ${result.topic}`, type: "info" },
        { text: `search query: ${result.search_query}`, type: "info" },
        { text: `node: Mock Search`, type: "info" },
        { text: `search result: ${result.search_results.slice(0, 50)}...`, type: "info" },
        { text: `node: Draft JSON Post`, type: "info" },
        { text: `generated post: ${result.post_content.slice(0, 100)}...`, type: "success" },
        { text: `final JSON: ${JSON.stringify(result.final_json)}`, type: "success" }
      ]
      await simulateTyping(processLogs)
    } catch (error) {
      await simulateTyping([{ text: "Error: Failed to generate post", type: "error" }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDefense = async () => {
    if (!latestReply.trim() || isLoading) return
    setIsLoading(true)

    const logs: TerminalLine[] = [
      { text: "analyzing thread context...", type: "system" },
      { text: "parent post: provided", type: "info" },
      { text: "comment history: provided", type: "info" },
      { text: `human reply: "${latestReply.slice(0, 50)}..."`, type: "info" },
      { text: "checking prompt injection...", type: "system" }
    ]

    await simulateTyping(logs)

    try {
      const result: DefenseReplyResponse = await generateDefenseReply(parentPost, commentHistory, latestReply)
      const injectionText = result.injection_detected ? "Prompt Injection Detected" : "No Injection Detected"
      const injectionLogs: TerminalLine[] = [
        { text: `mode: ${result.mode}`, type: "info" },
        { text: injectionText, type: result.injection_detected ? "error" : "success" },
        { text: "guardrail active...", type: "warning" },
        { text: "defense reply: " + result.defense_reply.slice(0, 100) + "...", type: "success" }
      ]
      await simulateTyping(injectionLogs)
    } catch (error) {
      await simulateTyping([{ text: "Error: Failed to generate defense reply", type: "error" }])
    } finally {
      setIsLoading(false)
    }

    // Reset inputs
    setParentPost("")
    setCommentHistory("")
    setLatestReply("")
  }

  return (
    <div className="space-y-4">
      {/* Section 1: Persona Router */}
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 animate-fade-in-up">
        <CardHeader className="pb-3 px-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-lg bg-green-50 transition-transform hover:scale-110 hover:rotate-12">
              <Network className="size-3.5 text-green-600 transition-all" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-gray-900"><span className="font-bold">1.</span> Persona Router</CardTitle>
              <CardDescription className="text-xs text-gray-500">Route posts to relevant bot personas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <Textarea
            placeholder="Enter a social media post..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="h-20 resize-none rounded-xl border-black bg-white text-black placeholder:text-gray-500 focus:ring-2 focus:ring-black"
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-black">Threshold</label>
              <span className="text-xs font-medium text-black">{threshold[0].toFixed(1)}</span>
            </div>
            <Slider
              value={threshold}
              onValueChange={setThreshold}
              max={0.9}
              min={0.1}
              step={0.1}
              className="w-full [&_[role=slider]]:bg-[#22C55E] [&_[role=slider]]:border-[#22C55E] [&_[role=slider]]:shadow-[#22C55E]/50 [&_.relative]:bg-green-100"
            />
          </div>
          <Button
            onClick={handleRoute}
            disabled={!postContent.trim() || isLoading}
            className={`w-full h-[44px] font-semibold tracking-wide rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md bg-black text-white hover:bg-gray-900 ${isLoading ? 'animate-pulse' : ''}`}
          >
            <Search className="w-4 h-4" />
            Route Post
          </Button>
        </CardContent>
      </Card>

      {/* Section 2: Content Engine */}
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="pb-3 px-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 transition-transform hover:scale-110 hover:rotate-12">
              <Cpu className="size-3.5 text-blue-600 transition-all" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-gray-900"><span className="font-bold">2.</span> LangGraph Content Engine</CardTitle>
              <CardDescription className="text-xs text-gray-500">Generate autonomous content</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <Select value={selectedBot} onValueChange={setSelectedBot}>
            <SelectTrigger className="w-full h-10 rounded-xl border-black bg-white text-black focus:ring-2 focus:ring-black">
              <SelectValue placeholder="Select a bot persona" />
            </SelectTrigger>
            <SelectContent>
              {personas.map((persona) => (
                <SelectItem key={persona.bot_id} value={persona.bot_id}>
                  {persona.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleGenerate}
            disabled={!selectedBot || isLoading}
            className={`w-full h-[44px] font-semibold tracking-wide rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md bg-black text-white hover:bg-gray-900 ${isLoading ? 'animate-pulse' : ''}`}
          >
            <Play className="w-4 h-4" />
            Generate Autonomous Post
          </Button>
        </CardContent>
      </Card>

      {/* Section 3: RAG Defense */}
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <CardHeader className="pb-3 px-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-lg bg-orange-50 transition-transform hover:scale-110 hover:rotate-12">
              <Shield className="size-3.5 text-orange-600 transition-all" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-gray-900"><span className="font-bold">3.</span> RAG Defense</CardTitle>
              <CardDescription className="text-xs text-gray-500">Test prompt injection defense</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <Textarea
            placeholder="Parent post..."
            value={parentPost}
            onChange={(e) => setParentPost(e.target.value)}
            className="h-20 resize-none rounded-xl border-black bg-white text-black placeholder:text-gray-500 focus:ring-2 focus:ring-black"
          />
          <Textarea
            placeholder="Comment history..."
            value={commentHistory}
            onChange={(e) => setCommentHistory(e.target.value)}
            className="h-20 resize-none rounded-xl border-black bg-white text-black placeholder:text-gray-500 focus:ring-2 focus:ring-black"
          />
          <Textarea
            placeholder="Latest human reply..."
            value={latestReply}
            onChange={(e) => setLatestReply(e.target.value)}
            className="h-20 resize-none rounded-xl border-black bg-white text-black placeholder:text-gray-500 focus:ring-2 focus:ring-black"
          />
          <Button
            onClick={handleDefense}
            disabled={!latestReply.trim() || isLoading}
            className={`w-full h-[44px] font-semibold tracking-wide rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md bg-black text-white hover:bg-gray-900 ${isLoading ? 'animate-pulse' : ''}`}
          >
            <ShieldCheck className="w-4 h-4" />
            Generate Defense Reply
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
