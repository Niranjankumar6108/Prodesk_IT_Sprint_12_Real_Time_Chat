# Sprint 12 – Real-Time Chat Application

## Overview

Sprint 12 – Real-Time Chat is a real-time messaging application built using React, Node.js, Express and Socket.IO.

The application enables users to join chat rooms, send and receive messages instantly, see typing indicators and communicate within isolated channels.

## Features

- Real-time messaging using Socket.IO
- User identity through display names
- Two chat rooms:
  - General
  - Tech Support
- Room-based message isolation
- Live typing indicators
- Connection status indicator
- Join and leave room notifications
- Responsive user interface
- React frontend and Node.js backend

## Tech Stack

### Frontend
- React
- Vite
- Socket.IO Client
- CSS

### Backend
- Node.js
- Express.js
- Socket.IO
- CORS

## Project Structure

```text
Sprint_12_Real_Time_Chat/
│
├── backend/
│   ├── src/
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── .env.example
│
├── README.md
└── Prompts.md
```

## Installation

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

http://localhost:5000

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

http://localhost:5173

## How to Use

1. Open the application in your browser.
2. Enter your display name.
3. Select General or Tech Support.
4. Click Join Room.
5. Send messages to other users in the same room.
6. Observe real-time typing indicators.
7. Switch between chat rooms.

## Real-Time Communication

Socket.IO establishes bidirectional communication between the React frontend and Node.js backend.

Messages are broadcast to users subscribed to the same room. Users in other rooms do not receive those messages.

## Testing

The following features were tested locally:

- Backend server startup
- Frontend server startup
- Multiple client connections
- Username identification
- Real-time message delivery
- Typing indicator
- General room isolation
- Tech Support room isolation
- Room switching

## Deployment

- Frontend: Vercel
- Backend: Node.js hosting platform supporting persistent Socket.IO connections

The frontend requires the deployed backend URL through the `VITE_SOCKET_URL` environment variable.

## Sprint Information

**Sprint:** 12

**Track:** B – Fullstack Developers

**Theme:** WebSockets & Real-Time Bidirectional Data Pipelines

**Engineering Objective:** Architect a live communication room using Socket.IO.

## Author

Niranjan Kumar
