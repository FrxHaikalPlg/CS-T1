import React, { useState } from 'react';
import Camera from './components/Camera';
import generatePDF from './components/GeneratePDF';

function App() {
  const [photos, setPhotos] = useState([]);
  const [fileName, setFileName] = useState('dokumen');

  const handleCapture = (photo) => {
    setPhotos([...photos, photo]);
  };

  const handleShare = async () => {
    if (photos.length === 0) {
      alert('No photos to share.');
      return;
    }
    const pdfBlob = await generatePDF(photos);
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

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

  const handleDownload = async () => {
    if (photos.length === 0) {
      alert('No photos to download.');
      return;
    }
    const pdfBlob = await generatePDF(photos);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deletePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  return (
    <div>
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <Camera onCapture={handleCapture} />
      <div>
        {photos.map((photo, index) => (
          <div key={index}>
            <img src={photo} alt={`Captured ${index}`} style={{ maxWidth: '100%' }} />
            <button onClick={() => deletePhoto(index)}>Delete</button>
          </div>
        ))}
      </div>
      <button onClick={handleShare}>Share PDF</button>
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
}

export default App;