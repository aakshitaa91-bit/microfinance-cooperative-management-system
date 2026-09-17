import { useState, useEffect } from 'react';
import { fetchCooperativeGroups, createCooperativeGroup, updateCooperativeGroup, deleteCooperativeGroup, fetchCooperativeSocietys, fetchVillageAreas } from '../services/api';

const CooperativeGroupManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [fkCooperativeSocietys, setFkCooperativeSocietys] = useState([]);
    const [fkVillageAreas, setFkVillageAreas] = useState([]);
    const [formData, setFormData] = useState({ groupId: '', societyId: '', groupName: '', forwardDate: '', villageArea: '', city: '', state: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCooperativeGroups();
            setRecords(data);
            setFkCooperativeSocietys(await fetchCooperativeSocietys());
            setFkVillageAreas(await fetchVillageAreas());
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
            groupId: record.groupId !== null && record.groupId !== undefined ? record.groupId : '',
            societyId: record.societyId !== null && record.societyId !== undefined ? record.societyId : '',
            groupName: record.groupName !== null && record.groupName !== undefined ? record.groupName : '',
            forwardDate: record.forwardDate !== null && record.forwardDate !== undefined ? record.forwardDate : '',
            villageArea: record.villageArea !== null && record.villageArea !== undefined ? record.villageArea : '',
            city: record.city !== null && record.city !== undefined ? record.city : '',
            state: record.state !== null && record.state !== undefined ? record.state : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setEditingRecord(null);
        setFormData({ groupId: '', societyId: '', groupName: '', forwardDate: '', villageArea: '', city: '', state: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            groupId: formData.groupId ? (isNaN(Number(formData.groupId)) ? formData.groupId : Number(formData.groupId)) : null,
            societyId: formData.societyId ? (isNaN(Number(formData.societyId)) ? formData.societyId : Number(formData.societyId)) : null,
            groupName: formData.groupName || null,
            forwardDate: formData.forwardDate || null,
            villageArea: formData.villageArea ? (isNaN(Number(formData.villageArea)) ? formData.villageArea : Number(formData.villageArea)) : null,
            city: formData.city || null,
            state: formData.state || null,
        };

        try {
            if (editingRecord) {
                await updateCooperativeGroup(editingRecord.groupId, dataToSend);
                setSuccess('CooperativeGroup updated successfully!');
            } else {
                await createCooperativeGroup(dataToSend);
                setSuccess('CooperativeGroup added successfully!');
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
            await deleteCooperativeGroup(record.groupId);
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
                    <h2>Cooperative Group Management</h2>
                    <p>Manage registered cooperative groups and their information.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add Cooperative Group'}
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
                        <label className="form-label">Group ID:</label>
                        <input type="number" step="1" name="groupId" value={formData.groupId} onChange={handleChange} required disabled={editingRecord !== null} className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Society:</label>
                        <select name="societyId" value={formData.societyId} onChange={handleChange} required className="form-select" >
                            <option value="">-- Select Society --</option>
                            {fkCooperativeSocietys.map(fk => (
                                <option key={fk.societyId} value={fk.societyId}>
                                    {fk.societyId} - {fk.societyName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Group Name:</label>
                        <input type="text" name="groupName" value={formData.groupName} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Forward Date:</label>
                        <input type="date" name="forwardDate" value={formData.forwardDate} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Village Area:</label>
                        <select name="villageArea" value={formData.villageArea} onChange={handleChange} required className="form-select" >
                            <option value="">-- Select Village Area --</option>
                            {fkVillageAreas.map(fk => (
                                <option key={fk.villageArea} value={fk.villageArea}>
                                    {fk.villageArea} - {fk.villageArea}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">City:</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">State:</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange}  className="form-input" />
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
                <h3 className="section-title" style={{ margin: 0 }}>Existing Cooperative Groups</h3>
                <button className="btn-secondary" onClick={() => { loadData() }} disabled={loading}>Refresh</button>
            </div>
            {loading && !records.length ? <div className="status-message">Loading cooperative groups...</div> : (
                <div className="table-wrapper">
                <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th >Group ID</th>
                            <th >Society</th>
                            <th >Group Name</th>
                            <th >Forward Date</th>
                            <th >Village Area</th>
                            <th >City</th>
                            <th >State</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td >{r.groupId}</td>
                                <td >{r.societyId}</td>
                                <td >{r.groupName}</td>
                                <td >{r.forwardDate}</td>
                                <td >{r.villageArea}</td>
                                <td >{r.city}</td>
                                <td >{r.state}</td>
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

export default CooperativeGroupManagement;
