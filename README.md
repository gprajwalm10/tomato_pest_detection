# Automated Pest Detection And Prevention For Tomato Plants

An AI-powered web application that detects pests and diseases in tomato plants from images, providing real-time alerts and preventive recommendations to farmers and agricultural users.

🌐 **Live Demo** → [tomato-pest-detection.vercel.app](https://tomato-pest-detection.vercel.app)

## What It Does

- **Pest & Disease Detection** — deep learning model analyzes uploaded plant images and identifies pests or diseases with high accuracy
- **AI Recommendations** — Google Gemini API generates specific preventive actions and treatment recommendations based on the detected issue
- **Real-Time Alerts** — instant feedback delivered through a clean web interface
- **Modular Architecture** — separate components, services, and server layers for maintainability

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite |
| AI Detection | Deep Learning, Computer Vision |
| AI Recommendations | Google Gemini API |
| Backend | Node.js server |
| Deployment | Vercel |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/gprajwalm10/tomato_pest_detection.git
cd tomato_pest_detection

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Gemini API key to .env.local
# GEMINI_API_KEY=your_key_here

# Run the app and server
npm run dev
npm run server
```

## Project Structure
