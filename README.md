# ResumeForge Pro

A professional AI-powered resume builder with advanced features including ATS optimization, AI bullet rewriting, interview preparation, and cover letter generation.

## Features

- **8 Professional Templates**: Modern, ATS-friendly, Creative, Executive, Minimalist, Tech, Compact, and Professional
- **AI-Powered Analysis**: 
  - ATS Score Checker with industry benchmarks
  - Resume bullet point rewriter
  - Job description analyzer
  - Interview question generator
- **Smart Resume Builder**: Guided wizard with real-time preview
- **Cover Letter Generator**: AI-powered personalized cover letters
- **AI Chat Assistant**: Career advice and resume optimization tips
- **Export Options**: PDF download with professional formatting

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Framer Motion
- React Router
- Lucide Icons

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Stripe (Payment processing)
- OpenAI API (AI features)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd ResumeForge-Pro
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Configure environment variables

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resumeforge
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
STRIPE_SECRET_KEY=your_stripe_key
OPENAI_API_KEY=your_openai_api_key
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
ResumeForge-Pro/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   └── package.json
├── server/
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middleware/        # Express middleware
│   ├── config/            # Configuration files
│   └── package.json
└── DEPLOYMENT.md          # Deployment guide
```

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Resume Routes
- `POST /api/resume/create` - Create new resume
- `GET /api/resume/:id` - Get resume by ID
- `PUT /api/resume/:id` - Update resume
- `DELETE /api/resume/:id` - Delete resume
- `GET /api/resume/user/:userId` - Get all user resumes

### AI Routes
- `POST /api/ai/analyze-ats` - Analyze resume for ATS score
- `POST /api/ai/rewrite-bullet` - Rewrite bullet points
- `POST /api/ai/generate-cover-letter` - Generate cover letter
- `POST /api/ai/interview-questions` - Generate interview questions
- `POST /api/ai/chat` - AI chat assistant

### Payment Routes
- `POST /api/payment/create-checkout` - Create Stripe checkout session
- `POST /api/payment/webhook` - Stripe webhook handler

## Features in Detail

### AI-Powered Resume Analysis
- **ATS Score Checker**: Analyzes your resume against industry standards
- **Keyword Optimization**: Identifies missing keywords from job descriptions
- **Format Analysis**: Ensures ATS-friendly formatting
- **Industry Benchmarks**: Compares your resume to industry standards

### Smart Resume Builder
- **8 Professional Templates**: Modern, ATS-friendly, Creative, Executive, Minimalist, Tech, Compact, and Professional
- **Real-time Preview**: See changes as you type
- **Guided Wizard**: Step-by-step resume creation
- **Auto-save**: Never lose your progress

### AI Bullet Point Rewriter
- Transforms basic bullet points into impactful achievements
- Uses action verbs and quantifiable metrics
- Tailored to your industry and role
- Multiple variations to choose from

### Cover Letter Generator
- AI-powered personalized cover letters
- Matches your resume content
- Customized for specific job descriptions
- Professional formatting

### Interview Preparation
- AI-generated interview questions based on your resume
- Common questions for your industry
- Behavioral and technical questions
- Tips and best practices

### AI Chat Assistant
- Career advice and guidance
- Resume optimization tips
- Job search strategies
- Real-time assistance

## Deployment

### Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure MongoDB with authentication
- [ ] Enable HTTPS/TLS
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Enable security headers
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Add OpenAI API key
- [ ] Configure Stripe webhooks

### Quick Deploy Options
- **Frontend**: Vercel, Netlify
- **Backend**: Render, Railway, Heroku
- **Database**: MongoDB Atlas

## Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `OPENAI_API_KEY` - OpenAI API key for AI features

### Optional
- `STRIPE_SECRET_KEY` - For payment processing
- `CLIENT_URL` - Frontend URL for CORS
- `PORT` - Server port (default: 5000)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Documentation

- [API Reference](docs/API.md) - Detailed API documentation
- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [Contributing Guide](CONTRIBUTING.md) - How to contribute

## Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd frontend
npm test
```

## License

This project is licensed under the MIT License.

## Support

For support, email support@resumeforge.com or open an issue on GitHub.

## Acknowledgments

- OpenAI for AI capabilities
- MongoDB for database
- React and Vite for frontend framework
- TailwindCSS for styling
- Stripe for payment processing

---

**Built with ❤️ for job seekers**

**Version**: 1.0.0
**Status**: Production Ready
"// Testing branch update" 
