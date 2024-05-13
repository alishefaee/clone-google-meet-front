import React from 'react';
import Footer from "./Footer.tsx";
import Box from "@mui/material/Box";
import AnchorTemporaryDrawer from "./Drawer.tsx";

const Meeting = () => {
    return (
        <Box sx={{
            backgroundColor: theme=>theme.palette.background.default,
            height:'100%'
        }}
        id='testid'
        >
            <AnchorTemporaryDrawer/>
            <Footer/>
        </Box>
    );
};

export default Meeting;