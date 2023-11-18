import React, {useState} from 'react';
import { Typography, Button, CircularProgress, Alert } from '@mui/material';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import '../styles/stripe-element.css';
import '../styles/common.css';
import {
  ElementsConsumer,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';

import ApplePay from '../assets/applePay.svg';
import GPay from '../assets/gPay.svg';
import PayPal from '../assets/paypal.svg';
import { donationApi } from './redux/actions';
// import PaymentRequestForm from './PaymentRequestForm';

const options = {
    style: {
      base: {
        color: "#303238",
        fontSize: "16px",
        fontFamily: "sans-serif",
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#CFD7DF"
        }
      },
      invalid: {
        color: "#e5424d",
        ":focus": {
          color: "#303238"
        }
      },
      placeholder: 'Custom Placeholder', 
    }
  };
  
const stripePromise = loadStripe('pk_test_7rF79g57po6HBEZMbqn1PVPw');

  
const InjectedCheckoutForm = ({handleNext, sharedData, updateSharedData}) => {
  return (
    <ElementsConsumer>
      {({elements, stripe}) => (
        <CheckoutForm elements={elements} stripe={stripe} handleNext={handleNext} sharedData={sharedData} updateSharedData={updateSharedData} />
      )}
    </ElementsConsumer>
  );
};

const CheckoutForm = ({handleNext, sharedData, updateSharedData, elements, stripe}) => {
  const [postalCode, setPostalCode] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState('');

  const handleInputChange = (e, type) => {
      if(e.error && e.error.message) {
        setErrorMessage(e.error.message)
      } else {
        setErrorMessage('');
     }
     if(type === 'postalCode') {
      const value = e.target.value.replace(/\D/g, ''); 
      setPostalCode(value);
    } 

}
const confirmDonation = (apiReq) => {
  donationApi(apiReq).then((response) => {
    setButtonDisabled(false);
    setErrorMessage('')
    if(response.code && response.code  !== "") {
      setErrorMessage(response.code);
      return
    }
    if (response && response.data && response.data.status === 200) {
        const paymentSuccessData = response.data.data;
        const updatedData = { ...sharedData, paymentSuccessData };
        updateSharedData(updatedData);
        setErrorMessage('')
        handleNext();
    }
    if (response && response.data && response.data.status !== 200) {
      setErrorMessage(response.data.message);
    }
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
    setErrorMessage(error.message);
  });
}


const handleSubmit = async event => {
  setButtonDisabled(true)

  event.preventDefault();
  if (!stripe || !elements) {
    return;
  }
  const card = elements.getElement(CardNumberElement);
  const result = await stripe.createToken(card);

  if (result.error) {
    setButtonDisabled(false)
    setErrorMessage(result.error.message);
  } 
  else if(postalCode.trim().length === 0 || postalCode.trim().length !== 6) {
    setButtonDisabled(false)
    setErrorMessage('Your postal code is incomplete.')
  }
  else {
    setErrorMessage('');
    const originalString = sharedData?.donationAmount?.currency;
    const lowercaseStringCurrency = originalString.toLowerCase();
    const apiRequest = {
      "amount": sharedData?.donationAmount?.totalAmount,
      "youGive":sharedData?.donationAmount?.youGive,
      "givecardAmount":Number(sharedData?.rewardApplied?.creditApplied),
      "givecardId":Number(sharedData?.rewardApplied?.givecardId),
      "givacardBalance":Number(sharedData?.rewardApplied?.givacardBalance),
      "currency": lowercaseStringCurrency,
      "description": sharedData?.donationAmount?.description+' (to '+sharedData.projectName+')',
      "token": result.token.id,
      "postalCode": postalCode,
      "projectId": sharedData?.projectId,
      "supplierId": sharedData?.supplier_id || "",
      "givecardCode": sharedData?.rewardApplied?.rewardCode?.toUpperCase() || "",
      "userId": sharedData?.userId  !== "None"  ? sharedData?.userId : null,
    }
  const updatedData = { ...sharedData, apiRequest };
  updateSharedData(updatedData);
  confirmDonation(apiRequest)
}
};
  
return (
    <form onSubmit={handleSubmit}>
      {errorMessage  !== ''  &&  <Alert severity="error">{errorMessage}</Alert>}
      <div className="custom-card-element">
        <CardNumberElement 
        onChange={(e)=> {handleInputChange(e, 'cardNo')}}
        options={options} />
        <CardExpiryElement options={options} onChange={(e)=> {handleInputChange(e, 'expiry')}}/>
        <CardCvcElement options={options} onChange={(e)=> {handleInputChange(e, 'ccv')}} />
      </div>
      <div className='apply-amount mb-20 mt-5'>
        <input className='amount-input' placeholder="Postal Code" maxLength={6} onChange={(e)=> {handleInputChange(e, 'postalCode')}} value={postalCode}/>
      </div>
      {/* <div className='payment-req'>
        <PaymentRequestForm sharedData={sharedData} handleNext={handleNext}/>
      </div> */}
      <div className='flex-space-btw'>
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
    
    <Button type='submit' className={`normal-text next-btn ${!stripe  ? 'payment-disabled' : ''}`}  variant='contained' disabled={!stripe || buttonDisabled}>
      {!stripe || buttonDisabled ? (<><CircularProgress className='progress-color' /><span style={{color:'#fff'}}>Processing...</span></>) : <span>Confirm Donation</span>}
    </Button>
    <Typography className='normal-text mb-10 mt-20 flex-center'>Donation processed by See the Good Foundation.</Typography>
    </form>
);
};


const PaymentMethod1 = ({ handleNext, sharedData, updateSharedData }) => {

const paymentMethodArray = [{
  icon: ApplePay,
  name: 'Pay'
},
{
  icon: GPay,
  name: 'G Pay'
},{
  icon: PayPal,
  name: 'Paypal'
}]
const [active, setActive] = useState("");

const handleClick = (event) => {
  setActive(event.target.id);
}


return (
  <div>
    <Typography className='query-head mb-40'>How would you like to pay?</Typography>
  {/* <Typography className="sub-head mb-10" style={{textAlign: 'left'}}>Pay via wallet:</Typography>
  <div className='flex-space-btw mb-20'>
      {paymentMethodArray.map((paymentMethod, i) => (
      <Button
          key={i}
          className="normal-text black-btn outlined-btn"
          id={i}
          onClick={handleClick}
          value={paymentMethod.name}
          startIcon={<img src={paymentMethod.icon} />}
          variant='outlined'></Button>
      ))}
  </div> */}
  
  <Typography className="sub-head mb-10" style={{textAlign: 'left'}}>Pay with credit card</Typography>
      <div>
        <Elements stripe={stripePromise}>
          <InjectedCheckoutForm  handleNext={handleNext} sharedData={sharedData} updateSharedData={updateSharedData} />
        </Elements>
      </div>
    
    </div>
  );
};



export default PaymentMethod1