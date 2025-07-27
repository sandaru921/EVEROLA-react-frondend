import { useState } from 'react';

// Utility functions for PKCE
const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => ('0' + byte.toString(16)).slice(-2)).join('');
};

const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const LinkedInOAuthButton = () => {
  const [state] = useState(crypto.randomUUID());

  const handleLinkedInAuth = async () => {
    const redirectUri = 'https://localhost:5173/linkedin/callback';
    const scope = 'openid profile email r_liteprofile r_basicprofile';
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    if (!codeVerifier || !codeChallenge) {
      console.error('Failed to generate code verifier or challenge');
      return;
    }

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=7887xvg2iwuyu5&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    
    console.log('Generated Auth URL:', authUrl);
    localStorage.setItem('linkedin_state', state);
    localStorage.setItem('linkedin_code_verifier', codeVerifier);
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleLinkedInAuth}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Connect with LinkedIn
    </button>
  );
};

export default LinkedInOAuthButton;