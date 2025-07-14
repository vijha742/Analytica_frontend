"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AuthStatus() {
    const { data: session, status } = useSession();
    const [backendStatus, setBackendStatus] = useState<"loading" | "connected" | "error">("loading");

    useEffect(() => {
        const checkBackendConnection = async () => {
            if (session?.backendJWT) {
                try {
                    const response = await fetch('/api/test-backend', {
                        headers: {
                            'Authorization': `Bearer ${session.backendJWT}`
                        }
                    });

                    if (response.ok) {
                        setBackendStatus("connected");
                    } else {
                        setBackendStatus("error");
                    }
                } catch (error) {
                    setBackendStatus("error");
                }
            } else {
                setBackendStatus("error");
            }
        };

        if (status === "authenticated") {
            checkBackendConnection();
        }
    }, [session, status]);

    if (status === "loading") {
        return <LoadingSpinner message="Checking authentication status..." />;
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Authentication Status
                    {status === "authenticated" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">NextAuth Status:</span>
                        <Badge variant={status === "authenticated" ? "default" : "destructive"}>
                            {status}
                        </Badge>
                    </div>

                    {session && (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">User:</span>
                                <span className="text-sm">{session.user?.name}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">GitHub Token:</span>
                                <Badge variant={session.githubAccessToken ? "default" : "destructive"}>
                                    {session.githubAccessToken ? "Available" : "Missing"}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Backend JWT:</span>
                                <Badge variant={session.backendJWT ? "default" : "destructive"}>
                                    {session.backendJWT ? "Available" : "Missing"}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Backend Connection:</span>
                                <Badge variant={
                                    backendStatus === "connected" ? "default" :
                                        backendStatus === "error" ? "destructive" : "secondary"
                                }>
                                    {backendStatus === "loading" && <AlertCircle className="h-3 w-3 mr-1" />}
                                    {backendStatus}
                                </Badge>
                            </div>
                        </>
                    )}
                </div>

                {status === "authenticated" && session?.backendJWT && (
                    <div className="pt-4 border-t">
                        <p className="text-xs text-green-600">
                            ✅ Authentication successful! You can now access protected resources.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
