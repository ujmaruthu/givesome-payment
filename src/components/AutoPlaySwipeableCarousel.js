import React, {useState} from 'react';
import { Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import '../styles/stepper.css';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const AutoPlaySwipeableCarousel = ({images}) => {
  const theme = useTheme();
  const maxSteps = images.length;
  const [activeStep, setActiveStep] = useState(0);
  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{justifyContent: 'end', display: 'flex', padding: 0}}>
          <Box sx={{ maxWidth: 500, flexGrow: 1, position: 'relative' }}>
          <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              className='stepper-container'
            />
            
            <AutoPlaySwipeableViews
              index={activeStep}
              onChangeIndex={handleStepChange}
              enableMouseEvents
            >
              {images.map((step, index) => (
                <div key={step.label} style={{position: 'relative'}}>
                  {Math.abs(activeStep - index) <= 2 ? (
                    <><Box
                      component="img"
                      sx={{
                        height: 255,
                        display: 'block',
                        maxWidth: 500,
                        overflow: 'hidden',
                        width: '100%',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10
                      }}
                      src={step.imgPath}
                      alt={step.label} />
                      <div style={{position: 'absolute', bottom: 10, paddingLeft: 30}}>
                        <Typography className='query-head mb-10' style={{color: "#fff"}}>{step.label}</Typography>
                        <Typography className="normal-text-head mb-10" style={{color: "#fff"}}>{step.subLabel}</Typography>
                      </div></>
                  ) : null}
                </div>
              ))}
            </AutoPlaySwipeableViews>
          </Box>
        </Grid>
        </Grid>
    </div>
  );
}

export default AutoPlaySwipeableCarousel;

