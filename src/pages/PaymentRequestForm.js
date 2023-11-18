import React, { useMemo, useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentRequestButtonElement
} from "@stripe/react-stripe-js";



const PaymentRequestForm = ({sharedData, handleNext}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  useEffect(()=> {
    if(!stripe || !elements) {
      return;
    }
    const originalString = sharedData?.donationAmount?.currency;
    const lowercaseStringCurrency = originalString.toLowerCase();
  const pr = stripe.paymentRequest({
    country: sharedData?.donationAmount?.currency,
      currency: lowercaseStringCurrency,
      total: {  
        label: "Donation Amount",
        amount: Number(sharedData?.rewardApplied?.creditApplied)
      },
      requestPayerName: true,
      requestPayerEmail: true,
  })
  pr.canMakePayment().then((result) => {
    if(result) {
      //Show btn on page
      setPaymentRequest(pr);
    }
  });
  pr.on('paymentmethod', async (e) => {
  //  create payment intent on server
  //  const {clientSecret} = await fetch('/create-payment-intent', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     paymentMethodType: 'card',
  //     currency: 'usd'
  //   }),
  // }).then(r => {
    
  //   const res = {
  //     "clientSecret": "pi_3OD9NjHiWAUtr3KA1Lqcos8e_secret_Ne53TeJPjqJzB7tPrFkJwetaK",
  //     "paymentIntentId": "pi_3OD9NjHiWAUtr3KA1Lqcos8e",
  //     "status": "requires_confirmation",
  //     "clientData": {
  //       // additional information may be included here
  //     }
  //   }
  //   res.json()});
  const {clientSecret} = "pi_3ODn7QHiWAUtr3KA0N5gUvKA_secret_hVy9SGNNRZ5FUKor3ygFaOFxg"
  const {paymentIntentId} = "pi_3ODn7QHiWAUtr3KA0N5gUvKA"
  // const paymentInetnt[status] = "requires_payment_method"
  
  const {error, paymentInetnt} = await stripe.confirmCardPayment (
    clientSecret, {
      payment_method: paymentIntentId,
    }, {
      handleActions: false
    }
  )
  if(error) {
    e.complete('fail');
    return;
  }
  e.complete('success')
  // if(paymentInetnt.status == 'requires_action') {
    stripe.confirmCardPayment(clientSecret);
    // handleNext()
  // }

  });
  
},  [stripe, elements])
  return (
    <div>
      {paymentRequest && 
          <PaymentRequestButtonElement
            className="PaymentRequestButton"
            options={{paymentRequest}}
            onReady={() => {
              console.log("PaymentRequestButton [ready]");
            }}
            onClick={event => {
              console.log("PaymentRequestButton [click]", event);
            }}
            onBlur={() => {
              console.log("PaymentRequestButton [blur]");
            }}
            onFocus={() => {
              console.log("PaymentRequestButton [focus]");
            }}
          />
      }
    </div>
  );
};

export default PaymentRequestForm;
