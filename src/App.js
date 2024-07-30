import React, { useState } from 'react';
import Camera from './components/Camera';
import generatePDF from './components/GeneratePDF';

function App() {
  const [photos, setPhotos] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

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
      alert('Web Share API is not supported in this browser.');
    }
  };

  const handleDownload = () => {
    const pdfBlob = generatePDF(photos);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'photos.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const deletePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  return (
    <div>
      <Camera onCapture={handleCapture} />
      <button onClick={togglePreview}>{showPreview ? 'Hide Preview' : 'Show Preview'}</button>
      {showPreview && (
        <div style={{ position: 'fixed', top: '10%', left: '10%', width: '80%', height: '80%', backgroundColor: 'white', overflow: 'auto', zIndex: 1000 }}>
          <button onClick={togglePreview} style={{ position: 'absolute', right: 20, top: 20 }}>Close</button>
          {photos.map((photo, index) => (
            <div key={index}>
              <img src={photo} alt={`Captured ${index}`} style={{ maxWidth: '100%' }} />
              <button onClick={() => deletePhoto(index)}>Delete</button>
            </div>
          ))}
        </div>
      )}
      <button onClick={handleShare}>Share PDF</button>
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
}

export default App;