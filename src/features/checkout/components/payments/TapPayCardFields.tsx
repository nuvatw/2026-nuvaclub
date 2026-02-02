"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import Script from "next/script";

export interface TapPayCardFieldsHandle {
    getPrime: () => Promise<string>;
}

interface TapPayCardFieldsProps {
    onUpdate?: (update: any) => void;
    onReady?: (canGetPrime: boolean) => void;
}

const TapPayCardFields = forwardRef<TapPayCardFieldsHandle, TapPayCardFieldsProps>(
    ({ onUpdate, onReady }, ref) => {
        const [isLoaded, setIsLoaded] = useState(false);
        const [isSetup, setIsSetup] = useState(false);

        const appId = process.env.NEXT_PUBLIC_TAPPAY_APP_ID || "";
        const appKey = process.env.NEXT_PUBLIC_TAPPAY_APP_KEY || "";
        const serverType = process.env.NEXT_PUBLIC_TAPPAY_SERVER_TYPE || "sandbox";
        const sdkVersion = process.env.NEXT_PUBLIC_TAPPAY_SDK_VERSION || "v5.19.2";

        const setupSDK = () => {
            if (typeof window !== "undefined" && window.TPDirect && !isSetup) {
                console.log('[TapPay] Setting up SDK with:', { appId, serverType });
                window.TPDirect.setupSDK(appId, appKey, serverType);
                console.log('[TapPay] SDK setup called successfully');

                window.TPDirect.card.setup({
                    fields: {
                        number: {
                            element: "#card-number",
                            placeholder: "**** **** **** ****",
                        },
                        expirationDate: {
                            element: "#card-expiration-date",
                            placeholder: "MM / YY",
                        },
                        ccv: {
                            element: "#card-ccv",
                            placeholder: "CCV",
                        },
                    },
                    styles: {
                        input: {
                            color: "#ffffff",
                            "font-size": "16px",
                        },
                        ":focus": {
                            color: "#ffffff",
                        },
                        ".valid": {
                            color: "#10b981",
                        },
                        ".invalid": {
                            color: "#ef4444",
                        },
                    },
                });

                window.TPDirect.card.onUpdate((update) => {
                    if (onUpdate) onUpdate(update);
                    if (onReady) onReady(update.canGetPrime);
                });

                setIsSetup(true);
            }
        };

        useEffect(() => {
            if (isLoaded) {
                setupSDK();
            }
        }, [isLoaded]);

        useImperativeHandle(ref, () => ({
            getPrime: () => {
                return new Promise((resolve, reject) => {
                    console.log('[TapPay] getPrime called');

                    if (!window.TPDirect) {
                        console.error('[TapPay] TPDirect not loaded');
                        reject(new Error("TapPay SDK not loaded"));
                        return;
                    }

                    console.log('[TapPay] Calling TPDirect.card.getPrime...');
                    window.TPDirect.card.getPrime((result) => {
                        console.log('[TapPay] getPrime result:', result);

                        if (result.status !== 0) {
                            console.error('[TapPay] getPrime failed:', {
                                status: result.status,
                                msg: result.msg,
                                fullResult: result
                            });
                            reject(new Error(result.msg || "Failed to get prime"));
                            return;
                        }

                        console.log('[TapPay] getPrime success, prime:', result.card.prime.substring(0, 20) + '...');
                        resolve(result.card.prime);
                    });
                });
            },
        }));


        return (
            <div className="space-y-4">
                <Script
                    src={`https://js.tappaysdk.com/sdk/tpdirect/${sdkVersion}`}
                    onLoad={() => setIsLoaded(true)}
                    strategy="afterInteractive"
                />

                {/* Show skeleton while loading */}
                {!isSetup && (
                    <div className="grid grid-cols-1 gap-4 animate-pulse">
                        <div className="space-y-1">
                            <div className="h-4 w-24 bg-neutral-700 rounded"></div>
                            <div className="h-12 w-full rounded-lg bg-neutral-800 border border-neutral-700"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="h-4 w-28 bg-neutral-700 rounded"></div>
                                <div className="h-12 w-full rounded-lg bg-neutral-800 border border-neutral-700"></div>
                            </div>
                            <div className="space-y-1">
                                <div className="h-4 w-12 bg-neutral-700 rounded"></div>
                                <div className="h-12 w-full rounded-lg bg-neutral-800 border border-neutral-700"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TapPay fields - fade in when ready */}
                <div
                    className={`grid grid-cols-1 gap-4 transition-all duration-500 ${isSetup ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                        }`}
                >
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 ml-1">Card Number</label>
                        <div
                            id="card-number"
                            className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 shadow-inner ring-1 ring-white/5 transition-all focus-within:ring-primary-500/50 focus-within:border-primary-500 focus-within:bg-neutral-900"
                        ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 ml-1">Expiration Date</label>
                            <div
                                id="card-expiration-date"
                                className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 shadow-inner ring-1 ring-white/5 transition-all focus-within:ring-primary-500/50 focus-within:border-primary-500 focus-within:bg-neutral-900"
                            ></div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 ml-1">CCV</label>
                            <div
                                id="card-ccv"
                                className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 shadow-inner ring-1 ring-white/5 transition-all focus-within:ring-primary-500/50 focus-within:border-primary-500 focus-within:bg-neutral-900"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

TapPayCardFields.displayName = "TapPayCardFields";

export default TapPayCardFields;
