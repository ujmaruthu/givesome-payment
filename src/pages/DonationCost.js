import React, {useState, useEffect} from 'react';
import { Typography, Button, Select, MenuItem, Alert } from '@mui/material';
import '../styles/common.css';
import { getCurrencyList, getIpBasedCurrency } from './redux/actions';

const DonationCost = ({ handleNext, sharedData, updateSharedData }) => {
  const amountArray = [2, 5, 10];
  
  const [active, setActive] = useState(sharedData?.donationAmount?.btnAmount  || '');
  const [amount, setAmount] = useState(sharedData?.donationAmount?.amount  || null);
  const [youGive, setYouGive] = useState(sharedData?.donationAmount?.youGive  || 0);
  const [creditApplied, setCreditApplied] = useState(sharedData?.rewardApplied?.creditApplied || 0);
  const [totalAmount, setTotalAmount] = useState(sharedData?.donationAmount?.totalAmount  || (creditApplied + youGive) || 0);
  const [countryCode, setCountryCode] = useState('')
  const[errorMessage, setErrorMessage] = useState('');
  const[errMessage, setErrMessage] = useState('');
  console.log(sharedData?.rewardApplied?.creditApplied)
  console.log(youGive)
  const [ipBasedCurrency, setIpBasedCurrency] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);


  useEffect(() => {
    getIpBasedCurrency().then((response) => {
        if(response.code && response.code  !== "") {
          return
        }
        if (response && response.status === 200) {
            setIpBasedCurrency(response.data.currency)
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setErrorMessage(error.message);
      });

      getCurrencyList().then((response) => {
        if(response.code && response.code  !== "") {
          return
        }
        if (response && response.status === 200) {
          setCurrencyList(response.data.data)
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setErrorMessage(error.message);
      });
  }, []);

  useEffect(() => {
    if (ipBasedCurrency?.length > 0 && currencyList?.length > 0) {
      const defaultCurrency = sharedData?.donationAmount?.currency || 'USD';

      setCurrencyList(currencyList);

      // For Current Use
      setCountryCode(defaultCurrency);
      setCurrency(defaultCurrency);
      setCurrencySymbol(getCurrencySymbol(defaultCurrency));

      // setCountryCode(sharedData?.donationAmount?.currency || ipBasedCurrency)
      // setCurrency(sharedData?.donationAmount?.currency || ipBasedCurrency);
      // setCurrencySymbol(sharedData?.donationAmount?.currency ? getCurrencySymbol(sharedData?.donationAmount?.currency) : getCurrencySymbol(ipBasedCurrency))
    }
  }, [ipBasedCurrency, currencyList]);


  const getCurrencySymbol = (currencyCode) => {
    const currency = currencyList?.find((item) => item.currencyCode === currencyCode);
    return currency ? currency.currencySymbol : '';
  };

  const [currency, setCurrency] = useState(sharedData?.donationAmount?.currency ? sharedData?.donationAmount?.currency : countryCode);
  const [currencySymbol, setCurrencySymbol] = useState(sharedData?.donationAmount?.currencySymbol);
  const [currencyError, setCurrencyError] = useState('');

  useEffect(()=>{
    
    if(sharedData?.donationAmount?.currencySymbol) {
      setCurrencySymbol(sharedData?.donationAmount?.currencySymbol)
    } else {
      setCurrencySymbol(getCurrencySymbol(currency))
    }
  },[currencyList, countryCode, sharedData?.donationAmount?.currencySymbol])

  const handleChange = (e) => {
    setCurrency(e.target.value);
    const filteredArray = currencyList?.filter((obj) => obj?.currencyCode === e.target.value)[0]
    setCurrencySymbol(filteredArray.currencySymbol)
    setCurrencyError('');
  };
  
  const handleClick = (event) => {
    setErrorMessage('')
    setActive(event.target.value);
    setAmount('');
    setYouGive(Number(event.target.value))
    setTotalAmount(Number(event.target.value)+Number(creditApplied));
  }
  const onChangeAmount = (e) => {
    let sanitizedValue = e.target.value.replace(/[^\d.]+/, '');
    const dotCount = sanitizedValue.split('.').length - 1;
    if (dotCount > 1) {
      sanitizedValue = sanitizedValue.substring(0, sanitizedValue.lastIndexOf('.'));
    }
    setAmount(sanitizedValue);
    setYouGive(sanitizedValue);
    setActive('')
    setTotalAmount(Number(e.target.value)+Number(creditApplied));
    if(e.target.value.trim().length !== '') {
      setErrorMessage('')
    }
  }

  const onDonationNext = () => {
      let isValid = false;
        if(totalAmount === 0){
        setErrMessage('Please chooose/enter the amount')
        isValid = true;
      } else if (totalAmount < 2) {
        setErrMessage('Please enter a donation amount greater than'+ currencySymbol+'2.');
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
      "creditApplied": creditApplied,
      "btnAmount": Number(active),
      "youGive": youGive,
      "currencySymbol": currencySymbol
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
          {currencyList.map((item) => (
          <MenuItem key={item.currencyCode} value={item.currencyCode}>
            <div>
              {currency === item.currencyCode && <span style={{ marginRight: 5 }}>✓</span>}
              <b style={{ marginRight: 10 }}>{item.currencyCode.toUpperCase()}</b>
              <span style={{ color: '#ccc' }}>{item.currencyName}</span>
            </div>
          </MenuItem>
        ))}
        </Select>
      </div> 
    <Typography className="sub-head mb-10" style={{marginTop: '-15px'}}>Specify amount:</Typography>
   
    <Typography className="error-message1 mb-10">{currencyError}</Typography>
    <div className='flex-space-btw mb-10'>
      
        {amountArray.map((amount, i) => (
        <Button
            key={i}
            className={`normal-text outlined-btn ${active == amount ? "active-btn" : "normal-btn"}`}
            id={amount}
            onClick={handleClick}
            value={amount}
            variant='outlined'>{currencySymbol}{amount}</Button>
        ))}
    </div>
    <div style={{display: 'flex', flexDirection: 'row',alignItems: 'baseline', marginTop: 15}}>
    <div style={{ position: 'relative', width: '100%' }}>
        <label className={`${errorMessage !== '' ? 'money-symbol' : 'money-symbol1'}`}>{currencySymbol} </label>
        <Typography className='error-message'>{errorMessage}</Typography>
        <input className={`amount-input mb-20 input-center ${errorMessage !== '' ? 'err-input' : ''}`}  maxLength={8} value={amount} onChange={(e)=> {onChangeAmount(e)}} placeholder=' Enter a custom amount' />
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

    <div className='flex-space-btw'>
        <Typography className="normal-text mb-10">Givecard Credit Applied</Typography>
        <Typography className="normal-text mb-10">{currencySymbol}{creditApplied ? creditApplied : 0}</Typography>
    </div>
    <div className='flex-space-btw'>
        <Typography className="normal-text mb-10">You Give</Typography>
        <Typography className="normal-text mb-10">{currencySymbol}{youGive ? youGive : 0}</Typography>
    </div>
    <div className='flex-space-btw mb-20'>
        <Typography className="sub-head mb-10">TOTAL</Typography>
        <Typography className="sub-head mb-10" style={{textTransform: 'uppercase'}}>{currency} {currencySymbol}{totalAmount ? totalAmount : 0}</Typography>
    </div>
    <Button className="normal-text next-btn" variant='contained' onClick={onDonationNext}>
        Next
    </Button>
    <Typography className='normal-text mb-10 mt-20 flex-center'>Donation processed by See the Good Foundation</Typography>
    </>
  );
}

export default DonationCost;

