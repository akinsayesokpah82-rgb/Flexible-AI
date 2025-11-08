import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function Login(){
  const handleGoogle = async ()=>{
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch(err){
      console.error(err);
      alert('Google sign-in failed: ' + err.message);
    }
  };
  return (
    <div className="login">
      <h1>Welcome to FLEXIBLE AI</h1>
      <p>Sign in with Google to continue</p>
      <button onClick={handleGoogle}>Sign in with Google</button>
    </div>
  );
}
