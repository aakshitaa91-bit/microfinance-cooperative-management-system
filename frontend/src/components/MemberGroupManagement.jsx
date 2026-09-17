import { useState, useEffect } from 'react';
import { fetchMemberGroups, createMemberGroup, updateMemberGroup, deleteMemberGroup, fetchMembers, fetchCooperativeGroups } from '../services/api';

const MemberGroupManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [fkMembers, setFkMembers] = useState([]);
    const [fkCooperativeGroups, setFkCooperativeGroups] = useState([]);
    const [formData, setFormData] = useState({ memberId: '', groupId: '', role: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchMemberGroups();
            setRecords(data);
            setFkMembers(await fetchMembers());
            setFkCooperativeGroups(await fetchCooperativeGroups());
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
            groupId: record.groupId !== null && record.groupId !== undefined ? record.groupId : '',
            role: record.role !== null && record.role !== undefined ? record.role : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditingRecord(null);
        setFormData({ memberId: '', groupId: '', role: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            memberId: formData.memberId ? (isNaN(Number(formData.memberId)) ? formData.memberId : Number(formData.memberId)) : null,
            groupId: formData.groupId ? (isNaN(Number(formData.groupId)) ? formData.groupId : Number(formData.groupId)) : null,
            role: formData.role || null,
        };

        try {
            if (editingRecord) {
                await updateMemberGroup(editingRecord.memberId, editingRecord.groupId, dataToSend);
                setSuccess('MemberGroup updated successfully!');
            } else {
                await createMemberGroup(dataToSend);
                setSuccess('MemberGroup added successfully!');
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
            await deleteMemberGroup(record.memberId, record.groupId);
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
            <h2>Member Group Management</h2>
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
                        <label>Group:</label><br/>
                        <select name="groupId" value={formData.groupId} onChange={handleChange} required style={{width: '100%'}}>
                            <option value="">-- Select Group --</option>
                            {fkCooperativeGroups.map(fk => (
                                <option key={fk.groupId} value={fk.groupId}>
                                    {fk.groupId} - {fk.groupName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Role:</label><br/>
                        <input type="text" name="role" value={formData.role} onChange={handleChange}  style={{width: '100%'}}/>
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
                            <th style={{ padding: '8px' }}>Group</th>
                            <th style={{ padding: '8px' }}>Role</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: '8px' }}>{r.memberId}</td>
                                <td style={{ padding: '8px' }}>{r.groupId}</td>
                                <td style={{ padding: '8px' }}>{r.role}</td>
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

export default MemberGroupManagement;
