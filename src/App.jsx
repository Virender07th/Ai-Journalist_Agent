import { Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./Page/DashBoard";
import NewsFetchLayout from "./Page/AiJournalist/NewsFetchLayout";
import FactChecker from "./Page/AiJournalist/FactChecker";
import BiasDetection from "./Page/AiJournalist/BiasDetection";
import SummaryGenerator from "./Page/AiJournalist/SummaryGenerator";
import Translator from "./Page/AiJournalist/Translator";
import PageNotFound from "./Component/PageNotFound";

function App() {
  return (
    <>
      <Routes>
        {/* Dashboard as layout */}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<  FactChecker/>} /> {/* Default inside dashboard */}
          <Route path="fetch-new" element={<NewsFetchLayout />} />
          <Route path="fact-check" element={<FactChecker />} />
          <Route path="bias-detection" element={<BiasDetection />} />
          <Route path="summarizer" element={<SummaryGenerator />} />
          <Route path="translate" element={<Translator />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
