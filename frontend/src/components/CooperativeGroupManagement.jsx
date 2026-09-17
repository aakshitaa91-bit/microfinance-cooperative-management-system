import { useState, useEffect } from 'react';
import { fetchCooperativeGroups, createCooperativeGroup, updateCooperativeGroup, deleteCooperativeGroup, fetchCooperativeSocietys, fetchVillageAreas } from '../services/api';

const CooperativeGroupManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Cooperative Group Management</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', padding: '10px', border: '1px solid green', backgroundColor: '#e6ffe6' }}>{success}</div>}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>{editingRecord ? 'Edit Record' : 'Add New Record'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Group ID:</label><br/>
                        <input type="number" step="1" name="groupId" value={formData.groupId} onChange={handleChange} required disabled={editingRecord !== null} style={{width: '100%'}}/>
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
                        <label>Group Name:</label><br/>
                        <input type="text" name="groupName" value={formData.groupName} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Forward Date:</label><br/>
                        <input type="date" name="forwardDate" value={formData.forwardDate} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>Village Area:</label><br/>
                        <select name="villageArea" value={formData.villageArea} onChange={handleChange} required style={{width: '100%'}}>
                            <option value="">-- Select Village Area --</option>
                            {fkVillageAreas.map(fk => (
                                <option key={fk.villageArea} value={fk.villageArea}>
                                    {fk.villageArea} - {fk.villageArea}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>City:</label><br/>
                        <input type="text" name="city" value={formData.city} onChange={handleChange}  style={{width: '100%'}}/>
                    </div>
                    <div>
                        <label>State:</label><br/>
                        <input type="text" name="state" value={formData.state} onChange={handleChange}  style={{width: '100%'}}/>
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
                            <th style={{ padding: '8px' }}>Group ID</th>
                            <th style={{ padding: '8px' }}>Society</th>
                            <th style={{ padding: '8px' }}>Group Name</th>
                            <th style={{ padding: '8px' }}>Forward Date</th>
                            <th style={{ padding: '8px' }}>Village Area</th>
                            <th style={{ padding: '8px' }}>City</th>
                            <th style={{ padding: '8px' }}>State</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: '8px' }}>{r.groupId}</td>
                                <td style={{ padding: '8px' }}>{r.societyId}</td>
                                <td style={{ padding: '8px' }}>{r.groupName}</td>
                                <td style={{ padding: '8px' }}>{r.forwardDate}</td>
                                <td style={{ padding: '8px' }}>{r.villageArea}</td>
                                <td style={{ padding: '8px' }}>{r.city}</td>
                                <td style={{ padding: '8px' }}>{r.state}</td>
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

export default CooperativeGroupManagement;
