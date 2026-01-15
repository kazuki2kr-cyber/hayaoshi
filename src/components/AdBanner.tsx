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
        <div className="w-full overflow-hidden my-8 flex justify-center bg-black/20 rounded-xl p-2 border border-white/5">
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-3577742758028719" // パブリッシャーIDを適用しました
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive.toString()}
            />
        </div>
    );
}
