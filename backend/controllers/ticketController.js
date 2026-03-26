import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import Booking from '../models/Booking.js';
import fs from 'fs';
import path from 'path';

export const downloadTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('event').populate('user');
    if (!booking || booking.paymentStatus !== 'Completed') {
      return res.status(404).json({ message: 'Ticket not found or payment incomplete' });
    }

    // Generate QR Code Buffer
    const qrData = JSON.stringify({ bookingId: booking._id, seats: booking.seats });
    const qrCodeImage = await QRCode.toDataURL(qrData);
    
    // Setup PDF
    const doc = new PDFDocument({ margin: 50 });
    
    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ChalChitra_Ticket_${booking._id}.pdf`);
    
    doc.pipe(res);

    // Build PDF content
    doc.fontSize(25).text('ChalChitra E-Ticket', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(16).text(`Event: ${booking.event.title}`);
    doc.fontSize(12).text(`Venue: ${booking.event.venue}`);
    doc.text(`Date: ${booking.event.date}`);
    doc.moveDown();
    
    doc.text(`Booked By: ${booking.user.name}`);
    doc.text(`Reference ID: ${booking._id}`);
    doc.text(`Seats: ${booking.seats.join(', ')}`);
    doc.text(`Amount Paid: Rs. ${booking.totalAmount}`);
    doc.moveDown();

    // Embed QR at the bottom
    doc.image(qrCodeImage, { fit: [150, 150], align: 'center' });

    doc.end();

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error generating ticket' });
    }
  }
};
