import './App.css'
import ResponsiveAppBar from "./components/AppBar.tsx";
import {Button, Stack, TextField, useMediaQuery, useTheme} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {UsernameContext} from "./context/User.context.tsx";
import {socket, updateAuthToken} from './socket';

function App() {
    const theme = useTheme()
    const isTablet = useMediaQuery(theme.breakpoints.down('md'))
    const {username, setUsername} = useContext(UsernameContext)
    const [isMeeting, setIsMeeting] = useState(false)
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        if (storedUsername) {
            setUsername(storedUsername)
        } else {
            const userInput = window.prompt('Please enter some input:', '')
            if (userInput !== null) {
                setUsername(userInput)
                localStorage.setItem('username', userInput)
                updateAuthToken(userInput)
            }
        }
    }, []);

    function newMeetingHandler() {
        console.log('base url:', import.meta.env.VITE_BASE_URL)
        try {
            (async () => {
                // const params = new URLSearchParams({
                //     meet: username, // Mandatory query parameter
                // })
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
                console.log('result:',result)
                setData(result);
                console.log('After connection')
                socket.emit('create-meeting', result, ()=>{
                    console.log('create meeting callback')
                })
            })()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return (
        <>
            <ResponsiveAppBar/>
            {isMeeting?<>Meeting is holding</>:<Stack
                direction={isTablet ? 'column' : 'row'}
                spacing={1}
            >
                <Button
                    size='small'
                    variant='contained'
                    onClick={newMeetingHandler}
                >New Meeting</Button>
                <TextField placeholder='Enter code or link' size='small'></TextField>
                <Button size='small' variant='outlined'>Join</Button>
            </Stack>}
        </>
    )
}

export default App
