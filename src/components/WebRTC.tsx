import React, {useEffect} from 'react';
import {socket} from '../socket.ts';
import {useWebRTC} from "../context/webrtc.context.tsx";


const WebRTCChat: React.FC = () => {
    const {
        localVideoRef,
        remoteVideoRef,
        peerConnectionRef,
        stream,
        remoteStream,
        error,
        setStream,
        setRemoteStream,
        setError,
        handleOffer,
        createPeerConnection
    } = useWebRTC()

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
        const handleIncomingOffer = async ({offer,meetingId}: {offer: RTCSessionDescriptionInit, meetingId: string}) => {
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
                socket.emit('answer', {answer, meetingId});

                // Send local tracks back to the caller
                if (stream) {
                    stream.getTracks().forEach((track) => {
                        peerConnectionRef.current?.addTrack(track, stream);
                    });
                }
            }
        };

        socket.on('offer', handleIncomingOffer);

        socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
            console.log('Answer received', answer);
            if (peerConnectionRef.current) {
                if (peerConnectionRef.current.signalingState !== 'have-local-offer') {
                    console.error('Failed to set remote description: not in have-local-offer state');
                    return;
                }
                console.log('peerConnectionRef.current.signalingState:', peerConnectionRef.current.signalingState)
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


    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                <div>
                    <h3>Local Video</h3>
                    <video ref={localVideoRef} autoPlay muted
                           style={{width: '300px', height: '200px', border: '1px solid black'}}></video>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                </div>
                <div>
                    <h3>Remote Video</h3>
                    <video ref={remoteVideoRef} autoPlay
                           style={{width: '300px', height: '200px', border: '1px solid black'}}></video>
                </div>
            </div>
        </div>
    );
};

export default WebRTCChat;
