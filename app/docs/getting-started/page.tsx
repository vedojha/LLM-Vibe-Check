"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, MessageSquare, Sparkles, Key } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GettingStartedPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Getting Started</h1>
        <p className="text-xl text-muted-foreground">
          Follow these steps to begin comparing AI models
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Key className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">1. Set Up API Keys</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Configure your API keys for the different AI models you want to compare:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li>• OpenAI API key for GPT models</li>
              <li>• Anthropic API key for Claude</li>
              <li>• Grok API key for Grok models</li>
            </ul>
            <Link 
              href="/settings/api-keys"
              className="inline-flex items-center text-primary hover:underline mt-2"
            >
              Configure API Keys
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">2. Start a Comparison</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Begin comparing AI models in two ways:
            </p>
            <div className="space-y-4 ml-6">
              <div>
                <h3 className="font-medium mb-2">Single Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Chat with one AI model at a time and switch between models to compare responses.
                </p>
                <Button asChild variant="default" size="lg" className="gap-2">
                  <Link href="/chat">
                    Start Chat
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div>
                <h3 className="font-medium mb-2">Side-by-Side Comparison</h3>
                <p className="text-muted-foreground mb-4">
                  Compare responses from multiple models simultaneously in a grid view.
                </p>
                <Button asChild variant="default" size="lg" className="gap-2">
                  <Link href="/compare">
                    Start Comparison
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">3. Use Advanced Features</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Response Synthesis</h3>
                <p className="text-muted-foreground">
                  Use the synthesis button (magic wand icon) in comparison view to get an AI-powered 
                  analysis of the differences and similarities between model responses.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Chat History</h3>
                <p className="text-muted-foreground">
                  Access your past conversations and comparisons from the sidebar. All chats are 
                  saved locally in your browser.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Tips for Better Comparisons</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Use clear, specific prompts to get the most meaningful comparisons</li>
          <li>• Try different types of tasks to understand model strengths</li>
          <li>• Use the synthesis feature to identify subtle differences</li>
          <li>• Save interesting comparisons for future reference</li>
        </ul>
      </div>
    </div>
  )
} 