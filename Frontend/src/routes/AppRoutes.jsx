import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import Home from "../pages/public/Home";
import Explore from "../pages/public/Explore";
import Publish from "../pages/public/Publish";
import Login from "../pages/public/Login";
import SkillDetail from "../pages/public/SkillDetail";
import Profile from "../pages/public/Profile";
import PublicProfile from "../pages/public/PublicProfile";
import ListOrder from "../pages/public/ListOrder";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 RUTAS CON LAYOUT (APP PRINCIPAL) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/skill/:userId/:skillId" element={<SkillDetail />} />
            <Route path="/order" element={<ListOrder />} />

            {/* 👤 PERFIL PROPIO */}
            <Route path="/profile" element={<Profile />} />

            {/* 👤 PERFIL PÚBLICO DE OTRO USUARIO */}
            <Route path="/profile/:userId" element={<PublicProfile />} />
          </Route>
        </Route>

        {/* 🔐 AUTH (SIN LAYOUT) */}
        <Route path="/login" element={<Login />} />

        {/* ❌ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
