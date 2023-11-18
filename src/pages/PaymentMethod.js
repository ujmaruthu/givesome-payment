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
        const apiReq = {
            "amount": 5,
            "currency": "usd"
        }
        createPaymentIntent(apiReq).then((response) => {
            //   setErrorMessage('')
              if(response.code && response.code  !== "") {
                // setErrorMessage(response.code);
                return
              }
              if (response && response.data && response.data.status === 200) {
                console.log(response);
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
  
    // useEffect(() => {
    //    const payload = {
    //         "amount": 5,
    //         "currency": "usd"
    //     }
        
    //     alert(3333)
    //     fetch("http://localhost:8080/api/payment/paymentIntent", {
    //       method: "POST",
    //       body: JSON.stringify({payload}),
    //     }).then(async (result) => {
    //       const responsee = {
    //         "id": "pi_3OD9NjHiWAUtr3KA1Lqcos8e",
    //         "object": "payment_intent",
    //         "amount": 2000,
    //         "currency": "USD",
    //         "automatic_payment_methods": {
    //           "enabled": true
    //         },
    //         "client_secret": "pi_3OD9NjHiWAUtr3KA1Lqcos8e_secret_Ne53TeJPjqJzB7tPrFkJwetaK",
    //       }
          
    
    //     var { client_secret: clientSecret } = responsee;

    //       console.log(clientSecret, 'clientSct')
    //       setClientSecret("pi_3OD9NjHiWAUtr3KA1Lqcos8e_secret_Ne53TeJPjqJzB7tPrFkJwetaK");
    //     });
    //   }, []);
  
    return (
      <>
        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        )}
      </>
    );
};



export default PaymentMethod