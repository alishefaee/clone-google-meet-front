import {Stack, styled, StackProps, Typography, IconButton} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import PresentToAllOutlinedIcon from '@mui/icons-material/PresentToAllOutlined';
import TagFacesOutlinedIcon from '@mui/icons-material/TagFacesOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import React, {useEffect} from 'react'
import theme from "../theme.ts";
import {DrawerLayoutEnum} from "../enum/drawer-layout.enum.ts";


export default function Footer({state, setState}) {
    function dialogLayoutHandler(name: DrawerLayoutEnum) {
        setState({
            name,
            open: name == state.name? !state.open: true
        })
    }

    return (
        <Stack direction='row' sx={{
            zIndex: theme => theme.zIndex.drawer + 1,
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme =>theme.palette.background.default
        }}
        >
            <Stack direction='row' sx={{justifyContent: 'center', flex: 1}}>
                <IconButton color='primary'> <TagFacesOutlinedIcon/></IconButton>
                <IconButton color='primary'> <PresentToAllOutlinedIcon/></IconButton>
                <IconButton color='primary'> <BackHandOutlinedIcon/></IconButton>
                <IconButton color='primary'> <MoreVertIcon/></IconButton>
            </Stack>
            <Stack direction='row' sx={{justifyContent: 'flex-end'}}>
                <IconButton
                    color='primary'
                    onClick={()=>dialogLayoutHandler(DrawerLayoutEnum.PEOPLE)}
                ><PeopleAltOutlinedIcon/>
                </IconButton>
                <IconButton
                    color='primary'
                    onClick={()=>dialogLayoutHandler(DrawerLayoutEnum.CHAT)}
                > <ChatBubbleOutlineOutlinedIcon/></IconButton>
            </Stack>
        </Stack>
    )
}