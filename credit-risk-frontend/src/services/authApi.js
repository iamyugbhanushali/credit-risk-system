import axios from "axios";


const API_BASE_URL = "http://127.0.0.1:8000";


export const loginUser = async (loginData) => {

    const response = await axios.post(

        `${API_BASE_URL}/auth/login`,

        loginData
    );

    return response.data;
};


export const registerUser = async (registerData) => {

    const response = await axios.post(

        `${API_BASE_URL}/auth/register`,

        registerData
    );

    return response.data;
};

export const googleLogin = async (credential) => {

    const response = await axios.post(

        `${API_BASE_URL}/auth/google-login`,

        {
            credential
        }
    );

    return response.data;
};