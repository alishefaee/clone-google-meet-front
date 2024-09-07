import './App.css'
import { useContext, useEffect, useState } from 'react'
import { UsernameContext } from './context/User.context'
import { socket, updateAuthToken } from './socket'
import MainPage from './components/MainPage'
import Meeting from './components/Meeting.tsx'
import { useRoomContext } from './context/Room.context.tsx'
import Box from '@mui/material/Box'

function App() {
  const { setUsername, username } = useContext(UsernameContext)
  const { removePerson } = useRoomContext()
  const [usernameLoaded, setUsernameLoaded] = useState(false)
  const [isMeeting, setIsMeeting] = useState(false)

  const [isConnected, setIsConnected] = useState(socket.connected)

  useEffect(() => {
    console.log('isConnected:', socket.connected, isConnected)
  }, [isConnected])

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setUsername(storedUsername)
      updateAuthToken(storedUsername)
    } else {
      const userInput = window.prompt('Please enter some input:', '')
      if (userInput !== null) {
        setUsername(userInput)
        localStorage.setItem('username', userInput)
        updateAuthToken(userInput)
      }
    }

    setUsernameLoaded(true)

    socket.connect()

    return () => {
      if (isMeeting) {
        removePerson(username)
      }
    }
  }, [])

  useEffect(() => {
    function onConnect() {
      console.log('Connected to server')
      setIsConnected(true)
    }

    function onDisconnect() {
      console.log('Disconnected from server')
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [])

  if (!usernameLoaded) {
    return <div>Loading...</div>
  }

  return (
    <Box sx={{ height: '100%' }}>
      {isMeeting ? <Meeting /> : <MainPage setIsMeeting={setIsMeeting} />}
    </Box>
  )
}

export default App
