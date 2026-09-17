import { useState, useEffect } from 'react';
import { fetchSavingsAccounts, createSavingsAccount, updateSavingsAccount, deleteSavingsAccount, fetchMembers } from '../services/api';

const SavingsAccountManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [fkMembers, setFkMembers] = useState([]);
    const [formData, setFormData] = useState({ accountNo: '', memberId: '', openingDate: '', accountType: '', nomineeId: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchSavingsAccounts();
            setRecords(data);
            setFkMembers(await fetchMembers());
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
            accountNo: record.accountNo !== null && record.accountNo !== undefined ? record.accountNo : '',
            memberId: record.memberId !== null && record.memberId !== undefined ? record.memberId : '',
            openingDate: record.openingDate !== null && record.openingDate !== undefined ? record.openingDate : '',
            accountType: record.accountType !== null && record.accountType !== undefined ? record.accountType : '',
            nomineeId: record.nomineeId !== null && record.nomineeId !== undefined ? record.nomineeId : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditingRecord(null);
        setFormData({ accountNo: '', memberId: '', openingDate: '', accountType: '', nomineeId: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            accountNo: formData.accountNo ? (isNaN(Number(formData.accountNo)) ? formData.accountNo : Number(formData.accountNo)) : null,
            memberId: formData.memberId ? (isNaN(Number(formData.memberId)) ? formData.memberId : Number(formData.memberId)) : null,
            openingDate: formData.openingDate || null,
            accountType: formData.accountType || null,
            nomineeId: formData.nomineeId ? Number(formData.nomineeId) : null,
        };

        try {
            if (editingRecord) {
                await updateSavingsAccount(editingRecord.accountNo, dataToSend);
                setSuccess('SavingsAccount updated successfully!');
            } else {
                await createSavingsAccount(dataToSend);
                setSuccess('SavingsAccount added successfully!');
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
            await deleteSavingsAccount(record.accountNo);
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
            <h2>Savings Account Management</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', padding: '10px', border: '1px solid green', backgroundColor: '#e6ffe6' }}>{success}</div>}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>{editingRecord ? 'Edit Record' : 'Add New Record'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Account No:</label><br/>
                        <input type="number" step="1" name="accountNo" value={formData.accountNo} onChange={handleChange} required disabled={editingRecord !== null} style={{width: '100%'}}/>
                    </div>
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
                        <label>Opening Date:</label><br/>
                        <input type="date" name="openingDate" value={formData.openingDate} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Account Type:</label><br/>
                        <input type="text" name="accountType" value={formData.accountType} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Nominee (Optional):</label><br/>
                        <select name="nomineeId" value={formData.nomineeId} onChange={handleChange}  style={{width: '100%'}}>
                            <option value="">-- Select Nominee (Optional) --</option>
                            {fkMembers.map(fk => (
                                <option key={fk.memberId} value={fk.memberId}>
                                    {fk.memberId} - {fk.name}
                                </option>
                            ))}
                        </select>
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
                            <th style={{ padding: '8px' }}>Account No</th>
                            <th style={{ padding: '8px' }}>Member</th>
                            <th style={{ padding: '8px' }}>Opening Date</th>
                            <th style={{ padding: '8px' }}>Account Type</th>
                            <th style={{ padding: '8px' }}>Nominee (Optional)</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: '8px' }}>{r.accountNo}</td>
                                <td style={{ padding: '8px' }}>{r.memberId}</td>
                                <td style={{ padding: '8px' }}>{r.openingDate}</td>
                                <td style={{ padding: '8px' }}>{r.accountType}</td>
                                <td style={{ padding: '8px' }}>{r.nomineeId}</td>
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

export default SavingsAccountManagement;
