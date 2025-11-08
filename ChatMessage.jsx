import React from 'react';
export default function ChatMessage({ role, content }){
  return (
    <div className={`msg ${role}`}>
      <div className="bubble">{role==='user' ? 'You: ' : 'AI: '}{content}</div>
    </div>
  );
}
