const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001";

export const getApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const getAssetUrl = (filePath = "") => {
  if (!filePath) {
    return "";
  }

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  const normalizedPath = filePath.replace(/^public/, "");
  return getApiUrl(normalizedPath);
};

export default API_BASE_URL;
