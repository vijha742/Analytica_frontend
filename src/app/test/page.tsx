"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthGuard from "@/components/AuthGuard";
import AuthStatus from "@/components/AuthStatus";
import BackendTestComponent from "@/components/BackendTestComponent";
import { LogOut, User } from "lucide-react";

export default function TestPage() {
    const { data: session } = useSession();

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User className="h-6 w-6" />
                                        Authentication Test Page
                                    </div>
                                    <Button onClick={handleSignOut} variant="outline" size="sm">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    This page is protected and can only be accessed by authenticated users.
                                </p>
                                {session?.user && (
                                    <div className="mt-4 p-4 bg-muted rounded-lg">
                                        <h3 className="font-semibold mb-2">Welcome, {session.user.name}!</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Email: {session.user.email}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <AuthStatus />

                        <BackendTestComponent />

                        <Card>
                            <CardHeader>
                                <CardTitle>Session Data</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                                    {JSON.stringify(session, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Test API Endpoints</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">
                                    Use these buttons to test authenticated API calls:
                                </p>

                                <div className="flex gap-2 flex-wrap">
                                    <Button
                                        onClick={async () => {
                                            try {
                                                const response = await fetch('/api/test-backend', {
                                                    headers: {
                                                        'Authorization': `Bearer ${session?.backendJWT}`
                                                    }
                                                });
                                                const data = await response.json();
                                                alert(JSON.stringify(data, null, 2));
                                            } catch (error) {
                                                alert('Error: ' + error);
                                            }
                                        }}
                                        variant="outline"
                                    >
                                        Test Backend Connection
                                    </Button>

                                    <Button
                                        onClick={async () => {
                                            try {
                                                const response = await fetch('/api/auth/backend-jwt', {
                                                    method: 'POST',
                                                    credentials: 'include'
                                                });
                                                const data = await response.json();
                                                alert(JSON.stringify(data, null, 2));
                                            } catch (error) {
                                                alert('Error: ' + error);
                                            }
                                        }}
                                        variant="outline"
                                    >
                                        Exchange GitHub Token
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
