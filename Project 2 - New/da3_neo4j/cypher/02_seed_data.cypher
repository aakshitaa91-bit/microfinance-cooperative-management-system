// ==============================================================================
// DA3: MICROFINANCE AND COOPERATIVE SOCIETY MANAGEMENT SYSTEM
// SCRIPT: 02_seed_data.cypher
// DATABASE: CooperativeDA3 (Neo4j Desktop)
//
// SOURCE OF TRUTH:
// D:\cooperative_extended\cooperative\database\cooperative_db.sql (Lines 290-500)
//
// DESIGN PRINCIPLES:
// 1. Strict Idempotency: Uses `MERGE` on unique business keys so running this
//    script multiple times never generates duplicate nodes or relationships.
// 2. 100% Data Fidelity: Preserves all original values, dates, amounts, and foreign
//    key relationships without inventing or omitting any records.
// 3. Multi-Valued Attributes: MEMBER_PHONE and STAFF_PHONE records are converted
//    into native string list properties (e.g., `phoneNumbers: ['...', '...']`).
// 4. M:N Junction Tables: MEMBERSHIP, MEMBER_GROUP, and LOAN_FUND become directed
//    edges with their original associative attributes.
// 5. Non-Destructive: Contains NO `DELETE` or `DETACH DELETE` commands.
// ==============================================================================

// ==============================================================================
// 1. VILLAGE AREAS (Source: VILLAGE_AREA - 5 records)
// ==============================================================================
MERGE (v:VillageArea {villageArea: 'Anna Nagar Village'})
SET v.pin = '600001';

MERGE (v:VillageArea {villageArea: 'Gandhi Village'})
SET v.pin = '600002';

MERGE (v:VillageArea {villageArea: 'Temple Village'})
SET v.pin = '625001';

MERGE (v:VillageArea {villageArea: 'Main Road Village'})
SET v.pin = '641001';

MERGE (v:VillageArea {villageArea: 'Lake View Village'})
SET v.pin = '636001';


// ==============================================================================
// 2. COOPERATIVE SOCIETIES (Source: COOPERATIVE_SOCIETY - 3 records)
// ==============================================================================
MERGE (s:CooperativeSociety {societyId: 101})
SET s.societyName = 'Chennai Farmers Cooperative',
    s.registrationDate = date('2020-01-15'),
    s.street = 'Mount Road',
    s.city = 'Chennai',
    s.state = 'Tamil Nadu',
    s.pin = '600003';

MERGE (s:CooperativeSociety {societyId: 102})
SET s.societyName = 'Madurai Rural Cooperative',
    s.registrationDate = date('2019-06-20'),
    s.street = 'Main Bazaar',
    s.city = 'Madurai',
    s.state = 'Tamil Nadu',
    s.pin = '625002';

MERGE (s:CooperativeSociety {societyId: 103})
SET s.societyName = 'Coimbatore Workers Cooperative',
    s.registrationDate = date('2021-03-10'),
    s.street = 'RS Puram',
    s.city = 'Coimbatore',
    s.state = 'Tamil Nadu',
    s.pin = '641002';


// ==============================================================================
// 3. MEMBERS AND PHONE NUMBERS
// Source: MEMBER (5 records) + MEMBER_PHONE (6 records)
// Member 1 has two phone numbers in original SQL; others have one.
// ==============================================================================
MERGE (m:Member {memberId: 1})
SET m.name = 'Akshita',
    m.dateOfBirth = date('2005-05-15'),
    m.houseNo = '12',
    m.street = 'Anna Street',
    m.city = 'Chennai',
    m.state = 'Tamil Nadu',
    m.pin = '600001',
    m.phoneNumbers = ['9876543210', '9123456780'];

MERGE (m:Member {memberId: 2})
SET m.name = 'Rahul',
    m.dateOfBirth = date('2004-08-20'),
    m.houseNo = '25',
    m.street = 'Gandhi Street',
    m.city = 'Chennai',
    m.state = 'Tamil Nadu',
    m.pin = '600002',
    m.phoneNumbers = ['9876501234'];

MERGE (m:Member {memberId: 3})
SET m.name = 'Priya',
    m.dateOfBirth = date('2005-01-10'),
    m.houseNo = '18',
    m.street = 'Temple Road',
    m.city = 'Madurai',
    m.state = 'Tamil Nadu',
    m.pin = '625001',
    m.phoneNumbers = ['9988776655'];

MERGE (m:Member {memberId: 4})
SET m.name = 'Arjun',
    m.dateOfBirth = date('2003-11-25'),
    m.houseNo = '42',
    m.street = 'Main Road',
    m.city = 'Coimbatore',
    m.state = 'Tamil Nadu',
    m.pin = '641001',
    m.phoneNumbers = ['9090909090'];

MERGE (m:Member {memberId: 5})
SET m.name = 'Sneha',
    m.dateOfBirth = date('2004-06-18'),
    m.houseNo = '7',
    m.street = 'Lake View Road',
    m.city = 'Salem',
    m.state = 'Tamil Nadu',
    m.pin = '636001',
    m.phoneNumbers = ['9555555555'];


// ==============================================================================
// 4. STAFF AND PHONE NUMBERS
// Source: STAFF (5 records) + STAFF_PHONE (5 records)
// ==============================================================================
MERGE (st:Staff {staffId: 201})
SET st.name = 'Ramesh',
    st.designation = 'Manager',
    st.street = 'Park Street',
    st.city = 'Chennai',
    st.state = 'Tamil Nadu',
    st.pin = '600004',
    st.phoneNumbers = ['9000000001'];

MERGE (st:Staff {staffId: 202})
SET st.name = 'Kumar',
    st.designation = 'Accountant',
    st.street = 'Gandhi Road',
    st.city = 'Madurai',
    st.state = 'Tamil Nadu',
    st.pin = '625003',
    st.phoneNumbers = ['9000000002'];

MERGE (st:Staff {staffId: 203})
SET st.name = 'Divya',
    st.designation = 'Clerk',
    st.street = 'Nehru Street',
    st.city = 'Coimbatore',
    st.state = 'Tamil Nadu',
    st.pin = '641003',
    st.phoneNumbers = ['9000000003'];

MERGE (st:Staff {staffId: 204})
SET st.name = 'Meena',
    st.designation = 'Loan Officer',
    st.street = 'Market Road',
    st.city = 'Salem',
    st.state = 'Tamil Nadu',
    st.pin = '636002',
    st.phoneNumbers = ['9000000004'];

MERGE (st:Staff {staffId: 205})
SET st.name = 'Suresh',
    st.designation = 'Field Officer',
    st.street = 'Temple Street',
    st.city = 'Chennai',
    st.state = 'Tamil Nadu',
    st.pin = '600005',
    st.phoneNumbers = ['9000000005'];


// ==============================================================================
// 5. FUNDS (Source: FUND - 5 records)
// ==============================================================================
MERGE (f:Fund {fundId: 301})
SET f.fundType = 'Government Fund',
    f.totalAmount = 500000.00;

MERGE (f:Fund {fundId: 302})
SET f.fundType = 'Member Contribution',
    f.totalAmount = 250000.00;

MERGE (f:Fund {fundId: 303})
SET f.fundType = 'Agriculture Fund',
    f.totalAmount = 400000.00;

MERGE (f:Fund {fundId: 304})
SET f.fundType = 'Emergency Fund',
    f.totalAmount = 150000.00;

MERGE (f:Fund {fundId: 305})
SET f.fundType = 'Women Empowerment Fund',
    f.totalAmount = 300000.00;


// ==============================================================================
// 6. MEMBERSHIP (Source: MEMBERSHIP junction table - 5 records)
// Connects Member to CooperativeSociety with `joinDate` attribute
// ==============================================================================
MATCH (m:Member {memberId: 1}), (s:CooperativeSociety {societyId: 101})
MERGE (m)-[r:MEMBER_OF]->(s)
SET r.joinDate = date('2022-01-10');

MATCH (m:Member {memberId: 2}), (s:CooperativeSociety {societyId: 101})
MERGE (m)-[r:MEMBER_OF]->(s)
SET r.joinDate = date('2022-03-15');

MATCH (m:Member {memberId: 3}), (s:CooperativeSociety {societyId: 102})
MERGE (m)-[r:MEMBER_OF]->(s)
SET r.joinDate = date('2022-05-20');

MATCH (m:Member {memberId: 4}), (s:CooperativeSociety {societyId: 103})
MERGE (m)-[r:MEMBER_OF]->(s)
SET r.joinDate = date('2023-01-12');

MATCH (m:Member {memberId: 5}), (s:CooperativeSociety {societyId: 101})
MERGE (m)-[r:MEMBER_OF]->(s)
SET r.joinDate = date('2023-04-18');


// ==============================================================================
// 7. COOPERATIVE GROUPS (Source: COOPERATIVE_GROUP - 4 records)
// In relational SQL, Group had foreign keys to SocietyID and VillageArea.
// In graph, Group is a node connected via AFFILIATED_TO and OPERATES_IN edges.
// ==============================================================================
MERGE (g:CooperativeGroup {groupId: 401})
SET g.groupName = 'Anna Farmers Group',
    g.forwardDate = date('2022-02-01'),
    g.city = 'Chennai',
    g.state = 'Tamil Nadu';

MERGE (g:CooperativeGroup {groupId: 402})
SET g.groupName = 'Gandhi Women Group',
    g.forwardDate = date('2022-04-10'),
    g.city = 'Chennai',
    g.state = 'Tamil Nadu';

MERGE (g:CooperativeGroup {groupId: 403})
SET g.groupName = 'Temple Farmers Group',
    g.forwardDate = date('2022-06-15'),
    g.city = 'Madurai',
    g.state = 'Tamil Nadu';

MERGE (g:CooperativeGroup {groupId: 404})
SET g.groupName = 'Main Road Workers Group',
    g.forwardDate = date('2023-02-20'),
    g.city = 'Coimbatore',
    g.state = 'Tamil Nadu';

// Group -> Society Relationships
MATCH (g:CooperativeGroup {groupId: 401}), (s:CooperativeSociety {societyId: 101})
MERGE (g)-[:AFFILIATED_TO]->(s);

MATCH (g:CooperativeGroup {groupId: 402}), (s:CooperativeSociety {societyId: 101})
MERGE (g)-[:AFFILIATED_TO]->(s);

MATCH (g:CooperativeGroup {groupId: 403}), (s:CooperativeSociety {societyId: 102})
MERGE (g)-[:AFFILIATED_TO]->(s);

MATCH (g:CooperativeGroup {groupId: 404}), (s:CooperativeSociety {societyId: 103})
MERGE (g)-[:AFFILIATED_TO]->(s);

// Group -> VillageArea Relationships
MATCH (g:CooperativeGroup {groupId: 401}), (v:VillageArea {villageArea: 'Anna Nagar Village'})
MERGE (g)-[:OPERATES_IN]->(v);

MATCH (g:CooperativeGroup {groupId: 402}), (v:VillageArea {villageArea: 'Gandhi Village'})
MERGE (g)-[:OPERATES_IN]->(v);

MATCH (g:CooperativeGroup {groupId: 403}), (v:VillageArea {villageArea: 'Temple Village'})
MERGE (g)-[:OPERATES_IN]->(v);

MATCH (g:CooperativeGroup {groupId: 404}), (v:VillageArea {villageArea: 'Main Road Village'})
MERGE (g)-[:OPERATES_IN]->(v);


// ==============================================================================
// 8. MEMBER GROUP (Source: MEMBER_GROUP junction table - 5 records)
// Connects Member to CooperativeGroup with `role` attribute
// ==============================================================================
MATCH (m:Member {memberId: 1}), (g:CooperativeGroup {groupId: 401})
MERGE (m)-[r:BELONGS_TO]->(g)
SET r.role = 'Leader';

MATCH (m:Member {memberId: 2}), (g:CooperativeGroup {groupId: 401})
MERGE (m)-[r:BELONGS_TO]->(g)
SET r.role = 'Member';

MATCH (m:Member {memberId: 5}), (g:CooperativeGroup {groupId: 402})
MERGE (m)-[r:BELONGS_TO]->(g)
SET r.role = 'Leader';

MATCH (m:Member {memberId: 3}), (g:CooperativeGroup {groupId: 403})
MERGE (m)-[r:BELONGS_TO]->(g)
SET r.role = 'Member';

MATCH (m:Member {memberId: 4}), (g:CooperativeGroup {groupId: 404})
MERGE (m)-[r:BELONGS_TO]->(g)
SET r.role = 'Leader';


// ==============================================================================
// 9. SAVINGS ACCOUNTS & NOMINEES (Source: SAVINGS_ACCOUNT - 5 records)
// In relational SQL, MemberID was account owner and NomineeID was a self-FK to Member.
// In graph, Member HOLDS_ACCOUNT and Account HAS_NOMINEE to another Member.
// ==============================================================================
MERGE (a:SavingsAccount {accountNo: 100001})
SET a.openingDate = date('2022-01-15'),
    a.accountType = 'Regular';

MERGE (a:SavingsAccount {accountNo: 100002})
SET a.openingDate = date('2022-03-20'),
    a.accountType = 'Regular';

MERGE (a:SavingsAccount {accountNo: 100003})
SET a.openingDate = date('2022-06-01'),
    a.accountType = 'Premium';

MERGE (a:SavingsAccount {accountNo: 100004})
SET a.openingDate = date('2023-01-20'),
    a.accountType = 'Regular';

MERGE (a:SavingsAccount {accountNo: 100005})
SET a.openingDate = date('2023-05-01'),
    a.accountType = 'Premium';

// Member -> SavingsAccount (Ownership)
MATCH (m:Member {memberId: 1}), (a:SavingsAccount {accountNo: 100001})
MERGE (m)-[:HOLDS_ACCOUNT]->(a);

MATCH (m:Member {memberId: 2}), (a:SavingsAccount {accountNo: 100002})
MERGE (m)-[:HOLDS_ACCOUNT]->(a);

MATCH (m:Member {memberId: 3}), (a:SavingsAccount {accountNo: 100003})
MERGE (m)-[:HOLDS_ACCOUNT]->(a);

MATCH (m:Member {memberId: 4}), (a:SavingsAccount {accountNo: 100004})
MERGE (m)-[:HOLDS_ACCOUNT]->(a);

MATCH (m:Member {memberId: 5}), (a:SavingsAccount {accountNo: 100005})
MERGE (m)-[:HOLDS_ACCOUNT]->(a);

// SavingsAccount -> Member (Nominee Relationship)
// Note: Nominee IDs from SQL:
// Account 100001 -> Nominee 2
// Account 100002 -> Nominee 1
// Account 100003 -> Nominee 4
// Account 100004 -> Nominee 5
// Account 100005 -> Nominee 3
MATCH (a:SavingsAccount {accountNo: 100001}), (nominee:Member {memberId: 2})
MERGE (a)-[:HAS_NOMINEE]->(nominee);

MATCH (a:SavingsAccount {accountNo: 100002}), (nominee:Member {memberId: 1})
MERGE (a)-[:HAS_NOMINEE]->(nominee);

MATCH (a:SavingsAccount {accountNo: 100003}), (nominee:Member {memberId: 4})
MERGE (a)-[:HAS_NOMINEE]->(nominee);

MATCH (a:SavingsAccount {accountNo: 100004}), (nominee:Member {memberId: 5})
MERGE (a)-[:HAS_NOMINEE]->(nominee);

MATCH (a:SavingsAccount {accountNo: 100005}), (nominee:Member {memberId: 3})
MERGE (a)-[:HAS_NOMINEE]->(nominee);


// ==============================================================================
// 10. LOANS (Source: LOAN - 5 records)
// In relational SQL, MemberID was a foreign key.
// In graph, Member BORROWED Loan.
// ==============================================================================
MERGE (l:Loan {loanId: 501})
SET l.loanType = 'Agriculture Loan',
    l.amount = 100000.00,
    l.startDate = date('2023-01-10'),
    l.tenure = 24;

MERGE (l:Loan {loanId: 502})
SET l.loanType = 'Business Loan',
    l.amount = 150000.00,
    l.startDate = date('2023-02-15'),
    l.tenure = 36;

MERGE (l:Loan {loanId: 503})
SET l.loanType = 'Education Loan',
    l.amount = 80000.00,
    l.startDate = date('2023-03-20'),
    l.tenure = 24;

MERGE (l:Loan {loanId: 504})
SET l.loanType = 'Housing Loan',
    l.amount = 250000.00,
    l.startDate = date('2023-04-10'),
    l.tenure = 48;

MERGE (l:Loan {loanId: 505})
SET l.loanType = 'Women Enterprise Loan',
    l.amount = 120000.00,
    l.startDate = date('2023-05-15'),
    l.tenure = 36;

// Member -> Loan Relationships
MATCH (m:Member {memberId: 1}), (l:Loan {loanId: 501})
MERGE (m)-[:BORROWED]->(l);

MATCH (m:Member {memberId: 2}), (l:Loan {loanId: 502})
MERGE (m)-[:BORROWED]->(l);

MATCH (m:Member {memberId: 3}), (l:Loan {loanId: 503})
MERGE (m)-[:BORROWED]->(l);

MATCH (m:Member {memberId: 4}), (l:Loan {loanId: 504})
MERGE (m)-[:BORROWED]->(l);

MATCH (m:Member {memberId: 5}), (l:Loan {loanId: 505})
MERGE (m)-[:BORROWED]->(l);


// ==============================================================================
// 11. LOAN FUND (Source: LOAN_FUND junction table - 5 records)
// In relational SQL: (501, 303), (502, 302), (503, 301), (504, 304), (505, 305)
// In graph: Loan FINANCED_BY Fund
// ==============================================================================
MATCH (l:Loan {loanId: 501}), (f:Fund {fundId: 303})
MERGE (l)-[:FINANCED_BY]->(f);

MATCH (l:Loan {loanId: 502}), (f:Fund {fundId: 302})
MERGE (l)-[:FINANCED_BY]->(f);

MATCH (l:Loan {loanId: 503}), (f:Fund {fundId: 301})
MERGE (l)-[:FINANCED_BY]->(f);

MATCH (l:Loan {loanId: 504}), (f:Fund {fundId: 304})
MERGE (l)-[:FINANCED_BY]->(f);

MATCH (l:Loan {loanId: 505}), (f:Fund {fundId: 305})
MERGE (l)-[:FINANCED_BY]->(f);


// ==============================================================================
// 12. REPAYMENT (Source: REPAYMENT - 7 records)
// Weak entity in MySQL: (LoanID, RepaymentNo)
// In graph: Loan HAS_REPAYMENT Repayment
// ==============================================================================
MERGE (r:Repayment {repaymentId: '501-1'})
SET r.loanId = 501,
    r.repaymentNo = 1,
    r.paymentDate = date('2023-02-10'),
    r.amountPaid = 5000.00,
    r.modeOfPayment = 'Cash';

MERGE (r:Repayment {repaymentId: '501-2'})
SET r.loanId = 501,
    r.repaymentNo = 2,
    r.paymentDate = date('2023-03-10'),
    r.amountPaid = 5000.00,
    r.modeOfPayment = 'UPI';

MERGE (r:Repayment {repaymentId: '502-1'})
SET r.loanId = 502,
    r.repaymentNo = 1,
    r.paymentDate = date('2023-03-15'),
    r.amountPaid = 7000.00,
    r.modeOfPayment = 'Bank Transfer';

MERGE (r:Repayment {repaymentId: '502-2'})
SET r.loanId = 502,
    r.repaymentNo = 2,
    r.paymentDate = date('2023-04-15'),
    r.amountPaid = 7000.00,
    r.modeOfPayment = 'UPI';

MERGE (r:Repayment {repaymentId: '503-1'})
SET r.loanId = 503,
    r.repaymentNo = 1,
    r.paymentDate = date('2023-04-20'),
    r.amountPaid = 4000.00,
    r.modeOfPayment = 'Cash';

MERGE (r:Repayment {repaymentId: '504-1'})
SET r.loanId = 504,
    r.repaymentNo = 1,
    r.paymentDate = date('2023-05-10'),
    r.amountPaid = 6000.00,
    r.modeOfPayment = 'Bank Transfer';

MERGE (r:Repayment {repaymentId: '505-1'})
SET r.loanId = 505,
    r.repaymentNo = 1,
    r.paymentDate = date('2023-06-15'),
    r.amountPaid = 5000.00,
    r.modeOfPayment = 'UPI';

// Loan -> Repayment Relationships
MATCH (l:Loan {loanId: 501}), (r:Repayment {repaymentId: '501-1'})
MERGE (l)-[:HAS_REPAYMENT]->(r);

MATCH (l:Loan {loanId: 501}), (r:Repayment {repaymentId: '501-2'})
MERGE (l)-[:HAS_REPAYMENT]->(r);

MATCH (l:Loan {loanId: 502}), (r:Repayment {repaymentId: '502-1'})
MERGE (l)-[:HAS_REPAYMENT]->(r);

MATCH (l:Loan {loanId: 502}), (r:Repayment {repaymentId: '502-2'})
MERGE (l)-[:HAS_REPAYMENT]->(r);

MATCH (l:Loan {loanId: 503}), (r:Repayment {repaymentId: '503-1'})
MERGE (l)-[:HAS_REPAYMENT]->(r);

MATCH (l:Loan {loanId: 504}), (r:Repayment {repaymentId: '504-1'})
MERGE (l)-[:HAS_REPAYMENT]->(r);

MATCH (l:Loan {loanId: 505}), (r:Repayment {repaymentId: '505-1'})
MERGE (l)-[:HAS_REPAYMENT]->(r);


// ==============================================================================
// VERIFICATION QUERIES:
// Run these in Neo4j Browser after seeding to verify all entity counts:
// ==============================================================================

// 1. Node counts by Label (Matches relational table counts)
MATCH (n)
RETURN labels(n)[0] AS Entity, count(n) AS TotalCount
ORDER BY Entity;

// 2. Relationship counts by Type
MATCH ()-[r]->()
RETURN type(r) AS RelationshipType, count(r) AS TotalCount
ORDER BY RelationshipType;
