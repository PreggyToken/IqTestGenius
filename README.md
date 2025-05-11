# GatsIQTest - AI-Powered IQ Assessment Platform

A responsive, modern IQ testing platform powered by Google's Gemini AI API. Users complete a registration form before taking an 8-question IQ test, which provides an estimated IQ score with detailed analysis.

## Project Structure

This is a monorepo with:
- `/client` - React frontend with Vite
- `/server` - Express.js backend
- `/shared` - Shared TypeScript types and schemas

## Local Development

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/gatsiqtest.git
cd gatsiqtest
```

2. Install dependencies:
```bash
# Root dependencies
npm install

# Client dependencies
cd client
npm install
cd ..

# Server dependencies
cd server
npm install
cd ..
```

3. Set up environment variables:
```bash
# Copy example files
cp .env.example .env
cp client/.env.example client/.env
```

4. Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your-gemini-api-key-here
```

5. Start development servers:
```bash
# Start both frontend and backend
npm run dev

# Or separately:
# Frontend
cd client && npm run dev

# Backend
cd server && npm run dev
```

## Deployment

### Backend Deployment (Render, Railway, etc.)

1. Set up your server hosting platform
2. Add environment variables:
   - `GEMINI_API_KEY`
   - `NODE_ENV=production`
3. Deploy with:
```bash
cd server
npm run build
npm start
```

### Frontend Deployment (Vercel)

1. Fork/push this repository to GitHub
2. Create a new project in Vercel
3. Link your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: (leave as default, configured in vercel.json)
   - Output Directory: (leave as default, configured in vercel.json)
5. Add environment variables:
   - `VITE_API_BASE_URL` (URL to your deployed backend API)
6. Deploy

## API Endpoints

- `GET /api/questions` - Get IQ test questions
- `POST /api/users` - Register a user
- `POST /api/results` - Submit test and get results
- `POST /api/results/download` - Download results as PDF

## Technologies

- Frontend: React, TailwindCSS, shadcn/ui, React Query
- Backend: Express.js, Drizzle ORM
- AI: Google Gemini API
- Testing: (To be added)

## License

MIT