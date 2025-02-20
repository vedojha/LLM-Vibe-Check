"use client"

import { Card } from "@/components/ui/card"
import { Github, Heart, Lock, Rocket, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-8 space-y-16">
      {/* Mission Section */}
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          About the Platform
        </h1>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Building the future of AI model evaluation and comparison through open collaboration and innovation
        </p>
      </div>

      {/* Core Values Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow border-0 bg-muted/30 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Security First</h3>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your API keys and data never leave your browser. We use client-side encryption
            and local storage to ensure maximum security and privacy.
          </p>
        </Card>

        <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow border-0 bg-muted/30 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Github className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Open Source</h3>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Built in the open with the community. Our code is freely available on GitHub,
            and we welcome contributions from developers worldwide.
          </p>
        </Card>

        <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow border-0 bg-muted/30 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Community Driven</h3>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Developed based on real needs from AI researchers, developers, and enthusiasts.
            Your feedback shapes our roadmap.
          </p>
        </Card>

        <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow border-0 bg-muted/30 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Future Ready</h3>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Continuously evolving to support new models, features, and use cases as the
            AI landscape expands.
          </p>
        </Card>
      </div>

      {/* Technical Architecture */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Technical Architecture</h2>
        <div className="bg-muted/30 p-8 rounded-xl space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Built with modern web technologies for maximum performance and security:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Next.js 14 with React Server Components</li>
            <li>• TailwindCSS for responsive design</li>
            <li>• Client-side API handling for security</li>
            <li>• Local storage for session management</li>
            <li>• Real-time streaming responses</li>
          </ul>
        </div>
      </div>

      {/* Roadmap */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Roadmap</h2>
        <div className="space-y-4">
          <div className="bg-muted/30 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">Q2 2024</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Support for more AI models</li>
              <li>• Enhanced analysis tools</li>
              <li>• Custom evaluation metrics</li>
            </ul>
          </div>
          <div className="bg-muted/30 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">Q3 2024</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Collaborative features</li>
              <li>• Advanced prompt templates</li>
              <li>• Performance benchmarking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-2xl font-medium">
          <Heart className="h-8 w-8 text-primary" />
          Made with love by the community
        </div>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="h-12 px-8 text-lg">
            <Link href="https://github.com">Contribute on GitHub</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 text-lg">
            <Link href="/docs/getting-started">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 