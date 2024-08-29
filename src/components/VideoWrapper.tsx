import React, { forwardRef } from 'react';

interface VideoWrapperProps {
    username: string;
    audioEnabled: boolean;
    videoEnabled: boolean;
}

const VideoWrapper = forwardRef<HTMLVideoElement, VideoWrapperProps>(
    ({ username, audioEnabled, videoEnabled }, ref) => {
        return (
            <div>
                <h3>{username}</h3>
                <video
                    ref={ref}
                    autoPlay
                    muted={!audioEnabled} // Muted based on audioEnabled prop
                    style={{ width: '300px', height: '200px', border: '1px solid black' }}
                >
                </video>
            </div>
        );
    }
);

export default VideoWrapper;
