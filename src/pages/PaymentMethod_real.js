import React, {useState} from 'react';
import { Typography, Button, CircularProgress } from '@mui/material';
import '../styles/common.css';
import CvvIcon from '../assets/cvv.svg';
import CardIcon from '../assets/cardIcon.svg';
import ApplePay from '../assets/applePay.svg';
import GPay from '../assets/gPay.svg';
import PayPal from '../assets/paypal.svg';
import { donationApi } from './redux/actions';

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

  const [creditCard, setCreditCard] = useState('');
  const [expiration, setExpiration] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');
  const [cvv, setCVV] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);


  const [creditCardErr, setCreditCardErr] = useState('');
  const [expirationErr, setExpirationErr] = useState('');
  const [cvvErr, setCVVErr] = useState('');
  const [postalCodeErr, setPostalCodeErr] = useState('');

  const [error, setError] = useState('');
  const [expiryDate, setExpiryDate] = useState('');


  const handleInputChange = (e, type) => {
    if(type === 'cardNo') {
        const input = e.target.value;
        const numericInput = input.replace(/\D/g, '');
        const formattedInput = numericInput.replace(/(\d{4})/g, '$1 ');
        setCreditCard(formattedInput);
      } else if(type === 'expiration') {
        const value = e.target.value.replace(/\D/g, ''); 
        setExpiration(value.slice(0, 2) + '/' + value.slice(2, 4));
        setExpiryDate(e.target.value);
        setExpirationMonth(value.slice(0, 2));
        setExpirationYear(value.slice(2, 4));
      } else if(type === 'cvv') {
        const value = e.target.value.replace(/\D/g, ''); 
        setCVV(value)
      } 
      if(type === 'postalCode') {
        const value = e.target.value.replace(/\D/g, ''); 
        setPostalCode(value);
      } 

  }



  const handleClick = (event) => {
    setActive(event.target.id);
  }
  const resetErrorMessage = () => {
    setCreditCardErr('');
    setExpirationErr('');
    setCVVErr('');
    setPostalCodeErr('');
  }
  const onSave = () => {
    let isInValid = false;
    const numericCreditCard = creditCard.replace(/\s/g, '');
    const creditCardExpiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    resetErrorMessage();

    if (numericCreditCard.trim().length === 0) {
      setCreditCardErr('Creit Card Number is required');
      isInValid = true;
    } else if (numericCreditCard.length !== 16 || !/^\d+$/.test(numericCreditCard)) {
      setCreditCardErr('Invalid credit card number');
      isInValid = true;
    }
    if (expiration.trim().length === 0) {
      setExpirationErr('Expiration date is required');
      isInValid = true;
    } else if(!creditCardExpiryRegex.test(expiryDate)) {
      setExpirationErr('Expiration date is not valid');
      isInValid = true;
    }
    if (cvv.trim().length === 0) {
      setCVVErr('CVV is required');
      isInValid = true;
    }else if (cvv.trim().length !== 3) {
      setCVVErr('CVV is not valid')
      isInValid = true;
    }
    if (postalCode.trim().length === 0) {
      setPostalCodeErr('Postal Code is required');
      isInValid = true;
    } else if (postalCode.length !== 5 && postalCode.length !== 9) {
      setPostalCodeErr('Invalid postal code');
      isInValid = true;
    }
    if(isInValid) {
      return;
    }
    setButtonDisabled(true);
    setError('');
    const apiRequest = {
            "amount": sharedData?.donationAmount?.totalAmount,
            "currency":sharedData?.donationAmount?.currency,
            "description":sharedData?.donationAmount?.description,
            "cardDetails":
        {
            "cardNumber": numericCreditCard,
            "expMonth": expirationMonth,
            "expYear": expirationYear,
            "cvc": cvv
        }
    }
    console.log(apiRequest, '9999999')

    const updatedData = { ...sharedData, apiRequest };
    updateSharedData(updatedData);
    console.log(updatedData, '0000')
    donationApi(apiRequest)
      .then((apiData) => {
        console.log(apiData, '0000')
        if (apiData && apiData.status === 200) {
            setError('');
            setButtonDisabled(false);
            handleNext();
          // setErrorMessage('');
          // setSuccessMessage('Thank you for Donation.');
          // setTimeout(() => {
          //   setSuccessMessage('');
          //   handleClose();
          // }, 5000);
          // event.target.reset();
        }
        if (apiData && apiData.status !== 200) {
          // setSuccessMessage('')
          setError(apiData.message);
          setButtonDisabled(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
  
 
  return (
    <form>
    <Typography className='query-head mb-20'>How would you like to pay?</Typography>
    <Typography className="sub-head mb-10">Pay via wallet:</Typography>
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
    </div>
    
    {error && <p className="error sub-head mb-10" style={{color:'red'}}>{error}</p>}
    <Typography className="sub-head mb-10">Pay with credit card</Typography>
    <div style={{ position: 'relative' }}>
        <Typography className='error-message'>{creditCardErr}</Typography>
        <input className={`amount-input mb-20 ${creditCardErr !== '' ? 'err-input' : ''}`}  placeholder='Credit Card Number' maxLength={19}  onChange={(e)=> {handleInputChange(e, 'cardNo')}} value={creditCard} />
        <img className={`${creditCardErr === '' ? 'icon-end' : 'icon-end1'}`} src={CardIcon} alt="Credit Card Number" /> 
    </div>
    <div style={{display: 'flex', gap: 10, alignItems: 'baseline' }}>
        <div className='w-50' style={{ position: 'relative' }}>
          <Typography className='error-message'>{expirationErr}</Typography>
          <input className={`amount-input mb-20 w-50 ${expirationErr !== '' ? 'err-input' : ''}`}  placeholder='Expiration MM / YY' onChange={(e)=> {handleInputChange(e, 'expiration')}} value={expiration} />
        </div>
        <div className='w-100' style={{ position: 'relative' }}>
            <Typography className='error-message'>{cvvErr}</Typography>
            <input className={`amount-input mb-20 ${cvvErr !== '' ? 'err-input' : ''}`}  style={{ paddingRight: 40 }} placeholder='CVV' maxLength={3} onChange={(e)=> {handleInputChange(e, 'cvv')}} value={cvv} />
            <img className={`${cvvErr === '' ? 'icon-end' : 'icon-end1'}`} src={CvvIcon} alt="cvv" />
        </div>
    </div>
    <div className='apply-amount mb-40'>
        <Typography className='error-message'>{postalCodeErr}</Typography>
        <input className={`amount-input ${postalCodeErr !== '' ? 'err-input' : ''}`} placeholder="Postal Code" maxLength={9} onChange={(e)=> {handleInputChange(e, 'postalCode')}} value={postalCode}/>
    </div>

    <div className='flex-space-btw'>
        <Typography className="normal-text mb-10">Givecard Credit Applied</Typography>
        <Typography className="normal-text mb-10">${sharedData?.donationAmount?.creditApplied || "0.00"}</Typography>
    </div>
    <div className='flex-space-btw'>
        <Typography className="normal-text mb-10">You Give</Typography>
        <Typography className="normal-text mb-10">${sharedData?.donationAmount?.amount || "0.00"}</Typography>
    </div>
    <div className='flex-space-btw mb-20'>
        <Typography className="sub-head mb-10">TOTAL</Typography>
        <Typography className="sub-head mb-10">${sharedData?.donationAmount?.totalAmount || "0.00"}</Typography>
    </div>
    <Button className={`normal-text next-btn ${buttonDisabled  ? 'payment-disabled' : ''}`}  variant='contained' disabled={buttonDisabled} onClick={onSave}>
      {buttonDisabled ? (<><CircularProgress className='progress-color' /><span>Processing...</span></>) : <span>Next</span>}
    </Button>
    </form>
  );
}

export default PaymentMethod1;
