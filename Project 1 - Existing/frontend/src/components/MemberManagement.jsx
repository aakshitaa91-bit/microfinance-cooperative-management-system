import { useState, useEffect } from 'react';
import { fetchMembers, createMember, updateMember, deleteMember } from '../services/api';

const MemberManagement = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
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
            setLastRefreshed(new Date().toLocaleTimeString());
        } catch (err) {
            setError('Unable to load records.');
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
        setShowForm(true);
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
        setShowForm(false);
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
            setShowForm(false);
            await loadMembers();
        } catch (err) {
            setError(err.message || 'Failed to save member');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setRecordToDelete(id);
    };

    const handleDelete = async () => {
        if (!recordToDelete) return;
        const id = recordToDelete;
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
        <div className="module-container">
            <div className="module-header">
                <div className="module-title-section">
                    <h2>Member Management</h2>
                    <p>Manage registered members and their information.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add Member'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            {showForm && (
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                <h3>{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
                
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Member ID (Integer):</label>
                        <input type="number" name="memberId" value={formData.memberId} onChange={handleChange} required disabled={editingMember !== null} className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required maxLength="100" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Date of Birth:</label>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">House No:</label>
                        <input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} maxLength="20" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Street:</label>
                        <input type="text" name="street" value={formData.street} onChange={handleChange} maxLength="100" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">City:</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} maxLength="50" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">State:</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} maxLength="50" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">PIN:</label>
                        <input type="text" name="pin" value={formData.pin} onChange={handleChange} maxLength="10" className="form-input" />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : (editingMember ? 'Update Member' : 'Add Member')}
                    </button>
                    {editingMember && (
                        <button type="button" className="btn-secondary" onClick={handleCancelEdit} disabled={loading}>Cancel</button>
                    )}
                </div>
                           </form>
            </div>
        )}

            <div className="module-header" style={{ marginTop: '30px', borderBottom: 'none' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Existing Members</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {lastRefreshed && <span style={{ fontSize: '0.85em', color: '#666' }}>Last refreshed: {lastRefreshed}</span>}
                    <button className="btn-secondary" onClick={() => { loadMembers() }} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
                </div>
            </div>

            {loading && !members.length ? <div className="status-message">Loading records...</div> : (
                <div className="table-wrapper">
                <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th >ID</th>
                            <th >Name</th>
                            <th >DOB</th>
                            <th >House No</th>
                            <th >Street</th>
                            <th >City</th>
                            <th >State</th>
                            <th >PIN</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.length === 0 ? (
                            <tr><td colSpan="9" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : members.map(m => (
                            <tr key={m.memberId}>
                                <td >{m.memberId}</td>
                                <td >{m.name}</td>
                                <td >{m.dateOfBirth}</td>
                                <td >{m.houseNo}</td>
                                <td >{m.street}</td>
                                <td >{m.city}</td>
                                <td >{m.state}</td>
                                <td >{m.pin}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-text-edit" onClick={() => handleEdit(m)}>[Edit]</button>
                                        <button className="btn-text-delete" onClick={() => confirmDelete(m.memberId)}>[Delete]</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                </div>
            )}
        
            {recordToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this record?</p>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setRecordToDelete(null)}>Cancel</button>
                            <button className="btn-danger" onClick={() => { handleDelete(); setRecordToDelete(null); }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberManagement;
