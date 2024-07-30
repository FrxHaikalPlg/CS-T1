import React, { useState, useEffect } from 'react';
import Camera from './components/Camera';
import generatePDF from './components/GeneratePDF';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [fileName, setFileName] = useState('');

  // Fungsi untuk menangani pengambilan foto
  const handleCapture = (photo) => {
    setPhotos([...photos, photo]);
  };

  // Fungsi untuk berbagi PDF
  const handleShare = async () => {
    if (photos.length === 0) {
      alert('No photos to share.');
      return;
    }
    try {
      const pdfBlob = await generatePDF(photos);
      const file = new File([pdfBlob], `${fileName}.pdf`, { type: 'application/pdf' });

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
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Fungsi untuk mengunduh PDF
  const handleDownload = async () => {
    if (photos.length === 0) {
      alert('No photos to download.');
      return;
    }
    const pdfBlob = await generatePDF(photos);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fungsi untuk menghapus foto
  const handleDeletePhoto = (indexToDelete) => {
    setPhotos(photos.filter((_, index) => index !== indexToDelete));
  };

  // Fungsi untuk mendapatkan tanggal dan jam saat ini
  const getCurrentDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `CamPDF_${day}${month}${year}_${hours}${minutes}`;
  };

  // Mengatur placeholder saat komponen dimuat
  useEffect(() => {
    setFileName(getCurrentDateTime());
  }, []);

  return (
    <div className="app-container">
      {/* Input untuk nama file PDF */}
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className="filename-input"
        style={{ paddingLeft: '30px' }}
        placeholder={getCurrentDateTime()} // Placeholder dengan format yang diinginkan
      />
      {/* Komponen Kamera */}
      <Camera onCapture={handleCapture} />
      <div className="photos-container">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo} alt={`Captured ${index}`} className="photo-image" />
            <button
              className="delete-photo-btn"
              onClick={() => handleDeletePhoto(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="footer-container">
        {/* Tombol untuk mengambil gambar */}
        <button className="footer-button" onClick={() => document.getElementById('cameraInput').click()}>
          <i className="fa fa-camera"></i> Take Picture
        </button>
        {/* Tombol untuk menyimpan sebagai PDF */}
        <button className="footer-button" onClick={handleDownload}>
          <i className="fa fa-save"></i> Save as PDF
        </button>
        {/* Tombol untuk berbagi sebagai PDF */}
        <button className="footer-button" onClick={handleShare}>
          <i className="fa fa-share-alt"></i> Share as PDF
        </button>
      </div>
    </div>
  );
}

export default App;