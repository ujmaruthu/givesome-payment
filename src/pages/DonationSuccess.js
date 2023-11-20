import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';
import '../styles/common.css';
import Confetti from 'react-confetti'
import ThankyouIcon from '../assets/thankyou.svg';
import moment from "moment/moment";

const DonationSuccess = ({ sharedData, updateSharedData }) => {
  const [showConfetti, setShowConfetti] = useState(true)
  const moreProjectRedrection = () => {
    window.parent.postMessage({ action: 'loadUrl', url: sharedData?.applyCardData?.moreProjectUrl ? sharedData?.applyCardData?.moreProjectUrl : sharedData?.paymentSuccessData?.moreProjectUrl || 'https://qa.givesome.org' }, "*");
  }
  const exclusiveContentRedrection = () => {
    window.parent.postMessage({ action: 'loadUrl', url: sharedData?.applyCardData?.exclusiveContentUrl ? sharedData?.applyCardData?.exclusiveContentUrl : sharedData?.paymentSuccessData?.moreProjectUrl || 'https://qa.givesome.org' }, "*");
  }
  const divStyle = {
    backgroundImage: `url(${sharedData?.projectImage ? "https://qa.givesome.org/"+sharedData?.projectImage : ThankyouIcon})`,
    backgroundSize: 'cover',
    width: '100%',
    height: '340px',
    borderRadius: 20
  };

  setTimeout(() => {
    setShowConfetti(false);
  }, 10000);
  return (
    <><div style={{ textAlign: 'center', minHeight: 400 }}>
      {showConfetti && 
      <Confetti width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
        />
      }
      <div>
        <Typography className='big-head mb-20 mt-30'>Thank you! Now, see the good.</Typography>
        <Typography className="normal-text mb-40">Once the project is fully funded, we’ll send you <br /> video and blog updates.</Typography>
      </div>
      {sharedData?.applyCardData?.selectedValue !== 'pin' && (
        <><div style={{ textAlign: 'center' }}>
          <Typography className="normal-text mb-10">Payment ID: {sharedData?.paymentSuccessData?.paymentId ? sharedData?.paymentSuccessData?.paymentId : '-'}</Typography>
        </div><div style={{ textAlign: 'center' }}>
            <Typography className="normal-text mb-20">Completed on: {sharedData?.paymentSuccessData?.createdTime ? moment(sharedData?.paymentSuccessData?.createdTime).format('LL') : '-'}</Typography>
          </div></>
        )}
        <div className="img-container mb-40">
          <div style={divStyle}></div>
          {/* <img src={sharedData?.projectImage ? "https://qa.givesome.org/"+sharedData?.projectImage : ThankyouIcon} alt="Logo icon" /> */}
        </div>

    </div><div className='btn-holder'>
        <Button className="normal-text default-btn" variant='contained' onClick={moreProjectRedrection}>
          More Projects
        </Button>
        <Button className="normal-text outlined-black-btn" style={{textTransform: 'capitalize'}} variant='outlined' onClick={exclusiveContentRedrection}>
          <b>Exclusive Content</b>
        </Button>
      </div></>
  );
}

export default DonationSuccess;

