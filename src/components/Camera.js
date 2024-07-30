import React from 'react';

function Camera({ onCapture }) {
  // Handler for file input change
  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        onCapture(readEvent.target.result); // Pass base64 image to onCapture
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="camera-container">
      {/* File input for capturing photos */}
      <input
        id="cameraInput"
        type="file"
        accept="image/*"
        capture="environment" // Suggests the device to use the rear camera
        onChange={handleCapture}
        className="camera-input"
        style={{ display: 'none' }}
      />
      <button className="take-picture-btn" onClick={() => document.getElementById('cameraInput').click()}>Take Picture</button>
    </div>
  );
}

export default Camera;