import React, { useContext, useEffect } from 'react'
import { socket } from '../socket.ts'
import { useWebRTC } from '../context/webrtc.context.tsx'
import VideoWrapper from './VideoWrapper.tsx'
import { UsernameContext } from '../context/User.context.tsx'
import { useRoomContext } from '../context/Room.context.tsx'
import Box from '@mui/material/Box'

const WebRTCChat: React.FC = () => {
  const {
    localVideoRef,
    remoteVideoRef,
    peerConnectionRef,
    stream,
    audioEnabled,
    videoEnabled,
    remoteAudioEnabled,
    remoteVideoEnabled,
    setStream,
    setError,
    createPeerConnection
  } = useWebRTC()
  const { username } = useContext(UsernameContext)
  const { people } = useRoomContext()
  useEffect(() => {
    const getLocalPreview = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        setStream(mediaStream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream
        }
        setError(null) // Reset error state if camera access is successful
      } catch (error) {
        console.error('Error accessing media devices.', error)
      }
    }

    getLocalPreview()
  }, [])

  useEffect(() => {
    const handleIncomingOffer = async ({
      offer,
      meetingId
    }: {
      offer: RTCSessionDescriptionInit
      meetingId: string
    }) => {
      console.log('Offer received', offer)

      await createPeerConnection()

      if (peerConnectionRef.current) {
        // TypeScript will correctly understand signalingState as a specific type
        const signalingState = peerConnectionRef.current.signalingState

        // Check signaling state to ensure it's in the correct state to set a remote offer
        if (signalingState !== 'stable') {
          console.error(`Cannot handle offer. Current signaling state: ${signalingState}`)
          return
        }

        try {
          // Set the remote description
          await peerConnectionRef.current.setRemoteDescription(offer)

          // Recheck signaling state after setting remote description
          if (peerConnectionRef.current.signalingState === 'have-remote-offer') {
            // Create an answer and set the local description
            const answer = await peerConnectionRef.current.createAnswer()
            await peerConnectionRef.current.setLocalDescription(answer)
            socket.emit('answer', { answer, meetingId })

            // Send local tracks back to the caller
            if (stream) {
              const existingTracks = peerConnectionRef.current
                .getSenders()
                .map((sender) => sender.track)
              stream.getTracks().forEach((track) => {
                if (!existingTracks.includes(track)) {
                  peerConnectionRef.current?.addTrack(track, stream)
                }
              })
            }
          } else {
            console.error(
              `Failed to create an answer: invalid signaling state ${peerConnectionRef.current.signalingState}`
            )
          }
        } catch (error) {
          console.error('Error handling incoming offer:', error)
        }
      }
    }

    socket.on('offer', handleIncomingOffer)

    socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
      console.log('Answer received', answer)

      if (!answer || typeof answer.type !== 'string' || typeof answer.sdp !== 'string') {
        console.error('Received invalid SDP answer:', answer)
        return
      }

      if (peerConnectionRef.current) {
        if (peerConnectionRef.current.signalingState !== 'have-local-offer') {
          console.error(
            'Failed to set remote description: not in have-local-offer state. Current state:',
            peerConnectionRef.current.signalingState
          )
          return
        }

        try {
          console.log(
            'peerConnectionRef.current.signalingState:',
            peerConnectionRef.current.signalingState
          )

          // Create a valid RTCSessionDescriptionInit object
          const remoteDesc = new RTCSessionDescription(answer)
          await peerConnectionRef.current.setRemoteDescription(remoteDesc)
        } catch (error) {
          console.error('Error setting remote description:', error)
        }
      }
    })

    socket.on('candidate', async (candidate: RTCIceCandidateInit) => {
      // console.log('ICE candidate received', candidate);
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(candidate)
      }
    })

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
      socket.off('message')
      socket.off('candidate')
      socket.off('answer')
      socket.off('offer')
    }
  }, [stream])

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        height: '93%'
      }}
    >
      <Box
        sx={{
          gridColumn: 'span 3',
          gridRow: 'span 4',
          backgroundColor: 'red'
        }}
      >
        <VideoWrapper
          username={people[1]}
          audioEnabled={remoteAudioEnabled}
          videoEnabled={remoteVideoEnabled}
          ref={remoteVideoRef}
        />
      </Box>
      <Box
        sx={{
          gridColumn: 4,
          gridRow: 4,
          backgroundColor: 'green'
        }}
      >
        <VideoWrapper
          username={username}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
          ref={localVideoRef}
        />
      </Box>
    </Box>
  )
}

export default WebRTCChat
