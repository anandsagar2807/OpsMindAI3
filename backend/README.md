# OpsMind AI - Backend

Production-grade Node.js backend for corporate knowledge management.

## Features

- JWT Authentication
- PDF Processing & Text Extraction
- AI Embeddings (Gemini/OpenAI)
- MongoDB Vector Storage
- Rate Limiting & Security
- Async Document Processing

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- Multer (file uploads)
- pdf-parse (PDF extraction)
- Google Gemini / OpenAI APIs
- JWT + bcryptjs

## Installation

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

## Environment Variables

See `.env.example` for all required variables.

## API Endpoints

See `/API_DOCUMENTATION.md` in project root.

## Project Structure

```
src/
├── config/          # Database & Multer config
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, errors
├── models/          # Mongoose schemas
├── routes/          # API routes
├── services/        # Business logic
└── server.js        # Express app
```

## Scripts

- `npm run dev` - Start with nodemon
- `npm start` - Production start

## License

MIT
