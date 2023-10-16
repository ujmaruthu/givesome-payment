import React, {useState} from 'react';
import { Typography, Button, Divider, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import '../styles/common.css';
import MailIcon from '../assets/mail_icon.svg';

const EmailCreateAccount = ({handleNext}) => {
    const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    address: '',
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const onSave = () => {
    handleNext();
  }

  return (
    <>
    <div className='flex-center'>
        <Typography className='query-head mb-10 mt-40'>See the impact of your donation!</Typography>
        <Typography className="normal-text mb-20">Create a Givesome account to automatically receive tax  <br /> receipts and updates about your projects.</Typography>
    </div>
    <div className="or-divider-holder mb-20">
        <Divider className="divider2" />
        <div className="or-style normal-text"><b>Or create an account via email</b></div>
        <Divider className="divider2" />
    </div>

    <div style={{display: 'flex', gap: 10 }}>
        <div className="w-50">
            <Typography className="sub-head mb-10">First Name</Typography>
            <input className='amount-input mb-20 w-50' placeholder='First Name' onChange={(e)=> {handleInputChange(e, 'firstname')}} name="firstname" />
        </div>
        <div className="w-50">
            <Typography className="sub-head mb-10">Last Name</Typography>
            <input className='amount-input mb-20' style={{ paddingRight: 40 }} placeholder='Last Name' maxLength={3} onChange={(e)=> {handleInputChange(e, 'lastname')}} name="lastname" />
        </div>
    </div>
    <div>
        <Typography className="sub-head mb-10">Email</Typography>
        <input className='amount-input mb-20' placeholder='Email' onChange={(e)=> {handleInputChange(e, 'email')}} name="email" />
    </div>
    
    <div className='apply-amount mb-20'>
        <Typography className="sub-head mb-10">Address</Typography>
        <input className='amount-input' placeholder="Address" onChange={(e)=> {handleInputChange(e, 'address')}} name="address"/>
    </div>

    <FormGroup>
        <FormControlLabel className='receipt-label mb-20' control={<Checkbox defaultChecked />} label="Send me a tax receipt for this donation." />
    </FormGroup>
    <Button className="normal-text next-btn" variant='contained' onClick={onSave}>
      Confirm Donation
    </Button>
    </>
  );
}

export default EmailCreateAccount;

