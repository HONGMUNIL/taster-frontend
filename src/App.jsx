import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RankingPage from "./pages/RankingPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/places/:id" element={<PlaceDetailPage />} />
      </Routes>
    </Layout>
  );
}