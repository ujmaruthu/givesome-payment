import React from 'react';
import { Typography, Button } from '@mui/material';
import '../styles/common.css';
import Confetti from 'react-confetti'
import ThankyouIcon from '../assets/thankyou.svg';

const DonationSuccess = () => {
  const moreProjectRedrection = () => {
    window.close();
    window.open('https://qa.givesome.org/');
  }

 
  return (
    <><div style={{ position: 'relative', textAlign: 'center', minHeight: 400 }}>
      <Confetti style={{ position: 'absolute' }} />
      <div>
        <Typography className='big-head mb-20 mt-40'>Thank you! Now, see the good.</Typography>
        <Typography className="normal-text mb-40">Once the project is fully funded, we’ll send you <br /> video and blog updates.</Typography>
      </div>
      <img src={ThankyouIcon} alt="Logo icon" width={340} height={340} className='mb-40' />
    </div><div className='btn-holder'>
        <Button className="normal-text default-btn" variant='contained' onClick={moreProjectRedrection}>
          More Projects
        </Button>
        <Button className="normal-text outlined-black-btn" style={{textTransform: 'capitalize'}} variant='outlined' onClick={moreProjectRedrection}>
          <b>Exclusive Content</b>
        </Button>
      </div></>
  );
}

export default DonationSuccess;

