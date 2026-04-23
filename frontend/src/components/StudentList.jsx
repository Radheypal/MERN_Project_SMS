import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    const res = await axios.get('/api/students', getHeaders());
    setStudents(res.data);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    await axios.delete(`/api/students/${id}`, getHeaders());
    fetchStudents();
  };

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>All Students</h3>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td>{s.rollNo || '-'}</td>
                <td>{s.name}</td>
                <td>{s.class || '-'}</td>
                <td>{s.email}</td>
                <td>{s.phone || '-'}</td>
                <td>
                  <button
                    onClick={() => navigate(`/edit/${s._id}`)}
                    style={{ background: '#3498db', color: '#fff', marginRight: '8px' }}
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    style={{ background: '#e74c3c', color: '#fff' }}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
