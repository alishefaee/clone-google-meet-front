import './App.css';
import {useContext, useEffect, useState} from "react";
import { UsernameContext } from "./context/User.context";
import { socket, updateAuthToken } from './socket';
import MainPage from "./components/MainPage";
import Meeting from "./components/Meeting.tsx";
import {useRoomContext} from "./context/Room.context.tsx";

function App() {
    const { setUsername, username } = useContext(UsernameContext);
    const {removePerson} = useRoomContext()
    const [usernameLoaded, setUsernameLoaded] = useState(false);
    const [isMeeting, setIsMeeting] = useState(false)

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

    if (!usernameLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div id='main-id'>
            {isMeeting ? (
                <Meeting/>
            ) : (
                <MainPage setIsMeeting={setIsMeeting} />
            )}
        </div>
    );
}

export default App