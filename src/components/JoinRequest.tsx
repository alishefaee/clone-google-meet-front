import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {useEffect, useState} from "react";
import {socket} from "../socket.ts";

type TJoinReq = {
    username: string,
    meetingId: string,
    connectionId: string
}

const JoinRequest = () => {

    const [open, setOpen] = useState(false);
    const [user, setUser] = useState('');

    useEffect(() => {
        socket.on('f:people:join-request', (data:TJoinReq)=>{
            setUser(data.username)
            setOpen(true)
        })
    }, []);

    const handleAdmit = () => {
        console.log('Admin handler')
        setOpen(false);
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
        <Snackbar
            open={open}
            onClose={handleClose}
            message={user}
            action={action}
        />
    );
};

export default JoinRequest;