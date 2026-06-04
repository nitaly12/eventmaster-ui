"use client";

import { Button } from "@/components/ui/button";

export const CTAComponent = () => {
    return (
        <div className="w-full py-10">
            {/* Main Banner Container
        Using your exact brand color background, rounded edges, and responsive vertical padding 
      */}
            <div className="relative w-full max-w-7xl mx-auto rounded-[24px] bg-[#7939EF] px-6 py-10 md:py-10 text-center shadow-md flex flex-col items-center justify-center">
                {/* ================= HEAVY AGGREGRESSIVE STATIC NOISE LAYER ================= */}
                <div
                     className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.30]"
                    style={{
                        background: `
              repeating-radial-gradient(#000 0px, #000 1px, #fff 1px, #fff 2px) 0 0 / 8px 8px,
              repeating-conic-gradient(#000 0% 0.0003%, #fff 0% 0.0006%) 50% 50% / 1500px 1500px
            `,
                        backgroundBlendMode: "difference",
                        animation: "ctaHeavyNoise 0.15s infinite linear",
                    }}
                />
                {/* Main Heading - Scales fluidly for mobile responsiveness */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight mb-3">
                    Get Ready To Manage Your Event
                </h2>

                {/* Subtitle text */}
                <p className="text-white/90 text-sm md:text-base font-medium mb-6">
                    Join Free Today
                </p>

                {/* CTA Button 
          Matches the white background, dark text, and pill shape (rounded-full) of your UI design
        */}
                <Button
                    className="bg-white text-zinc-900 hover:bg-zinc-100 font-medium px-6 py-2 rounded-full text-sm shadow-sm transition-all cursor-pointer border-0"
                >
                    Register now
                </Button>

            </div>
        </div >
    );
};