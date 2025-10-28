// src/pages/LoginPage.js - FINAL VERSION WITH STARRY SKY BACKGROUND
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, signInWithPhoneNumber } from 'firebase/auth';
import { auth, googleProvider, generateRecaptcha } from '../firebase';
import StarryBackground from '../components/StarryBackground'; // नया बैकग्राउंड इम्पोर्ट करें

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [view, setView] = useState('phone'); // 'phone', 'email', or 'otp'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your email and password.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const handlePhoneSignIn = async (e) => {
    e.preventDefault();
    setError('');
    if (phone.length !== 10) return setError("Please enter a valid 10-digit phone number.");
    try {
      generateRecaptcha('recaptcha-container');
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier);
      window.confirmationResult = confirmationResult;
      setView('otp');
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please check the number or try again later.");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) return setError("Please enter a valid 6-digit OTP.");
    try {
      await window.confirmationResult.confirm(otp);
      navigate('/');
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <StarryBackground />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-20 px-4">
        <div id="recaptcha-container"></div>
        <div className="bg-black bg-opacity-50 backdrop-blur-sm p-8 rounded-lg shadow-2xl shadow-white/20 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-animated-gradient mb-8">Login to Hollyflix</h2>
          {error && <p className="bg-red-500 text-white text-center p-3 rounded-md mb-4">{error}</p>}

          {view === 'otp' ? (
            <form onSubmit={verifyOtp}>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Enter OTP sent to +91{phone}</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600" required />
              </div>
              <button type="submit" className="w-full bg-animated-gradient text-white font-bold py-3 rounded-lg">Verify & Login</button>
              <button type="button" onClick={() => { setView('phone'); setError(''); }} className="w-full mt-4 text-purple-400 hover:underline">Back to Phone Login</button>
            </form>
          ) : view === 'email' ? (
            <form onSubmit={handleEmailLogin}>
              <div className="mb-4"><label className="block text-gray-400 mb-2">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600" required /></div>
              <div className="mb-6"><label className="block text-gray-400 mb-2">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600" required /></div>
              <button type="submit" className="w-full bg-animated-gradient text-white font-bold py-3 rounded-lg">Login</button>
              <button type="button" onClick={() => setView('phone')} className="w-full mt-4 text-purple-400 hover:underline">Login with Phone instead</button>
            </form>
          ) : (
            <form onSubmit={handlePhoneSignIn}>
              <div className="mb-4"><label className="block text-gray-400 mb-2">Phone Number</label><div className="flex"><span className="inline-flex items-center px-3 text-sm text-gray-300 bg-gray-800 rounded-l-md">+91</span><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-gray-700 text-white px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-purple-600" required /></div></div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg">Send OTP</button>
              <button type="button" onClick={() => setView('email')} className="w-full mt-4 text-purple-400 hover:underline">Login with Email instead</button>
            </form>
          )}

          <div className="relative my-6"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-600"></span></div><div className="relative flex justify-center text-sm"><span className="bg-black px-2 text-gray-500">OR</span></div></div>
          <button onClick={handleGoogleSignIn} className="w-full bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2"><svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h12.8c-.57 3.24-2.31 5.95-4.88 7.82l7.46 5.75C44.59 38.91 46.98 32.25 46.98 24.55z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.46-5.75c-2.13 1.45-4.88 2.3-7.82 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>Sign in with Google</button>
          <p className="mt-8 text-center text-gray-400">Don't have an account? <Link to="/signup" className="text-purple-400 hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;