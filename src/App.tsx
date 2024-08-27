import './App.css';
import {useContext, useEffect, useState} from "react";
import { UsernameContext } from "./context/User.context";
import { socket, updateAuthToken } from './socket';
import MainPage from "./components/MainPage";
import Meeting from "./components/Meeting.tsx";
import {useRoomContext} from "./context/Room.context.tsx";
import Box from "@mui/material/Box";

function App() {
    const { setUsername, username } = useContext(UsernameContext);
    const {removePerson} = useRoomContext()
    const [usernameLoaded, setUsernameLoaded] = useState(false);
    const [isMeeting, setIsMeeting] = useState(false)

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [fooEvents, setFooEvents] = useState([]);

    useEffect(() => {
        console.log('isConnected:', socket.connected,isConnected)
    }, [isConnected]);

    useEffect(() => {
        console.log('fooEvents:',fooEvents)
    }, [fooEvents]);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
            updateAuthToken(storedUsername);
        } else {
            const userInput = window.prompt('Please enter some input:', '');
            if (userInput !== null) {
                setUsername(userInput);
                localStorage.setItem('username', userInput);
                updateAuthToken(userInput);
            }
        }

        setUsernameLoaded(true);

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            socket.off('disconnect');
            if (isMeeting) {
                removePerson(username)
            }
        };
    }, [setUsername]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onFooEvent(value) {
            setFooEvents(previous => [...previous, value]);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('foo', onFooEvent);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('foo', onFooEvent);
        };
    }, []);

    if (!usernameLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{height: '100%'}}>
            {isMeeting ? (
                <Meeting/>
            ) : (
                <MainPage setIsMeeting={setIsMeeting} />
            )}
        </Box>
    );
}

export default App