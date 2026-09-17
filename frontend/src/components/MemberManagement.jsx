import { useState, useEffect } from 'react';
import { fetchMembers, createMember, updateMember, deleteMember } from '../services/api';

const MemberManagement = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingMember, setEditingMember] = useState(null);

    const [formData, setFormData] = useState({
        memberId: '',
        name: '',
        dateOfBirth: '',
        houseNo: '',
        street: '',
        city: '',
        state: '',
        pin: ''
    });

    const loadMembers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchMembers();
            setMembers(data);
        } catch (err) {
            setError(err.message || 'Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (member) => {
        setEditingMember(member.memberId);
        setFormData({
            memberId: member.memberId || '',
            name: member.name || '',
            dateOfBirth: member.dateOfBirth || '',
            houseNo: member.houseNo || '',
            street: member.street || '',
            city: member.city || '',
            state: member.state || '',
            pin: member.pin || ''
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditingMember(null);
        setFormData({
            memberId: '', name: '', dateOfBirth: '', houseNo: '', street: '', city: '', state: '', pin: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            memberId: parseInt(formData.memberId),
            name: formData.name,
            dateOfBirth: formData.dateOfBirth || null,
            houseNo: formData.houseNo,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pin: formData.pin
        };

        try {
            if (editingMember) {
                await updateMember(editingMember, dataToSend);
                setSuccess('Member updated successfully!');
            } else {
                await createMember(dataToSend);
                setSuccess('Member added successfully!');
            }
            handleCancelEdit();
            await loadMembers();
        } catch (err) {
            setError(err.message || 'Failed to save member');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this member?')) return;
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            await deleteMember(id);
            setSuccess('Member deleted successfully!');
            await loadMembers();
        } catch (err) {
            setError(err.message || 'Failed to delete member');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Member Management</h2>

            {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', padding: '10px', border: '1px solid green', backgroundColor: '#e6ffe6' }}>{success}</div>}
            
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Member ID (Integer):</label><br/>
                        <input type="number" name="memberId" value={formData.memberId} onChange={handleChange} required disabled={editingMember !== null} style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Name:</label><br/>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required maxLength="100" style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Date of Birth:</label><br/>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>House No:</label><br/>
                        <input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} maxLength="20" style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Street:</label><br/>
                        <input type="text" name="street" value={formData.street} onChange={handleChange} maxLength="100" style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>City:</label><br/>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} maxLength="50" style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>State:</label><br/>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} maxLength="50" style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>PIN:</label><br/>
                        <input type="text" name="pin" value={formData.pin} onChange={handleChange} maxLength="10" style={{width: '100%'}}/>
                    </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                    <button type="submit" disabled={loading} style={{ marginRight: '10px' }}>
                        {loading ? 'Saving...' : (editingMember ? 'Update Member' : 'Add Member')}
                    </button>
                    {editingMember && (
                        <button type="button" onClick={handleCancelEdit} disabled={loading}>Cancel</button>
                    )}
                </div>
            </form>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Existing Members</h3>
                <button onClick={loadMembers} disabled={loading}>Refresh</button>
            </div>

            {loading && !members.length ? <p>Loading...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border="1">
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '8px' }}>ID</th>
                            <th style={{ padding: '8px' }}>Name</th>
                            <th style={{ padding: '8px' }}>DOB</th>
                            <th style={{ padding: '8px' }}>House No</th>
                            <th style={{ padding: '8px' }}>Street</th>
                            <th style={{ padding: '8px' }}>City</th>
                            <th style={{ padding: '8px' }}>State</th>
                            <th style={{ padding: '8px' }}>PIN</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.length === 0 ? (
                            <tr><td colSpan="9" style={{ textAlign: 'center', padding: '10px' }}>No members found.</td></tr>
                        ) : members.map(m => (
                            <tr key={m.memberId}>
                                <td style={{ padding: '8px' }}>{m.memberId}</td>
                                <td style={{ padding: '8px' }}>{m.name}</td>
                                <td style={{ padding: '8px' }}>{m.dateOfBirth}</td>
                                <td style={{ padding: '8px' }}>{m.houseNo}</td>
                                <td style={{ padding: '8px' }}>{m.street}</td>
                                <td style={{ padding: '8px' }}>{m.city}</td>
                                <td style={{ padding: '8px' }}>{m.state}</td>
                                <td style={{ padding: '8px' }}>{m.pin}</td>
                                <td style={{ padding: '8px' }}>
                                    <button onClick={() => handleEdit(m)} style={{ marginRight: '5px' }}>Edit</button>
                                    <button onClick={() => handleDelete(m.memberId)} style={{ color: 'red' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MemberManagement;
