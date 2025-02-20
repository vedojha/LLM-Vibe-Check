// app/docs/getting-started/page.tsx
"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Key, MessageSquare, Sparkles, Settings2, Bot, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GettingStartedPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-8 space-y-0">
      {/* Header */}
      <div className="space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">Getting Started</h1>
        <p className="text-2xl text-muted-foreground max-w-3xl leading-relaxed">
          Follow this guide to set up and start using the AI Comparison Platform
        </p>
      </div>

      {/* Setup Steps */}
      <div className="space-y-8">
        {/* API Keys Setup */}
        <Card className="p-10 hover:shadow-lg transition-shadow border-0 bg-muted/30 rounded-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Key className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">1. Configure API Keys</h2>
                <p className="text-xl text-muted-foreground">Set up your AI model access</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 mt-6">
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Required Keys</h3>
                <ul className="space-y-4 text-lg text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <Bot className="h-5 w-5" />
                    OpenAI API Key (GPT-4, GPT-3.5)
                  </li>
                  <li className="flex items-center gap-3">
                    <Bot className="h-5 w-5" />
                    Anthropic API Key (Claude)
                  </li>
                  <li className="flex items-center gap-3">
                    <Bot className="h-5 w-5" />
                    xAI API Key (Grok)
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Key Storage</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Keys are stored securely in your browser's local storage and are never sent to our servers.
                  They are only used to make direct API calls to the respective services.
                </p>
                <Button asChild variant="default" size="lg" className="gap-3 h-12 text-lg">
                  <Link href="/settings/api-keys">
                    <Settings2 className="h-5 w-5" />
                    Configure Keys
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Comparison Modes */}
        <Card className="p-10 hover:shadow-lg transition-shadow border-0 bg-muted/30 rounded-xl">
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">2. Choose Your Mode</h2>
                <p className="text-xl text-muted-foreground">Select how you want to compare models</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-medium">Single Chat Mode</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Chat with one model at a time. Perfect for focused conversations 
                    and testing individual model capabilities.
                  </p>
                </div>
                <Button asChild variant="default" size="lg" className="gap-3 h-12 text-lg w-auto">
                  <Link href="/chat">
                    Start Chat
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-medium">Comparison Mode</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Compare up to 4 models simultaneously in a grid view. 
                    Ideal for analyzing different approaches.
                  </p>
                </div>
                <Button asChild variant="default" size="lg" className="gap-3 h-12 text-lg w-auto">
                  <Link href="/compare">
                    Start Comparison
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Advanced Features */}
        <Card className="p-10 hover:shadow-lg transition-shadow border-0 bg-muted/30 rounded-xl">
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">3. Explore Features</h2>
                <p className="text-xl text-muted-foreground">Synthesis is a pretty cool feature</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="flex items-start gap-5">
                <div className="p-3 rounded-xl bg-muted">
                  <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Response Synthesis</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Use the synthesis button in comparison mode to get an AI-powered analysis 
                    of differences and similarities between model responses.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="p-3 rounded-xl bg-muted">
                  <Settings2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Model Parameters</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Fine-tune model behavior using the sidebar controls. Adjust system prompts,
                    temperature, and maximum tokens for optimal results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 