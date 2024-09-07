import React, { forwardRef } from 'react'

interface VideoWrapperProps {
  username: string
  audioEnabled: boolean
  videoEnabled: boolean
}

const VideoWrapper = forwardRef<HTMLVideoElement, VideoWrapperProps>(
  ({ username, audioEnabled, videoEnabled }, ref) => {
    return (
      <>
        <h3>{username}</h3>
        <video
          ref={ref}
          autoPlay
          muted={!audioEnabled} // Muted based on audioEnabled prop
          style={{
            width: '100%',
            // height:'200px',
            // width: '200px',
            border: '1px solid black'
          }}
        ></video>
      </>
    )
  }
)

export default VideoWrapper
