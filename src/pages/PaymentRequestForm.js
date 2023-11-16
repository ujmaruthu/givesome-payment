import React, { useMemo, useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentRequestButtonElement
} from "@stripe/react-stripe-js";



const PaymentRequestForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  useEffect(()=> {
    if(!stripe || !elements) {
      return;
    }
  const pr = stripe.paymentRequest({
    country: "US",
      currency: "usd",
      total: {  
        label: "Demo total",
        amount: 1000
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
   // create payment intent on server
   const {clientSecret} = await fetch('/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentMethodType: 'card',
      currency: 'usd'
    }),
  }).then(r => r.json());
  
  const {error, paymentInetnt} = await stripe.confirmCardPayment (
    clientSecret, {
      payment_method: e.paymentMethod.id,
    }, {
      handleActions: false
    }
  )
  if(error) {
    e.complete('fail');
    return;
  }
  e.complete('success')
  if(paymentInetnt.status == 'requires_action') {
    stripe.confirmCardPayment(clientSecret);
  }

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
