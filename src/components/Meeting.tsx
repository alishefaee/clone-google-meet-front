import React from 'react';
import Footer from "./Footer.tsx";
import Box from "@mui/material/Box";
import AnchorTemporaryDrawer from "./Drawer.tsx";
import {DrawerLayoutEnum} from "../enum/drawer-layout.enum.ts";

const Meeting = () => {
    const [state, setState] =
        React.useState<{ name: DrawerLayoutEnum | undefined, open: boolean }>({name: undefined, open: false});

    return (
        <Box sx={{
            backgroundColor: theme => theme.palette.background.default,
            height: '100%'
        }}
        >
            <AnchorTemporaryDrawer
                state={state}
                setState={setState}
            />
            <Footer
                state={state}
                setState={setState}
            />
        </Box>
    );
};

export default Meeting;