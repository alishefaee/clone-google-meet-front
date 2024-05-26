import React from 'react';
import Typography from "@mui/material/Typography";
import {Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from '@mui/icons-material/Send';

const ChatLayout = () => {
    return (
        <Box
            sx={{
                width: 250,
                padding: 1,
                height: '93%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography variant='h6'>Chat</Typography>
            <Divider/>
            <List sx={{flexGrow: 1}}>
                {['Hasan', 'Ali'].map((text) => (
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
            <List>
                <ListItem sx={{p: 0}}>
                    <Stack
                        direction='row'
                        alignItems='center'
                        sx={{
                            p: 1,
                            borderRadius: '20px 20px 20px 20px',
                            textAlign: 'center',
                            bgcolor: '#F1F3F4'
                        }}
                    >
                        <TextField
                            size='small'
                            placeholder='message...'
                            multiline
                            maxRows={3}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'transparent',
                                    },
                                },
                            }}
                        />
                        <Box><SendIcon/></Box>
                    </Stack>
                </ListItem>
            </List>
        </Box>
    )
}

export default ChatLayout;