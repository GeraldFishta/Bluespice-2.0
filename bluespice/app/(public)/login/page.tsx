"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });
  }, [router]);

  const handleGitHubLogin = async () => {
    setError("");
    setGithubLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Failed to login with GitHub");
      toast.error(error.message || "Failed to login with GitHub");
      setGithubLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Failed to login");
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ p: 4, width: "100%" }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            Bluespice
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleGitHubLogin}
            disabled={githubLoading}
            sx={{ mb: 3 }}
          >
            {githubLoading ? "Redirecting..." : "Sign in with GitHub"}
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <form onSubmit={handleEmailLogin}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoComplete="email"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                autoComplete="current-password"
              />
              <Button
                type="submit"
                variant="outlined"
                fullWidth
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In with Email"}
              </Button>
            </Stack>
          </form>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            To enable GitHub login: Supabase Dashboard → Authentication →
            Providers → Enable GitHub
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
