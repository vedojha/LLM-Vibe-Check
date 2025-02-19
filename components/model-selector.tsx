// components/model-selector.tsx
"use client"

import * as React from "react"
import { Bot, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Message } from "@/types/chat"

interface ModelSelectorProps {
  models: {
    id: string
    name: string
    provider: string
  }[]
  selectedModels: string[]
  onSelectModel: (modelId: string) => void
  onRemoveModel: (modelId: string) => void
  modelMessages: Record<string, Message[]>
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export function ModelSelector({
  models,
  selectedModels,
  onSelectModel,
  onRemoveModel,
  modelMessages,
  messagesEndRef
}: ModelSelectorProps) {
  // Calculate grid columns based on selected models count
  const gridCols = selectedModels.length === 0 ? 1 :
                   selectedModels.length === 1 ? 1 :
                   selectedModels.length === 2 ? 2 :
                   selectedModels.length === 3 ? 3 : 4

  return (
    <div className="container mx-auto max-w-7xl px-4 flex flex-col h-[calc(100vh-16rem)]">
      {/* Model Selection Pills */}
      <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg justify-center mb-4">
        {models.map(model => {
          const isSelected = selectedModels.includes(model.id)
          return (
            <Button
              key={model.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`
                gap-2 transition-all duration-200
                ${isSelected ? 'ring-2 ring-primary' : 'hover:bg-muted'}
              `}
              onClick={() => isSelected ? onRemoveModel(model.id) : onSelectModel(model.id)}
            >
              <Bot className="h-4 w-4" />
              {model.name}
              {isSelected && (
                <X className="h-3 w-3 text-muted-foreground" />
              )}
            </Button>
          )
        })}
      </div>

      {selectedModels.length > 0 ? (
        /* Selected Models Grid */
        <div className={`
          grid gap-4 w-full flex-1 mb-4
          ${selectedModels.length === 1 ? 'grid-cols-1' : 
            selectedModels.length === 2 ? 'grid-cols-2' : 
            selectedModels.length === 3 ? 'grid-cols-3' : 
            'grid-cols-4'}
        `}>
          <AnimatePresence>
            {selectedModels.map(modelId => {
              const model = models.find(m => m.id === modelId)
              if (!model) return null

              return (
                <motion.div
                  key={model.id}
                  layout
                  className="h-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                >
                  <Card className="flex flex-col h-full border-none rounded-lg overflow-hidden">
                    <div className="border-b p-4 flex items-center justify-between flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">{model.name}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onRemoveModel(model.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1 min-h-0">
                      <ScrollArea className="h-full">
                        <div className="flex flex-col p-4 space-y-4">
                          {modelMessages[model.id]?.map((message, index) => (
                            <div
                              key={index}
                              className="flex w-full"
                            >
                              <div
                                className={`max-w-[400px] ${
                                  message.role === "user"
                                    ? "ml-auto"
                                    : "mr-auto"
                                }`}
                              >
                                <div
                                  className={`inline-block px-4 py-3 rounded-2xl ${
                                    message.role === "user"
                                      ? "bg-primary text-primary-foreground rounded-tr-none"
                                      : "bg-secondary rounded-tl-none"
                                  } shadow-sm`}
                                >
                                  <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                                    {message.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State - Redesigned */
        <div className="flex flex-col items-center justify-center h-[calc(100vh-20rem)] bg-muted/30 rounded-lg p-8">
          <div className="bg-background rounded-full p-6 mb-6">
            <Bot className="h-12 w-12 text-primary/60" />
          </div>
          <h3 className="text-xl font-medium mb-3">Select Models to Compare</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Choose the AI models you want to compare from the options above. 
            You can select up to 4 models for side-by-side comparison.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Select models above</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Compare responses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Analyze differences</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 