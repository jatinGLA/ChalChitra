import supabase from '../config/supabaseClient.js';

// Get all users (Admin only)
export const getUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, phone, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Update user role (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!['USER', 'ORGANISER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};
