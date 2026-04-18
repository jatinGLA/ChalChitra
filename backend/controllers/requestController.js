import supabase from '../config/supabaseClient.js';

export const submitHostRequest = async (req, res) => {
  try {
    const { name, email, phone, query } = req.body;
    
    if (!name || !email || !query) {
      return res.status(400).json({ message: 'Name, email, and query are required' });
    }

    const { data, error } = await supabase
      .from('host_requests')
      .insert([{ name, email, phone, query }])
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(400).json({ message: 'Failed to submit request', error: error.message });
    }

    res.status(201).json({ message: 'Host request submitted successfully', request: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    // Ideally this should be protected by middleware verifying isAdmin
    const { data, error } = await supabase
      .from('host_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ message: 'Failed to fetch requests', error: error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
