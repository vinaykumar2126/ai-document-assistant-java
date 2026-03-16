# AI Document Assistant

<p align="center">
  <img src="./src/main/resources/static/Screenshot 2026-03-15 at 8.11.20 PM.png" alt="AI Document Assistant login experience" width="88%" />
</p>

<p align="center">
  A premium Spring Boot + React workspace for document chat, fast onboarding, and unapologetically sharp interface design.
</p>

<p align="center">
  <img alt="Java" src="https://img.shields.io/badge/Java-17-orange" />
  <img alt="Spring Boot" src="https://img.shields.io/badge/Spring_Boot-3.3-brightgreen" />
  <img alt="React" src="https://img.shields.io/badge/React-19-blue" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-purple" />
  <img alt="Database" src="https://img.shields.io/badge/Database-H2%20%7C%20PostgreSQL-0f766e" />
</p>

## Why this app

AI Document Assistant is built for teams who want strong engineering and standout interface quality in the same product. We are not aiming for a generic dashboard. We are aiming for a workspace that feels fast, intentional, and better designed than the usual AI tooling.

- Secure login with username/password
- Optional Google OAuth login
- Upload `PDF`, `TXT`, and `DOCX` files
- Ask questions against uploaded content
- Ollama-powered local inference by default
- Gemini-powered RAG flow when cloud inference is configured
- Fast local setup with H2 as the default development database
- Bold, modern UI that makes the product feel premium from the first screen

## Frontend Preview

<table>
  <tr>
    <td align="center"><strong>Signature Login Experience</strong></td>
    <td align="center"><strong>Ready-To-Chat Workspace</strong></td>
  </tr>
  <tr>
    <td><img src="./src/main/resources/static/Screenshot 2026-03-15 at 8.11.20 PM.png" alt="Login screen" width="100%"/></td>
    <td><img src="./src/main/resources/static/Screenshot 2026-03-15 at 8.11.41 PM.png" alt="Ready to chat workspace" width="100%"/></td>
  </tr>
</table>

### Live Workspace Moment

This is the point where the product comes together: the document is uploaded, the workspace is active, and the assistant is already returning grounded answers from the file.

<p align="center">
  <img src="./src/main/resources/static/Screenshot 2026-03-15 at 8.11.41 PM.png" alt="AI Document Assistant ready-to-chat workspace" width="92%" />
</p>

## UI Philosophy

This project leads with interface quality.

- Strong typography and high-contrast hierarchy
- Warm editorial color palette instead of default SaaS styling
- Glassmorphism-inspired panels with depth and motion-ready layout
- A login flow and workspace that feel product-grade, not prototype-grade
- A document chat experience that looks as refined as the answers it returns

If someone lands on this repo, they should immediately understand that UI quality is one of our strongest differentiators.

## Tech Stack

- Backend: Spring Boot, Spring Security, Spring Data JPA
- Frontend: React, TypeScript, Vite
- AI: LangChain4j + Ollama + Gemini
- Database: H2 by default, PostgreSQL optional
- Auth: JWT with optional Google OAuth

## Project Structure

```text
ai-document-assistant-java/
├── src/main/java/                  # Spring Boot backend
├── src/main/resources/             # application config + static assets
├── src/test/                       # backend tests
├── frontend/                       # React + Vite frontend
├── pom.xml                         # backend build config
└── README.md
```

## Local Setup

### 1. Start the backend

The backend now starts safely for local development without forcing PostgreSQL, OAuth, or Gemini setup.

```bash
mvn spring-boot:run
```

Backend endpoints:

- App: `http://localhost:8080`
- H2 console: `http://localhost:8080/h2-console`

Default local database:

- JDBC URL: `jdbc:h2:mem:aidb`
- Username: `sa`
- Password: empty

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

- `http://localhost:5173`

### 3. Run Ollama locally

Ollama is the default inference provider for this app.

Install and start Ollama, then pull the default chat and embedding models:

```bash
ollama serve
ollama pull llama3.2
ollama pull nomic-embed-text
```

If upload fails with `model "nomic-embed-text" not found`, it means the embedding model was not pulled yet. Run:

```bash
ollama pull nomic-embed-text
```

Default Ollama config:

- Provider: `ollama`
- Base URL: `http://localhost:11434`
- Chat model: `llama3.2`
- Embedding model: `nomic-embed-text`

## Optional Configuration

### Change Ollama models

```bash
export OLLAMA_CHAT_MODEL=llama3.2
export OLLAMA_EMBEDDING_MODEL=nomic-embed-text
mvn spring-boot:run
```

### Use Gemini instead of Ollama

Switch the provider and supply a Gemini API key:

```bash
export AI_PROVIDER=gemini
export GEMINI_API_KEY=your_gemini_api_key
mvn spring-boot:run
```

### Switch to PostgreSQL

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/aidb
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=your_password
mvn spring-boot:run
```

### Enable Google OAuth

OAuth configuration is isolated in the `oauth` profile.

```bash
export GOOGLE_CLIENT_ID=your_google_client_id
export GOOGLE_CLIENT_SECRET=your_google_client_secret
mvn spring-boot:run -Dspring-boot.run.profiles=oauth
```

## How To Use The App

### UI flow

1. Start the backend and frontend.
2. Open `http://localhost:5173`.
3. Register a new account or sign in from the premium auth screen.
4. Enter the document workspace and upload a `PDF`, `TXT`, or `DOCX` file.
5. Wait for the upload confirmation in the source-material panel.
6. Start chatting once the workspace is ready and Ollama is running.
7. Review grounded answers and continue the conversation in the main chat area.
8. Iterate quickly with follow-up prompts to explore the document in more depth.

### API flow

#### Register

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo",
    "email": "demo@example.com",
    "password": "secret123"
  }'
```

#### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo",
    "password": "secret123"
  }'
```

Save the returned JWT:

```bash
export TOKEN="paste-jwt-here"
```

#### Upload a document

```bash
curl -X POST http://localhost:8080/api/ai/ingest/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/absolute/path/to/your-document.pdf"
```

#### Ask a question

```bash
curl "http://localhost:8080/api/ai/ask?question=Summarize%20the%20document" \
  -H "Authorization: Bearer $TOKEN"
```

## Supported Files

- `.pdf`
- `.txt`
- `.docx`

## Notes

- `JWT_SECRET` has a local default for easier development startup.
- H2 is the default local database.
- Ollama is the default inference provider.
- To use Gemini, set `AI_PROVIDER=gemini` and provide `GEMINI_API_KEY`.
- Google OAuth requires the `oauth` profile and Google credentials.

## Verification

```bash
mvn -Dtest=AiPoweredDocumentApplicationTests test
mvn spring-boot:run
```
