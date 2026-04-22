import supabase from '../config/supabaseClient.js';
import { calculateFees } from '../utils/feeCalculator.js';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

// Get my tickets
export const getMyTickets = async (req, res) => {
  try {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select(`
        id,
        seat_number,
        is_resellable,
        resale_price,
        events (
          id,
          title,
          date,
          venue,
          image_url,
          allow_resell
        )
      `)
      .eq('owner_id', req.user.id);

    if (error) throw error;
    res.json(tickets || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tickets' });
  }
};

// List ticket for resale
export const listTicketForResale = async (req, res) => {
  try {
    const { data: ticket, error: fetchError } = await supabase
      .from('tickets')
      .select('*, events(*)')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !ticket) return res.status(404).json({ message: 'Ticket not found' });
    
    // Only owner can list for resale
    if (ticket.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Only ticket owner can list for resale' });
    }
    
    // Event must allow resale
    if (!ticket.events.allow_resell) {
      return res.status(400).json({ message: 'Resale not allowed for this event' });
    }
    
    const { resale_price } = req.body;
    if (!resale_price || resale_price <= 0) {
      return res.status(400).json({ message: 'Invalid resale price' });
    }

    const { data: updatedTicket, error: updateError } = await supabase
      .from('tickets')
      .update({
        is_resellable: true,
        resale_price: resale_price,
        resale_active: true
      })
      .eq('id', ticket.id)
      .select()
      .single();
      
    if (updateError) throw updateError;
    
    res.json({ message: 'Ticket listed for resale', ticket: updatedTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Transfer ticket ownership directly
export const transferTicket = async (req, res) => {
  try {
    const { data: ticket, error: fetchError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !ticket) return res.status(404).json({ message: 'Ticket not found' });
    
    if (ticket.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Only ticket owner can transfer' });
    }
    
    const { newOwnerId } = req.body;
    if (!newOwnerId) return res.status(400).json({ message: 'New owner ID required' });
    
    const { data: updatedTicket, error: updateError } = await supabase
      .from('tickets')
      .update({
        owner_id: newOwnerId,
        is_resellable: false,
        resale_active: false,
        resale_price: null
      })
      .eq('id', ticket.id)
      .select()
      .single();

    if (updateError) throw updateError;
    res.json({ message: 'Ticket transferred', ticket: updatedTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all tickets active on the resale marketplace
export const getMarketplaceTickets = async (req, res) => {
  try {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*, events(*)')
      .eq('is_resellable', true)
      .eq('resale_active', true)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching marketplace' });
  }
};

// Place a bid on a ticket
export const placeBid = async (req, res) => {
  try {
    const { bid_amount } = req.body;
    if (!bid_amount || bid_amount <= 0) {
      return res.status(400).json({ message: 'Invalid bid amount' });
    }

    const { data: ticket, error: fetchError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !ticket) return res.status(404).json({ message: 'Ticket not found' });
    
    if (!ticket.is_resellable || !ticket.resale_active) {
      return res.status(400).json({ message: 'Ticket is not taking bids' });
    }
    
    const bidderId = req.user.id;
    if (ticket.owner_id === bidderId) {
      return res.status(400).json({ message: 'You cannot bid on your own ticket' });
    }

    // Insert bid
    const { data: bid, error: bidError } = await supabase
      .from('ticket_bids')
      .insert([{
        ticket_id: ticket.id,
        bidder_id: bidderId,
        bid_amount: bid_amount
      }])
      .select()
      .single();

    if (bidError) throw bidError;
    res.status(201).json({ message: 'Bid placed successfully', bid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all bids for a specific ticket (Owner access only recommended)
export const getTicketBids = async (req, res) => {
  try {
    const { data: bids, error } = await supabase
      .from('ticket_bids')
      .select('*, users(name, email)') // Fetching bidder details
      .eq('ticket_id', req.params.id)
      .eq('status', 'Pending')
      .order('bid_amount', { ascending: false });

    if (error) throw error;
    res.json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching bids' });
  }
};

// Accept a bid
export const acceptBid = async (req, res) => {
  try {
    const { bidId } = req.params;

    // Fetch bid
    const { data: bid, error: bidFetchError } = await supabase
      .from('ticket_bids')
      .select('*, tickets(*)')
      .eq('id', bidId)
      .single();

    if (bidFetchError || !bid) return res.status(404).json({ message: 'Bid not found' });
    const ticket = bid.tickets;

    // Verify ownership
    if (ticket.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Only ticket owner can accept bids' });
    }

    const price = bid.bid_amount;
    const { hostFee, platformFee } = calculateFees(price);
    
    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert([{
        ticket_id: ticket.id,
        seller_id: ticket.owner_id,
        buyer_id: bid.bidder_id,
        price,
        host_fee: hostFee,
        platform_fee: platformFee
      }])
      .select()
      .single();

    if (txError) throw txError;

    // Accept this bid
    await supabase.from('ticket_bids').update({ status: 'Accepted' }).eq('id', bid.id);
    
    // Reject all other pending bids for this ticket
    await supabase.from('ticket_bids')
      .update({ status: 'Rejected' })
      .eq('ticket_id', ticket.id)
      .eq('status', 'Pending');

    // Transfer ownership
    const { error: updateError } = await supabase
      .from('tickets')
      .update({
        owner_id: bid.bidder_id,
        is_resellable: false,
        resale_active: false,
        resale_price: null
      })
      .eq('id', ticket.id);

    if (updateError) throw updateError;
    
    res.json({ message: 'Bid accepted. Transaction complete.', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const downloadTicket = async (req, res) => {
  try {
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*, events(*), users(*)')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !booking || booking.payment_status !== 'Completed') {
      return res.status(404).json({ message: 'Ticket not found or payment incomplete' });
    }

    // Generate QR Code Buffer
    const qrData = JSON.stringify({ bookingId: booking.id, seats: booking.seats });
    const qrCodeImage = await QRCode.toDataURL(qrData);
    
    // Check if PDFDocument is validly imported, using a mock if it's missing from file imports
    // Usually pdfkit is imported, wait, the original file was missing `import PDFDocument from 'pdfkit';`
    const PDFDocument = (await import('pdfkit')).default;
    const doc = new PDFDocument({ margin: 50 });
    
    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ChalChitra_Ticket_${booking.id}.pdf`);
    
    doc.pipe(res);

    // Build PDF content
    doc.fontSize(25).text('ChalChitra E-Ticket', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(16).text(`Event: ${booking.events.title}`);
    doc.fontSize(12).text(`Venue: ${booking.events.venue}`);
    doc.text(`Date: ${new Date(booking.events.date).toLocaleString()}`);
    doc.moveDown();
    
    doc.text(`Booked By: ${booking.users.name}`);
    doc.text(`Reference ID: ${booking.id}`);
    doc.text(`Seats: ${booking.seats.join(', ')}`);
    doc.text(`Amount Paid: Rs. ${booking.total_amount}`);
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
