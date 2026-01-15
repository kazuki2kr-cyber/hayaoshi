"use client";

import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function Toaster() {
    const { toasts } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border animate-in fade-in slide-in-from-right-4 ${toast.variant === "destructive"
                            ? "bg-red-50 border-red-200 text-red-800"
                            : "bg-white border-slate-200 text-slate-800"
                        }`}
                >
                    {toast.variant === "destructive" ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                        {toast.title && <p className="font-bold text-sm">{toast.title}</p>}
                        {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}
