# Sprint 12 – Development Prompts

## Project

Sprint 12 – Real-Time Chat Application

Track B – Fullstack Developers

## Objective

Build a real-time communication application using Socket.IO with React frontend and Node.js/Express backend.

## Prompts and Development Tasks

### 1. Project Setup

Set up a full-stack project structure with separate frontend and backend directories.

Use React with Vite for the frontend and Node.js with Express for the backend.

### 2. Socket.IO Server

Integrate Socket.IO into the Node.js backend.

Create a persistent WebSocket connection and handle client connection and disconnection events.

### 3. Socket.IO Client

Install Socket.IO Client in the React application and connect it to the backend server.

Display the connection status in the UI.

### 4. User Identification

Allow users to enter a display name before joining a chat room.

Use the display name to identify users in real-time messages.

### 5. Real-Time Messaging

Create a messaging interface with a text input and send button.

When a user sends a message, the backend receives it and broadcasts it to users in the same room.

### 6. Typing Indicator

Implement typing:start and typing:stop events.

Broadcast typing activity to other members of the currently selected room.

Display a typing indicator such as:

"Niranjan is typing..."

### 7. Room Architecture

Implement two rooms:

- General
- Tech Support

Allow users to switch between rooms.

### 8. Room Isolation

Use Socket.IO room-based broadcasting.

Messages sent in General must only be delivered to General room members.

Messages sent in Tech Support must only be delivered to Tech Support room members.

### 9. Frontend Design

Create a responsive chat interface including:

- Connection status
- Username
- Room selection
- Message display
- Message input
- Send button
- Typing indicator
- Leave chat button

### 10. Testing

Test the application using multiple browser sessions.

Verify:

- Users can connect
- Users can join rooms
- Messages are received instantly
- Typing indicator works
- Room switching works
- Room isolation is maintained

### 11. Build and Deployment

Create a production frontend build using:

```bash
npm run build
```

Prepare the frontend for Vercel deployment.

Configure the frontend environment variable:

```env
VITE_SOCKET_URL=YOUR_DEPLOYED_BACKEND_URL
```

Deploy the backend separately on a hosting platform that supports Socket.IO connections.

## Technologies Used

- React
- Vite
- Node.js
- Express.js
- Socket.IO
- Socket.IO Client
- CSS
- Git
- GitHub
- Vercel

## Development Summary

The application was developed and tested locally with real-time messaging, typing indicators, user identification, room switching and room-based isolation.
