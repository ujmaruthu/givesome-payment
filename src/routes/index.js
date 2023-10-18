import React from "react";
import {Routes,Route } from "react-router-dom";
import Payment from "../pages/Payment";
import MainLayout from '../Layout/MainLayout';

const wrapWithLayout = (comp) =>{
    return <MainLayout>{comp}</MainLayout>
}

const AppRoutes =  () => {
    return (
      <Routes>
        <Route path="/" element={wrapWithLayout(<Payment/>)} />
        <Route path="/payment" element={wrapWithLayout(<Payment/>)} />
      </Routes>
    )
};


export default AppRoutes;
















