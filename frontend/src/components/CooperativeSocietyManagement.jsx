import { useState, useEffect } from 'react';
import { fetchCooperativeSocietys, createCooperativeSociety, updateCooperativeSociety, deleteCooperativeSociety } from '../services/api';

const CooperativeSocietyManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({ societyId: '', societyName: '', registrationDate: '', street: '', city: '', state: '', pin: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCooperativeSocietys();
            setRecords(data);
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
            societyId: record.societyId !== null && record.societyId !== undefined ? record.societyId : '',
            societyName: record.societyName !== null && record.societyName !== undefined ? record.societyName : '',
            registrationDate: record.registrationDate !== null && record.registrationDate !== undefined ? record.registrationDate : '',
            street: record.street !== null && record.street !== undefined ? record.street : '',
            city: record.city !== null && record.city !== undefined ? record.city : '',
            state: record.state !== null && record.state !== undefined ? record.state : '',
            pin: record.pin !== null && record.pin !== undefined ? record.pin : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditingRecord(null);
        setFormData({ societyId: '', societyName: '', registrationDate: '', street: '', city: '', state: '', pin: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            societyId: formData.societyId ? (isNaN(Number(formData.societyId)) ? formData.societyId : Number(formData.societyId)) : null,
            societyName: formData.societyName || null,
            registrationDate: formData.registrationDate || null,
            street: formData.street || null,
            city: formData.city || null,
            state: formData.state || null,
            pin: formData.pin || null,
        };

        try {
            if (editingRecord) {
                await updateCooperativeSociety(editingRecord.societyId, dataToSend);
                setSuccess('CooperativeSociety updated successfully!');
            } else {
                await createCooperativeSociety(dataToSend);
                setSuccess('CooperativeSociety added successfully!');
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
            await deleteCooperativeSociety(record.societyId);
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
            <h2>Cooperative Society Management</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', padding: '10px', border: '1px solid green', backgroundColor: '#e6ffe6' }}>{success}</div>}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>{editingRecord ? 'Edit Record' : 'Add New Record'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Society ID:</label><br/>
                        <input type="number" step="1" name="societyId" value={formData.societyId} onChange={handleChange} required disabled={editingRecord !== null} style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Society Name:</label><br/>
                        <input type="text" name="societyName" value={formData.societyName} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Registration Date:</label><br/>
                        <input type="date" name="registrationDate" value={formData.registrationDate} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Street:</label><br/>
                        <input type="text" name="street" value={formData.street} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>City:</label><br/>
                        <input type="text" name="city" value={formData.city} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>State:</label><br/>
                        <input type="text" name="state" value={formData.state} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>PIN:</label><br/>
                        <input type="text" name="pin" value={formData.pin} onChange={handleChange}  style={{width: '100%'}}/>
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
                            <th style={{ padding: '8px' }}>Society ID</th>
                            <th style={{ padding: '8px' }}>Society Name</th>
                            <th style={{ padding: '8px' }}>Registration Date</th>
                            <th style={{ padding: '8px' }}>Street</th>
                            <th style={{ padding: '8px' }}>City</th>
                            <th style={{ padding: '8px' }}>State</th>
                            <th style={{ padding: '8px' }}>PIN</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: '8px' }}>{r.societyId}</td>
                                <td style={{ padding: '8px' }}>{r.societyName}</td>
                                <td style={{ padding: '8px' }}>{r.registrationDate}</td>
                                <td style={{ padding: '8px' }}>{r.street}</td>
                                <td style={{ padding: '8px' }}>{r.city}</td>
                                <td style={{ padding: '8px' }}>{r.state}</td>
                                <td style={{ padding: '8px' }}>{r.pin}</td>
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

export default CooperativeSocietyManagement;
