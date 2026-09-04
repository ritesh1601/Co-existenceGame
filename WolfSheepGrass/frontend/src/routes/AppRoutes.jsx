import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../components/Dashboard";
import Game from "../components/Game";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Home</h1>} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/game/:id"
                    element={
                        <ProtectedRoute>
                            <Game />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;