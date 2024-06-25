// WebRTCContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WebRTCContextProps {
    stream: MediaStream | null;
    remoteStream: MediaStream | null;
    audioEnabled: boolean;
    error: string | null;
    setStream: (stream: MediaStream | null) => void;
    setRemoteStream: (stream: MediaStream | null) => void;
    toggleAudioTrack: () => void;
    setError: (error: string | null) => void;
}

const WebRTCContext = createContext<WebRTCContextProps | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const toggleAudioTrack = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setAudioEnabled(audioTrack.enabled); // Sync state with track property
            }
        }
    };

    return (
        <WebRTCContext.Provider value={{ stream, remoteStream, audioEnabled, error, setStream, setRemoteStream, toggleAudioTrack, setError }}>
            {children}
        </WebRTCContext.Provider>
    );
};

export const useWebRTC = (): WebRTCContextProps => {
    const context = useContext(WebRTCContext);
    if (!context) {
        throw new Error('useWebRTC must be used within a WebRTCProvider');
    }
    return context;
};
