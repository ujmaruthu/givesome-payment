import { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from './redux/actions';

const PaymentMethod = ({ handleNext, sharedData, updateSharedData }) => {
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
  
    useEffect(() => {
        setStripePromise(loadStripe('pk_test_7rF79g57po6HBEZMbqn1PVPw'));
    }, []);


    useEffect(()=>{
      const originalString = sharedData?.donationAmount?.currency;
      const lowercaseStringCurrency = originalString.toLowerCase();
        const apiReq = {
          "mode": 'payment',
          "amount": sharedData?.donationAmount?.youGive,
          "currency": lowercaseStringCurrency
        }
        createPaymentIntent(apiReq).then((response) => {
            //   setErrorMessage('')
              if(response.code && response.code  !== "") {
                // setErrorMessage(response.code);
                return
              }
              if (response && response.data && response.data.status === 200) {
                console.log(response);
                const paymentIntent  = {
                  "clientSecret": response.data.data.clientSecret,
                  "paymentIntentId": response.data.data.paymentIntentId,
              }
              const updatedData = { ...sharedData, paymentIntent };
              updateSharedData(updatedData);
              setClientSecret(response.data.data.clientSecret);
              }
              if (response && response.data && response.data.status !== 200) {
                // setErrorMessage(response.data.message);
              }
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            //   setErrorMessage(error.message);
            });
    },[])
  
    return (
      <>
        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm handleNext={handleNext} sharedData={sharedData} csKey={clientSecret}/>
          </Elements>
        )}
      </>
    );
};



export default PaymentMethod