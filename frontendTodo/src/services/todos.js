import axios from "axios";
const baseUrl = "/api/todos";

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};

const create = async (newObject) => {
  const request = await axios.post(baseUrl, newObject);
  return request.data;
};

const deleted = async (id) => {
  await axios.delete(`${baseUrl}/${id}`);
  return id;
};

const deleteAllCompleted = async () => {
  await axios.delete(`${baseUrl}/completed`);
  return true;
};

const update = async (id, newObject) => {
  const request = await axios.put(`${baseUrl}/${id}`, newObject);
  return request.data;
};

export default { getAll, create, deleted, update, deleteAllCompleted };
