import { useState, useEffect } from 'react';
import { fetchRepayments, createRepayment, updateRepayment, deleteRepayment, fetchLoans } from '../services/api';

const RepaymentManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [fkLoans, setFkLoans] = useState([]);
    const [formData, setFormData] = useState({ loanId: '', repaymentNo: '', paymentDate: '', amountPaid: '', modeOfPayment: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchRepayments();
            setRecords(data);
            setFkLoans(await fetchLoans());
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
            repaymentNo: record.repaymentNo !== null && record.repaymentNo !== undefined ? record.repaymentNo : '',
            paymentDate: record.paymentDate !== null && record.paymentDate !== undefined ? record.paymentDate : '',
            amountPaid: record.amountPaid !== null && record.amountPaid !== undefined ? record.amountPaid : '',
            modeOfPayment: record.modeOfPayment !== null && record.modeOfPayment !== undefined ? record.modeOfPayment : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditingRecord(null);
        setFormData({ loanId: '', repaymentNo: '', paymentDate: '', amountPaid: '', modeOfPayment: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            loanId: formData.loanId ? (isNaN(Number(formData.loanId)) ? formData.loanId : Number(formData.loanId)) : null,
            repaymentNo: formData.repaymentNo ? (isNaN(Number(formData.repaymentNo)) ? formData.repaymentNo : Number(formData.repaymentNo)) : null,
            paymentDate: formData.paymentDate || null,
            amountPaid: formData.amountPaid ? (isNaN(Number(formData.amountPaid)) ? formData.amountPaid : Number(formData.amountPaid)) : null,
            modeOfPayment: formData.modeOfPayment || null,
        };

        try {
            if (editingRecord) {
                await updateRepayment(editingRecord.loanId, editingRecord.repaymentNo, dataToSend);
                setSuccess('Repayment updated successfully!');
            } else {
                await createRepayment(dataToSend);
                setSuccess('Repayment added successfully!');
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
            await deleteRepayment(record.loanId, record.repaymentNo);
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
            <h2>Repayment Management</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', padding: '10px', border: '1px solid green', backgroundColor: '#e6ffe6' }}>{success}</div>}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>{editingRecord ? 'Edit Record' : 'Add New Record'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Loan:</label><br/>
                        <select name="loanId" value={formData.loanId} onChange={handleChange} required style={{width: '100%'}}>
                            <option value="">-- Select Loan --</option>
                            {fkLoans.map(fk => (
                                <option key={fk.loanId} value={fk.loanId}>
                                    {fk.loanId} - {fk.loanId}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Repayment No:</label><br/>
                        <input type="number" step="1" name="repaymentNo" value={formData.repaymentNo} onChange={handleChange} required style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Payment Date:</label><br/>
                        <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Amount Paid:</label><br/>
                        <input type="number" step="0.01" name="amountPaid" value={formData.amountPaid} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Mode of Payment:</label><br/>
                        <input type="text" name="modeOfPayment" value={formData.modeOfPayment} onChange={handleChange}  style={{width: '100%'}}/>
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
                            <th style={{ padding: '8px' }}>Loan</th>
                            <th style={{ padding: '8px' }}>Repayment No</th>
                            <th style={{ padding: '8px' }}>Payment Date</th>
                            <th style={{ padding: '8px' }}>Amount Paid</th>
                            <th style={{ padding: '8px' }}>Mode of Payment</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: '8px' }}>{r.loanId}</td>
                                <td style={{ padding: '8px' }}>{r.repaymentNo}</td>
                                <td style={{ padding: '8px' }}>{r.paymentDate}</td>
                                <td style={{ padding: '8px' }}>{r.amountPaid}</td>
                                <td style={{ padding: '8px' }}>{r.modeOfPayment}</td>
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

export default RepaymentManagement;
