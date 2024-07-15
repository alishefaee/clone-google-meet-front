import {IconButton, Stack, Typography} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import PresentToAllOutlinedIcon from '@mui/icons-material/PresentToAllOutlined';
import TagFacesOutlinedIcon from '@mui/icons-material/TagFacesOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import React, {useEffect} from 'react'
import {DrawerLayoutEnum} from "../enum/drawer-layout.enum.ts";
import {useRoomContext} from "../context/Room.context.tsx";
import {useWebRTC} from "../context/webrtc.context.tsx";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

export default function Footer({state, setState}) {
    const {roomId} = useRoomContext()
    const {stream, toggleAudioTrack,audioEnabled, remoteStream, error, setStream, setRemoteStream, setError} = useWebRTC()

    function dialogLayoutHandler(name: DrawerLayoutEnum) {
        setState({
            name,
            open: name == state.name ? !state.open : true
        })
    }

    useEffect(() => {
        console.log('clicked', !!stream)
        if (stream)
        console.log(stream.getAudioTracks()[0].enabled)
    }, [stream]);

    return (
        <Stack direction='row' sx={{
            zIndex: theme => theme.zIndex.drawer + 1,
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme => theme.palette.background.default,
            boxSizing: 'border-box',
            pl: 2,
            pr: 2,
        }}
        >
            <Typography color='white'>
                {roomId}
            </Typography>
            <Stack direction='row' sx={{justifyContent: 'center', flex: 1}}>
                <IconButton color='primary'> <TagFacesOutlinedIcon/></IconButton>
                <IconButton color='primary'> <PresentToAllOutlinedIcon/></IconButton>
                {audioEnabled ? <IconButton
                    color='primary'
                    onClick={toggleAudioTrack}
                >
                    <MicIcon/>
                </IconButton> : <IconButton
                    color='primary'
                    onClick={toggleAudioTrack}
                >
                    <MicOffIcon/>
                </IconButton>}
                <IconButton color='primary'> <BackHandOutlinedIcon/></IconButton>
                <IconButton color='primary'> <MoreVertIcon/></IconButton>
            </Stack>
            <Stack direction='row' sx={{justifyContent: 'flex-end'}}>
                <IconButton
                    color='primary'
                    onClick={() => dialogLayoutHandler(DrawerLayoutEnum.PEOPLE)}
                ><PeopleAltOutlinedIcon/>
                </IconButton>
                <IconButton
                    color='primary'
                    onClick={() => dialogLayoutHandler(DrawerLayoutEnum.CHAT)}
                > <ChatBubbleOutlineOutlinedIcon/></IconButton>
            </Stack>
        </Stack>
    )
}