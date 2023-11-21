import React, { useState, useEffect } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Typography, Button, CircularProgress } from '@mui/material';
import '../styles/common.css';

const appearance = {
  rules: {
    '.p-CardNumberInput-input': {
      placeholder: '1px solid #E0E6EB',
    },

    '.Tab:hover': {
      color: 'var(--colorText)',
    },

    '.Tab--selected': {
      borderColor: '#E0E6EB',
      boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02), 0 0 0 2px var(--colorPrimary)',
    },

    '.Input--invalid': {
      boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.07), 0 0 0 2px var(--colorDanger)',
    },

    // See all supported class names and selector syntax below
  }
};

 const CheckoutForm = ({handleNext, sharedData, csKey}) => {
  const stripe = useStripe();
  // const elements1 = useElements();
  const elements = stripe.elements({csKey, appearance});


  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
//   const [clientSecret, setClientSecret] = useState(sharedData?.paymentIntent?.clientSecret);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
        'payment_intent_client_secret'
      );
  
    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        console.log(paymentIntent, 'paymentIntentpaymentIntent')
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setIsProcessing(true);
    const { paymentIntent, error } = await stripe.confirmPayment({
      
        elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        // return_url: window.parent.postMessage({ action: 'successUrl', url: 'https://qa.givesome.org' }, "*"),
      },
      redirect: 'if_required'
    })
    console.log("PaymentIntent details:", paymentIntent);
    console.log("PaymentIntent err:", error);
    alert(3)

    // if (error.type === "card_error" || error.type === "validation_error") {
    //   setMessage(error.message);
    // } 
    if (error) {
      alert(1)
        // Handle client-side errors
        console.error("Client-side error:", error.message);
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        handleNext();
        // alert(2)
        // // Payment confirmation succeeded on the client side
        // // You may choose to handle additional client-side actions here
        // console.log("PaymentIntent details:", paymentIntent);
        // setIsProcessing(false);
        // if (paymentIntent.status === 'succeeded') {
        //     handleNext
        //     // window.location.href = `https://stripe.com/docs/payments/payment-element`;
        //   } else {
        //     alert(4)
        //     // If the paymentIntent status is not 'succeeded', you may choose to display an error message
        //     console.log('Unexpected payment status:', paymentIntent.status);
        //     // Display an error message or stay on the current page
        //   }
      
    
        // // Send the PaymentIntent ID to your server to confirm the payment on the server side
        // // handleServerConfirmation(paymentIntent.id);
      }
    

    // setIsProcessing(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
        <Typography className='query-head mb-40'>How would you like to pay?</Typography>
        {message && <p>{message}</p>}

  {/* <Typography className="sub-head mb-10" style={{textAlign: 'left'}}>Pay with credit card</Typography> */}

    <PaymentElement id="payment-element" options={paymentElementOptions} />

    <div className='flex-space-btw mt-40'>
        <Typography className="normal-text mb-10">Givecard Credit Applied</Typography>
        <Typography className="normal-text mb-10">{sharedData?.donationAmount?.currencySymbol}{sharedData?.donationAmount?.creditApplied || 0}</Typography>
    </div>
    <div className='flex-space-btw'>
        <Typography className="normal-text mb-10">You Give</Typography>
        <Typography className="normal-text mb-10">{sharedData?.donationAmount?.currencySymbol}{sharedData?.donationAmount?.youGive  || 0}</Typography>
    </div>
    <div className='flex-space-btw mb-20'>
        <Typography className="sub-head mb-10">TOTAL</Typography>
        <Typography className="sub-head mb-10" style={{textTransform: 'uppercase'}}>{sharedData?.donationAmount?.currency} {sharedData?.donationAmount?.currencySymbol}{sharedData?.donationAmount?.totalAmount || 0}</Typography>
    </div>
    
    <Button type='submit' className={`normal-text next-btn ${!stripe  ? 'payment-disabled' : ''}`}  variant='contained' disabled={!stripe || isProcessing}>
      {!stripe || isProcessing ? (<><CircularProgress className='progress-color' /><span style={{color:'#fff'}}>Processing...</span></>) : <span>Confirm Donation</span>}
    </Button>
    <Typography className='normal-text mb-10 mt-20 flex-center'>Donation processed by See the Good Foundation.</Typography>
  </form>
  );
}

export default CheckoutForm;