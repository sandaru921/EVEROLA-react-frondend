import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import UserActivities from "./pages/UserActivities";
import Invite from "./pages/Invite";
import Support from "./pages/Support";
import Chat from "./pages/Chat";

function App() {
  console.log("App component is rendering"); // Debug log

  return (
    
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<Home/>}/>
        <Route path="/dashboard" element={<UserDashboard/>}/>
        <Route path="/activities" element={<UserActivities/>}/>
        <Route path="/support" element={<Support />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/chat" element={<Chat />} />

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
