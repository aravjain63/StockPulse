import { Toaster } from 'sonner';
import { useState } from 'react'
import './App.css'
import { StockDetail } from './pages/StockDetail'
import {NavBar} from './components/NavBar'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignUp'
import LoginPage from './pages/SIgnIn';
import WatchlistDashboard from './pages/Dashboard';
// import { Toaster } from "./components/ui/sonner"; // ← make sure this path is correct based on how shadcn installed it

function App() {

 return <div className='w-full h-full' >
   <BrowserRouter>
    <Routes>

      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dash" element={<WatchlistDashboard />} />
      <Route path="/stock" element={<StockDetail />} />

      {/* <Route path="/signup" element={<Signup />} /> */}
      {/* <Route path="/signin" element={<Signin />} /> */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  </BrowserRouter> 
<Toaster position="top-right" richColors />  </div> 
// return <div>
//   <NavBar></NavBar>
//   <StockDetail></StockDetail>

// </div>
}

export default App
