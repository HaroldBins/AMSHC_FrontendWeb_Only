const baseURL = process.env.REACT_APP_API_BASE_URL || "https://it342-amshc-backend-only.onrender.com";
console.log("✅ ENV loaded:", baseURL);

export default {
  baseURL,
};
