// pages/login.tsx
import React from "react";
import { useRouter } from "next/router";

const LoginPage: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    window.location.href = `${
      process.env.NEXT_PUBLIC_CAS_SERVER_URL
    }/login?service=${encodeURIComponent(
      process.env.NEXT_PUBLIC_APP_URL + "/api/auth"
    )}`;
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login with CAS</button>
    </div>
  );
};

export default LoginPage;
