"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });
  }, [router]);

  const handleLogin = async () => {
    // Placeholder: redirect to Supabase magic link or OAuth as needed
    await supabase.auth.signInWithOAuth({ provider: "github" });
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>
      <p>Sign in to continue.</p>
      <button onClick={handleLogin}>Sign in with GitHub</button>
    </div>
  );
}
