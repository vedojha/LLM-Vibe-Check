"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

interface SynthesisModalProps {
  isOpen: boolean
  onClose: () => void
  content: string
  isLoading: boolean
}

function formatSynthesisContent(content: string) {
  // Split content into sections based on numbered headers
  const sections = content.split(/(?=\d\.\s)/).filter(Boolean)
  
  return sections.map((section, index) => {
    const [title, ...content] = section.split('\n').filter(Boolean)
    
    // Determine section type from title
    const sectionType = title.includes("Comprehensive") ? "synthesis" :
                       title.includes("Differences") ? "differences" :
                       title.includes("Summary") ? "summary" : "other"
    
    return {
      title: title.replace(/^\d\.\s/, '').trim(),
      content: content.join('\n').trim(),
      type: sectionType
    }
  })
}

export function SynthesisModal({ isOpen, onClose, content, isLoading }: SynthesisModalProps) {
  if (!isOpen) return null

  const formattedSections = React.useMemo(() => 
    formatSynthesisContent(content),
    [content]
  )

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col relative animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Synthesis of AI Responses</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-muted-foreground">
                Synthesizing responses...
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {formattedSections.map((section, index) => (
                <section 
                  key={index}
                  className={`
                    space-y-3 p-4 rounded-lg
                    ${section.type === 'synthesis' ? 'bg-primary/5' : ''}
                    ${section.type === 'differences' ? 'bg-secondary/5' : ''}
                    ${section.type === 'summary' ? 'bg-muted' : ''}
                  `}
                >
                  <h3 className="text-lg font-semibold tracking-tight">
                    {section.title}
                  </h3>
                  <div className="text-sm leading-relaxed space-y-2">
                    {section.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="text-muted-foreground">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  )
} 