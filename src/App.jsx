import { useState } from "react";
//import reactLogo from "./assets/react.svg";
import { useEffect } from "react";
//import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/User/Home";
import UserDashboard from "./pages/User/UserDashboard";
import UserActivities from "./pages/User/UserActivities";
import Invite from "./pages/User/Invite";
import Support from "./pages/User/Support";
import Chat from "./pages/User/Chat";
import Joblanding from "./pages/Joblanding";
import Contact from "./pages/User/Contact";
import Privacy from "./pages/User/Privacy";
import UserProfile from "./pages/User/UserProfile";
import LoginPage from "./pages/User/LoginPage";
import RegisterPage from "./pages/User/RegisterPage";
import ForgotPasswordPage from "./pages/User/ForgotPasswordPage";
import HomePage from "./pages/User/HomePage";
import "./pages/User/HomePage.css";
import AdminChat from "./pages/Admin/AdminChat";
import Test from "./pages/Admin/Test";
import QuizDash from "./pages/Admin/QuizDash";
import AddQuiz from "./pages/Admin/NewQuiz";
import TryOutQuiz from "./pages/Admin/TryOutQuiz";

function App() {
  console.log("App component is rendering"); // Debug log

  return (
    
    <BrowserRouter>
      <Routes>
      
      <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/login/forgot-password" element={<ForgotPasswordPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>

        
        <Route path="/dashboard" element={<UserDashboard/>}/>
        <Route path="/activities" element={<UserActivities/>}/>
        <Route path="/support" element={<Support />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/Joblanding" element={<Joblanding />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy/>}/>
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/adminchat" element={<AdminChat />} />
        <Route path="/quizDash" element={<QuizDash />} />
        <Route path="/addNewQuiz" element={<AddQuiz />} />
        <Route path="/tryout/:id" element={<TryOutQuiz />} />

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
