import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/watchlists`;

export const getAllWatchlists = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const createNewWatchlist = async (data) => {
  const res = await axios.post(API_BASE, data);
  return res.data;
};
