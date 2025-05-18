# LoopPanel Chat Interface

A modern chat interface built with React and TypeScript that allows users to chat with data

## Features

- Project selection dropdown
- AI responses with source file references for query

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on localhost:5000

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fe-looppanel
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```bash
# Development environment
VITE_API_URL=http://localhost:5000
```
## Running the Application

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open your browser and navigate to:
```
http://localhost:5173
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000 |

## Project Structure

```
fe-looppanel/
├── src/
│   ├── Components/     # React components
│   ├── types.ts        # TypeScript type definitions
│   └── App.tsx         # Main application component
├── .env               # Environment variables
├── package.json       # Project dependencies
└── README.md         # Project documentation
```

## API Endpoints

The application expects the following API endpoints to be available:

- `GET /list_projects` - List all available projects
- `POST /get_chat_reply/{project_id}` - Get AI response for a query asked in a project

## Development

- Built with React + TypeScript
- Styled with Tailwind CSS
- Uses Vite as the build tool
