# OpsMind AI - Frontend

Premium React dashboard for corporate knowledge management.

## Features

- Modern glass-morphism UI
- Drag & drop file upload
- Real-time processing status
- Document management
- Vector visualization
- Responsive design

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- React Router v6
- Zustand (state)
- Axios
- react-dropzone
- react-hot-toast

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── components/      # Reusable components
├── pages/          # Route pages
├── store/          # Zustand stores
├── utils/          # API client
├── App.jsx         # Main app
└── main.jsx        # Entry point
```

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview build

## Design System

- **Colors:** Dark theme with cyan accents
- **Font:** Inter
- **Effects:** Glass-morphism, gradients
- **Icons:** Lucide React

## License

MIT
