// ==============================================================================
// DA3: MICROFINANCE AND COOPERATIVE SOCIETY MANAGEMENT SYSTEM
// SCRIPT: 03_crud_operations.cypher
// DATABASE: CooperativeDA3 (Neo4j Desktop)
//
// PURPOSE:
// Demonstrates standard CRUD (Create, Read, Update, Delete) operations in Neo4j
// Cypher for academic evaluation by your DBMS faculty.
//
// DEMO SAFETY GUARANTEE:
// - All Read and Update operations target existing records cleanly.
// - All Delete operations use a DEDICATED DEMO RECORD (Member 999) created
//   specifically for testing, ensuring original records (IDs 1-5) remain intact.
// - Every operation includes an immediate verification query to view the result.
// ==============================================================================


// ==============================================================================
// 1. CREATE OPERATIONS (C in CRUD)
// ==============================================================================

// ------------------------------------------------------------------------------
// Scenario C1: Register a new Member with phone list and link to a Society
// Demonstrates atomic entity creation and relationship establishment in one query.
// ------------------------------------------------------------------------------
MERGE (m:Member {memberId: 999})
SET m.name = 'Karthik Demo',
    m.dateOfBirth = date('2002-09-15'),
    m.houseNo = '88',
    m.street = 'College Road',
    m.city = 'Chennai',
    m.state = 'Tamil Nadu',
    m.pin = '600028',
    m.phoneNumbers = ['9840199999', '9840188888']
WITH m
MATCH (s:CooperativeSociety {societyId: 101})
MERGE (m)-[r:MEMBER_OF]->(s)
SET r.joinDate = date('2024-01-10')
RETURN m.memberId AS NewMemberID, m.name AS Name, m.phoneNumbers AS Phones, s.societyName AS JoinedSociety;

// Verification Query for C1:
MATCH (m:Member {memberId: 999})-[r:MEMBER_OF]->(s:CooperativeSociety)
RETURN m.memberId, m.name, m.phoneNumbers, r.joinDate, s.societyName;


// ------------------------------------------------------------------------------
// Scenario C2: Issue a new Loan to an existing Member financed by a Fund
// Demonstrates multi-node association (Member -> Loan -> Fund).
// ------------------------------------------------------------------------------
MATCH (m:Member {memberId: 3}), (f:Fund {fundId: 305})
MERGE (l:Loan {loanId: 599})
SET l.loanType = 'Solar Equipment Loan',
    l.amount = 75000.00,
    l.startDate = date('2024-02-01'),
    l.tenure = 18
MERGE (m)-[:BORROWED]->(l)
MERGE (l)-[:FINANCED_BY]->(f)
RETURN m.name AS Borrower, l.loanId AS LoanID, l.amount AS Amount, f.fundType AS FinancedBy;

// Verification Query for C2:
MATCH (m:Member)-[:BORROWED]->(l:Loan {loanId: 599})-[:FINANCED_BY]->(f:Fund)
RETURN m.name, l.loanType, l.amount, l.tenure, f.fundType;


// ------------------------------------------------------------------------------
// Scenario C3: Record a new Repayment installment for Loan 599
// Demonstrates weak entity creation with composite key handling (repaymentId: '599-1').
// ------------------------------------------------------------------------------
MATCH (l:Loan {loanId: 599})
MERGE (r:Repayment {repaymentId: '599-1'})
SET r.loanId = 599,
    r.repaymentNo = 1,
    r.paymentDate = date('2024-03-01'),
    r.amountPaid = 4500.00,
    r.modeOfPayment = 'UPI'
MERGE (l)-[:HAS_REPAYMENT]->(r)
RETURN l.loanId AS LoanID, r.repaymentNo AS InstallmentNo, r.amountPaid AS Paid, r.modeOfPayment AS Mode;

// Verification Query for C3:
MATCH (l:Loan {loanId: 599})-[:HAS_REPAYMENT]->(r:Repayment)
RETURN l.loanId, r.repaymentNo, r.paymentDate, r.amountPaid, r.modeOfPayment;



// ==============================================================================
// 2. READ / RETRIEVE OPERATIONS (R in CRUD)
// ==============================================================================

// ------------------------------------------------------------------------------
// Scenario R1: Comprehensive 360-Degree Member Profile
// Retrieves Member details, phone list, society memberships, group roles,
// savings accounts, nominees, and active loans in a single traversal (No JOINs).
// ------------------------------------------------------------------------------
MATCH (m:Member {memberId: 1})
OPTIONAL MATCH (m)-[rSoc:MEMBER_OF]->(s:CooperativeSociety)
OPTIONAL MATCH (m)-[rGrp:BELONGS_TO]->(g:CooperativeGroup)
OPTIONAL MATCH (m)-[:HOLDS_ACCOUNT]->(a:SavingsAccount)
OPTIONAL MATCH (a)-[:HAS_NOMINEE]->(nominee:Member)
OPTIONAL MATCH (m)-[:BORROWED]->(l:Loan)
RETURN m.memberId AS ID,
       m.name AS MemberName,
       m.phoneNumbers AS Contacts,
       s.societyName AS Society,
       g.groupName AS GroupName,
       rGrp.role AS GroupRole,
       a.accountNo AS SavingsAccNo,
       nominee.name AS AccountNominee,
       l.loanType AS ActiveLoan,
       l.amount AS LoanAmount;


// ------------------------------------------------------------------------------
// Scenario R2: Retrieve all Cooperative Groups with Society and Village Details
// Demonstrates traversing from Group to both its parent Society and its Village Area.
// ------------------------------------------------------------------------------
MATCH (g:CooperativeGroup)-[:AFFILIATED_TO]->(s:CooperativeSociety)
MATCH (g)-[:OPERATES_IN]->(v:VillageArea)
OPTIONAL MATCH (m:Member)-[r:BELONGS_TO]->(g)
RETURN g.groupId AS GroupID,
       g.groupName AS GroupName,
       s.societyName AS ParentSociety,
       v.villageArea AS OperatingVillage,
       v.pin AS PostalPIN,
       count(m) AS MemberCount
ORDER BY GroupID;


// ------------------------------------------------------------------------------
// Scenario R3: Loan Repayment History Ledger
// Retrieves all repayment records for Loan 501, showing payment timeline and total paid.
// ------------------------------------------------------------------------------
MATCH (m:Member)-[:BORROWED]->(l:Loan {loanId: 501})
MATCH (l)-[:HAS_REPAYMENT]->(r:Repayment)
RETURN l.loanId AS LoanID,
       m.name AS Borrower,
       l.amount AS SanctionedAmount,
       r.repaymentNo AS Installment,
       r.paymentDate AS DatePaid,
       r.amountPaid AS Amount,
       r.modeOfPayment AS PaymentMode
ORDER BY r.repaymentNo ASC;



// ==============================================================================
// 3. UPDATE OPERATIONS (U in CRUD)
// ==============================================================================

// ------------------------------------------------------------------------------
// Scenario U1: Update Member Contact Information (Array Property Manipulation)
// Adds an additional emergency phone number to Member 1's list property.
// ------------------------------------------------------------------------------
MATCH (m:Member {memberId: 1})
SET m.phoneNumbers = m.phoneNumbers + ['9777788888']
RETURN m.memberId AS MemberID, m.name AS Name, m.phoneNumbers AS UpdatedPhoneList;

// Verification Query for U1:
MATCH (m:Member {memberId: 1})
RETURN m.name, m.phoneNumbers;


// ------------------------------------------------------------------------------
// Scenario U2: Promote Member Role within a Cooperative Group
// Modifies the property of an existing relationship (replaces SQL junction table UPDATE).
// ------------------------------------------------------------------------------
MATCH (m:Member {memberId: 2})-[r:BELONGS_TO]->(g:CooperativeGroup {groupId: 401})
SET r.role = 'Treasurer'
RETURN m.name AS MemberName, g.groupName AS GroupName, r.role AS NewRole;

// Verification Query for U2:
MATCH (m:Member {memberId: 2})-[r:BELONGS_TO]->(g:CooperativeGroup {groupId: 401})
RETURN m.name, g.groupName, r.role;


// ------------------------------------------------------------------------------
// Scenario U3: Modify Loan Terms (Tenure Extension)
// Updates the tenure of Loan 503 from 24 months to 36 months.
// ------------------------------------------------------------------------------
MATCH (l:Loan {loanId: 503})
SET l.tenure = 36
RETURN l.loanId AS LoanID, l.loanType AS Type, l.tenure AS UpdatedTenureMonths;

// Verification Query for U3:
MATCH (l:Loan {loanId: 503})
RETURN l.loanId, l.loanType, l.amount, l.tenure;



// ==============================================================================
// 4. DELETE OPERATIONS (D in CRUD - SAFE COLLEGE DEMO)
// ==============================================================================

// In relational databases (MySQL), deleting a parent row requires `ON DELETE CASCADE`
// or manual deletion of referencing foreign key rows across multiple tables.
// In Neo4j, `DETACH DELETE` removes a node along with all its incident relationships,
// preventing dangling edges.
//
// To protect your original sample data (IDs 1-5), this demo safely cleans up
// the test records (Loan 599 and Member 999) created in Section 1.

// ------------------------------------------------------------------------------
// Step D1: Inspect Demo Records Before Deletion
// ------------------------------------------------------------------------------
MATCH (m:Member {memberId: 999})
OPTIONAL MATCH (m)-[r]-()
RETURN m.memberId AS MemberToDelete, count(r) AS ConnectedEdges;

MATCH (l:Loan {loanId: 599})
OPTIONAL MATCH (l)-[r]-(connected)
RETURN l.loanId AS LoanToDelete, type(r) AS EdgeType, labels(connected)[0] AS ConnectedNodeType;


// ------------------------------------------------------------------------------
// Step D2: Safely Delete Demo Loan 599 and its Repayment Node
// Demonstrates cleaning up dependent weak entity nodes before detaching loan.
// ------------------------------------------------------------------------------
MATCH (l:Loan {loanId: 599})
OPTIONAL MATCH (l)-[:HAS_REPAYMENT]->(r:Repayment)
DETACH DELETE r, l;

// Verification of Step D2:
MATCH (l:Loan {loanId: 599})
RETURN count(l) AS DemoLoansRemaining; // Expected: 0


// ------------------------------------------------------------------------------
// Step D3: Safely Delete Demo Member 999
// Demonstrates DETACH DELETE removing the node and its [:MEMBER_OF] relationship.
// ------------------------------------------------------------------------------
MATCH (m:Member {memberId: 999})
DETACH DELETE m;

// Verification of Step D3:
MATCH (m:Member {memberId: 999})
RETURN count(m) AS DemoMembersRemaining; // Expected: 0


// ------------------------------------------------------------------------------
// Final Safety Check: Verify All Original Members (1-5) Remain 100% Intact
// ------------------------------------------------------------------------------
MATCH (m:Member)
RETURN m.memberId AS MemberID, m.name AS Name
ORDER BY m.memberId;
