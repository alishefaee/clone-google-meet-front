import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import PeopleLayout from "./PeopleLayout.tsx";
import {DrawerLayoutEnum} from "../enum/drawer-layout.enum.ts";
import ChatLayout from "./ChatLayout.tsx";

export default function AnchorTemporaryDrawer({state, setState}) {

    return (
        <Drawer
            anchor='right'
            open={state.open}
            onClose={() => setState({name: undefined, open: false})}
        >

                {state.name == DrawerLayoutEnum.PEOPLE && <PeopleLayout />}
                {state.name == DrawerLayoutEnum.CHAT && <ChatLayout/>}
        </Drawer>
    )
}
