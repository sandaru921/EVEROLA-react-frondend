import "./App.css";
import {BrowserRouter, Route, Routes,Navigate} from "react-router-dom";
import UserDashboard from "./pages/User/UserDashboard";
import UserActivities from "./pages/User/UserActivities";
import Invite from "./pages/User/Invite";
import Support from "./pages/User/Support";
import Chat from "./pages/User/Chat";
import Joblanding from "./pages/Joblanding";

function App() {

  return (
    
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<HomePage/>}/>
        <Route path="/dashboard" element={<UserDashboard/>}/>
        <Route path="/activities" element={<UserActivities/>}/>
        <Route path="/support" element={<Support />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/Joblanding" element={<Joblanding />} />
        <Route path="/admin/JobUpload" element={<AdminJobUpload/>}/>
        <Route path="/client/Jobview" element={<UserJobView/>}/>
        <Route path="/Admin/Jobview" element={<AdminJobView/>}/>
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
