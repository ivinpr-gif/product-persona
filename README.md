# GamePersona AI

## Overview
GamePersona AI is an AI-powered gaming analytics platform that turns player profiles into realistic gamer personas with behavioral insights, segmentation, and personalized game recommendations. It is designed to feel like a studio-grade analytics tool for game developers, publishers, UX researchers, and esports organizations.

## Architecture
- Backend: FastAPI + SQLAlchemy + SQLite
- AI Layer: OpenRouter API with CrewAI-style orchestration via structured prompts
- Frontend: React + Vite + Recharts
- Database: SQLite for storing generated personas and analytics artifacts

## Installation

### Backend
1. Navigate to the backend folder.
2. Create a virtual environment.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set your OpenRouter API key in the .env file.

### Frontend
1. Navigate to the frontend folder.
2. Install dependencies:
   ```bash
   npm install
   ```

## OpenRouter Configuration
Add your key to the workspace .env file:
```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
```

## Running the Project
### Backend
```bash
cd backend
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm run dev
```

## Folder Structure
```text
backend/
  app/
    api/
    core/
    db/
    services/
  main.py
frontend/
  src/
  index.html
  package.json
  vite.config.js
database/
outputs/
README.md
```

## API Documentation
Once the backend is running, visit:
- http://localhost:8000/docs

## Future Improvements
- Add true CrewAI multi-agent orchestration
- Add export to JSON/CSV/PDF
- Add advanced search and filtering
- Add richer charts and segmentation analytics
