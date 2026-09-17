import { useState, useEffect } from 'react';
import { fetchLoans, createLoan, updateLoan, deleteLoan, fetchMembers } from '../services/api';

const LoanManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [fkMembers, setFkMembers] = useState([]);
    const [formData, setFormData] = useState({ loanId: '', memberId: '', loanType: '', amount: '', startDate: '', tenure: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchLoans();
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
            loanId: record.loanId !== null && record.loanId !== undefined ? record.loanId : '',
            memberId: record.memberId !== null && record.memberId !== undefined ? record.memberId : '',
            loanType: record.loanType !== null && record.loanType !== undefined ? record.loanType : '',
            amount: record.amount !== null && record.amount !== undefined ? record.amount : '',
            startDate: record.startDate !== null && record.startDate !== undefined ? record.startDate : '',
            tenure: record.tenure !== null && record.tenure !== undefined ? record.tenure : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditingRecord(null);
        setFormData({ loanId: '', memberId: '', loanType: '', amount: '', startDate: '', tenure: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            loanId: formData.loanId ? (isNaN(Number(formData.loanId)) ? formData.loanId : Number(formData.loanId)) : null,
            memberId: formData.memberId ? (isNaN(Number(formData.memberId)) ? formData.memberId : Number(formData.memberId)) : null,
            loanType: formData.loanType || null,
            amount: formData.amount ? (isNaN(Number(formData.amount)) ? formData.amount : Number(formData.amount)) : null,
            startDate: formData.startDate || null,
            tenure: formData.tenure ? (isNaN(Number(formData.tenure)) ? formData.tenure : Number(formData.tenure)) : null,
        };

        try {
            if (editingRecord) {
                await updateLoan(editingRecord.loanId, dataToSend);
                setSuccess('Loan updated successfully!');
            } else {
                await createLoan(dataToSend);
                setSuccess('Loan added successfully!');
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
            await deleteLoan(record.loanId);
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
            <h2>Loan Management</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', padding: '10px', border: '1px solid green', backgroundColor: '#e6ffe6' }}>{success}</div>}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>{editingRecord ? 'Edit Record' : 'Add New Record'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Loan ID:</label><br/>
                        <input type="number" step="1" name="loanId" value={formData.loanId} onChange={handleChange} required disabled={editingRecord !== null} style={{width: '100%'}}/>
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
                        <label>Loan Type:</label><br/>
                        <input type="text" name="loanType" value={formData.loanType} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Amount:</label><br/>
                        <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Start Date:</label><br/>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Tenure (Months):</label><br/>
                        <input type="number" step="1" name="tenure" value={formData.tenure} onChange={handleChange}  style={{width: '100%'}}/>
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
                            <th style={{ padding: '8px' }}>Loan ID</th>
                            <th style={{ padding: '8px' }}>Member</th>
                            <th style={{ padding: '8px' }}>Loan Type</th>
                            <th style={{ padding: '8px' }}>Amount</th>
                            <th style={{ padding: '8px' }}>Start Date</th>
                            <th style={{ padding: '8px' }}>Tenure (Months)</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: '8px' }}>{r.loanId}</td>
                                <td style={{ padding: '8px' }}>{r.memberId}</td>
                                <td style={{ padding: '8px' }}>{r.loanType}</td>
                                <td style={{ padding: '8px' }}>{r.amount}</td>
                                <td style={{ padding: '8px' }}>{r.startDate}</td>
                                <td style={{ padding: '8px' }}>{r.tenure}</td>
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

export default LoanManagement;
