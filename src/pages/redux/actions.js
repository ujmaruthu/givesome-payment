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
export const rewardApplyApi = async (data) => {

  const endpoint = `http://34.170.249.201:8080/givesome/api/payment/givecard`;
  try {
      const response = await axios.post(`${endpoint}`, data);
    //   const response = {
    //    data: {
    //     "message": "Givecard Response",
    //     "status": 200,
    //     "data": {
    //         "balance": 2,
    //         "campaignName": "Bevy",
    //         "campaignImage": "https://qa.givesome.org/media/filer_public/0f/d2/0fd2c414-2175-4664-97b1-3f5ac903fcfd/bevy.png"
    //     }
    // }
    // }
      return response;

    } catch (error) {
      return error;
    }
}
export const redeemGivecardApi = async (data) => {

  const endpoint = `http://34.170.249.201:8080/givesome/api/payment/givecard/redeem`;
  try {
      const response = await axios.post(`${endpoint}`, data);
    //   const response = {
    //    data: {
    //     "message": "Givecard Response",
    //     "status": 200,
    //     "data": {
            
    //     }
    // }
    // }
      return response;

    } catch (error) {
      return error;
    }
}

export const getCurrencyList = async (data) => {
  
  const endpoint = `http://34.170.249.201:8080/givesome/api/payment/currency/list`;
  try {
      const response = await axios.get(`${endpoint}`, data);
      return response;

    } catch (error) {
      return error;
    }
}

export const getIpBasedCurrency = async (data) => {
  const endpoint = `https://ipapi.co/json/`;
  try {
      const response = await axios.get(`${endpoint}`, data);
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

