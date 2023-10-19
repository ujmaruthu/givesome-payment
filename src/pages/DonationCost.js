import React, {useState, useEffect} from 'react';
import { Typography, Button, Select, MenuItem, Alert } from '@mui/material';
import '../styles/common.css';
import {listDataApi} from './redux/actions';
import { TypeSpecimenOutlined } from '@mui/icons-material';


const DonationCost = ({ handleNext, sharedData, updateSharedData }) => {

  // useEffect(() => {
  //   const data = null;
  //   listDataApi(id, name, data).then((response) => {
  //     if (response && response.status === 200) {
  //     }
  //     if (response && response.status !== 200) {
  //     }
  //   })
  //   .catch((error) => {
  //     console.error('Error fetching data:', error);
  //   });
   
  // }, [id, name]); 

  const amountArray = [10, 50, 100];
  const [rewardCode, setRewardCode] = useState('');

  const [active, setActive] = useState(-1);
  const [amount, setAmount] = useState(sharedData?.donationAmount?.amount  || null);
  const [creditApplied, setCreditApplied] = useState(0.00);
  const [totalAmount, setTotalAmount] = useState(sharedData?.donationAmount?.totalAmount  || 0);
  const[errorMessage, setErrorMessage] = useState('');
  const[errMessage, setErrMessage] = useState('');

  const [currency, setCurrency] = useState(sharedData?.donationAmount?.currency  || 'cad');
  const [currencyError, setCurrencyError] = useState('');

  const handleChange = (e) => {
    setCurrency(e.target.value);
    setCurrencyError('');
  };

  const handleClick = (event) => {
    setErrorMessage('')
    setActive(event.target.id);
    setAmount(event.target.value);
    setTotalAmount(Number(event.target.value)+Number(creditApplied));
  }
  const onChangeAmount = (e) => {

    let sanitizedValue = e.target.value.replace(/[^\d.]+/, '');
    const dotCount = sanitizedValue.split('.').length - 1;
    if (dotCount > 1) {
      sanitizedValue = sanitizedValue.substring(0, sanitizedValue.lastIndexOf('.'));
    }
    setAmount(sanitizedValue);
    setTotalAmount(Number(e.target.value)+Number(creditApplied));
    if(e.target.value.trim().length !== '') {
      setErrorMessage('')
    }
  }

  const handleRewardChange = (e) => {
    const formattedInput = e.target.value;
    setRewardCode(formattedInput);
  };

  const handleApplyReward = () => {
    // onApplyReward(rewardCode);
    // setRewardCode('');
  };
 
  const onDonationNext = () => {
      let isValid = false;
      if(currency === '') {
        // setCurrencyError('Please select your currency');
        setErrMessage('Please select your currency')
        isValid = true;
      }else  if((!amount) || (amount?.trim().length === 0)){
        // setErrorMessage('Please chooose/enter the amount')
        setErrMessage('Please chooose/enter the amount')
        isValid = true;
      } else if (amount <= 0) {
        setErrMessage('Please enter the valid amount');
        isValid = true;
      }
    if(isValid) {
      return
    }
    const donationAmount = {
      "amount": amount,
      "currency": currency,
      "description": "Payment For Givesome Donation",
      "totalAmount": totalAmount,
      "creditApplied": creditApplied
     }
    const updatedData = { ...sharedData, donationAmount };
    updateSharedData(updatedData);
    handleNext();
  }
  return (
    <>
    <Typography className='query-head mb-40'>How much would you like to Donate?</Typography>
    {errMessage  !== ''  &&  <Alert className='mb-20' severity="error">{errMessage}</Alert>}
      <div style={{textAlign: 'right'}}>
        <Select
          value={currency}
          onChange={(e) => { handleChange(e) }}
          displayEmpty
          renderValue={(selected) => (
            <div style={{fontSize: 12, textTransform: 'uppercase'}}>
              <b>{selected}</b>
            </div>
          )}
          className={`amount-input ${currencyError !== '' ? "select-input-error" : "select-input"}`}
        >
          <MenuItem value={"usd"}>
            <div>
              <b style={{marginRight: 10}}>USD</b>
              <span style={{ color: '#ccc' }}>US Dollar</span>
            </div>
          </MenuItem>
          <MenuItem value={"cad"}>
            <div>
              <b style={{marginRight: 10}}>CAD</b>
              <span style={{ color: '#ccc' }}>Canadian Dollar</span>
            </div>
          </MenuItem>
        </Select>
      </div> 
    <Typography className="sub-head mb-10" style={{marginTop: '-15px'}}>Specify amount:</Typography>
   
    <Typography className="error-message1 mb-10">{currencyError}</Typography>
    <div className='flex-space-btw mb-10'>
      
        {amountArray.map((amount, i) => (
        <Button
            key={i}
            className={`normal-text outlined-btn ${active == i ? "active-btn" : "normal-btn"}`}
            id={i}
            onClick={handleClick}
            value={amount}
            variant='outlined'>${amount}</Button>
        ))}
    </div>
    <div style={{display: 'flex', flexDirection: 'row',alignItems: 'baseline', marginTop: 15}}>
    <div style={{ position: 'relative', width: '100%' }}>
        <label className={`${errorMessage !== '' ? 'money-symbol' : 'money-symbol1'}`}>$</label>
        <Typography className='error-message'>{errorMessage}</Typography>
        <input className={`amount-input mb-20 input-center ${errorMessage !== '' ? 'err-input' : ''}`}  maxLength={8} value={amount} onChange={(e)=> {onChangeAmount(e)}} placeholder='Enter a custom amount' />
    </div>
  </div>
    {/* <Typography className="sub-head mb-10">Redeem a Givecard:</Typography>
    <div className='apply-amount mb-40'>
        <input className='amount-input' 
            type="text"
            placeholder="Enter 6 digit PIN"
            value={rewardCode}
            maxLength={6}
            onChange={handleRewardChange}
            />
        <Button className="normal-text apply-btn"  onClick={handleApplyReward}  disabled={rewardCode.trim() === ''} variant='contained'>
        Apply
        </Button>
    </div> */}

    {/* <div className='flex-space-btw mt-10'>
        <Typography className="normal-text mb-10">Givecard Credit Applied</Typography>
        <Typography className="normal-text mb-10">${creditApplied ? creditApplied : "0.00"}</Typography>
    </div> */}
    <div className='flex-space-btw mt-10'>
        <Typography className="normal-text mb-10">You Give</Typography>
        <Typography className="normal-text mb-10">${amount ? amount : "0.00"}</Typography>
    </div>
    <div className='flex-space-btw mb-20'>
        <Typography className="sub-head mb-10">TOTAL</Typography>
        <Typography className="sub-head mb-10" style={{textTransform: 'uppercase'}}>{currency} ${totalAmount ? totalAmount : '0.00'}</Typography>
    </div>
    <Button className="normal-text next-btn" variant='contained' onClick={onDonationNext}>
        Next
    </Button>
    <Typography className='normal-text mb-10 mt-20 flex-center'>Donation processed by See the Good Foundation</Typography>
    </>
  );
}

export default DonationCost;

