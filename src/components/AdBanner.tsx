"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AdBannerProps {
    adSlot: string;
    adFormat?: "auto" | "fluid" | "rectangle";
    fullWidthResponsive?: boolean;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export default function AdBanner({
    adSlot,
    adFormat = "auto",
    fullWidthResponsive = true,
}: AdBannerProps) {
    const pathname = usePathname();
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        // AdSense ads often need careful handling during client-side navigation in Next.js
        try {
            if (typeof window !== "undefined" && window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (err) {
            console.error("AdSense push error:", err);
        }
    }, [pathname]); // Re-run on navigation

    return (
        <div className="w-full overflow-hidden my-8 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-white/10 font-black tracking-[0.4em] text-[10px] uppercase">
                <div className="h-[1px] w-8 bg-white/10" />
                Advertisement
                <div className="h-[1px] w-8 bg-white/10" />
            </div>
            <div className="w-full bg-black/40 rounded-xl p-2 border border-white/5 min-h-[100px] flex justify-center items-center">
                <ins
                    ref={adRef}
                    className="adsbygoogle"
                    style={{ display: "block", minWidth: "250px" }}
                    data-ad-client="ca-pub-3577742758028719"
                    data-ad-slot={adSlot}
                    data-ad-format={adFormat}
                    data-full-width-responsive={fullWidthResponsive.toString()}
                />
            </div>
        </div>
    );
}
