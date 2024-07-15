// WebRTCContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';
import { socket } from "../socket.ts";

interface WebRTCContextProps {
    stream: MediaStream | null;
    remoteStream: MediaStream | null;
    audioEnabled: boolean;
    error: string | null;
    setStream: (stream: MediaStream | null) => void;
    setRemoteStream: (stream: MediaStream | null) => void;
    toggleAudioTrack: () => void;
    createPeerConnection: () => void;
    handleOffer: () => void;
    setError: (error: string | null) => void;
    localVideoRef: React.RefObject<HTMLVideoElement>;
    remoteVideoRef: React.RefObject<HTMLVideoElement>;
    peerConnectionRef: React.RefObject<RTCPeerConnection | null>;
}

const configuration = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302',
        },
    ],
};

const WebRTCContext = createContext<WebRTCContextProps | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    const toggleAudioTrack = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setAudioEnabled(audioTrack.enabled); // Sync state with track property
            }
        }
    }

    const createPeerConnection = useCallback(async () => {
        console.log('createPeerConnection');
        if (!peerConnectionRef.current) {
            const pc = new RTCPeerConnection(configuration);
            const remoteStream = new MediaStream();

            setRemoteStream(remoteStream);
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }

            console.log('Remote track about')
            pc.ontrack = (event) => {
                console.log('Remote track received', event);
                remoteStream.addTrack(event.track);
            };

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('ICE candidate sent', event.candidate);
                    socket.emit('candidate', event.candidate);
                }
            };

            pc.oniceconnectionstatechange = () => {
                console.log('ICE connection state change', pc.iceConnectionState);
            };

            pc.onsignalingstatechange = () => {
                console.log('Signaling state change', pc.signalingState);
            };

            if (stream) {
                stream.getTracks().forEach((track) => {
                    console.log('Adding track:', track);
                    pc.addTrack(track, stream);
                });
            }

            peerConnectionRef.current = pc;
        }
    }, [stream])

    const handleOffer = async () => {
        console.log('Creating offer');
        await createPeerConnection();
        if (peerConnectionRef.current) {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            socket.emit('offer', offer);
        }
    };

    return (
        <WebRTCContext.Provider value={{
            stream,
            remoteStream,
            audioEnabled,
            error,
            setStream,
            setRemoteStream,
            toggleAudioTrack,
            setError,
            localVideoRef,
            remoteVideoRef,
            peerConnectionRef,
            handleOffer,
            createPeerConnection
        }}>
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
