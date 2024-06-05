import React, {useState} from 'react';
import Typography from "@mui/material/Typography";
import {Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from '@mui/icons-material/Send';
import {useRoomContext} from "../context/Room.context.tsx";
import {socket} from "../socket.ts";

const ChatLayout = () => {
    const {messages} = useRoomContext()
    const [msg, setMsg] = useState('')

    function sendMessageHandler() {
        socket.emit('s:msg:new', {message: msg}, () => {
            console.log('message send:', msg);
        });
    }

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
                {messages.map(({username, time, content}) => (
                    <ListItem key={time}>
                        <Stack>
                            <Stack direction='row' spacing={1} sx={{width: '100%'}}>
                                <Typography>{content}</Typography>
                                <Typography>{new Date(time).toLocaleTimeString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })}</Typography>
                            </Stack>
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
                            value={msg}
                            onChange={(e)=>setMsg(e.target.value)}
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
                        <Box
                            onClick={sendMessageHandler}
                        ><SendIcon/></Box>
                    </Stack>
                </ListItem>
            </List>
        </Box>
    )
}

export default ChatLayout;