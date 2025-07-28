import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL || "https://localhost:5031";

const LinkedInCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function finishOAuth() {
      const code = params.get("code");
const state = params.get("state");
const storedState = localStorage.getItem("linkedin_state");
const storedVerifier = localStorage.getItem("linkedin_code_verifier");

if (!code || state !== storedState) {
  alert("OAuth invalid");
  return navigate("/profile");
}

const res = await fetch(`${API}/api/userprofile/linkedin/exchange`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    code,
    redirectUri: "https://localhost:5173/linkedin/callback",
    codeVerifier: storedVerifier
  })
});

      if (!res.ok) {
        alert("Token exchange failed");
        return navigate("/profile");
      }

      const { accessToken } = await res.json();
      localStorage.setItem("linkedin_access_token", accessToken);
      alert("LinkedIn verified!");
      navigate("/profile");
    }

    finishOAuth();
  }, [navigate]);

  return <p>Verifying LinkedIn...</p>;
};
export default LinkedInCallback;
