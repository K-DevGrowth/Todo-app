import axios from "axios";
const baseUrl = "/api/todos";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const deleted = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then(() => id);
};

export default { getAll, create, deleted };
