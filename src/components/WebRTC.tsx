import React, { useState, useRef, useEffect, useCallback } from 'react';
import { socket } from '../socket.ts';
import {useWebRTC} from "../context/webrtc.context.tsx";

const configuration = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302',
        },
    ],
};

const WebRTCChat: React.FC = () => {
    const { stream, remoteStream, error, setStream, setRemoteStream, setError } = useWebRTC()

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        const getLocalPreview = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                setStream(mediaStream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = mediaStream;
                }
                setError(null); // Reset error state if camera access is successful
            } catch (error) {
                console.error('Error accessing media devices.', error);
                setError('Could not access camera. Please make sure no other applications are using the camera.');
            }
        };

        getLocalPreview();
    }, []);

    useEffect(() => {
        const handleOffer = async (offer: RTCSessionDescriptionInit) => {
            console.log('Offer received', offer);
            await createPeerConnection();
            if (peerConnectionRef.current) {
                if (peerConnectionRef.current.signalingState !== 'stable') {
                    console.error('Failed to set remote description: not in stable state');
                    return;
                }
                await peerConnectionRef.current.setRemoteDescription(offer);
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);
                socket.emit('answer', answer);

                // Send local tracks back to the caller
                if (stream) {
                    stream.getTracks().forEach((track) => {
                        peerConnectionRef.current?.addTrack(track, stream);
                    });
                }
            }
        };

        socket.on('offer', handleOffer);

        socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
            console.log('Answer received', answer);
            if (peerConnectionRef.current) {
                if (peerConnectionRef.current.signalingState !== 'have-local-offer') {
                    console.error('Failed to set remote description: not in have-local-offer state');
                    return;
                }
                console.log('peerConnectionRef.current.signalingState:',peerConnectionRef.current.signalingState)
                await peerConnectionRef.current.setRemoteDescription(answer);
            }
        });

        socket.on('candidate', async (candidate: RTCIceCandidateInit) => {
            // console.log('ICE candidate received', candidate);
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.addIceCandidate(candidate);
            }
        });
        
        return () => {
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            socket.off('message')
            socket.off('candidate')
            socket.off('answer')
            socket.off('offer')
        };
    }, [stream]);

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
    }, [stream]);

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
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <div>
                    <h3>Local Video</h3>
                    <video ref={localVideoRef} autoPlay muted style={{ width: '300px', height: '200px', border: '1px solid black' }}></video>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
                <div>
                    <h3>Remote Video</h3>
                    <video ref={remoteVideoRef} autoPlay style={{ width: '300px', height: '200px', border: '1px solid black' }}></video>
                </div>
            </div>
            <div>
                <button onClick={handleOffer}>Call</button>
                <button onClick={() => stream && stream.getVideoTracks()[0] && (stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled)}>
                    Toggle Video
                </button>
                <button onClick={() => stream && stream.getAudioTracks()[0] && (stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled)}>
                    Toggle Microphone
                </button>
                <button onClick={() => remoteStream && remoteStream.getAudioTracks()[0] && (remoteStream.getAudioTracks()[0].enabled = !remoteStream.getAudioTracks()[0].enabled)}>
                    Toggle Sound
                </button>
            </div>
        </div>
    );
};

export default WebRTCChat;
