import axios from 'axios';

export const donationApi = async (data) => {
  const endpoint = "http://localhost:8080/api/charge/create"
  try {
      const response = await axios.post(`${endpoint}`, data);
      // const response = {"message":"Payment sent Successfully","status":200,"data":null}
      return response;

    } catch (error) {
      return error;
    }
}

