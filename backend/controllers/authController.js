import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabaseClient.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    // Check user exists
    const { data: userExists } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
      
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create User
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        { name, email, password_hash: passwordHash, role: role || 'USER', phone }
      ])
      .select()
      .single();
      
    if (error) {
      console.error(error);
      return res.status(400).json({ message: 'Failed to create user', error: error.message });
    }
    
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, phone, created_at')
      .eq('id', req.user.id)
      .single();
      
    if (user && !error) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
