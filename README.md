# NEXA AI

**Your intelligence. Your space. Your AI.**

NEXA AI is a locally powered AI chatbot application built with React, TypeScript and Ollama. The project aims to provide a simple, modern chat interface that allows users to interact with open-source language models running locally on their computers.

The application is designed to explore local AI integration, API communication, React state management and browser-based conversation persistence.

---

## Project Overview

NEXA AI aims to provide a personalised AI assistant through a responsive chatbot interface.

### Planned Features

- Interactive AI chatbot interface.
- Local AI model integration using Ollama.
- User and AI conversation messages.
- Loading indicators while generating responses.
- AI response generation time.
- Tokens generated per second.
- Customisable system message defining the assistant's purpose.
- Conversation history saved using LocalStorage.
- Persistent conversations after refreshing the browser.
- Responsive user interface.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| TypeScript | Type safety and application logic |
| Vite | Development server and build tool |
| CSS3 | Application styling |
| Ollama | Local AI model execution |
| LocalStorage | Conversation persistence |
| Fetch API | Communication with Ollama |

## AI Model

NEXA AI uses Ollama to run language models locally.

**Selected model: Qwen2.5 0.5B**

- Model: `qwen2.5:0.5b`
- Parameters: 0.5 billion
- Approximate download size: 398 MB

Model library: https://ollama.com/library/qwen2.5:0.5b

## Getting Started

### Prerequisites

Before running the project, ensure you have:

- Node.js installed.
- npm installed.
- Git installed.
- Ollama installed on Windows.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/nexa-ai.git
```

### 2. Navigate into the project

```bash
cd nexa-ai
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the React development server

```bash
npm run dev
```

Open the local development URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## Ollama Configuration

### 1. Verify Ollama installation

```bash
ollama --version
```

### 2. Download the AI model

```bash
ollama pull qwen2.5:0.5b
```

### 3. Verify downloaded models

```bash
ollama list
```

### 4. Run the model

```bash
ollama run qwen2.5:0.5b
```

### 5. Ollama API endpoint

The React application will communicate with Ollama through:

```text
http://localhost:11434/api/generate
```

Example request body:

```json
{
  "model": "qwen2.5:0.5b",
  "system": "You are NEXA, a helpful AI assistant.",
  "prompt": "Explain React in simple English.",
  "stream": false
}
```

## Project Structure

```text
nexa-ai/
│
├── public/
│   ├── logo.svg
│   └── favicon.svg
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── services/
│   │   └── ollama.ts
│   ├── types/
│   │   └── chat.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

## Performance Metrics

NEXA AI will display generation performance information below AI responses.

Ollama provides the following response properties:

| Property | Description |
|---|---|
| `total_duration` | Total request duration |
| `eval_count` | Number of generated tokens |
| `eval_duration` | Time spent generating tokens |

Ollama reports duration values in nanoseconds.

Tokens per second can be calculated using:

```typescript
const tokensPerSecond =
  eval_count / (eval_duration / 1e9);
```

Total duration in seconds:

```typescript
const duration = total_duration / 1e9;
```

## Conversation Persistence

The application will use browser LocalStorage to save and retrieve conversation messages.

Planned functionality:

- Save messages after conversations.
- Retrieve messages when the application loads.
- Preserve conversation history after refreshing the browser.
- Allow users to clear saved conversations.

## Development Roadmap

The project is organised into six development sprints.

| Sprint | Description | Status |
|---|---|---|
| Sprint 1 | Environment and Ollama setup | In progress |
| Sprint 2 | Branding and UI development | Planned |
| Sprint 3 | Ollama API integration | Planned |
| Sprint 4 | Performance metrics | Planned |
| Sprint 5 | System message and LocalStorage | Planned |
| Sprint 6 | Testing and documentation | Planned |

## Running Locally

For local development, both Ollama and the React development server need to be available.

**Terminal 1 – Ollama**

```bash
ollama run qwen2.5:0.5b
```

**Terminal 2 – React application**

```bash
npm run dev
```

The application will run in your browser while Ollama processes AI requests locally.

## Learning Objectives

This project provides practical experience with:

- Integrating local AI models into React applications.
- Understanding REST API communication.
- Working with asynchronous JavaScript.
- Managing application state with React.
- Using TypeScript interfaces.
- Persisting data using LocalStorage.
- Processing API responses.
- Calculating AI generation performance.

## Project Status

**Currently under development.**

NEXA AI is being developed incrementally, starting with the local Ollama environment and progressing towards a fully functional React-based AI chatbot.

---

**NEXA AI – Your intelligence. Your space. Your AI.**
