// WebRTCContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WebRTCContextProps {
    stream: MediaStream | null;
    remoteStream: MediaStream | null;
    error: string | null;
    setStream: (stream: MediaStream | null) => void;
    setRemoteStream: (stream: MediaStream | null) => void;
    setError: (error: string | null) => void;
}

const WebRTCContext = createContext<WebRTCContextProps | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    return (
        <WebRTCContext.Provider value={{ stream, remoteStream, error, setStream, setRemoteStream, setError }}>
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
