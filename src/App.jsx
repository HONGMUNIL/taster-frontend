import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RankingPage from "./pages/RankingPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import PlacePage from "./pages/PlacesPage";
import PlaceCreatePage from "./pages/PlaceCreatePage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/places" element={<PlacePage />} />
        <Route path="/places/:id" element={<PlaceDetailPage />} />
        <Route path="/places/new" element={<PlaceCreatePage />} />

      </Routes>
    </Layout>
  );
}