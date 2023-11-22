import React, { useState, useEffect } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Typography, Button, CircularProgress, Alert } from '@mui/material';
import '../styles/common.css';

const CheckoutForm = ({handleNext, sharedData, updateSharedData}) => {
const stripe = useStripe();
const elements = useElements();
const [errorMessage, setErrorMessage] = useState('');
const [isProcessing, setIsProcessing] = useState(false);

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
}, [stripe]);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements) {
    return;
  }
  setIsProcessing(true);
  const { paymentIntent, error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
    },
    redirect: 'if_required'
  })
  // if (error.type === "card_error" || error.type === "validation_error") {
  //   setErrorMessage(error.message);
  // } 
  if (error) {
      console.error("Client-side error:", error.message);
      setIsProcessing(false);
    } else if (paymentIntent) {
      console.log(paymentIntent, "paymentIntent");
      setIsProcessing(false);
      if (paymentIntent.status === 'succeeded') {
          const updatedData = {
            ...sharedData,
            paymentIntent: {
              ...sharedData.paymentIntent,
              "paymentIntentId": paymentIntent.id,
            },
          };
          updateSharedData(updatedData);
          handleNext();
        } else {
          setErrorMessage('Unexpected payment status:', paymentIntent.status)
          console.log('Unexpected payment status:', paymentIntent.status);
        }
    }
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
        <Typography className='query-head mb-40 mt-20'>How would you like to pay?</Typography>
        {errorMessage  !== ''  &&  <Alert className='mb-20' severity="error">{errorMessage}</Alert>}
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