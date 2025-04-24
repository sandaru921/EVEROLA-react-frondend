import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes,Navigate } from "react-router-dom";
import Home from "./pages/User/Home";
import UserDashboard from "./pages/User/UserDashboard";
import UserActivities from "./pages/User/UserActivities";
import Invite from "./pages/User/Invite";
import Support from "./pages/User/Support";
import Chat from "./pages/User/Chat";
import Joblanding from "./pages/Joblanding";
import PostJob from "./pages/Admin/postjob";

import ClientJobQuizDetails from "./pages/User/JobQuizDetails";
import AdminJobQuizDetails from "./pages/Admin/JobQuizDetails";


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
        <Route path="/Joblanding" element={<Joblanding />} />
        <Route path="/admin/postjob" element={<PostJob/>}/>
    
        <Route path="/admin/job-quiz-details/:id" element={<AdminJobQuizDetails />} />
        <Route path="/admin/job-quiz-details" element={<Navigate to="/admin/postjob" />} /> {/* Redirect if no ID */}
        <Route path="/client/job-quiz-details/:id" element={<ClientJobQuizDetails />} />
        <Route path="/client/job-quiz-details" element={<Navigate to="/" />} /> {/* Redirect if no ID */}
        <Route path="/" element={<div>Home Page - Add navigation links here</div>} />
     
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
