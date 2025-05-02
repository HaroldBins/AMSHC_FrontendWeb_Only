const baseURL = process.env.REACT_APP_API_BASE_URL || "https://amshc-backend-v2.onrender.com";
console.log("✅ ENV loaded:", baseURL);

export default {
  baseURL,
};
