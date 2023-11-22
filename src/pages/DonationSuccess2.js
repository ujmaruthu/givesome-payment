import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import '../styles/common.css';
import Confetti from 'react-confetti'
import ThankyouIcon from '../assets/thankyou.svg';
import moment from "moment/moment";
import { retrievePaymentDetails } from './redux/actions';

const DonationSuccess2 = ({ sharedData, updateSharedData }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [paymentId, setPaymentId] = useState('');
  const [createdTime, setCreatedTime] = useState('');
  const [moreProjectUrl, setMoreProjectUrl] = useState('');
  const [exclusiveContentUrl, setExclusiveContentUrl] = useState('');

  useEffect(()=>{
    const originalString = sharedData?.donationAmount?.currency;
    const lowercaseStringCurrency = originalString.toLowerCase();
    const apiReq = {
      "amount": sharedData?.donationAmount?.totalAmount,
      "youGive":sharedData?.donationAmount?.youGive,
      "givecardAmount":Number(sharedData?.rewardApplied?.creditApplied),
      "givecardId":Number(sharedData?.rewardApplied?.givecardId),
      "givacardBalance":Number(sharedData?.rewardApplied?.givacardBalance),
      "currency": lowercaseStringCurrency,
      "description": sharedData?.donationAmount?.description+' (to '+sharedData.projectName+')',
      "projectId": sharedData?.projectId,
      "supplierId": sharedData?.supplier_id || "",
      "givecardCode": sharedData?.rewardApplied?.rewardCode?.toUpperCase() || "",
      "userId": sharedData?.userId  !== "None"  ? sharedData?.userId : null,
      "paymentIntentId": sharedData?.paymentIntent?.paymentIntentId
    }
      retrievePaymentDetails(apiReq).then((response) => {
            if(response.code && response.code  !== "") {
              return
            }
            if (response && response.data && response.data.status === 200) {
              console.log(response);
              const timeStamp = moment(response.data.data.createdTime).format('LL');
              setExclusiveContentUrl(response.data.data.exclusiveContentUrl);
              setMoreProjectUrl(response.data.data.moreProjectUrl);
              setCreatedTime(timeStamp);
              setPaymentId(response.data.data.paymentId);
            }
            if (response && response.data && response.data.status !== 200) {
              // setErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          //   setErrorMessage(error.message);
          });
  },[])
  const moreProjectRedrection = () => {
    window.parent.postMessage({ action: 'loadUrl', url: sharedData?.applyCardData?.moreProjectUrl ? sharedData?.applyCardData?.moreProjectUrl : moreProjectUrl || 'https://qa.givesome.org' }, "*");
  }
  const exclusiveContentRedrection = () => {
    window.parent.postMessage({ action: 'loadUrl', url: sharedData?.applyCardData?.exclusiveContentUrl ? sharedData?.applyCardData?.exclusiveContentUrl : exclusiveContentUrl || 'https://qa.givesome.org' }, "*");
  }
  const divStyle = {
    backgroundImage: `url(${sharedData?.projectImage ? "https://qa.givesome.org/"+sharedData?.projectImage : ThankyouIcon})`,
    backgroundSize: 'cover',
    width: '340px',
    height: '340px',
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20
  };

  setTimeout(() => {
    setShowConfetti(false);
  }, 10000);
  return (
    <><div style={{ textAlign: 'center', minHeight: 400, position: 'relative' }}>
      {showConfetti && 
      <div style={{position: 'relative', zIndex: 0}}>
      <Confetti width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          opacity={0.7}
        />
        </div>
      }
      <div style={{position: 'relative'}}>
      <div>
        <Typography className='big-head mb-10 mt-30'>Thank you! Now, see the good.</Typography>
        <Typography className="lg-normal-text mb-30" style={{color:'#111111BF'}}>Once the project is fully funded, we’ll send you <br /> video and blog updates.</Typography>
      </div>
      {sharedData?.applyCardData?.selectedValue !== 'pin' && (
        <div style={{ textAlign: 'center' }}>
          <Typography className="normal-text mb-10">Payment ID: {paymentId || '-'}</Typography>
        </div>
        )}
        <div style={{ textAlign: 'center' }}>
            <Typography className="normal-text mb-20">Completed on: {createdTime ? createdTime :  sharedData?.applyCardData?.createdTime ? moment(sharedData?.applyCardData?.createdTime).format('MMMM DD, YYYY, hh:mm A')  : '-'}</Typography>
          </div>
        <div className="img-container mb-30">
          <div style={divStyle}></div>
          {/* <img src={sharedData?.projectImage ? "https://qa.givesome.org/"+sharedData?.projectImage : ThankyouIcon} alt="Logo icon" /> */}
        </div>

    </div>
    <div className='btn-holder mb-10'>
        <Button className="normal-text default-btn"  style={{width: '50%'}} variant='contained' onClick={moreProjectRedrection}>
          <p className='lg-btn-text'>More Projects</p>
        </Button>
        <Button className="normal-text outlined-black-btn" style={{textTransform: 'capitalize', width: '50%', borderRadius: 12, backgroundColor: '#fff'}} variant='outlined' onClick={exclusiveContentRedrection}>
          <p className='lg-btn-text'>Exclusive Content</p>
        </Button>
      </div>
      
      </div>
      </>
  );
}

export default DonationSuccess2;

