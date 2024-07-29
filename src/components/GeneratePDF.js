import jsPDF from 'jspdf';

function generatePDF(photos) {
  const doc = new jsPDF();
  photos.forEach((photo, index) => {
    if (index > 0) doc.addPage();
    doc.addImage(photo, 'PNG', 10, 10, 180, 160);
  });
  return doc.output('blob');
}

export default generatePDF;