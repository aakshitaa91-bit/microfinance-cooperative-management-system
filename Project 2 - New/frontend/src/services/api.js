export const API_BASE_URL = 'http://localhost:8081/api';

export const fetchDashboardSummary = async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
    if (!response.ok) throw new Error('Failed to fetch dashboard summary');
    return response.json();
};

export const fetchMembers = async () => {
    const response = await fetch(`${API_BASE_URL}/members`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createMember = async (data) => {
    const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateMember = async (memberId, data) => {
    const response = await fetch(`${API_BASE_URL}/members/${encodeURIComponent(memberId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteMember = async (memberId) => {
    const response = await fetch(`${API_BASE_URL}/members/${encodeURIComponent(memberId)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

export const fetchCooperativeSocietys = async () => {
    const response = await fetch(`${API_BASE_URL}/societies`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createCooperativeSociety = async (data) => {
    const response = await fetch(`${API_BASE_URL}/societies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateCooperativeSociety = async (societyId, data) => {
    const response = await fetch(`${API_BASE_URL}/societies/${encodeURIComponent(societyId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteCooperativeSociety = async (societyId) => {
    const response = await fetch(`${API_BASE_URL}/societies/${encodeURIComponent(societyId)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

export const fetchVillageAreas = async () => {
    const response = await fetch(`${API_BASE_URL}/village-areas`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createVillageArea = async (data) => {
    const response = await fetch(`${API_BASE_URL}/village-areas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateVillageArea = async (villageArea, data) => {
    const response = await fetch(`${API_BASE_URL}/village-areas/${encodeURIComponent(villageArea)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteVillageArea = async (villageArea) => {
    const response = await fetch(`${API_BASE_URL}/village-areas/${encodeURIComponent(villageArea)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

export const fetchStaffs = async () => {
    const response = await fetch(`${API_BASE_URL}/staff`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createStaff = async (data) => {
    const response = await fetch(`${API_BASE_URL}/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateStaff = async (staffId, data) => {
    const response = await fetch(`${API_BASE_URL}/staff/${encodeURIComponent(staffId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteStaff = async (staffId) => {
    const response = await fetch(`${API_BASE_URL}/staff/${encodeURIComponent(staffId)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

export const fetchFunds = async () => {
    const response = await fetch(`${API_BASE_URL}/funds`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createFund = async (data) => {
    const response = await fetch(`${API_BASE_URL}/funds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateFund = async (fundId, data) => {
    const response = await fetch(`${API_BASE_URL}/funds/${encodeURIComponent(fundId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteFund = async (fundId) => {
    const response = await fetch(`${API_BASE_URL}/funds/${encodeURIComponent(fundId)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

export const fetchSavingsAccounts = async () => {
    const response = await fetch(`${API_BASE_URL}/savings-accounts`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createSavingsAccount = async (data) => {
    const response = await fetch(`${API_BASE_URL}/savings-accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateSavingsAccount = async (accountNo, data) => {
    const response = await fetch(`${API_BASE_URL}/savings-accounts/${encodeURIComponent(accountNo)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteSavingsAccount = async (accountNo) => {
    const response = await fetch(`${API_BASE_URL}/savings-accounts/${encodeURIComponent(accountNo)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

export const fetchLoans = async () => {
    const response = await fetch(`${API_BASE_URL}/loans`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createLoan = async (data) => {
    const response = await fetch(`${API_BASE_URL}/loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateLoan = async (loanId, data) => {
    const response = await fetch(`${API_BASE_URL}/loans/${encodeURIComponent(loanId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteLoan = async (loanId) => {
    const response = await fetch(`${API_BASE_URL}/loans/${encodeURIComponent(loanId)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

export const fetchRepayments = async () => {
    const response = await fetch(`${API_BASE_URL}/repayments`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createRepayment = async (data) => {
    const response = await fetch(`${API_BASE_URL}/repayments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateRepayment = async (loanId, repaymentNo, data) => {
    const response = await fetch(`${API_BASE_URL}/repayments/${encodeURIComponent(loanId)}/${encodeURIComponent(repaymentNo)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteRepayment = async (loanId, repaymentNo) => {
    const response = await fetch(`${API_BASE_URL}/repayments/${encodeURIComponent(loanId)}/${encodeURIComponent(repaymentNo)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

export const fetchMemberPhones = async () => {
    const response = await fetch(`${API_BASE_URL}/member-phones`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createMemberPhone = async (data) => {
    const response = await fetch(`${API_BASE_URL}/member-phones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateMemberPhone = async (memberId, phoneNo, data) => {
    const response = await fetch(`${API_BASE_URL}/member-phones/${encodeURIComponent(memberId)}/${encodeURIComponent(phoneNo)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteMemberPhone = async (memberId, phoneNo) => {
    const response = await fetch(`${API_BASE_URL}/member-phones/${encodeURIComponent(memberId)}/${encodeURIComponent(phoneNo)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

export const fetchMemberships = async () => {
    const response = await fetch(`${API_BASE_URL}/memberships`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createMembership = async (data) => {
    const response = await fetch(`${API_BASE_URL}/memberships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateMembership = async (memberId, societyId, data) => {
    const response = await fetch(`${API_BASE_URL}/memberships/${encodeURIComponent(memberId)}/${encodeURIComponent(societyId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteMembership = async (memberId, societyId) => {
    const response = await fetch(`${API_BASE_URL}/memberships/${encodeURIComponent(memberId)}/${encodeURIComponent(societyId)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

export const fetchCooperativeGroups = async () => {
    const response = await fetch(`${API_BASE_URL}/groups`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createCooperativeGroup = async (data) => {
    const response = await fetch(`${API_BASE_URL}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateCooperativeGroup = async (groupId, data) => {
    const response = await fetch(`${API_BASE_URL}/groups/${encodeURIComponent(groupId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteCooperativeGroup = async (groupId) => {
    const response = await fetch(`${API_BASE_URL}/groups/${encodeURIComponent(groupId)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

export const fetchMemberGroups = async () => {
    const response = await fetch(`${API_BASE_URL}/member-groups`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createMemberGroup = async (data) => {
    const response = await fetch(`${API_BASE_URL}/member-groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateMemberGroup = async (memberId, groupId, data) => {
    const response = await fetch(`${API_BASE_URL}/member-groups/${encodeURIComponent(memberId)}/${encodeURIComponent(groupId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteMemberGroup = async (memberId, groupId) => {
    const response = await fetch(`${API_BASE_URL}/member-groups/${encodeURIComponent(memberId)}/${encodeURIComponent(groupId)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

export const fetchLoanFunds = async () => {
    const response = await fetch(`${API_BASE_URL}/loan-funds`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createLoanFund = async (data) => {
    const response = await fetch(`${API_BASE_URL}/loan-funds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateLoanFund = async (loanId, fundId, data) => {
    const response = await fetch(`${API_BASE_URL}/loan-funds/${encodeURIComponent(loanId)}/${encodeURIComponent(fundId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteLoanFund = async (loanId, fundId) => {
    const response = await fetch(`${API_BASE_URL}/loan-funds/${encodeURIComponent(loanId)}/${encodeURIComponent(fundId)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

export const fetchStaffPhones = async () => {
    const response = await fetch(`${API_BASE_URL}/staff-phones`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};

export const createStaffPhone = async (data) => {
    const response = await fetch(`${API_BASE_URL}/staff-phones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
};

export const updateStaffPhone = async (staffId, phoneNo, data) => {
    const response = await fetch(`${API_BASE_URL}/staff-phones/${encodeURIComponent(staffId)}/${encodeURIComponent(phoneNo)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
};

export const deleteStaffPhone = async (staffId, phoneNo) => {
    const response = await fetch(`${API_BASE_URL}/staff-phones/${encodeURIComponent(staffId)}/${encodeURIComponent(phoneNo)}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
};

// ==========================================
// DA3: Neo4j Graph Database Endpoints
// ==========================================

export const fetchGraphHealth = async () => {
    const response = await fetch(`${API_BASE_URL}/graph/health`);
    if (!response.ok) throw new Error('Failed to fetch Neo4j health status');
    return response.json();
};

export const fetchGraphStatistics = async () => {
    const response = await fetch(`${API_BASE_URL}/graph/statistics`);
    if (!response.ok) throw new Error('Failed to fetch graph statistics');
    return response.json();
};

export const fetchRuralCreditFlow = async (fundId = 303) => {
    const response = await fetch(`${API_BASE_URL}/graph/queries/rural-credit-flow?fundId=${encodeURIComponent(fundId)}`);
    if (!response.ok) throw new Error('Failed to fetch rural credit flow');
    return response.json();
};

export const fetchCircularNominees = async () => {
    const response = await fetch(`${API_BASE_URL}/graph/queries/circular-nominees`);
    if (!response.ok) throw new Error('Failed to fetch circular nominees');
    return response.json();
};

export const fetchGroupRiskExposure = async () => {
    const response = await fetch(`${API_BASE_URL}/graph/queries/group-risk-exposure`);
    if (!response.ok) throw new Error('Failed to fetch group risk exposure');
    return response.json();
};

export const fetchShortestPath = async (member1Id = 1, member2Id = 3) => {
    const response = await fetch(`${API_BASE_URL}/graph/queries/shortest-path?member1Id=${encodeURIComponent(member1Id)}&member2Id=${encodeURIComponent(member2Id)}`);
    if (!response.ok) {
        let msg = 'Failed to compute shortest path';
        try {
            const err = await response.json();
            if (err.details || err.error || err.message) {
                msg = err.details || err.error || err.message;
            }
        } catch (_) {}
        throw new Error(msg);
    }
    return response.json();
};

export const fetchVillagePerformance = async () => {
    const response = await fetch(`${API_BASE_URL}/graph/queries/village-performance`);
    if (!response.ok) throw new Error('Failed to fetch village performance');
    return response.json();
};

export const fetchMultiPhoneMembers = async () => {
    const response = await fetch(`${API_BASE_URL}/graph/queries/multi-phone-members`);
    if (!response.ok) throw new Error('Failed to fetch multi-phone members');
    return response.json();
};

export const fetchGraphVisualization = async (limit = 100) => {
    const response = await fetch(`${API_BASE_URL}/graph/visualization?limit=${encodeURIComponent(limit)}`);
    if (!response.ok) throw new Error('Failed to fetch graph visualization data');
    return response.json();
};


