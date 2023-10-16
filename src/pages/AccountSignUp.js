import React, {useState} from 'react';
import { Typography, Button, Divider, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import '../styles/common.css';
import FbIcon from '../assets/fb_logo.svg';
import GoogleIcon from '../assets/google_logo.svg';
import MailIcon from '../assets/mail_icon.svg';
import { donationApi } from './redux/actions';

const AccountSignUp = ({handleNext}) => {
  const onSave = () => {
    handleNext();
  }

  return (
    <>
    <div className='flex-center'>
        <Typography className='query-head mb-10 mt-40'>See the impact of your donation!</Typography>
        <Typography className="normal-text mb-20">Create a Givesome account to automatically receive tax  <br /> receipts and updates about your projects.</Typography>
    </div>
    <div className='flex-center'>
        <Typography className="normal-text mb-20"><b>Sign up via social</b></Typography>
    </div>
    <div className='mb-20 btn-holder'>
        <Button className="normal-text black-btn w-50" variant='outlined' startIcon={<img src={GoogleIcon} />}>Sign up with Google</Button>
        <Button className="normal-text black-btn w-50" variant='outlined' startIcon={<img src={FbIcon} />}>Sign up with Facebook</Button>
    </div>
    <div className="or-divider-holder">
        <Divider className="divider2" />
        <div className="or-style normal-text"><b>Or create an account via email</b></div>
        <Divider className="divider2" />
    </div>
    <Button className="normal-text black-btn w-100 mt-20 mb-40" variant='outlined' startIcon={<img src={MailIcon} />}>Sign up with Email</Button>
    <FormGroup>
        <FormControlLabel className='receipt-label mb-20' control={<Checkbox />} label="Send me a tax receipt for this donation." />
    </FormGroup>
    <Button className="normal-text next-btn" variant='contained' onClick={onSave}>
      Confirm Donation
    </Button>
    </>
  );
}

export default AccountSignUp;

