<div align="center">

# 🍅 AgriGuard
### Multilingual Pest & Disease Detection for Tomato Plants

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-tomato--pest--detection.vercel.app-brightgreen?style=for-the-badge)](https://tomato-pest-detection.vercel.app)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

> A web application that identifies pests and diseases in tomato plants from leaf images using a pre-trained CNN classifier, then uses the Gemini API to generate treatment plans in 6 Indian languages.

</div>

---

## 📌 Overview

**AgriGuard** is an agricultural assistant built for Indian tomato farmers. A farmer uploads a leaf photo, a pre-trained CNN classifies the condition, and Gemini turns that result into a clear, localized action plan: what is wrong, how severe it is, and what to do about it with organic and chemical options.

The app also includes a crop task tracker, mandi price view, regional alert and community sections, and a knowledge hub, so it works as a farming companion beyond detection.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 📸 **Image Scan** | Upload a tomato leaf photo; the CNN classifies the pest or disease |
| 🎥 **Live Assistant** | Camera-based mode with real-time AI commentary using Gemini |
| 🌍 **6 Indian Languages** | UI and AI-generated guidance in English, Kannada, Hindi, Telugu, Malayalam, Tamil |
| 🔬 **Classification** | Covers 7 pests and 4 diseases, with confidence score and severity rating |
| 💊 **Treatment Plans** | Gemini-generated organic solutions, chemical solutions, and prevention tips |
| 📊 **Mandi Prices** | Price view for Kolar, Azadpur, Mumbai, and Chittoor *(sample data; live API integration planned)* |
| 📅 **Crop Task Tracker** | Day-by-day farming tasks from seedling (Day 1) to harvest (Day 100) |
| 🚨 **Regional Alerts** | Pest warnings for your farming region |
| 👥 **Farmer Community** | Connect with nearby farmers and share insights |
| 📚 **Knowledge Hub** | Agronomic tips on irrigation, nano-urea, trellising, and government schemes |

---

## 🔬 What AgriGuard Detects

**Pests (7):**
`Aphids` `Fruitworm` `Whiteflies` `Spider Mites` `Hornworm` `Stink Bugs` `Leaf Miners`

**Diseases (4):**
`Early Blight` `Late Blight` `Septoria Leaf Spot` `TYLCV (Tomato Yellow Leaf Curl Virus)`

For each detection, AgriGuard returns:
- ✅ Predicted condition with confidence score (0.0 – 1.0)
- ✅ Severity level (Low / Medium / High)
- ✅ Visible symptoms
- ✅ Immediate action steps
- ✅ Organic and chemical treatment options
- ✅ Prevention tips

---

## 🛠️ Tech Stack

```
Frontend         →   React 19, TypeScript, Vite 6
Classification   →   Pre-trained CNN: [MODEL NAME, e.g. MobileNetV2 / ResNet50], [fine-tuned on DATASET / used as published]
Explanation      →   Google Gemini API (@google/genai ^1.35.0)
Backend          →   Node.js, Express 5, Axios
Deployment       →   Vercel
Environment      →   dotenv
```

---

## 🤖 How It Works

```
Farmer uploads a leaf image
            │
            ▼
   Pre-trained CNN classifier  [runs in: BROWSER / EXPRESS SERVER / PYTHON SERVICE]
   → predicted label + confidence score
            │
            ▼
   Express backend (API key stays server-side)
            │
            ▼
   Gemini API: generates treatment plan from the CNN label,
   in the farmer's selected language, as a fixed JSON schema
            │
            ▼
   {
     isHealthy, name, scientificName, confidence, severity,
     symptoms, immediateActions, organicSolutions,
     chemicalSolutions, preventionTips
   }
            │
            ▼
   Web UI renders the diagnosis and plan
```

**Design choice:** the CNN makes the classification decision, which gives a consistent label and a measurable confidence score. Gemini is used only to explain that result and to localize it, so free-form text generation never decides the diagnosis.

> **Live Assistant mode** uses Gemini for real-time commentary on the camera feed. It is a guidance feature and separate from the CNN classification above. *(Edit if your implementation differs.)*

---

## ⚠️ Limitations

- The classifier has not been validated on real field photos, where lighting, background, and mixed symptoms are likely to reduce performance.
- The classifier only knows its 11 supported classes. Non-tomato or very low-quality images may produce a misleading result.
- Treatment guidance is AI-generated and should be reviewed by a local agronomist, especially chemical recommendations and dosages.
- Multilingual treatment text is generated by an LLM and has not been reviewed by native-speaking agronomists.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key
- [Any model files / Python requirements needed for the CNN]

### Installation

```bash
git clone https://github.com/gprajwalm10/tomato_pest_detection.git
cd tomato_pest_detection
npm install
cp .env.example .env.local
```

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Run the App

```bash
# Start the backend server
npm run server

# Start the frontend (in a separate terminal)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🏗️ Project Structure

```
tomato_pest_detection/
├── components/     # React UI components
├── server/
│   └── index.js    # Express backend (keeps the API key server-side)
├── services/       # Classification and Gemini service integrations
├── App.tsx         # Root application component
├── constants.ts    # Prompts, sample market data, crop timeline, translations
├── types.ts        # TypeScript type definitions
└── .env.example    # Environment variable template
```

---

## 🔮 Roadmap

- [ ] Evaluate on real field images and report per-class precision/recall
- [ ] Confidence threshold: ask for a retake instead of guessing on low-confidence images
- [ ] On-device model (TensorFlow Lite) for offline classification
- [ ] Live mandi price integration (Agmarknet / data.gov.in)
- [ ] Native-speaker review of translated agronomic content
- [ ] Weather API integration for disease risk forecasting
- [ ] Push and SMS alerts for regional outbreaks
- [ ] Unit tests and CI pipeline

---

## 🙋 Author

**Prajwal GM**, B.Tech Computer Science Graduate

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-blue?style=flat-square)](https://prajwalportfolio-gilt.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/prajwal-gm-3650b3335)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat-square&logo=github)](https://github.com/gprajwalm10)
[![LeetCode](https://img.shields.io/badge/LeetCode-126%2B_Solved-FFA116?style=flat-square&logo=leetcode)](https://leetcode.com/u/prajwal__gm)
