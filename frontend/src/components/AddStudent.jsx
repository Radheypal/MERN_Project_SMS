import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const initialState = { name: '', email: '', rollNo: '', class: '', phone: '' };

export default function AddStudent() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/students', form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.card}>
      <h3>Add New Student</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
        <label>Roll No</label>
        <input name="rollNo" value={form.rollNo} onChange={handleChange} required />
        <label>Class</label>
        <input name="class" value={form.class} onChange={handleChange} required />
        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
        <button type="submit" style={{ background: '#27ae60', color: '#fff' }}>Add Student</button>
      </form>
    </div>
  );
}

const styles = {
  card: { background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '500px' }
};
