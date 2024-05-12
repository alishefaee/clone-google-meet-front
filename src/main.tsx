import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {UsernameProvider} from "./context/User.context.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <UsernameProvider>
        <App/>
        </UsernameProvider>
    </React.StrictMode>
)
