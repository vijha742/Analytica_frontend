"use client";

import { signIn, getProviders } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Loader2 } from "lucide-react";

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Github className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Analytica</CardTitle>
          <p className="text-muted-foreground">
            Sign in with your GitHub account to access your analytics dashboard
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {providers ? (
            Object.values(providers).map((provider: any) => (
              <Button
                key={provider.name}
                onClick={() => handleSignIn(provider.id)}
                disabled={loading}
                className="w-full flex items-center gap-3 h-12"
                variant="outline"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Github className="h-5 w-5" />
                )}
                {loading ? "Signing in..." : `Sign in with ${provider.name}`}
              </Button>
            ))
          ) : (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}