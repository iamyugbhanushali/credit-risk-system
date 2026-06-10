import axios from "axios";

const API = "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("token");

export const applyLoan = async (payload) => {
  const response = await axios.post(`${API}/loans/apply`, payload, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const getLoans = async () => {
  const response = await axios.get(`${API}/loans`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};
