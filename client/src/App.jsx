import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import Login from "./Login.jsx";
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import axios from 'axios';

// Initialize Firebase
initializeApp(firebaseConfig);

export default function App(){
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(()=>{
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u)=> setUser(u));
    return ()=> unsub();
  },[]);

  useEffect(()=> bottomRef.current?.scrollIntoView({behavior:'smooth'}), [messages]);

  const send = async ()=>{
    if(!text && !file) return;
    const userId = user?.uid || 'guest';
    const userMsg = { role: 'user', content: text || (file && file.name) };
    setMessages(prev => [...prev, userMsg]);
    setText('');
    setFile(null);
    setLoading(true);
    try {
      if(file){
        const fd = new FormData();
        fd.append('file', file);
        const up = await axios.post('/api/upload', fd);
        setMessages(prev => [...prev, { role:'assistant', content: `Uploaded: ${up.data.filename}. ${up.data.snippet || ''}` }]);
      }
      const res = await axios.post('/api/chat', { userId, message: text || (file && file.name) });
      setMessages(prev => [...prev, { role:'assistant', content: res.data.reply }]);
    } catch(err){
      console.error(err);
      setMessages(prev => [...prev, { role:'assistant', content: 'Error contacting AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  if(!user) return <Login />;

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>FLEXIBLE AI</h2>
        <div className="creator">Created by Akin Saye Sokpah</div>
        <div className="contact">Email: sokpahakinsaye81@gmail.com</div>
        <div className="contact"><a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank" rel="noreferrer">Facebook</a></div>
        <button onClick={()=> signOut(getAuth())}>Sign out</button>
      </aside>
      <main className="main">
        <div className="messages">
          {messages.map((m,i)=> <ChatMessage key={i} role={m.role} content={m.content} />)}
          <div ref={bottomRef} />
        </div>
        <div className="composer">
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Ask something..." />
          <input type="file" onChange={e=>setFile(e.target.files[0])} />
          <button onClick={send} disabled={loading}>{loading? 'Sending...' : 'Send'}</button>
        </div>
      </main>
    </div>
  );
}
