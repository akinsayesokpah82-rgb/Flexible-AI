import { useState } from "react";
import Login from "./Login.jsx";
import ChatMessage from "./ChatMessage.jsx";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app-container">
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <div className="chat-wrapper">
          <header className="app-header">
            <h1>💬 ChatKin AI</h1>
            <button onClick={() => setUser(null)}>Logout</button>
          </header>
          <ChatMessage user={user} />
        </div>
      )}
    </div>
  );
}

export default App;
