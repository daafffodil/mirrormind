# MirrorMind - AI Inspiration Capture & Analysis

## Overview
MirrorMind is a Next.js app that captures user inspirations (text) and uses AI to generate structured metadata including titles, summaries, product ideas, social media titles, next actions, and interest tags. It analyzes patterns in user interests over time.

## Architecture
- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS v4, Geist fonts
- **Backend**: Supabase (PostgreSQL), server-side data fetching
- **AI**: DashScope (Alibaba) Qwen-turbo model for content processing
- **Components**: Server components for data display, client components for forms

## Key Components
- `app/page.tsx`: Main page with inspiration list and interest analysis
- `app/components/CaptureBox.tsx`: Client component for text input and AI processing
- `app/api/generate-card/route.ts`: API route handling AI generation and Supabase storage
- `lib/supabaseClient.ts`: Supabase client configuration

## Data Flow
1. User enters text in CaptureBox
2. POST to `/api/generate-card` with text
3. API calls DashScope with structured prompt for JSON output
4. Parses AI response for title, summary, product_idea, xiaohongshu_title, next_action, interest_tags
5. Inserts into Supabase `inspirations` table
6. Page reloads to show new inspiration

## AI Prompt Pattern
Use this exact JSON format in prompts:
```json
{
  "title": "不超过12字标题",
  "summary": "一句简洁摘要，不超过40字", 
  "product_idea": "产品想法，不超过50字",
  "xiaohongshu_title": "小红书标题，不超过20字",
  "next_action": "下一步行动，不超过30字",
  "interest_tags": ["标签1", "标签2", "标签3"]
}
```

## Database Schema
`inspirations` table fields:
- `raw_text`: User input
- `ai_title`, `ai_summary`, `ai_product_idea`, `ai_xiaohongshu_title`, `ai_next_action`
- `ai_interest_tags`: string array for pattern analysis
- `status`: processing state

## Conventions
- UI text in Chinese (simplified)
- Interest tags: 1-3 per inspiration, single concepts (e.g., "AI", "产品", "创业")
- Error handling: Console logs + user alerts for failures
- Styling: Neutral color palette, rounded corners, shadow-sm borders

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `DASHSCOPE_API_KEY`

## Development
- `npm run dev`: Standard Next.js development
- No custom build steps or tests
- ESLint with Next.js config
- TypeScript with `@/*` path alias</content>
<parameter name="filePath">/Users/chenganan/mirrormind/.github/copilot-instructions.md