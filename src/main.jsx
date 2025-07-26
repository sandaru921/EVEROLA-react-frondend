import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GoogleOAuthProvider clientId="733025342543-rcqhl881qn3164ug3p9b0uvqf6htm1ck.apps.googleusercontent.com">
            <App/>
        </GoogleOAuthProvider>
    </StrictMode>
);
