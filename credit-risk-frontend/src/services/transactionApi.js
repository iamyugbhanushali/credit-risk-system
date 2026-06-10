import axios from "axios";

const API = "http://127.0.0.1:8000";

const token =
  localStorage.getItem("token");

export const getTransactions =
async () => {

  const response =
  await axios.get(
    `${API}/transactions`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  return response.data;
};