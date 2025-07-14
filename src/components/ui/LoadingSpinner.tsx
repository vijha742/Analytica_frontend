"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    message?: string;
    size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({ message = "Loading...", size = "md" }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12"
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}
