"use client";

import { createContext, useContext, useEffect, useState } from "react";

type FontType = "inter" | "outfit" | "lato";

interface AppearanceContextType {
    font: FontType;
    setFont: (font: FontType) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export function AppearanceProvider({ children, initialFont }: { children: React.ReactNode, initialFont?: FontType }) {
    const [font, setFontState] = useState<FontType>(initialFont || "inter");

    useEffect(() => {
        // If initialFont is provided (SSR), trust it.
        // Otherwise try local storage (client-only fallback)
        if (!initialFont) {
            const savedFont = localStorage.getItem("gym-dashboard-font") as FontType;
            if (savedFont && ["inter", "outfit", "lato"].includes(savedFont)) {
                setFontState(savedFont);
                document.documentElement.setAttribute("data-font", savedFont);
            } else {
                document.documentElement.setAttribute("data-font", "inter");
            }
        } else {
            // Ensure data attribute is set for SSR hydration
            document.documentElement.setAttribute("data-font", initialFont);
        }
    }, [initialFont]);

    const setFont = async (newFont: FontType) => {
        setFontState(newFont);
        localStorage.setItem("gym-dashboard-font", newFont);
        document.documentElement.setAttribute("data-font", newFont);

        try {
            await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    settings: {
                        appearance: { font: newFont }
                    }
                }),
            });
        } catch (error) {
            console.error("Failed to save font preference", error);
        }
    };

    return (
        <AppearanceContext.Provider value={{ font, setFont }}>
            {children}
        </AppearanceContext.Provider>
    );
}

export function useAppearance() {
    const context = useContext(AppearanceContext);
    if (context === undefined) {
        throw new Error("useAppearance must be used within an AppearanceProvider");
    }
    return context;
}
