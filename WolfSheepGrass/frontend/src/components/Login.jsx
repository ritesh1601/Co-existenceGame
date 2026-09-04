import { useEffect } from "react";
import { useAuth } from "../context/useAuth";

function Login() {
    const { user, loginWithGoogle } = useAuth();

    useEffect(() => {
        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: loginWithGoogle
        });

        window.google.accounts.id.renderButton(
            document.getElementById("google-button"),
            {
                theme: "outline",
                size: "large"
            }
        );
    }, [loginWithGoogle]);

    if (user) {
        return <h2>Already logged in</h2>;
    }

    return (
        <div>
            <h1>Co-existing Environment Game</h1>
            <h2>Login</h2>

            <div id="google-button"></div>
        </div>
    );
}

export default Login;