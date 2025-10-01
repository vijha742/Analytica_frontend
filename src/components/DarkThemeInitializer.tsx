"use client";

import { useEffect } from 'react';

export default function DarkThemeInitializer() {
    useEffect(() => {
        // Always apply dark theme
        document.documentElement.classList.add('dark');
        // Remove any saved theme preference to ensure consistency
        window.localStorage.removeItem('theme');
    }, []);

    return null;
}