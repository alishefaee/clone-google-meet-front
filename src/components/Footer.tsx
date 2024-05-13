import {Stack, styled, StackProps, Typography, IconButton} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import PresentToAllOutlinedIcon from '@mui/icons-material/PresentToAllOutlined';
import TagFacesOutlinedIcon from '@mui/icons-material/TagFacesOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import React, {useEffect} from 'react'


export default function Footer() {

    return (

        <Stack direction='row' sx={{
            zIndex: theme => theme.zIndex.drawer + 1,
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}
        >
            <Stack direction='row' sx={{justifyContent: 'center', flex: 1}}>
                <IconButton color='primary'> <TagFacesOutlinedIcon/></IconButton>
                <IconButton color='primary'> <PresentToAllOutlinedIcon/></IconButton>
                <IconButton color='primary'> <BackHandOutlinedIcon/></IconButton>
                <IconButton color='primary'> <MoreVertIcon/></IconButton>
            </Stack>
            <Stack direction='row' sx={{justifyContent: 'flex-end'}}>
                <IconButton color='primary'> <PeopleAltOutlinedIcon/></IconButton>
                <IconButton color='primary'> <ChatBubbleOutlineOutlinedIcon/></IconButton>
            </Stack>
        </Stack>

    )
}
