import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from '@mui/material/Grid';


const Content = styled.div`
 padding: 1rem;

@media (max-width: 1390px) {
    padding: 1rem;
}
@media (max-width: 1200px) {
    padding: 1rem ;
    margin: 0 1rem;
}

`;

const ContentWrapper = styled.div`
    background:#FFFFFF;
    height: 100%;
`;

const MainLayout = props => {
    const { children } = props;
    // const { instance } = useMsal();

    // useEffect(()=>{
    //     idleTimer(instance);
    // },[])

    return (
        
    <ContentWrapper style={{height: '100vh'}}>
        <Grid container>
            <Grid item xs={12} sm={12} xl={12} lg={12} md={12}>
                <div className='content-wrapper'>
                <Content role="main"  style={{padding: 0, margin: 0}}>
                {children}
                </Content>
                </div>
            </Grid>
        </Grid>
    </ContentWrapper>
      

    );
}

MainLayout.propTypes = {
    children: PropTypes.node.isRequired
}
export default MainLayout;
