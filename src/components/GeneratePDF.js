import jsPDF from 'jspdf';

function generatePDF(photos) {
  let doc;

  const compressImage = (img, quality = 0.7) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg', quality);
  };

  const promises = photos.map((photo, index) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = photo;
      img.onload = () => {
        const compressedPhoto = compressImage(img);

        const imgWidth = img.width;
        const imgHeight = img.height;
        const orientation = imgHeight > imgWidth ? 'portrait' : 'landscape';
        const pageWidth = orientation === 'portrait' ? 210 : 330;
        const pageHeight = orientation === 'portrait' ? 330 : 210;
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        const pdfWidth = imgWidth * ratio;
        const pdfHeight = imgHeight * ratio;

        // Menyesuaikan orientasi halaman
        if (index === 0) {
          doc = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: [pageWidth, pageHeight]
          });
        } else {
          doc.addPage([pageWidth, pageHeight], orientation);
        }

        // Menambahkan gambar ke PDF
        doc.addImage(compressedPhoto, 'JPEG', (pageWidth - pdfWidth) / 2, (pageHeight - pdfHeight) / 2, pdfWidth, pdfHeight);
        resolve();
      };
    });
  });

  return Promise.all(promises).then(() => doc.output('blob'));
}

export default generatePDF;