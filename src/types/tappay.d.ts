declare global {
    interface Window {
        TPDirect?: {
            setupSDK: (appId: string | number, appKey: string, serverType: string) => void;
            card: {
                setup: (config: {
                    fields: {
                        number: { element: string | HTMLElement; placeholder: string };
                        expirationDate: { element: string | HTMLElement; placeholder: string };
                        ccv: { element: string | HTMLElement; placeholder: string };
                    };
                    styles: {
                        input?: { color?: string; "font-size"?: string };
                        ":focus"?: { color?: string };
                        ".valid"?: { color?: string };
                        ".invalid"?: { color?: string };
                    };
                }) => void;
                onUpdate: (callback: (update: any) => void) => void;
                getPrime: (callback: (result: any) => void) => void;
                getTappayFieldsStatus: () => any;
            };
        };
    }
}

export { };
