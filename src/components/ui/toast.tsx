"use client"

import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, X, Info } from 'lucide-react'

export interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'info'
    duration?: number
}

interface ToastProps {
    toast: Toast
    onRemove: (id: string) => void
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id)
        }, toast.duration || 5000)

        return () => clearTimeout(timer)
    }, [toast.id, toast.duration, onRemove])

    const getToastStyles = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
            case 'error':
                return 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            case 'info':
                return 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
            default:
                return 'bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200'
        }
    }

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            case 'info':
                return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            default:
                return <Info className="h-5 w-5" />
        }
    }

    return (
        <div className={`relative flex items-start gap-3 p-4 rounded-lg border-2 shadow-lg transform transition-all duration-300 ease-in-out ${getToastStyles()}`}>
            <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-5 break-words">
                    {toast.message}
                </p>
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

interface ToastContainerProps {
    toasts: Toast[]
    onRemove: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
            {toasts.map((toast) => (
                <ToastComponent key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    )
}

// Hook for managing toasts
export const useToast = () => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration?: number) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newToast: Toast = { id, message, type, duration }
        setToasts(prev => [...prev, newToast])
        return id
    }

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }

    const showSuccess = (message: string, duration?: number) => addToast(message, 'success', duration)
    const showError = (message: string, duration?: number) => addToast(message, 'error', duration)
    const showInfo = (message: string, duration?: number) => addToast(message, 'info', duration)

    return {
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showInfo
    }
}
