import axios from "./axios";

const loginApi = (username, password) => {
  return axios.post(
    "/auth/login-jwt",
    { username, password },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
};

const registerApi = (username, password, email) => {
  return axios.post(
    "/auth/register-jwt",
    {
      username,
      password,
      email,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};
const refreshApi = () => {
  return axios.get("/auth/refresh-jwt", {
    withCredentials: true,
  });
};
const createFolderApi = (title, bearerToken) => {
  return axios.post(
    "/noteFolder/",
    {
      title,
    },
    {
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );
};
const getAllFoldersApi = (bearerToken) => {
  return axios.get("/noteFolder/", {
    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${bearerToken}`,
    },
  });
};

const deleteFolderApi = (folderId, bearerToken) => {
  return axios.delete(`/noteFolder/${folderId}`, {
    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${bearerToken}`,
    },
  });
};

const updateFolderApi = (folderId, title, bearerToken) => {
  return axios.put(
    `/noteFolder/${folderId}`,
    {
      title,
    },
    {
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );
};

export {
  loginApi,
  registerApi,
  refreshApi,
  createFolderApi,
  getAllFoldersApi,
  deleteFolderApi,
  updateFolderApi,
};
