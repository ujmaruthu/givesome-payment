import React, {useState, useEffect} from 'react';
import { Typography, Button, Alert } from '@mui/material';
import '../styles/common.css';
import {rewardApplyApi} from './redux/actions';
import TickIcon from '../assets/tick.svg';
import { getCurrencyList, getIpBasedCurrency } from './redux/actions';
import * as formatters from '../utils/util';


const ApplyGivecard = ({ handleNext, sharedData, updateSharedData }) => {

  const [errorMessage, setErrorMessage] = useState('');

  const [rewardCode, setRewardCode] = useState('');

  const [amount, setAmount] = useState(sharedData?.donationAmount?.amount  || null);
  const [creditApplied, setCreditApplied] = useState(0.00);
  const [currency, setCurrency] = useState(sharedData?.donationAmount?.currency  || 'cad');
  const [totalAmount, setTotalAmount] = useState(sharedData?.donationAmount?.totalAmount  || 0);

  const [ipBasedCurrency, setIpBasedCurrency] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [countryCode, setCountryCode] = useState('')
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [giveCardBlc, setGiveCardBlc] = useState(null);
  const [givecardId, setGiveCardId] = useState(null)
  const [redeemableAmount, setRedeemableAmount] = useState(null);

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

  const handleRewardChange = (e) => {
    let val = formatters.isAlphabetic(e.target.value);
    if(val) {
      setRewardCode(e.target.value);
    }
  };

  const handleApplyReward = () => {
    let isValid = false;
    if(rewardCode?.trim()?.length === 0){
      setErrorMessage('Please enter the pin')
        isValid = true;
    } 
    if(isValid) {
      return
    }
    const payload = {
      "code": rewardCode?.toUpperCase(),
      "userId":null
    }
    onApplyReward(payload);
  };
 
  const onApplyReward = (apiReq) => {
    rewardApplyApi(apiReq).then((response) => {
      setErrorMessage('')
      if(response.code && response.code  !== "") {
        setErrorMessage(response.code);
        return
      }
      if (response && response.data && response.data.status === 200) {
          setErrorMessage('')
          setCreditApplied(response.data?.data?.balance);
          setGiveCardBlc(response.data?.data?.balance);
          setGiveCardId(response.data?.data?.givecardId);
          setTotalAmount(response.data?.data?.balance + amount)
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
  
  const onChangeInput = (e) => {
    let val = formatters.isNumeric(e.target.value);
    if(val <= creditApplied) {
      setRedeemableAmount(val);
      setGiveCardBlc(creditApplied - val)
    }
  }

  const onNextClick = () => {
    const rewardApplied = {
      "creditApplied": Number(redeemableAmount) || 0,
      "rewardCode": rewardCode,
      "givecardId": givecardId,
      "givacardBalance": giveCardBlc
     }
    const updatedData = { ...sharedData, rewardApplied };
    updateSharedData(updatedData);
    handleNext();
  }
  return (
    <>
    <Typography className='query-head mb-40'>Would you like to use a Givecard?</Typography>
    {errorMessage  !== ''  &&  <Alert severity="error" className='mb-20'>{errorMessage}</Alert>}
    <div className='' style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <Typography className="sub-head mb-10">Redeem a Givecard:</Typography>
      {creditApplied !== 0 && ( <Typography className="sub-head mb-10" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase'}}><img src={TickIcon} style={{marginRight: 5}}/>{rewardCode} </Typography>)}
    </div>
    
    {creditApplied === 0 ? (
      <div className='apply-amount mb-40'>
        <input className='amount-input' 
            type="text"
            placeholder="Enter 6 digit PIN"
            style={{textTransform: 'uppercase'}}
            value={rewardCode}
            maxLength={6}
            onChange={handleRewardChange}
            />
        <Button className="normal-text apply-btn"  onClick={handleApplyReward}  disabled={rewardCode?.trim() === ''} variant='contained'>
        Apply
        </Button>
    </div> 
    ): (
      <>
      <div className='flex-space-btw mt-10'>
        <Typography className="normal-text mb-10">Givecard balance</Typography>
        <Typography className="normal-text mb-10">{currencySymbol}{giveCardBlc ? giveCardBlc : "0.00"}</Typography>
      </div>
      <div className='amount-input mb-40' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className=''>How much of Givecard?</div>
          <div className="normal-text">
          <input className='small-input w-50' value={redeemableAmount} onChange={onChangeInput} style={{border: '1px solid transparent'}} placeholder='Redeemable amount' name="Redeemable amount" />
          </div>
        </div>
      </>
    )}
    
    {creditApplied !== 0 ? (
        <div className='flex-space-btw mt-10'>
          <Typography className="normal-text mb-10">Givecard Credit Applied</Typography>
          <Typography className="normal-text mb-10">{currencySymbol}{redeemableAmount ? redeemableAmount : "0.00"}</Typography>
        </div>
        // <div className='flex-space-btw'>
        //     <Typography className="normal-text mb-10">You Give</Typography>
        //     <Typography className="normal-text mb-10">{currencySymbol}{youGive ? youGive : "0.00"}</Typography>
        //   </div>
        //   <div className='flex-space-btw mb-20'>
        //     <Typography className="sub-head mb-10">TOTAL</Typography>
        //     <Typography className="sub-head mb-10" style={{ textTransform: 'uppercase' }}>{currency}  {currencySymbol}{totalAmount ? totalAmount : '0.00'}</Typography>
        //   </div>
    ) : <div style={{height: 60}}></div>}
    <Button className="normal-text next-btn" variant='contained' onClick={onNextClick}>
        Next
    </Button>
    </>
  );
}

export default ApplyGivecard;

