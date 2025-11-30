import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout";
import { ThemeProvider } from "./contexts/ThemeContext";
import MainPage from "./pages/MainPage";
import NewQuote from "./pages/NewQuote";
import ListQuotes from "./pages/ListQuotes";
import Statistics from "./pages/Statistics";

export default function App() {
    return (
        <ThemeProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/newQuote" element={<NewQuote />} />
                    <Route path="/listQuotes" element={<ListQuotes />} />
                    <Route path="/statistics" element={<Statistics />} />
                </Routes>
            </Layout>
        </ThemeProvider>
    );
}