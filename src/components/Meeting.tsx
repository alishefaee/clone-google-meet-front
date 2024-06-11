import React, {useContext, useEffect, useState} from 'react';
import Footer from "./Footer.tsx";
import Box from "@mui/material/Box";
import AnchorTemporaryDrawer from "./Drawer.tsx";
import {DrawerLayoutEnum} from "../enum/drawer-layout.enum.ts";
import {socket} from "../socket.ts";
import {UsernameContext} from "../context/User.context.tsx";
import {useRoomContext} from "../context/Room.context.tsx";
import VoiceChat from "./VoiceChat.tsx";

type TNewMsg = {
    username: string,
    message: string,
    date: string
}

type TNewPeople = {
    username: string
}

const Meeting = ({}) => {
    const {username} = useContext(UsernameContext)
    const {addPerson,addMessage,setRoomId} = useRoomContext()

    const [state, setState] =
        React.useState<{ name: DrawerLayoutEnum | undefined, open: boolean }>({name: undefined, open: false});
    const [people, setPeople] = useState([username])
    const [messages, setMessages] = useState([])

    useEffect(() => {
        socket.on('f:people:new', (data: TNewPeople) => {
            addPerson(data.username)
            console.log('New member:', data.username);
        });
        socket.on('f:msg:new', (data: TNewMsg) => {
            console.log('new message:', data.message);
            addMessage({
                time: data.date,
                content: data.message,
                username: data.username
            })
        });

        socket.on('f:meeting:info', ({people,roomId}: { people: string[], roomId:string }) => {
            console.log('peoples:', people);
            setRoomId(roomId)
            for (const person of people) {
                addPerson(person)
            }
        });

        return () => {
            socket.off('f:msg:new');
            socket.off('f:people:new');
            socket.off('f:meeting:info');
        };
    }, []);

    return (
        <Box sx={{
            backgroundColor: theme => theme.palette.background.default,
            height: '100%'
        }}
        >
            <AnchorTemporaryDrawer
                state={state}
                setState={setState}
            />
            <VoiceChat />
            <Footer
                state={state}
                setState={setState}
            />
        </Box>
    );
};

export default Meeting;