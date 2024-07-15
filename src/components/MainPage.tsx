import { Button, Stack, TextField, useMediaQuery, useTheme } from "@mui/material";
import ResponsiveAppBar from "./AppBar";
import {useState, useContext, useEffect} from "react";
import { UsernameContext } from "../context/User.context";
import {socket} from "../socket.ts";
import {useRoomContext} from "../context/Room.context.tsx";

const MainPage = ({setIsMeeting}) => {
    const theme = useTheme();
    const {addPerson, setRoomId} = useRoomContext()
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

            const result: {meetingId: string} = await response.json()
            console.log('result:', result)

            socket.emit('s:meeting:create', result, () => {
                addPerson(username)
                console.log('create meeting callback');
            });

            setRoomId(result.meetingId)
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

            socket.emit('s:meeting:join', {meetingId:code}, () => {
                console.log('joined meeting:', code);
                setIsMeeting(true)
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
