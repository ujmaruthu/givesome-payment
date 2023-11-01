import React, {useState} from 'react';
import { Typography, Button, Divider } from '@mui/material';
import '../styles/common.css';

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
        <Typography className='query-head mb-10 mt-10'>See the impact of your donation!</Typography>
        <Typography className="normal-text mb-20">To make a donation, create a Givesome account and  <br />  receive updates about your project.</Typography>
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
    
    <div className='apply-amount mb-40'>
        <Typography className="sub-head mb-10">Address</Typography>
        <input className='amount-input' placeholder="Address" onChange={(e)=> {handleInputChange(e, 'address')}} name="address"/>
    </div>

    <Button className="normal-text next-btn" variant='contained' onClick={onSave}>
    Next
    </Button>
    </>
  );
}

export default EmailCreateAccount;

