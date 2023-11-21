import axios from 'axios';

export const donationApi = async (data) => {
  const endpoint = "https://qa-api.givesome.gives/api/payment/create";
  try {
      const response = await axios.post(`${endpoint}`, data);
      // const response = {
      //   data: {
      //     "message": "Payment Success",
      //     "status": 200,
      //     "data": {
      //         "status": "succeeded",
      //         "paymentId": "ch_3OCFH9HiWAUtr3KA01o9cCID",
      //         "amount": 500,
      //         "createdTime": "2023-11-14T05:35:03Z"
      //     }
      // }
      // }
    
      return response;

    } catch (error) {
      return error;
    }
}
export const rewardApplyApi = async (data) => {

  const endpoint = `https://qa-api.givesome.gives/api/payment/givecard`;
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

  const endpoint = `https://qa-api.givesome.gives/api/payment/givecard/redeem`;
  try {
      const response = await axios.post(`${endpoint}`, data);
    //   const response = {
    //    data: {
    //       "message": "Givecard Redeem Success",
    //       "status": 200,
    //       "data": {
    //           "moreProjectUrl": "https://qa.givesome.org/mind-aid/",
                  // "createdTime": "2023-11-21T08:01:31.137136600Z",
    //           "exclusiveContentUrl": "https://qa.givesome.org/"
    //       }
    //   }
    // }
      return response;

    } catch (error) {
      return error;
    }
}

export const getCurrencyList = async (data) => {
  
  const endpoint = `https://qa-api.givesome.gives/api/payment/currency/list`;
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


export const createPaymentIntent = async (data) => {

  const endpoint = `https://qa-api.givesome.gives/api/payment/paymentIntent`;
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
