// app/docs/introduction/page.tsx
"use client"

import { Card } from "@/components/ui/card"
import { Scale, Zap, Brain, GitCompare } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function IntroductionPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-8 space-y-16">
      {/* Hero Section */}
      <div className="space-y-8 text-center">
        <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          AI Model Comparison Platform
        </h1>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Compare responses from leading AI models side by side, analyze their differences, 
          and gain deeper insights into their unique capabilities.
        </p>
        <div className="flex gap-4 justify-center pt-6">
          <Button asChild size="lg" className="h-12 px-8 text-lg">
            <Link href="/compare">Start Comparing</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 text-lg">
            <Link href="/docs/getting-started">Read Guide</Link>
          </Button>
        </div>
      </div>

      {/* Key Features */}
      <div>
        <h2 className="text-3xl font-bold mb-8">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow border-0 bg-muted/30 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <GitCompare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Multi-Model Comparison</h3>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Compare responses from GPT-4, Claude 3.5 Sonnet, Grok, and more in real-time. 
              See how different models interpret and respond to the same prompts.
            </p>
          </Card>
          <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow border-0 bg-muted/30 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Advanced Analysis</h3>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Use AI-powered synthesis to automatically analyze differences in reasoning, 
              approach, and insights across multiple model responses.
            </p>
            </Card>

          <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow border-0 bg-muted/30 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Real-Time Streaming</h3>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Watch as multiple models generate responses simultaneously. 
              Experience seamless, streaming responses with no waiting time.
            </p>
          </Card>

          <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow border-0 bg-muted/30 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Scale className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Fine-Tuned Control</h3>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Customize system prompts, temperature, and token limits. 
              Save and manage your API keys securely in your browser.
            </p>
          </Card>
        </div>
      </div>

      {/* Use Cases */}
      <div>
        <h2 className="text-3xl font-bold mb-8">Use Cases</h2>
        <div className="grid gap-6 text-muted-foreground">
          <div className="bg-muted/50 p-8 rounded-xl hover:bg-muted/70 transition-colors">
            <h3 className="text-2xl font-medium text-foreground mb-4">Research & Analysis</h3>
            <ul className="space-y-3 ml-6 text-lg">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                Compare model reasoning and problem-solving approaches
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                Analyze differences in knowledge and capabilities
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                Study model biases and limitations
              </li>
            </ul>
          </div>
          
          <div className="bg-muted/50 p-8 rounded-xl hover:bg-muted/70 transition-colors">
            <h3 className="text-2xl font-medium text-foreground mb-4">Development & Testing</h3>
            <ul className="space-y-3 ml-6 text-lg">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                Test prompts across multiple models
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                Evaluate model performance for specific tasks
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                Choose the best model for your use case
              </li>
            </ul>
          </div>
          
          <div className="bg-muted/50 p-8 rounded-xl hover:bg-muted/70 transition-colors">
            <h3 className="text-2xl font-medium text-foreground mb-4">Learning & Exploration</h3>
            <ul className="space-y-3 ml-6 text-lg">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                Understand model strengths and weaknesses
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                Learn from different approaches to the same problem
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                Stay updated on AI capabilities
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 