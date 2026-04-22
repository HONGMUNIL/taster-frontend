import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RankingPage from "./pages/RankingPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import PlacePage from "./pages/PlacesPage";
import PlaceCreatePage from "./pages/PlaceCreatePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/places" element={<PlacePage />} />
        <Route path="/places/:id" element={<PlaceDetailPage />} />
        <Route path="/places/new" element={<PlaceCreatePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
        

      </Routes>
    </Layout>
  );
}