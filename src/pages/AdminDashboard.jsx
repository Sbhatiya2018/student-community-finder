import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [communities, setCommunities] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Initial state with all fields
    const initialFormState = {
        name: '',
        platform: 'WhatsApp',
        link: '',
        country: '',
        field: '',
        courseType: '',
        sourceCountry: '',
        university: '',
        intake: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = () => {
        fetch('/api/communities')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data.data)) {
                    setCommunities(data.data);
                } else {
                    console.error("Invalid data format:", data);
                    setCommunities([]);
                }
            })
            .catch(err => {
                console.error(err);
                setCommunities([]);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this community?')) {
            fetch(`/api/communities/${id}`, { method: 'DELETE' })
                .then(() => fetchCommunities())
                .catch(err => console.error(err));
        }
    };

    const handleEdit = (comm) => {
        setFormData({
            name: comm.name,
            platform: comm.platform,
            link: comm.link,
            country: comm.tags.country,
            field: comm.tags.field,
            courseType: comm.tags.courseType,
            sourceCountry: comm.tags.sourceCountry || '',
            university: comm.tags.university || '',
            intake: comm.tags.intake || ''
        });
        setEditId(comm.id);
        setIsEditing(true);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditId(null);
        setShowForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            platform: formData.platform,
            link: formData.link,
            tags: {
                country: formData.country,
                field: formData.field,
                courseType: formData.courseType,
                sourceCountry: formData.sourceCountry,
                university: formData.university,
                intake: formData.intake
            }
        };

        const url = isEditing
            ? `/api/communities/${editId}`
            : '/api/communities';

        const method = isEditing ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(() => {
                resetForm();
                fetchCommunities();
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="App">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Back to Home</Link>
            </header>

            <div className="container" style={{ maxWidth: '1000px' }}>
                <div className="card fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                        <h2>Manage Communities</h2>
                        <button
                            onClick={() => {
                                if (showForm) resetForm();
                                else setShowForm(true);
                            }}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        >
                            {showForm ? 'Cancel' : '+ Add New'}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>{isEditing ? 'Edit Community' : 'New Community'}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <input placeholder="Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                <select value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value })}>
                                    <option>WhatsApp</option>
                                    <option>Discord</option>
                                    <option>Telegram</option>
                                    <option>Slack</option>
                                </select>
                                <input placeholder="Link" required value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                                <input placeholder="Destination Country" required value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
                                <input placeholder="Source Country (e.g. India)" value={formData.sourceCountry} onChange={e => setFormData({ ...formData, sourceCountry: e.target.value })} />
                                <input placeholder="University" value={formData.university} onChange={e => setFormData({ ...formData, university: e.target.value })} />
                                <input placeholder="Field (e.g. Technology)" value={formData.field} onChange={e => setFormData({ ...formData, field: e.target.value })} />
                                <input placeholder="Course Type (e.g. Masters)" value={formData.courseType} onChange={e => setFormData({ ...formData, courseType: e.target.value })} />
                                <input placeholder="Intake (e.g. Fall 2024)" value={formData.intake} onChange={e => setFormData({ ...formData, intake: e.target.value })} />
                            </div>
                            <button type="submit" style={{ width: '100%' }}>{isEditing ? 'Update Community' : 'Create Community'}</button>
                        </form>
                    )}

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <th style={{ padding: '0.75rem' }}>Name</th>
                                <th style={{ padding: '0.75rem' }}>Platform</th>
                                <th style={{ padding: '0.75rem' }}>Dest. Country</th>
                                <th style={{ padding: '0.75rem' }}>Source Country</th>
                                <th style={{ padding: '0.75rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {communities.map(comm => (
                                <tr key={comm.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <td style={{ padding: '0.75rem' }}>
                                        {comm.name}
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{comm.tags.university}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span className={`tag ${comm.platform.toLowerCase()}`} style={{ marginRight: 0 }}>
                                            {comm.platform}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>{comm.tags.country}</td>
                                    <td style={{ padding: '0.75rem' }}>{comm.tags.sourceCountry || '-'}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <button
                                            onClick={() => handleEdit(comm)}
                                            style={{
                                                backgroundColor: 'var(--primary)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                marginRight: '0.5rem'
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(comm.id)}
                                            style={{
                                                backgroundColor: '#ff4d4d',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
