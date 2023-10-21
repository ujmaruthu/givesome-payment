import axios from 'axios';

export const donationApi = async (data) => {
  const endpoint = "http://34.170.249.201:8080/givesome/api/payment/create"
  try {
      const response = await axios.post(`${endpoint}`, data);
      // const response = {"message":"Payment sent Successfully","status":200,"data":{
      //   "message":"Payment sent Successfully","status":200,
      // }}
      return response;

    } catch (error) {
      return error;
    }
}
export const listDataApi = async (param1, param2, data) => {
 // Define the API endpoint with query parameters
 const endpoint = `https://example.com/api/resource?param1=${param1}&param2=${param2}`;
  try {
      const response = await axios.fetch(`${endpoint}`, data);
      // const response = {"message":"Payment sent Successfully","status":200,"data":null}
      return response;

    } catch (error) {
      return error;
    }
}

