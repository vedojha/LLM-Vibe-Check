"use client"

import { Card } from "@/components/ui/card"
import { Github, Heart, Lock, Rocket, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-8 space-y-8">
      {/* Mission Section */}
      <div className="space-y-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
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

      <div className="text-center space-y-8 mt-16">
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="h-12 px-4 text-lg">
            <Link href="/docs/getting-started">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 