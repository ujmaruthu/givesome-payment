import React, {useState} from 'react';
import { Grid, Button, IconButton } from '@mui/material';
import AutoPlaySwipeableCarousel from '../components/AutoPlaySwipeableCarousel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DonationCost from './DonationCost';
import PaymentMethod from './PaymentMethod';
import DonationSuccess from './DonationSuccess';
import AccountSignUp from './AccountSignUp';
import BackIcon from '../assets/backIcon.svg';
const carouselImages = [
  {
    label: 'Help Sponsor an Autism Service Dog at NSD',
    subLabel: 'By National Service Dogs',
    imgPath:
      'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    label: 'Help Sponsor an Autism Service Dog at NSD2',
    subLabel: 'By National Service Dogs',
    imgPath:
      'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    label: 'Help Sponsor an Autism Service Dog at NSD3',
    subLabel: 'By National Service Dogs',
    imgPath:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250',
  },
  {
    label: 'Help Sponsor an Autism Service Dog at NSD4',
    subLabel: 'By National Service Dogs',
    imgPath:
      'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60',
  },
];
const Payment = () => {
  const [donationCost, setDonationCost] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [donationSucccess, setDonationSuccess] = useState(false);
  const onDonateNextClick = () => {
    setDonationCost(false);
    setPaymentMethod(true);
    setDonationSuccess(false);
    setCreateAccount(false);
  }
  const onPaymentBackClick = () => {
    setDonationCost(true);
    setPaymentMethod(false);
    setDonationSuccess(false);
    setCreateAccount(false);
  }
  const onPaymentNextClick = () => {
    setDonationCost(false);
    setPaymentMethod(false);
    setDonationSuccess(true);
    setCreateAccount(false);
  }
  const onCreateAccountBackClick = () => {
    setDonationCost(false);
    setPaymentMethod(true);
    setDonationSuccess(false);
    setCreateAccount(false);
  }
  const onCreateAccountNextClick = () => {
    setDonationCost(false);
    setPaymentMethod(false);
    setDonationSuccess(false);
    setCreateAccount(true);
  }
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{justifyContent: 'center', display: 'flex'}}>
          <Card variant="outlined" sx={{ width: 500 }}>
          {!donationSucccess && (
            <div style={{position: 'relative'}}>
              {paymentMethod && (
                <IconButton aria-label="back button" className="back-btn" onClick={onPaymentBackClick}>
                  <img src={BackIcon} alt="back icon" />
                </IconButton>
              )}
              {createAccount && (
                <IconButton aria-label="back button" className="back-btn" onClick={onCreateAccountBackClick}>
                  <img src={BackIcon} alt="back icon" />
                </IconButton>
              )}
              <AutoPlaySwipeableCarousel
                images={carouselImages}
              />
            </div>
          )}
            <CardContent>
              {donationCost && (
                <>
                <DonationCost onDonateNextClick={onDonateNextClick} onPaymentNextClick={onPaymentNextClick}/>
                </>
              )}
              {paymentMethod && (
                <>
                <PaymentMethod onDonateNextClick={onDonateNextClick} onPaymentNextClick={onCreateAccountNextClick}/>
                </>
              )}
              {createAccount && (
                <>
                <AccountSignUp onDonateNextClick={onCreateAccountNextClick} onPaymentNextClick={onPaymentNextClick}/>
                </>
              )}
              {donationSucccess && (
                <>
                
                <DonationSuccess onDonateNextClick={onDonateNextClick} onPaymentNextClick={onPaymentNextClick}/>
                
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        </Grid>
    </div>
  );
}

export default Payment;

