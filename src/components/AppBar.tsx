import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AccountCircle from '@mui/icons-material/AccountCircle';
import logo from '/google-meet.svg'
import {Stack} from "@mui/material";
import {useContext} from "react";
import {UsernameContext} from "../context/User.context.tsx";

function ResponsiveAppBar() {
    const { username } = useContext(UsernameContext)
    return (
        <AppBar position="static">
        <Container maxWidth="xl">
        <Toolbar disableGutters>
        <img src={logo} width={64}/>
    <Typography
    variant="h6"
    noWrap
    component="a"
    href="#app-bar-with-responsive-menu"
    sx={{
        mr: 2,
            display: { xs: 'none', md: 'flex' },
        fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
    }}
>
    Google Meet
    </Typography>

    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
    </Box>
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

    </Box>

    <Stack direction='row' spacing={1} sx={{ flexGrow: 0 }}>
        <Typography>
            {username}
        </Typography>
            <AccountCircle />
    </Stack>
    </Toolbar>
    </Container>
    </AppBar>
);
}
export default ResponsiveAppBar;
