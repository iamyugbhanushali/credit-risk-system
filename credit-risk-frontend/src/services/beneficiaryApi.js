import axios from "axios";

const API = "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("token");

export const addBeneficiary = async (payload) => {
  const response = await axios.post(`${API}/beneficiaries`, payload, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const getBeneficiaries = async () => {
  const response = await axios.get(`${API}/beneficiaries`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const removeBeneficiary = async (beneficiaryId) => {
  const response = await axios.delete(`${API}/beneficiaries/${beneficiaryId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};
