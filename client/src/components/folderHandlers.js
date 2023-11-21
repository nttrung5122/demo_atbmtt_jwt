import {
  createFolderApi,
  getAllFoldersApi,
  deleteFolderApi,
  updateFolderApi,
} from "../api/UserServices";

const createFolder = async (folders, setFolders, bearerToken) => {
  const title = "New folder"; // or any other logic to determine the title
  try {
    const response = await createFolderApi(title, bearerToken);

    if (response?.data) {
      setFolders([...folders, response.data]);
    }
  } catch (error) {
    console.log("Error creating folder:", error);
  }
};
const getAllFolders = async (setFolders, bearerToken) => {
  try {
    const response = await getAllFoldersApi(bearerToken);
    if (response && response?.data) {
      setFolders(response.data);
    }
  } catch (error) {
    console.log("Error getting all folders:", error);
  }
};

const deleteFolder = async (folderId, folders, setFolders, bearerToken) => {
  try {
    const response = await deleteFolderApi(folderId, bearerToken);
    if (response && response.status === 200) {
      // Assuming status 200 means success

      setFolders(folders.filter((folder) => folder._id !== folderId));
    }
  } catch (error) {
    console.log("Error deleting the folder:", error);
  }
};
const updateFolder = async (
  folderId,

  newTitle,

  folders,

  setFolders,

  bearerToken
) => {
  try {
    const response = await updateFolderApi(folderId, newTitle, bearerToken);

    if (response && response.status === 200) {
      setFolders(
        folders.map((folder) =>
          folder._id === folderId ? { ...folder, title: newTitle } : folder
        )
      );
    }
  } catch (error) {
    console.log("Error updating the folder:", error);
  }
};
export { createFolder, getAllFolders, deleteFolder, updateFolder };
