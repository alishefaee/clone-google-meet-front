import { ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles'

const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#ffffff',
        },
        secondary: {
            main: '#b9b9b9',
        },
        background: {
            default: '#252629',
        },
        text: {
            secondary: '#ffffff',
        },
    },
};

export default createTheme(themeOptions)