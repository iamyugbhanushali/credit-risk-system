import { createRoot } from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";

import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext";

createRoot(
    document.getElementById("root")
).render(

    <GoogleOAuthProvider
        clientId="673212010977-j266ugjnt4nbshf0iv6j42tgmok643mm.apps.googleusercontent.com"
    >

        <AuthProvider>

            <App />

        </AuthProvider>

    </GoogleOAuthProvider>
);