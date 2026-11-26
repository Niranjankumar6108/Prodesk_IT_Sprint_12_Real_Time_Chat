
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "https://prodesk-it-sprint-12-real-time-chat.onrender.com";
const ROOMS = ["General", "Tech Support"];

export default function App() {
  const socketRef = useRef(null);
  const timer = useRef(null);

  const [connected, setConnected] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("General");
  const [joined, setJoined] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("Connect to the server to begin.");

  // IMPORTANT: Declare refs AFTER state variables.
  const roomRef = useRef(room);
  const usernameRef = useRef(username);

  // Keep refs updated with the latest state.
  roomRef.current = room;
  usernameRef.current = username;

  // Socket connection and event listeners
  useEffect(() => {
    const socket = io(URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setNotice("Connected to chat server.");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setJoined(false);
      setTyping([]);
      setNotice("Disconnected. Reconnecting...");
    });

    socket.on("connect_error", () => {
      setConnected(false);
      setNotice("Cannot connect. Start the backend on port 5000.");
    });

    socket.on("room:joined", (data) => {
      setUsername(data.username);
      setRoom(data.room);
      setJoined(true);
      setMessages([]);
      setTyping([]);
      setError("");
      setNotice(`You joined ${data.room}.`);
    });

    // Receive messages from the selected room
    socket.on("chat:message", (msg) => {
      if (msg.room === roomRef.current) {
        setMessages((old) => [...old, msg]);
      }
    });

    // Typing indicator
    socket.on("typing:update", (data) => {
      if (
        data.room !== roomRef.current ||
        data.username === usernameRef.current
      ) {
        return;
      }

      setTyping((old) =>
        data.isTyping
          ? old.includes(data.username)
            ? old
            : [...old, data.username]
          : old.filter((name) => name !== data.username)
      );
    });

    socket.on("user:joined", (data) => {
      if (data.room === roomRef.current) {
        setNotice(`${data.username} joined ${data.room}.`);
      }
    });

    socket.on("user:left", (data) => {
      if (data.room === roomRef.current) {
        setNotice(`${data.username} left ${data.room}.`);
      }

      setTyping((old) =>
        old.filter((name) => name !== data.username)
      );
    });

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  // Join selected room
  function join(e) {
    e.preventDefault();
    setError("");

    if (!nameInput.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!connected) {
      setError("Backend is not connected.");
      return;
    }

    socketRef.current.emit(
      "room:join",
      {
        username: nameInput.trim(),
        room
      },
      (result) => {
        if (!result?.success) {
          setError(result?.message || "Could not join room.");
        }
      }
    );
  }

  // Send message
  function send(e) {
    e.preventDefault();

    if (!text.trim() || !joined) return;

    socketRef.current.emit("typing:stop");

    socketRef.current.emit(
      "chat:message",
      { text: text.trim() },
      (result) => {
        if (!result?.success) {
          setError(result?.message || "Message failed.");
        }
      }
    );

    setText("");
  }

  // Detect typing events
  function onTyping(e) {
    const value = e.target.value;
    setText(value);

    if (!joined) return;

    if (value.trim()) {
      socketRef.current.emit("typing:start");

      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        socketRef.current?.emit("typing:stop");
      }, 900);
    } else {
      socketRef.current.emit("typing:stop");
    }
  }

  // Switch between General and Tech Support
  function switchRoom(next) {
    if (next === room) return;

    setError("");
    setRoom(next);
    setMessages([]);
    setTyping([]);

    if (joined && connected) {
      socketRef.current.emit(
        "room:join",
        {
          username,
          room: next
        },
        (result) => {
          if (!result?.success) {
            setError(result?.message || "Room change failed.");
          }
        }
      );
    } else {
      setJoined(false);
    }
  }

  // Leave chat
  function leave() {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    socketRef.current?.disconnect();
    socketRef.current?.connect();

    setJoined(false);
    setUsername("");
    setMessages([]);
    setTyping([]);
    setText("");
    setError("");
    setNotice("You left the chat. Join again.");
  }

  return (
    <main className="shell">

      {/* Header */}
      <header className="topbar">
        <div className="logo">S12</div>

        <div>
          <small>SPRINT 12 · TRACK B</small>
          <h1>Real-Time Chat</h1>
        </div>

        <span className={`connection ${connected ? "on" : "off"}`}>
          ● {connected ? "Connected" : "Disconnected"}
        </span>
      </header>

      {/* Join Room Screen */}
      {!joined ? (
        <section className="join card">
          <div className="spark">✦</div>

          <small>WELCOME TO THE LIVE ROOM</small>

          <h2>Join the conversation</h2>

          <p>
            Choose a display name and a room to start chatting.
          </p>

          <form onSubmit={join}>
            <label>Your name</label>

            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength="24"
              placeholder="e.g. Niranjan"
            />

            <label>Choose room</label>

            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            >
              {ROOMS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {error && <div className="error">{error}</div>}

            <button disabled={!connected}>
              Join room
            </button>
          </form>

          <div className="notice">{notice}</div>
        </section>
      ) : (

        /* Chat Screen */
        <section className="chat card">

          {/* Sidebar */}
          <aside>
            <small>YOUR WORKSPACE</small>

            <h3>Chat rooms</h3>

            {ROOMS.map((r) => (
              <button
                key={r}
                className={`room ${room === r ? "selected" : ""}`}
                onClick={() => switchRoom(r)}
              >
                {r} {room === r ? "✓" : ""}
              </button>
            ))}

            <div className="profile">
              <span>{username[0]?.toUpperCase()}</span>

              <div>
                <b>{username}</b>
                <small>Online</small>
              </div>
            </div>

            <button className="leave" onClick={leave}>
              Leave chat
            </button>
          </aside>

          {/* Conversation */}
          <div className="conversation">

            <div className="chathead">
              <div>
                <small>LIVE CHANNEL</small>
                <h2>{room}</h2>
                <p>
                  Only members of this room receive its messages.
                </p>
              </div>

              <b className="live">● LIVE</b>
            </div>

            {/* Messages */}
            <div className="messages">
              {messages.length === 0 ? (
                <div className="empty">
                  <b>☁</b>
                  <h3>No messages yet</h3>
                  <p>Send the first message in {room}.</p>
                </div>
              ) : (
                messages.map((m) => (
                  <article className="message" key={m.id}>
                    <span className="bubble">
                      {m.username[0]?.toUpperCase()}
                    </span>

                    <div>
                      <div className="meta">
                        <b>{m.username}</b>

                        <time>
                          {new Date(m.createdAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit"
                            }
                          )}
                        </time>
                      </div>

                      <p>{m.text}</p>
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* Typing Indicator */}
            <div className="typing">
              {typing.length
                ? `${typing.join(", ")} ${
                    typing.length === 1 ? "is" : "are"
                  } typing...`
                : notice}
            </div>

            {/* Message Input */}
            <form className="send" onSubmit={send}>
              <input
                value={text}
                onChange={onTyping}
                placeholder={`Message ${room}`}
                maxLength="2000"
              />

              <button disabled={!text.trim()}>
                Send ➤
              </button>
            </form>

            {error && <div className="error">{error}</div>}

          </div>
        </section>
      )}

      <footer>
        Built for Sprint 12 · Socket.IO bidirectional communication
      </footer>

    </main>
  );
}
