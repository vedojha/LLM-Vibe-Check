"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  User, 
  CreditCard, 
  Paintbrush, 
  Settings2,
  Moon,
  Sun
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 space-y-8">
      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Profile Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="your@email.com" />
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Paintbrush className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Appearance</h2>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Theme</Label>
            <p className="text-sm text-muted-foreground">
              Customize how the app looks
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Sun className="h-4 w-4 mr-2" />
              Light
            </Button>
            <Button variant="outline" size="sm">
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </Button>
          </div>
        </div>
      </Card>

      {/* Default Model Parameters */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings2 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Model Defaults</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Default Temperature</Label>
            <Slider 
              defaultValue={[0.7]} 
              max={1} 
              step={0.1}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Response Length</Label>
            <Input type="number" placeholder="2048" />
          </div>
        </div>
      </Card>

      {/* Billing */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Billing</h2>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Current Plan</Label>
            <p className="text-sm text-muted-foreground">
              LLM Comparison (Free Tier)
            </p>
          </div>
          <Button variant="default">Upgrade Plan</Button>
        </div>
      </Card>
    </div>
  )
}