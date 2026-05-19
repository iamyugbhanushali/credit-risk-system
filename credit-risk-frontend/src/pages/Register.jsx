import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import {
    registerUser,
    googleLogin
} from "../services/authApi";

import { useAuth } from "../context/AuthContext";

const Register = () => {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // normal signup
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await registerUser(formData);

            setSuccess("Account created successfully");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (err) {
            setError(err.response?.data?.detail || "Registration failed");
        }
    };

    // 🔥 SAME AS LOGIN (IMPORTANT FIX)
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const data = await googleLogin(
                credentialResponse.credential
            );

            login(data.access_token, data.role);

            navigate("/dashboard");

        } catch (err) {
            setError("Google signup failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                <h1 className="text-3xl font-bold mb-6 text-center">
                    Register
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                        required
                    />

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    {success && (
                        <p className="text-green-600 text-sm">{success}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg"
                    >
                        Create Account
                    </button>
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-sm text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* 🔥 SAME GOOGLE FLOW AS LOGIN */}
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError("Google signup failed")}
                    />
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Already have an account?
                        <Link
                            to="/login"
                            className="text-black font-semibold ml-1 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;