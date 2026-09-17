import { useState, useEffect } from 'react';
import { fetchStaffPhones, createStaffPhone, updateStaffPhone, deleteStaffPhone, fetchStaffs } from '../services/api';

const StaffPhoneManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
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
            setError('Unable to load records.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const handleEdit = (record) => {
        setShowForm(true);
        setEditingRecord(record);
        setFormData({
            staffId: record.staffId !== null && record.staffId !== undefined ? record.staffId : '',
            phoneNo: record.phoneNo !== null && record.phoneNo !== undefined ? record.phoneNo : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setShowForm(false);
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
            setShowForm(false);
            await loadData();
        } catch (err) {
            setError(err.message || 'Failed to save');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (record) => {
        setRecordToDelete(record);
    };

    const handleDelete = async () => {
        if (!recordToDelete) return;
        const record = recordToDelete;
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
        <div className="module-container">
            <div className="module-header">
                <div className="module-title-section">
                    <h2>Staff Phone Management</h2>
                    <p>Manage registered staff phones and their information.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add Staff Phone'}
                </button>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            {showForm && (
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                <h3>{editingRecord ? 'Edit Record' : 'Add New Record'}</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Staff:</label>
                        <select name="staffId" value={formData.staffId} onChange={handleChange} required className="form-select" >
                            <option value="">-- Select Staff --</option>
                            {fkStaffs.map(fk => (
                                <option key={fk.staffId} value={fk.staffId}>
                                    {fk.staffId} - {fk.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone No:</label>
                        <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required className="form-input" />
                    </div>
                </div>
                <div className="form-actions">
                    {editingRecord ? <button type="button" className="btn-secondary" onClick={handleCancelEdit} disabled={loading}>Cancel</button> : null}
                    <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : (editingRecord ? 'Update' : 'Add')}</button>
                </div>
                           </form>
            </div>
        )}
            <div className="module-header" style={{ marginTop: '30px', borderBottom: 'none' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Existing Staff Phones</h3>
                <button className="btn-secondary" onClick={() => { loadData() }} disabled={loading}>Refresh</button>
            </div>
            {loading && !records.length ? <div className="status-message">Loading staff phones...</div> : (
                <div className="table-wrapper">
                <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th >Staff</th>
                            <th >Phone No</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td >{r.staffId}</td>
                                <td >{r.phoneNo}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-text-edit" onClick={() => handleEdit(r)}>[Edit]</button>
                                        <button className="btn-text-delete" onClick={() => confirmDelete(r)}>[Delete]</button>
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

export default StaffPhoneManagement;
