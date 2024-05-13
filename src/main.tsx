import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {UsernameProvider} from "./context/User.context.tsx";
import {ThemeProvider} from '@emotion/react'
import theme from './theme.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <UsernameProvider>
                <App/>
            </UsernameProvider>
        </ThemeProvider>
    </React.StrictMode>
)
