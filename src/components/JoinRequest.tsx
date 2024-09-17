import * as React from 'react'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'
import { socket } from '../socket.ts'
import { useWebRTC } from '../context/webrtc.context.tsx'

type TJoinReq = {
  username: string
  meetingId: string
  connectionId: string
}

const JoinRequest = () => {
  const { handleOffer } = useWebRTC()
  const [admitReqs, setAdmitReqs] = useState<TJoinReq[]>([])

  useEffect(() => {
    socket.on('f:people:join-request', (data: TJoinReq) => {
      setAdmitReqs((pre) => pre.concat(data))
    })

    return () => {
      socket.off('f:people:join-request')
    }
  }, [])

  const handleAdmit = (req: TJoinReq) => {
    handleOffer(req.meetingId)
    setAdmitReqs((pre) => pre.filter((r) => r.username != req.username))
  }

  const handleClose = (req: TJoinReq) => {
    setAdmitReqs((pre) => pre.filter((r) => r.username != req.username))
  }

  const Action = ({ req }) => {
    return (
      <>
        <Button color="secondary" size="small" onClick={() => handleAdmit(req)}>
          ADMIT
        </Button>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => handleClose(req)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </>
    )
  }

  return (
    <>
      {admitReqs.map((req) => (
        <Snackbar open={!!req} message={req.username} action={<Action req={req} />} />
      ))}
    </>
  )
}

export default JoinRequest
