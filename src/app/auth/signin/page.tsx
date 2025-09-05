"use client";

import { Suspense } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Loader2 } from "lucide-react";
import Link from 'next/link';


type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
};
type ProvidersType = Record<string, Provider>;

function SignInPage() {
  const [providers, setProviders] = useState<ProvidersType | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleSignIn = async (providerId: string) => {
    setLoading(true);
    try {
      await signIn(providerId, { callbackUrl });
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="animate-pulse absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="animate-pulse absolute bottom-0 right-0 w-40 h-40 rounded-full bg-secondary/20 blur-2xl" />
      </div>
      <Card className="relative z-10 w-full max-w-md shadow-2xl border-none bg-card/90 backdrop-blur-xl">
        <CardHeader className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center mb-2">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="drop-shadow-lg animate-float">
              <circle cx="24" cy="24" r="22" fill="url(#grad)" />
              <path d="M16 24c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" fill="#fff" fillOpacity="0.8" />
              <defs>
                <radialGradient id="grad" cx="0" cy="0" r="1" gradientTransform="translate(24 24) scale(22)" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#06b6d4" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <CardTitle className="text-4xl font-extrabold text-primary mb-1 tracking-tight">Welcome Back, Dev!</CardTitle>
          <p className="text-muted-foreground text-center text-base font-medium">Sign in to unlock your analytics superpowers 🚀</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 mt-2">
          {providers ? (
            Object.values(providers).map((provider) => (
              <Button
                key={provider.id}
                onClick={() => handleSignIn(provider.id)}
                className="w-full flex items-center justify-center gap-2 py-5 text-lg font-semibold  rounded-xl shadow-lg border border-primary/30 bg-[#1a1b26] text-primary hover:bg-[#24283b] hover:text-white transition-all duration-200 w-full flex items-center justify-center gap-2 py-5 text-lg font-semibold bg-gradient-tobg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-200 shadow-lg border border-primary/30 rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                ) : provider.id === 'github' ? (
                  <Github className="mr-2 h-5 w-5" />
                ) : null}
                {`Sign in with ${provider.name}`}
              </Button>
            ))
          ) : (
            <div className="flex justify-center items-center h-16">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          )}
          <div className="flex flex-col items-center mt-4">
            <span className="text-xs text-muted-foreground">By signing in, you agree to our <Link href="/about" className="underline hover:text-primary">Terms</Link>.</span>
            <Link href="/" className="mt-2 text-sm text-primary hover:underline">Back to Home</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInWithSuspense() {
  return (
    <Suspense>
      <SignInPage />
    </Suspense>
  );
}
