import React from 'react';
import Typography from "@mui/material/Typography";
import {Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import {useRoomContext} from "../context/Room.context.tsx";

const PeopleLayout = ({}) => {
    const {people} = useRoomContext()

    return (
        <Box
            sx={{width: 250, padding:1}}
        >
    <Typography variant='h6'>People</Typography>
    <Divider/>
    <List>
        {people.map((text, index) => (
            <ListItem key={text}>
                <Stack direction='row' spacing={1} sx={{width: '100%'}}>
                    <AccountCircleIcon/>
                    <Typography sx={{flex:1}}>{text}</Typography>
                    <MicIcon/>
                </Stack>
            </ListItem>
        ))}
    </List>
        </Box>
    );
};

export default PeopleLayout;