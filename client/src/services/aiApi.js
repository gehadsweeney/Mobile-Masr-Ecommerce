import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/ai`,
});

export const askAI = async (feature, question, extra = {}) => {
  try {
    const { data } = await api.post("/", {
      feature,
      question,
      ...extra,
    });
    return data;
  } catch (error) {
    console.error("Error connecting to AI:", error);
    throw error;
  }
};
