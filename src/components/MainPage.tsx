import { Button, Stack, TextField, useMediaQuery, useTheme } from "@mui/material";
import ResponsiveAppBar from "./AppBar";
import { useState, useContext } from "react";
import { UsernameContext } from "../context/User.context";
import {socket} from "../socket.ts";

const MainPage = ({setIsMeeting}) => {
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const { username } = useContext(UsernameContext);
    const [code, setCode] = useState('')

    async function newMeetingHandler() {
        console.log('server base url:', import.meta.env.VITE_BASE_URL);
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/meeting`, {
                method: 'POST',
                headers: {
                    'username': username
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('result:', result);

            socket.emit('create-meeting', result, () => {
                console.log('create meeting callback');
            });

            setIsMeeting(true)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function enterCodeHandler() {
        try {
            if (!code.length) {
                console.log('no code provided')
                return
            }

            socket.emit('join-meeting', {meetingId:code}, () => {
                console.log('joined meeting');
            });

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <ResponsiveAppBar />
            <Stack
                direction={isTablet ? 'column' : 'row'}
                spacing={1}
            >
                <Button
                    size='small'
                    variant='contained'
                    onClick={newMeetingHandler}
                >New Meeting</Button>
                <TextField
                    placeholder='Enter code or link'
                    size='small'
                    value={code}
                    onChange={(e)=>setCode(e.target.value)}
                />
                <Button
                    size='small'
                    variant='outlined'
                    onClick={enterCodeHandler}
                    sx={{color:'black'}}
                >Join</Button>
            </Stack>
        </>
    );
};

export default MainPage;
