import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../context/AuthContext";

import {
    loginUser,
    googleLogin
} from "../services/authApi";


const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const data = await loginUser(formData);
            console.log(data);
            localStorage.setItem("token", data.access_token);
            login(
                data.access_token,
                data.role,
                data.name,
                data.email
            );
            localStorage.setItem(
                "user_name",
                data.name
            );
            
            localStorage.setItem(
                "user_email",
                data.email
            );

            navigate("/dashboard");

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Login failed"
            );
        }
    };


    const handleGoogleSuccess = async (credentialResponse) => {
        try {
    
            console.log(
                "GOOGLE TOKEN:",
                credentialResponse.credential
            );
    
            const data = await googleLogin(
                credentialResponse.credential
            );
    
            console.log(data);
    
            localStorage.setItem(
                "token",
                data.access_token
            );
    
            login(
                data.access_token,
                data.role,
                data.name,
                data.email
            );
    
            localStorage.setItem(
                "user_name",
                data.name
            );
    
            localStorage.setItem(
                "user_email",
                data.email
            );
    
            navigate("/dashboard");
    
        } catch (err) {
    
            console.log(err);
    
            setError("Google login failed");
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                <h1 className="text-3xl font-bold mb-6 text-center">

                    Login

                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

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

                        <p className="text-red-500 text-sm">

                            {error}

                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
                    >

                        Login

                    </button>

                </form>


                <div className="my-6 flex items-center">

                    <div className="flex-grow border-t border-gray-300"></div>

                    <span className="mx-4 text-sm text-gray-500">

                        OR

                    </span>

                    <div className="flex-grow border-t border-gray-300"></div>

                </div>


                <div className="flex justify-center">

                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            setError(
                                "Google login failed"
                            );
                        }}
                    />

                </div>


                <div className="text-center mt-6">

                    <p className="text-sm text-gray-600">

                        Don't have an account?

                        <Link
                            to="/register"
                            className="text-black font-semibold ml-1 hover:underline"
                        >
                            Register
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
};


export default Login;