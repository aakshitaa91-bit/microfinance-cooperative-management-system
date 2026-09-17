import { useState, useEffect } from 'react';
import { fetchStaffPhones, createStaffPhone, updateStaffPhone, deleteStaffPhone, fetchStaffs } from '../services/api';

const StaffPhoneManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [fkStaffs, setFkStaffs] = useState([]);
    const [formData, setFormData] = useState({ staffId: '', phoneNo: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchStaffPhones();
            setRecords(data);
            setFkStaffs(await fetchStaffs());
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
            staffId: record.staffId !== null && record.staffId !== undefined ? record.staffId : '',
            phoneNo: record.phoneNo !== null && record.phoneNo !== undefined ? record.phoneNo : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditingRecord(null);
        setFormData({ staffId: '', phoneNo: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            staffId: formData.staffId ? (isNaN(Number(formData.staffId)) ? formData.staffId : Number(formData.staffId)) : null,
            phoneNo: formData.phoneNo || null,
        };

        try {
            if (editingRecord) {
                await updateStaffPhone(editingRecord.staffId, editingRecord.phoneNo, dataToSend);
                setSuccess('StaffPhone updated successfully!');
            } else {
                await createStaffPhone(dataToSend);
                setSuccess('StaffPhone added successfully!');
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
            await deleteStaffPhone(record.staffId, record.phoneNo);
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
            <h2>Staff Phone Management</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', padding: '10px', border: '1px solid green', backgroundColor: '#e6ffe6' }}>{success}</div>}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>{editingRecord ? 'Edit Record' : 'Add New Record'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Staff:</label><br/>
                        <select name="staffId" value={formData.staffId} onChange={handleChange} required style={{width: '100%'}}>
                            <option value="">-- Select Staff --</option>
                            {fkStaffs.map(fk => (
                                <option key={fk.staffId} value={fk.staffId}>
                                    {fk.staffId} - {fk.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Phone No:</label><br/>
                        <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required style={{width: '100%'}}/>
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
                            <th style={{ padding: '8px' }}>Staff</th>
                            <th style={{ padding: '8px' }}>Phone No</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: '8px' }}>{r.staffId}</td>
                                <td style={{ padding: '8px' }}>{r.phoneNo}</td>
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

export default StaffPhoneManagement;
