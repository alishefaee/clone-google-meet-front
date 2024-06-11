import React, { useEffect, useRef, useState } from 'react';
import {socket} from "../socket.ts";

const VoiceChat: React.FC = () => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then((stream) => {
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorderRef.current = mediaRecorder;
                    let audioChunks: BlobPart[] = [];

                    mediaRecorder.addEventListener("dataavailable", (event) => {
                        audioChunks.push(event.data);
                    });

                    mediaRecorder.addEventListener("stop", () => {
                        console.log('onstop');
                        const audioBlob = new Blob(audioChunks);
                        audioChunks = [];
                        const fileReader = new FileReader();
                        fileReader.readAsDataURL(audioBlob);
                        fileReader.onloadend = () => {
                            console.log('onloaded');
                            const base64String = fileReader.result;
                            socket.emit("audioStream", base64String);
                        };

                        mediaRecorder.start();
                        setTimeout(() => {
                            console.log('stopp');
                            mediaRecorder.stop();
                        }, 1000);
                    });

                    mediaRecorder.start();
                    setTimeout(() => {
                        console.log('stop');
                        mediaRecorder.stop();
                    }, 1000);
                })
                .catch((error) => {
                    console.error('Error capturing audio.', error);
                    setError('Microphone access is required for voice chat.');
                });


        socket.on('audioStream', (audioData) => {
            const newData = audioData.split(";");
            newData[0] = "data:audio/ogg;";
            const audioSrc = newData.join(';');
            const audio = new Audio(audioSrc);
            if (!audio || document.hidden) {
                return;
            }
            audio.play();
        });

        return () => {
            console.log('useEffect unmount');
            socket.off('audioStream');
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    return (
        <div>
            <h2>Voice Chat</h2>
            {error && <p>{error}</p>}
        </div>
    );
};

export default VoiceChat;
