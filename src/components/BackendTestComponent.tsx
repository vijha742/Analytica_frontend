"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { backendApiRequest } from "@/lib/auth-api";
import { Activity, Database, Shield } from "lucide-react";

type TestResult = {
    test: string;
    result: unknown;
    success: boolean;
    timestamp: Date;
};

export default function BackendTestComponent() {
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(false);

    const addTestResult = (test: string, result: unknown, success: boolean) => {
        setTestResults(prev => [...prev, { test, result, success, timestamp: new Date() }]);
    };

    const testBackendEndpoints = async () => {
        setLoading(true);
        setTestResults([]);

        try {
            const validateResult = await backendApiRequest('/api/validate');
            addTestResult('JWT Validation', validateResult, true);
        } catch (error) {
            addTestResult('JWT Validation', error instanceof Error ? error.message : 'Unknown error', false);
        }

        // Test 2: Get User Profile (example)
        try {
            const profileResult = await backendApiRequest('/api/user/profile');
            addTestResult('User Profile', profileResult, true);
        } catch (error) {
            addTestResult('User Profile', error instanceof Error ? error.message : 'Unknown error', false);
        }

        // Test 3: Protected Data Access (example)
        try {
            const dataResult = await backendApiRequest('/api/data/protected');
            addTestResult('Protected Data', dataResult, true);
        } catch (error) {
            addTestResult('Protected Data', error instanceof Error ? error.message : 'Unknown error', false);
        }

        setLoading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Backend API Testing
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Button
                        onClick={testBackendEndpoints}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <Shield className="h-4 w-4" />
                        {loading ? "Testing..." : "Test Backend APIs"}
                    </Button>
                </div>

                {testResults.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Test Results:
                        </h4>
                        {testResults.map((result, index) => (
                            <div key={index} className="p-3 bg-muted rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{result.test}</span>
                                    <Badge variant={result.success ? "default" : "destructive"}>
                                        {result.success ? "Success" : "Failed"}
                                    </Badge>
                                </div>
                                <pre className="text-xs bg-background p-2 rounded overflow-auto">
                                    {typeof result.result === 'string'
                                        ? result.result
                                        : JSON.stringify(result.result, null, 2)}
                                </pre>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {result.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-sm text-muted-foreground">
                    <p><strong>Note:</strong> All requests automatically include your JWT token in the Authorization header.</p>
                    <p>These tests call your Spring Boot backend at <code>localhost:8080</code></p>
                </div>
            </CardContent>
        </Card>
    );
}
