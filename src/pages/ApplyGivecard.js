import React, {useState, useEffect} from 'react';
import { Typography, Button, Alert, FormControlLabel, Radio, FormControl, RadioGroup } from '@mui/material';
import '../styles/common.css';
import {rewardApplyApi} from './redux/actions';
import TickIcon from '../assets/tick.svg';
import { getCurrencyList, getIpBasedCurrency, redeemGivecardApi } from './redux/actions';
import * as formatters from '../utils/util';


const ApplyGivecard = ({ handleNext, sharedData, updateSharedData, onBackButtonClick }) => {

  const [errorMessage, setErrorMessage] = useState('');
  const [radioErrorMessage, setRadioErrorMessage] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [showBackButton, setShowBackButton] = useState(true);

  const [rewardCode, setRewardCode] = useState(sharedData?.rewardApplied?.rewardCode || '');

  const [amount, setAmount] = useState(sharedData?.donationAmount?.amount  || null);
  const [creditApplied, setCreditApplied] = useState(sharedData?.rewardApplied?.creditApplied + sharedData?.rewardApplied?.givacardBalance || 0);
  const [currency, setCurrency] = useState(sharedData?.donationAmount?.currency  || 'cad');
  const [totalAmount, setTotalAmount] = useState(sharedData?.donationAmount?.totalAmount  || 0);

  const [ipBasedCurrency, setIpBasedCurrency] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [countryCode, setCountryCode] = useState('')
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [giveCardBlc, setGiveCardBlc] = useState(sharedData?.rewardApplied?.givacardBalance || null);
  const [givecardId, setGiveCardId] = useState(sharedData?.rewardApplied?.givecardId || null)
  const [redeemableAmount, setRedeemableAmount] = useState(sharedData?.rewardApplied?.redeemableAmount);
  const [campaignName, setCampaignName] = useState(null);
  const [campaignMessage, setCampaignMessage] = useState(null);
  const [campaignImage, setCampaignImage] = useState(sharedData?.rewardApplied?.redeemableAmount || null);
  const [applyBtnDisable, setApplyBtnDisable] = useState(false);
  const [showRedeemSuccess, setShowRedeemSuccess] = useState(false);
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
      // setCountryCode(defaultCurrency);
      // setCurrency(defaultCurrency);
      // setCurrencySymbol(getCurrencySymbol(defaultCurrency));

      setCountryCode(sharedData?.donationAmount?.currency || ipBasedCurrency)
      setCurrency(sharedData?.donationAmount?.currency || ipBasedCurrency);
      setCurrencySymbol(sharedData?.donationAmount?.currency ? getCurrencySymbol(sharedData?.donationAmount?.currency) : getCurrencySymbol(ipBasedCurrency))
    }
  }, [ipBasedCurrency, currencyList]);


  const getCurrencySymbol = (currencyCode) => {
    const currency = currencyList?.find((item) => item.currencyCode === currencyCode);
    return currency ? currency.currencySymbol : '';
  };

  const handleRewardChange = (e) => {
    let inputValue = e.target.value;
    if (/^[a-zA-Z0-9]*$/.test(inputValue) || inputValue === '') {
      setRewardCode(inputValue);
    }
  };

  const handleApplyReward = () => {
    let isValid = false;
    setApplyBtnDisable(true);
    if(rewardCode?.trim()?.length === 0){
      setErrorMessage('Please enter the pin')
        isValid = true;
    } 
    if(isValid) {
      return
    }
    const payload = {
      "code": rewardCode?.toUpperCase(),
      "userId": sharedData?.userId  !== "None"  ? sharedData?.userId : null,
      "supplierId": sharedData?.supplier_id || null
    }
    onApplyReward(payload);
  };
 
  const onApplyReward = (apiReq) => {
    rewardApplyApi(apiReq).then((response) => {
      setApplyBtnDisable(false)
      setErrorMessage('')
      if(response.code && response.code  !== "") {
        setErrorMessage(response.code);
        return
      }
      if (response && response.data && response.data.status === 200) {
          setErrorMessage('')
          setShowBackButton(!showBackButton);
          onBackButtonClick(!showBackButton);
          setCreditApplied(response.data?.data?.balance);
          setGiveCardBlc(response.data?.data?.balance);
          setGiveCardId(response.data?.data?.givecardId);
          setShowRedeemSuccess(true);
          setTotalAmount(response.data?.data?.balance + amount);
          setCampaignName(response.data?.data?.campaignName);
          setCampaignImage(response.data?.data?.campaignImage);
          setCampaignMessage(response.data?.data?.campaignMessage);
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
  
  const handleChange = (event) => {
    event.preventDefault();
    setSelectedValue(event.target.value);
    setRadioErrorMessage('')
  };

  const onChangeInput = (e) => {
    let val = formatters.isNumeric(e.target.value);
    const enteredAmount = Number(val);
    if(enteredAmount <= creditApplied) {
      setRedeemableAmount(val);
      setGiveCardBlc(creditApplied - val)
    } else {
      setRedeemableAmount('');
    }
  }
  const GiveNow = () => { 
    if (!selectedValue) {
      setRadioErrorMessage('Please choose an option to proceed')
      return
    }
    setShowRedeemSuccess(false)
  }

  const onNextClick = () => {
    const rewardApplied = {
      "creditApplied": Number(redeemableAmount) || 0,
      "redeemableAmount": Number(redeemableAmount) || 0,
      "rewardCode": errorMessage ? '' : rewardCode,
      "givecardId": givecardId,
      "givacardBalance": giveCardBlc,
      "showGiveCardBlc": true
     }
    const updatedData = { ...sharedData, rewardApplied };
    updateSharedData(updatedData);
    if(selectedValue === 'pin') {
      const payload = {
        "givecardId": givecardId || null,
        "userId": sharedData?.userId  !== "None"  ? sharedData?.userId : null,
        "givacardBalance": giveCardBlc,
        "supplierId": sharedData?.supplier_id || "",
        "givecardAmount": Number(redeemableAmount) || 0,
        "currency": currency,
        "projectId":sharedData?.projectId || ""
      }
      onRedeemingGivecard(payload);
    } else {
      handleNext();
    }
  }
  const onRedeemingGivecard = (apiReq) => {
    redeemGivecardApi(apiReq).then((response) => {
      setErrorMessage('')
      if(response.code && response.code  !== "") {
        setErrorMessage(response.code);
        return
      }
      if (response && response.data && response.data.status === 200) {
        const applyCardData = {
          selectedValue: selectedValue,
          moreProjectUrl: response?.data?.data?.moreProjectUrl,
          exclusiveContentUrl: response?.data?.data?.exclusiveContentUrl,
          createdTime: response?.data?.data?.createdTime
        }
        const updatedData = { ...sharedData, applyCardData };
        updateSharedData(updatedData);
        handleNext("pin-step");

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
  return (
    <>
    {showRedeemSuccess && (
    <div>
        <Typography className='big-head mb-40' style={{textAlign: 'center'}}><img width={20} height={20} src={TickIcon} style={{ marginRight: 5 }} />PIN Redeemed!</Typography>
        <div className='flex-space-btw mt-10' style={{alignItems: 'center', justifyContent: 'center'}}>
            <div className='image-div'><img src={campaignImage}/></div>
            <div style={{textAlign: 'center', width: "70%"}}>
              <Typography className="query-head mb-10">{campaignName} has given you {currencySymbol}{giveCardBlc ? giveCardBlc : 0}!</Typography>
              <Typography className="normal-text mb-10">{campaignMessage}</Typography>
            </div>
        </div>
        <div style={{textAlign: 'center'}}>
        {radioErrorMessage  !== ''  &&  <Alert severity="error" className='mt-20'>{radioErrorMessage}</Alert>}

        <FormControl>
          <RadioGroup
            name="radio-buttons-group"
            style={{flexDirection: 'row'}}
            className='radio-givecard mt-20'
            value={selectedValue}
            onChange={handleChange} 
          >
            <FormControlLabel value="pin" control={
            <Radio className="radio-label" sx={{
                color: "rgba(93, 66, 148, 1) !important",
                '&.Mui-checked': {
                  color: 'rgba(93, 66, 148, 1) !important',
                },
              }}
            />} label="Only Donate my PIN money" />
            <FormControlLabel value="funds" control={
            <Radio className="radio-label" sx={{
              color: "rgba(93, 66, 148, 1) !important",
              '&.Mui-checked': {
                color: 'rgba(93, 66, 148, 1) !important',
              },
              }}
            />} label="Top up my PIN Donation with my own funds" />
          </RadioGroup>
        </FormControl>
        </div>
        <Typography className="normal-text mb-40 mt-40" style={{textAlign: 'center'}}>Thanks for supporting our community</Typography>
        <Button className="normal-text next-btn" variant='contained' onClick={GiveNow}>
          Next
        </Button>
    </div>
    )}
  {!showRedeemSuccess && (
    <div>
        <Typography className='query-head mb-40 mt-10'>Would you like to use a Givecard?</Typography>
        {errorMessage !== '' && <Alert severity="error" className='mb-20'>{errorMessage}</Alert>}
        <div className='' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography className="sub-head mb-10">Redeem a Givecard:</Typography>
          {creditApplied !== 0 && (<Typography className="sub-head mb-10" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase' }}><img src={TickIcon} style={{ marginRight: 5 }} />{rewardCode} </Typography>)}
        </div>

        {creditApplied === 0 && !sharedData?.rewardApplied?.givecardId ? (
          <div className='apply-amount mb-40'>
            <input className='amount-input placeholder-text'
              type="text"
              placeholder="Enter 6 digit PIN"
              style={{ textTransform: 'uppercase' }}
              value={rewardCode}
              maxLength={6}
              onChange={handleRewardChange} />
            <Button className="normal-text apply-btn" style={{textTransform: 'capitalize'}} onClick={handleApplyReward} disabled={applyBtnDisable || rewardCode?.trim() === ''} variant='contained'>
              Apply
            </Button>
          </div>
        ) : (
          <>
            <div className='flex-space-btw mt-10'>
              <Typography className="normal-text mb-10">Givecard balance</Typography>
              <Typography className="normal-text mb-10">{currencySymbol}{giveCardBlc ? giveCardBlc : 0}</Typography>
            </div>
            <div className='mb-40' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className=''>How much of Givecard?</div>
              <div className="normal-text">
                <input className='amount-input w-50' value={redeemableAmount} onChange={onChangeInput} style={{ textAlign: 'right' }} placeholder='Redeemable amount' name="Redeemable amount" />
              </div>
            </div>
          </>
        )}

        {creditApplied !== 0 ? (
          <div className='flex-space-btw mt-10'>
            <Typography className="normal-text mb-10">Givecard Credit Applied</Typography>
            <Typography className="normal-text mb-10">{currencySymbol}{redeemableAmount ? redeemableAmount : 0}</Typography>
          </div>
          // <div className='flex-space-btw'>
          //     <Typography className="normal-text mb-10">You Give</Typography>
          //     <Typography className="normal-text mb-10">{currencySymbol}{youGive ? youGive : 0}</Typography>
          //   </div>
          //   <div className='flex-space-btw mb-20'>
          //     <Typography className="sub-head mb-10">TOTAL</Typography>
          //     <Typography className="sub-head mb-10" style={{ textTransform: 'uppercase' }}>{currency}  {currencySymbol}{totalAmount ? totalAmount : 0}</Typography>
          //   </div>
        ) : <div style={{ height: 60 }}></div>}
        <Button className="normal-text next-btn" variant='contained' onClick={onNextClick}>
          {selectedValue && selectedValue === 'pin' ? "Donate Now" : "Next"}
        </Button>
      </div>
  )}
      </>
  );
}

export default ApplyGivecard;

