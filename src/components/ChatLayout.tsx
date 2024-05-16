import React from 'react';
import Typography from "@mui/material/Typography";
import {Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MicIcon from "@mui/icons-material/Mic";

const ChatLayout = () => {
    return (
        <Box
            sx={{width: 250, padding: 1, height: '100%'}}
        >
            <Typography variant='h6'>Chat</Typography>
            <Divider/>
            <List>
                {['Hasan', 'Ali'].map((text, index) => (
                    <ListItem key={text}>
                        <Stack>
                            <Stack direction='row' spacing={1} sx={{width: '100%'}}>
                                <Typography>{text}</Typography>
                                <Typography>12:25</Typography>
                            </Stack>
                            <Typography>hi, shall we start?</Typography>
                        </Stack>
                    </ListItem>
                ))}
            </List>
            <Box sx={{
                position: 'absolute',
                bottom: 50,
                width: '94%',
                height: '40px',
                bgcolor: 'red',
                // m: 1,
                borderTop: '1px solid #ddd',
                textAlign: 'center'
            }}
            ></Box>
        </Box>
    )
}

export default ChatLayout;