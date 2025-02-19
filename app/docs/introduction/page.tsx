"use client"

import { Card } from "@/components/ui/card"
import { Bot, Wand2, Scale } from "lucide-react"

export default function IntroductionPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">AI Model Comparison Platform</h1>
        <p className="text-xl text-muted-foreground">
          A powerful platform for comparing responses from different AI language models side by side.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Multiple Models</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Compare responses from leading AI models including GPT-4, Claude, and Grok. 
            See how different models approach the same prompt and understand their unique characteristics.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Side-by-Side Comparison</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            View responses from all models simultaneously in a clean, organized interface. 
            Easily spot differences in reasoning, style, and approach between models.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Response Synthesis</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Use our unique synthesis feature to automatically analyze and compare responses across models. 
            Get insights into common themes, differences in approach, and key points of agreement.
          </p>
        </Card>
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Why Compare AI Models?</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Understand the strengths and weaknesses of different models</li>
          <li>• Choose the best model for specific use cases</li>
          <li>• Gain deeper insights by combining multiple perspectives</li>
          <li>• Evaluate model performance and consistency</li>
          <li>• Stay informed about AI capabilities across platforms</li>
        </ul>
      </div>
    </div>
  )
} 