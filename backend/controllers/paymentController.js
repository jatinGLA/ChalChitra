import Razorpay from 'razorpay';
import crypto from 'crypto';
import supabase from '../config/supabaseClient.js';

export const createOrder = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;
    
    // In actual implementation, we'd initialize with correct keys
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
    });

    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: bookingId
    };

    const order = await instance.orders.create(options);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Razorpay Order', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    
    // Verification signature logic
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      const { data: booking } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();
        
      if (booking) {
        await supabase
          .from('bookings')
          .update({
            payment_status: 'Completed',
            payment_id: razorpay_payment_id,
            e_ticket_url: `/api/tickets/download/${booking.id}`
          })
          .eq('id', booking.id);
          
        // Automatically generate matching 'Tickets' for the resale engine
        const ticketsToInsert = booking.seats.map(seat => ({
          booking_id: booking.id,
          event_id: booking.event_id,
          owner_id: booking.user_id,
          seat_number: seat,
          is_resellable: false,
          resale_active: false
        }));

        await supabase.from('tickets').insert(ticketsToInsert);
      }
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};
