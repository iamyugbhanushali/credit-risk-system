import axios from "axios";

const API = "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("token");

export const executeTransfer = async (payload) => {
  const response = await axios.post(`${API}/transfer`, payload, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const getTransfers = async () => {
  const response = await axios.get(`${API}/transfers`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};
