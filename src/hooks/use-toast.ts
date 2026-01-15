"use client";

import { useState, useCallback, useEffect } from "react";

interface ToastProps {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
}

export function useToast() {
    const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

    const toast = useCallback(({ title, description, variant = "default" }: ToastProps) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, title, description, variant }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return { toast, toasts };
}
