import React, { useRef, useState } from 'react';

function Camera({ onCapture }) {
  const videoRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment'); // Default to back camera

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode } 
    });
    videoRef.current.srcObject = stream;
  };

  const flipCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
  };

  return (
    <div>
      <video ref={videoRef} autoPlay></video>
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={flipCamera}>Flip Camera</button>
      <button onClick={capturePhoto}>Capture Photo</button>
      <button onClick={stopCamera}>Stop Camera</button>
    </div>
  );
}

export default Camera;