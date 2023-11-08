import React, { useState } from 'react';
import { Grid, IconButton,  Box, Typography } from '@mui/material';
// import AutoPlaySwipeableCarousel from '../components/AutoPlaySwipeableCarousel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ApplyGivecard from './ApplyGivecard';
import DonationCost from './DonationCost';
import PaymentMethod from './PaymentMethod';
import DonationSuccess from './DonationSuccess';
import AccountSignUp from './AccountSignUp';
import EmailCreateAccount from './EmailCreateAccount';
import BackIcon from '../assets/backIcon.svg';
import CloseIcon from '../assets/close.svg';
// const carouselImages = [
//     {
//       label: 'Help Sponsor an Autism Service Dog at NSD',
//       subLabel: 'By National Service Dogs',
//       imgPath:
//         'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
//     },
//     {
//       label: 'Help Sponsor an Autism Service Dog at NSD2',
//       subLabel: 'By National Service Dogs',
//       imgPath:
//         'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
//     },
//     {
//       label: 'Help Sponsor an Autism Service Dog at NSD3',
//       subLabel: 'By National Service Dogs',
//       imgPath:
//         'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250',
//     },
//     {
//       label: 'Help Sponsor an Autism Service Dog at NSD4',
//       subLabel: 'By National Service Dogs',
//       imgPath:
//         'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60',
//     },
// ];

const Payment = () => {

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('dataOne');
  const name = urlParams.get('dataThree');
  const sub_name = urlParams.get('dataFour');
  const image = urlParams.get('dataFive');
  const supplier_id = urlParams.get('dataTwo');
  const userId = urlParams.get('dataSix');

  const [currentStep, setCurrentStep] = useState(0);
  const [sharedData, setSharedData] = useState({"projectId": id, "supplier_id": Number(supplier_id), "projectName": name, userId: userId});

  const updateSharedData = (data) => {
    setSharedData(data);
  };

  const handleNext = (flag) => {
    if(flag === 'pin-step') {
      setCurrentStep(3); 
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleClose = () => {
    window.close();
    window.open('https://qa.givesome.org/');
  };

  return (
    <div>
      <Grid container spacing={2} style={{margin: 0, width: '100%'}}>
        <Grid item xs={12} style={{ justifyContent: 'center', display: 'flex', padding:0 }}>
          <Card variant="outlined" sx={{ width: "100%" }}>
            <div style={{ position: 'relative' }}>
            {currentStep === 0 && (
                <IconButton aria-label="back button" id="step1BackBtn" className="back-btn">
                  <img src={BackIcon} alt="back icon" />
                </IconButton>
              )}
              {currentStep > 0 &&  currentStep < 3 && (
                <IconButton aria-label="back button" className="back-btn" onClick={handleBack}>
                  <img src={BackIcon} alt="back icon" />
                </IconButton>
              )}
               {/* <IconButton aria-label="close button" className="close-btn" onClick={handleClose}>
                  <img src={CloseIcon} alt="close icon" />
                </IconButton> */}
              {currentStep !== 3 && (
                // <AutoPlaySwipeableCarousel images={carouselImages} />
                <div style={{position: 'relative', paddingBottom: 5}}>
                  <><Box
                    component="img"
                    sx={{
                      height: 255,
                      display: 'block',
                      overflow: 'hidden',
                      width: '100%',
                      borderRadius: '5px !important',
                      // border: '1px solid #ccc'
                    }}
                    src={"https://qa.givesome.org/"+image}
                    alt="Project image" />
                    <div className='image-over-text'>
                      <Typography className='query-head mb-10' style={{color: "#fff", position: 'absolute', bottom: 40}}>{name}</Typography>
                      <Typography className="normal-text-head mb-10" style={{color: "#fff", position: 'absolute', bottom: 5}}>{sub_name}</Typography>
                    </div></>
              </div>
              )}
            </div>
            <CardContent style={{padding: "16px 25px"}}>
                  {/* {currentStep === 0 && <AccountSignUp handleNext={handleNext} />} */}
                  {/* {currentStep === 1 && <EmailCreateAccount handleNext={handleNext} />} */}
                  {currentStep === 0 && <ApplyGivecard sharedData={sharedData} updateSharedData={updateSharedData} handleNext={handleNext}/>}
                  {currentStep === 1 && <DonationCost sharedData={sharedData} updateSharedData={updateSharedData} handleNext={handleNext}/>}
                  {currentStep === 2 && <PaymentMethod sharedData={sharedData} updateSharedData={updateSharedData} handleNext={handleNext} />}
                  {currentStep === 3 && <DonationSuccess handleNext={handleNext}/>}       
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Payment;
