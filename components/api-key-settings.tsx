// components/api-key-settings.tsx
"use client"

import * as React from "react"
import { KeyRound } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ApiKey {
  id: string
  name: string
  envKey: string
  value: string
  placeholder: string
}

const API_KEYS: ApiKey[] = [
  {
    id: "openai",
    name: "OpenAI",
    envKey: "OPENAI_API_KEY",
    value: "",
    placeholder: "sk-...",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    envKey: "ANTHROPIC_API_KEY",
    value: "",
    placeholder: "sk-ant-...",
  },
  {
    id: "xai",
    name: "xAI",
    envKey: "XAI_API_KEY",
    value: "",
    placeholder: "grok-...",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    envKey: "DEEPSEEK_API_KEY",
    value: "",
    placeholder: "sk-...",
  },
]

export function ApiKeySettings() {
  const [keys, setKeys] = React.useState<Record<string, string>>({})
  const [envKeys, setEnvKeys] = React.useState<Record<string, boolean>>({})

  // Load saved keys from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("api_keys")
    if (saved) {
      setKeys(JSON.parse(saved))
    }
  }, [])

  // Check environment variables on mount
  React.useEffect(() => {
    const envKeyStatus: Record<string, boolean> = {}
    API_KEYS.forEach((key) => {
      envKeyStatus[key.envKey] = process.env[key.envKey] !== undefined
    })
    setEnvKeys(envKeyStatus)
  }, [])

  // Save keys to localStorage when they change
  React.useEffect(() => {
    localStorage.setItem("api_keys", JSON.stringify(keys))
  }, [keys])

  const handleKeyChange = (envKey: string, value: string) => {
    setKeys(prev => ({ ...prev, [envKey]: value }))
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">API Keys</h1>
        <p className="text-muted-foreground">
          Configure your API keys for different AI models. Keys are stored securely in your browser.
          If no key is provided, the system will use the default key from environment variables if available.
        </p>
      </div>

      <div className="space-y-4">
        {API_KEYS.map((key) => (
          <div key={key.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {key.name}
              </label>
              {envKeys[key.envKey] && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                  Default key available
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder={envKeys[key.envKey] ? "Using default key" : key.placeholder}
                value={keys[key.envKey] || ""}
                onChange={(e) => handleKeyChange(key.envKey, e.target.value)}
                className="pr-10"
              />
              <KeyRound className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-[0.8rem] text-muted-foreground">
              Environment variable: {key.envKey}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
} 