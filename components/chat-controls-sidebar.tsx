"use client"

import * as React from "react"
import { ChevronRight, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ChatControlsProps {
  systemPrompt: string
  temperature: number
  maxTokens: number
  onSystemPromptChange: (value: string) => void
  onTemperatureChange: (value: number) => void
  onMaxTokensChange: (value: number) => void
  onOpenChange?: (isOpen: boolean) => void
}

export function ChatControlsSidebar({
  systemPrompt,
  temperature,
  maxTokens,
  onSystemPromptChange,
  onTemperatureChange,
  onMaxTokensChange,
  onOpenChange,
}: ChatControlsProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleToggle = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    onOpenChange?.(newIsOpen)
  }

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-[5] transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => handleToggle()}
      />

      <div className={`
        fixed right-0 top-0 h-screen transition-all duration-300 z-10
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-x-full h-12 w-8 rounded-l-lg rounded-r-none border border-r-0 bg-background"
          onClick={handleToggle}
        >
          {isOpen ? <ChevronRight className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
        </Button>

        <Card className="h-full w-[300px] rounded-l-lg rounded-r-none border-r-0 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Chat Controls</h3>
          </div>
          
          <div className="p-4 space-y-6 flex-1 overflow-auto">
            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={systemPrompt}
                onChange={(e) => onSystemPromptChange(e.target.value)}
                className="min-h-[100px] resize-none"
                placeholder="Enter system prompt..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">
                Temperature: {temperature.toFixed(1)}
              </Label>
              <Slider
                id="temperature"
                min={0}
                max={2}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => onTemperatureChange(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Input
                id="maxTokens"
                type="number"
                min={1}
                max={4000}
                value={maxTokens}
                onChange={(e) => onMaxTokensChange(Number(e.target.value))}
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  )
} 