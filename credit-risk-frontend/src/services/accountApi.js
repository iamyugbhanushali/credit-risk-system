import axios from "axios";

const API = "http://127.0.0.1:8000";

const getToken = () =>
  localStorage.getItem("token");

export const getAccounts = async () => {
  const response = await axios.get(
    `${API}/accounts`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  return response.data;
};

export const createAccount = async (
  accountType
) => {
  const response = await axios.post(
    `${API}/accounts`,
    {
      account_type: accountType
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  return response.data;
};