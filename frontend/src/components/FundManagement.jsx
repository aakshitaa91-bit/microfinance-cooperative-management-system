import { useState, useEffect } from 'react';
import { fetchFunds, createFund, updateFund, deleteFund } from '../services/api';

const FundManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({ fundId: '', fundType: '', totalAmount: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFunds();
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
            fundId: record.fundId !== null && record.fundId !== undefined ? record.fundId : '',
            fundType: record.fundType !== null && record.fundType !== undefined ? record.fundType : '',
            totalAmount: record.totalAmount !== null && record.totalAmount !== undefined ? record.totalAmount : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditingRecord(null);
        setFormData({ fundId: '', fundType: '', totalAmount: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            fundId: formData.fundId ? (isNaN(Number(formData.fundId)) ? formData.fundId : Number(formData.fundId)) : null,
            fundType: formData.fundType || null,
            totalAmount: formData.totalAmount ? (isNaN(Number(formData.totalAmount)) ? formData.totalAmount : Number(formData.totalAmount)) : null,
        };

        try {
            if (editingRecord) {
                await updateFund(editingRecord.fundId, dataToSend);
                setSuccess('Fund updated successfully!');
            } else {
                await createFund(dataToSend);
                setSuccess('Fund added successfully!');
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
            await deleteFund(record.fundId);
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
            <h2>Fund Management</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', padding: '10px', border: '1px solid green', backgroundColor: '#e6ffe6' }}>{success}</div>}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>{editingRecord ? 'Edit Record' : 'Add New Record'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Fund ID:</label><br/>
                        <input type="number" step="1" name="fundId" value={formData.fundId} onChange={handleChange} required disabled={editingRecord !== null} style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Fund Type:</label><br/>
                        <input type="text" name="fundType" value={formData.fundType} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Total Amount:</label><br/>
                        <input type="number" step="0.01" name="totalAmount" value={formData.totalAmount} onChange={handleChange}  style={{width: '100%'}}/>
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
                            <th style={{ padding: '8px' }}>Fund ID</th>
                            <th style={{ padding: '8px' }}>Fund Type</th>
                            <th style={{ padding: '8px' }}>Total Amount</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: '8px' }}>{r.fundId}</td>
                                <td style={{ padding: '8px' }}>{r.fundType}</td>
                                <td style={{ padding: '8px' }}>{r.totalAmount}</td>
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

export default FundManagement;
