// pages/protected.tsx
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const ProtectedPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    console.log("authToken=" + authToken);
    if (!authToken) {
      router.push("/login");
    }
  }, []);

  return (
    <div>
      <h1>Protected Page</h1>
      <p>
        This page is protected and should only be accessible after CAS
        authentication.
      </p>
    </div>
  );
};

export default ProtectedPage;
