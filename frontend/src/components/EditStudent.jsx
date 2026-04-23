import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export default function EditStudent() {
  const [form, setForm] = useState({ name: '', email: '', rollNo: '', class: '', phone: '' });
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/students', getHeaders()).then(res => {
      const student = res.data.find(s => s._id === id);
      if (student) setForm(student);
    });
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`/api/students/${id}`, form, getHeaders());
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div style={styles.card}>
      <h3>Edit Student</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
        <label>Roll No</label>
        <input name="rollNo" value={form.rollNo || ''} onChange={handleChange} />
        <label>Class</label>
        <input name="class" value={form.class || ''} onChange={handleChange} />
        <label>Phone</label>
        <input name="phone" value={form.phone || ''} onChange={handleChange} />
        <button type="submit" style={{ background: '#3498db', color: '#fff' }}>Update Student</button>
      </form>
    </div>
  );
}

const styles = {
  card: { background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '500px' }
};
