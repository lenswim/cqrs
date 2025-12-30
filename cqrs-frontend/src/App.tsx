import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToasterProvider } from "./contexts/ToasterContext";
import MainPage from "./pages/MainPage";
import NewQuote from "./pages/NewQuote";
import ListQuotes from "./pages/ListQuotes";
import Statistics from "./pages/Statistics";
import SocialGraph from "./pages/Social";
import { Toaster, createToaster, ToastRoot, ToastTitle, ToastDescription, ToastCloseTrigger } from "@chakra-ui/react";
import { useMemo } from "react";

export default function App() {
    const toaster = useMemo(() => createToaster({ placement: "top" }), []);

    return (
        <ThemeProvider>
            <ToasterProvider toaster={toaster}>
                <Layout>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/newQuote" element={<NewQuote />} />
                        <Route path="/listQuotes" element={<ListQuotes />} />
                        <Route path="/statistics" element={<Statistics />} />
                        <Route path="/social" element={<SocialGraph />} />
                    </Routes>
                    <Toaster toaster={toaster}>
                        {(toast) => (
                            <ToastRoot>
                                <ToastTitle>{toast.title}</ToastTitle>
                                <ToastDescription>{toast.description}</ToastDescription>
                                <ToastCloseTrigger />
                            </ToastRoot>
                        )}
                    </Toaster>
                </Layout>
            </ToasterProvider>
        </ThemeProvider>
    );
}