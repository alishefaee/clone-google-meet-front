import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {useEffect, useState} from "react";
import {socket} from "../socket.ts";
import {useWebRTC} from "../context/webrtc.context.tsx";

type TJoinReq = {
    username: string,
    meetingId: string,
    connectionId: string
}

const JoinRequest = () => {
    const {handleOffer} = useWebRTC()
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<TJoinReq>(null);

    useEffect(() => {
        socket.on('f:people:join-request', (data:TJoinReq)=>{
            setUser(data)
            setOpen(true)
        })
    }, []);

    const handleAdmit = () => {
        handleOffer(user.meetingId)
        setOpen(false);
        setUser(null)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleAdmit}>
                ADMIT
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <>
            {user?<Snackbar
                open={open}
                onClose={handleClose}
                message={user.username}
                action={action}
            />:null}
        </>
    );
};

export default JoinRequest;