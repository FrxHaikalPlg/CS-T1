import React, { useRef } from 'react';

function Camera({ onCapture }) {
  const videoRef = useRef(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay></video>
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={capturePhoto}>Capture Photo</button>
    </div>
  );
}

export default Camera;