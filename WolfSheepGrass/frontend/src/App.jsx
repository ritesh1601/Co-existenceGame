import { useEffect, useState } from "react";

function App() {
    const [user, setUser] = useState(null);

    async function handleGoogleLogin(response) {
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

            setUser(data.user);

        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    
    useEffect(() => {
        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleLogin
        });

        window.google.accounts.id.renderButton(
            document.getElementById("google-button"),
            {
                theme: "outline",
                size: "large"
            }
        );
    }, []);
    

    return (
        <div>
            <h1>Co-existing Environment Game</h1>

            {!user ? (
                <div id="google-button"></div>
            ) : (
                <div>
                    <h2>Welcome, {user.username}!</h2>
                </div>
            )}
        </div>
    );
}

export default App;