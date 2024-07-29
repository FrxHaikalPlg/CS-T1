import React, { useState } from 'react';
import Camera from './components/Camera';
import generatePDF from './components/GeneratePDF';

function App() {
  const [photos, setPhotos] = useState([]);

  const handleCapture = (photo) => {
    setPhotos([...photos, photo]);
  };

  const handleShare = async () => {
    const pdfBlob = generatePDF(photos);
    const file = new File([pdfBlob], 'photos.pdf', { type: 'application/pdf' });

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My PDF',
          files: [file],
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Web Share API tidak didukung di browser ini.');
    }
  };

  return (
    <div>
      <Camera onCapture={handleCapture} />
      <div>
        {photos.map((photo, index) => (
          <img key={index} src={photo} alt={`Captured ${index}`} />
        ))}
      </div>
      <button onClick={handleShare}>Share PDF</button>
    </div>
  );
}

export default App;