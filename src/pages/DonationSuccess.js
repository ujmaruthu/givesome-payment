import React from 'react';
import { Typography, Button } from '@mui/material';
import '../styles/common.css';
import Confetti from 'react-confetti'
import ThankyouIcon from '../assets/thankyou.svg';

const DonationSuccess = ({ sharedData, updateSharedData }) => {
  const moreProjectRedrection = () => {
    window.parent.postMessage({ action: 'loadUrl', url: sharedData?.paymentSuccessData?.moreProjectUrl }, "*");
  }
  const exclusiveContentRedrection = () => {
    window.parent.postMessage({ action: 'loadUrl', url: sharedData?.paymentSuccessData?.exclusiveContentUrl }, "*");
  }
  return (
    <><div style={{ textAlign: 'center', minHeight: 400 }}>
      <Confetti width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
        />
      <div>
        <Typography className='big-head mb-20 mt-30'>Thank you! Now, see the good.</Typography>
        <Typography className="normal-text mb-40">Once the project is fully funded, we’ll send you <br /> video and blog updates.</Typography>
      </div>
      <div style={{ textAlign: 'center'}}>
        <Typography className="normal-text mb-10">Payment ID: {sharedData?.paymentSuccessData?.paymentId ? sharedData?.paymentSuccessData?.paymentId : '-' }</Typography>
    </div>
    <div style={{ textAlign: 'center'}}>
        <Typography className="normal-text mb-20">Completed on: {sharedData?.paymentSuccessData?.createdTime ? sharedData?.paymentSuccessData?.createdTime : '-' }</Typography>
    </div>
      <img src={sharedData?.projectImage ? "https://qa.givesome.org/"+sharedData?.projectImage : ThankyouIcon} alt="Logo icon" width={340} height={300} className='mb-40' />
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

