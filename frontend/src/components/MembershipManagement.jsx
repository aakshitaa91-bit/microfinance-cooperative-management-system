import { useState, useEffect } from 'react';
import { fetchMemberships, createMembership, updateMembership, deleteMembership, fetchMembers, fetchCooperativeSocietys } from '../services/api';

const MembershipManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [fkMembers, setFkMembers] = useState([]);
    const [fkCooperativeSocietys, setFkCooperativeSocietys] = useState([]);
    const [formData, setFormData] = useState({ memberId: '', societyId: '', joinDate: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchMemberships();
            setRecords(data);
            setFkMembers(await fetchMembers());
            setFkCooperativeSocietys(await fetchCooperativeSocietys());
        } catch (err) {
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setFormData({
            memberId: record.memberId !== null && record.memberId !== undefined ? record.memberId : '',
            societyId: record.societyId !== null && record.societyId !== undefined ? record.societyId : '',
            joinDate: record.joinDate !== null && record.joinDate !== undefined ? record.joinDate : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditingRecord(null);
        setFormData({ memberId: '', societyId: '', joinDate: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            memberId: formData.memberId ? (isNaN(Number(formData.memberId)) ? formData.memberId : Number(formData.memberId)) : null,
            societyId: formData.societyId ? (isNaN(Number(formData.societyId)) ? formData.societyId : Number(formData.societyId)) : null,
            joinDate: formData.joinDate || null,
        };

        try {
            if (editingRecord) {
                await updateMembership(editingRecord.memberId, editingRecord.societyId, dataToSend);
                setSuccess('Membership updated successfully!');
            } else {
                await createMembership(dataToSend);
                setSuccess('Membership added successfully!');
            }
            handleCancelEdit();
            await loadData();
        } catch (err) {
            setError(err.message || 'Failed to save');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (record) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            await deleteMembership(record.memberId, record.societyId);
            setSuccess('Record deleted successfully!');
            await loadData();
        } catch (err) {
            setError(err.message || 'Failed to delete');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Membership Management</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', padding: '10px', border: '1px solid green', backgroundColor: '#e6ffe6' }}>{success}</div>}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>{editingRecord ? 'Edit Record' : 'Add New Record'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Member:</label><br/>
                        <select name="memberId" value={formData.memberId} onChange={handleChange} required style={{width: '100%'}}>
                            <option value="">-- Select Member --</option>
                            {fkMembers.map(fk => (
                                <option key={fk.memberId} value={fk.memberId}>
                                    {fk.memberId} - {fk.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Society:</label><br/>
                        <select name="societyId" value={formData.societyId} onChange={handleChange} required style={{width: '100%'}}>
                            <option value="">-- Select Society --</option>
                            {fkCooperativeSocietys.map(fk => (
                                <option key={fk.societyId} value={fk.societyId}>
                                    {fk.societyId} - {fk.societyName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Join Date:</label><br/>
                        <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                </div>
                <div style={{ marginTop: '15px' }}>
                    <button type="submit" disabled={loading} style={{ marginRight: '10px' }}>{loading ? 'Saving...' : (editingRecord ? 'Update' : 'Add')}</button>
                    {editingRecord && <button type="button" onClick={handleCancelEdit} disabled={loading}>Cancel</button>}
                </div>
            </form>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Existing Records</h3>
                <button onClick={loadData} disabled={loading}>Refresh</button>
            </div>
            {loading && !records.length ? <p>Loading...</p> : (
                <div style={{overflowX: 'auto'}}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border="1">
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '8px' }}>Member</th>
                            <th style={{ padding: '8px' }}>Society</th>
                            <th style={{ padding: '8px' }}>Join Date</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: '8px' }}>{r.memberId}</td>
                                <td style={{ padding: '8px' }}>{r.societyId}</td>
                                <td style={{ padding: '8px' }}>{r.joinDate}</td>
                                <td style={{ padding: '8px' }}>
                                    <button onClick={() => handleEdit(r)} style={{ marginRight: '5px' }}>Edit</button>
                                    <button onClick={() => handleDelete(r)} style={{ color: 'red' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            )}
        </div>
    );
};

export default MembershipManagement;
