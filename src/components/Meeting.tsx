import React, {useContext, useEffect, useState} from 'react';
import Footer from "./Footer.tsx";
import Box from "@mui/material/Box";
import AnchorTemporaryDrawer from "./Drawer.tsx";
import {DrawerLayoutEnum} from "../enum/drawer-layout.enum.ts";
import {socket} from "../socket.ts";
import {UsernameContext} from "../context/User.context.tsx";
import {useRoomContext} from "../context/Room.context.tsx";

const Meeting = ({setIsMeeting}) => {
    const {username} = useContext(UsernameContext)
    const {addPerson,roomId} = useRoomContext()

    const [state, setState] =
        React.useState<{ name: DrawerLayoutEnum | undefined, open: boolean }>({name: undefined, open: false});
    const [people, setPeople] = useState([username])
    const [messages, setMessages] = useState([])

    useEffect(() => {
        socket.on('new-member', (data: any) => {
            addPerson(data.username)
            console.log('New member message:', data.username);
        });
        socket.on('room-info', ({people}: { people: string[] }) => {
            console.log('peoples:', people);
            for (const person of people) {
                addPerson(person)
            }
        });

        return () => {
            socket.off('new-member');
            socket.off('room-info');
        };
    }, []);

    return (
        <Box sx={{
            backgroundColor: theme => theme.palette.background.default,
            height: '100%'
        }}
        >
            {roomId}
            <AnchorTemporaryDrawer
                state={state}
                setState={setState}
            />
            <Footer
                state={state}
                setState={setState}
            />
        </Box>
    );
};

export default Meeting;