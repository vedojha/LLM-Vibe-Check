# AI Model Comparison Platform

A platform for comparing responses from different AI models side by side. This tool allows you to evaluate and analyze outputs from various AI models including OpenAI's GPT models, Anthropic's Claude and xAI's Grok.

## Features

- Real-time comparison of multiple AI models
- Secure client-side API key storage
- Response synthesis and analysis
- Customizable system prompts and parameters
- Side-by-side model comparison
- Chat history management
- Markdown support
- Dark/Light mode

## Getting Started

### Prerequisites

- npm or yarn
- API keys for the models you want to use

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys in `.env.local`
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Environment Variables

The following API keys are required to run the application:

- `OPENAI_API_KEY` - OpenAI API key for GPT models
- `ANTHROPIC_API_KEY` - Anthropic API key for Claude models
- `XAI_API_KEY` - xAI API key for Grok

You can also configure these keys in the application settings after launching.

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API route handlers
│   ├── chat/            # Chat interface pages
│   ├── compare/         # Comparison interface pages
│   └── docs/            # Documentation pages
├── components/          # React components
├── lib/                 # Utility functions
├── public/             # Static assets
└── types/              # TypeScript type definitions
```

## Security

- API keys are stored securely in the browser's local storage
- Keys are never sent to our servers
- All API calls are made directly from the client to the respective services
- Environment variables are properly handled using Next.js

## Development

This project uses:
- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Lucide](https://lucide.dev/) - Icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
