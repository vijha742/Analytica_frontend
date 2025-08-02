"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const getErrorMessage = (errorType: string | null) => {
        switch (errorType) {
            case "Configuration":
                return "There is a problem with the server configuration.";
            case "AccessDenied":
                return "Access was denied. You may not have permission to sign in.";
            case "Verification":
                return "The sign-in verification failed.";
            case "Default":
            default:
                return "An unexpected error occurred during sign-in.";
        }
    };

    const getErrorTitle = (errorType: string | null) => {
        switch (errorType) {
            case "Configuration":
                return "Configuration Error";
            case "AccessDenied":
                return "Access Denied";
            case "Verification":
                return "Verification Failed";
            case "Default":
            default:
                return "Authentication Error";
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-destructive/10 p-3 rounded-full">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-destructive">
                        {getErrorTitle(error)}
                    </CardTitle>
                    <p className="text-muted-foreground">
                        {getErrorMessage(error)}
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Button asChild className="w-full">
                            <Link href="/auth/signin">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">
                                <Home className="h-4 w-4 mr-2" />
                                Go Home
                            </Link>
                        </Button>
                    </div>

                    {error && (
                        <div className="text-center pt-4 border-t">
                            <p className="text-xs text-muted-foreground">
                                Error code: {error}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
