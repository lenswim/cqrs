import { createContext, useContext } from "react";
import type { Store } from "@zag-js/toast";

const ToasterContext = createContext<Store | null>(null);

export function useToaster() {
    const toaster = useContext(ToasterContext);
    if (!toaster) {
        throw new Error("useToaster must be used within a ToasterProvider");
    }
    return toaster;
}

export function ToasterProvider({ children, toaster }: { children: React.ReactNode; toaster: Store }) {
    return <ToasterContext.Provider value={toaster}>{children}</ToasterContext.Provider>;
}
