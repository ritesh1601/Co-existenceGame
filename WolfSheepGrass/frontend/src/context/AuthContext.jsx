import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

       useEffect(() => {
    async function restoreUser() {
        console.log("restoreUser started");

        const token = localStorage.getItem("token");
        console.log("Token found:", token);

        if (!token) {
            console.log("No token");
            setAuthLoading(false);
            return;
        }

        try {
            const result = await fetch(
                "http://localhost:5000/api/auth/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Response received:", result.status);

            const data = await result.json();
            console.log("ME response:", data);

            if (!result.ok) {
                localStorage.removeItem("token");
                setAuthLoading(false);
                return;
            }

            setUser(data.user);

        } catch (error) {
            console.error("Failed to restore user:", error);
            localStorage.removeItem("token");
        } finally {
            console.log("Setting authLoading to false");
            setAuthLoading(false);
        }
    }

    restoreUser();
}, []);

    async function loginWithGoogle(response) {
        try {
            const result = await fetch(
                "http://localhost:5000/api/auth/google",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        credential: response.credential
                    })
                }
            );

            const data = await result.json();

            if (!result.ok) {
                throw new Error(data.message);
            }

            console.log("Logged in user:", data.user);
            console.log("Token:", data.token);
            localStorage.setItem("token", data.token);

            setUser(data.user);

            return data;


        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, authLoading, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
}