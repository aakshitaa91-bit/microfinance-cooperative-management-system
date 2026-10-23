// ==============================================================================
// DA3: MICROFINANCE AND COOPERATIVE SOCIETY MANAGEMENT SYSTEM
// SCRIPT: 05_verification.cypher
// DATABASE: CooperativeDA3 (Neo4j Desktop)
//
// PURPOSE:
// Complete verification and audit checklist for your DBMS faculty demonstration.
// Executes automated counts, structural assertions, referential integrity checks,
// and visual graph rendering queries.
//
// SOURCE OF TRUTH BENCHMARKS:
// - Total Nodes: 44
// - Node Labels: 9
// - Total Relationships: 45
// - Relationship Types: 9
// ==============================================================================


// ==============================================================================
// CHECK 1: SCHEMA CONSTRAINTS INSPECTION
// Verifies that all uniqueness constraints and backing indexes are active.
// ==============================================================================
SHOW CONSTRAINTS;


// ==============================================================================
// CHECK 2: SYSTEM-WIDE SUMMARY TOTALS
// Verifies high-level graph metrics against expected project benchmarks.
// ==============================================================================
CALL {
    MATCH (n) RETURN count(n) AS TotalNodes
}
CALL {
    MATCH ()-[r]->() RETURN count(r) AS TotalRelationships
}
RETURN TotalNodes,
       TotalRelationships,
       CASE WHEN TotalNodes = 44 THEN 'PASS: Expected 44 Nodes' ELSE 'FAIL: Node Count Mismatch' END AS NodeStatus,
       CASE WHEN TotalRelationships = 45 THEN 'PASS: Expected 45 Relationships' ELSE 'FAIL: Relationship Status' END AS RelationshipStatus;


// ==============================================================================
// CHECK 3: DETAILED NODE COUNT BREAKDOWN BY LABEL
// Must match the original table counts from cooperative_db.sql:
// Member: 5, CooperativeSociety: 3, VillageArea: 5, Staff: 5, Fund: 5,
// CooperativeGroup: 4, SavingsAccount: 5, Loan: 5, Repayment: 7 (Sum = 44)
// ==============================================================================
MATCH (n)
WITH labels(n)[0] AS EntityType, count(n) AS ActualCount
RETURN EntityType,
       ActualCount,
       CASE EntityType
           WHEN 'Member' THEN 5
           WHEN 'CooperativeSociety' THEN 3
           WHEN 'VillageArea' THEN 5
           WHEN 'Staff' THEN 5
           WHEN 'Fund' THEN 5
           WHEN 'CooperativeGroup' THEN 4
           WHEN 'SavingsAccount' THEN 5
           WHEN 'Loan' THEN 5
           WHEN 'Repayment' THEN 7
           ELSE 0
       END AS ExpectedCount,
       CASE
           WHEN EntityType = 'Member' AND ActualCount = 5 THEN 'MATCH'
           WHEN EntityType = 'CooperativeSociety' AND ActualCount = 3 THEN 'MATCH'
           WHEN EntityType = 'VillageArea' AND ActualCount = 5 THEN 'MATCH'
           WHEN EntityType = 'Staff' AND ActualCount = 5 THEN 'MATCH'
           WHEN EntityType = 'Fund' AND ActualCount = 5 THEN 'MATCH'
           WHEN EntityType = 'CooperativeGroup' AND ActualCount = 4 THEN 'MATCH'
           WHEN EntityType = 'SavingsAccount' AND ActualCount = 5 THEN 'MATCH'
           WHEN EntityType = 'Loan' AND ActualCount = 5 THEN 'MATCH'
           WHEN EntityType = 'Repayment' AND ActualCount = 7 THEN 'MATCH'
           ELSE 'MISMATCH'
       END AS Status
ORDER BY EntityType;


// ==============================================================================
// CHECK 4: RELATIONSHIP COUNT BREAKDOWN BY TYPE
// Must match original relational foreign key and junction counts:
// AFFILIATED_TO: 4 (Group -> Society)
// BELONGS_TO: 5 (Member -> Group)
// BORROWED: 5 (Member -> Loan)
// FINANCED_BY: 5 (Loan -> Fund)
// HAS_NOMINEE: 5 (Account -> Member)
// HAS_REPAYMENT: 7 (Loan -> Repayment)
// HOLDS_ACCOUNT: 5 (Member -> Account)
// MEMBER_OF: 5 (Member -> Society)
// OPERATES_IN: 4 (Group -> VillageArea)
// (Total = 45)
// ==============================================================================
MATCH ()-[r]->()
RETURN type(r) AS RelationshipType,
       count(r) AS ActualCount
ORDER BY RelationshipType;


// ==============================================================================
// CHECK 5: MEMBER INTEGRITY (IDs 1-5 Occurrence and Phone List)
// Verifies that member IDs 1 through 5 exist exactly once with their phones.
// ==============================================================================
MATCH (m:Member)
RETURN m.memberId AS MemberID,
       m.name AS Name,
       m.city AS City,
       m.phoneNumbers AS ContactNumbers,
       size(m.phoneNumbers) AS PhoneCount
ORDER BY m.memberId ASC;


// ==============================================================================
// CHECK 6: REFERENTIAL INTEGRITY / ORPHAN NODE AUDIT
// In relational databases, foreign keys prevent dangling rows.
// In graph databases, we verify that critical domain entities are properly connected.
// All queries below should return 0 rows for a healthy database.
// ==============================================================================

// 6A. Loans without a borrower (Orphan Loans)
MATCH (l:Loan)
WHERE NOT (:Member)-[:BORROWED]->(l)
RETURN count(l) AS UnassignedLoans; // Expected: 0

// 6B. Repayments not linked to any Loan (Dangling Repayments)
MATCH (r:Repayment)
WHERE NOT (:Loan)-[:HAS_REPAYMENT]->(r)
RETURN count(r) AS DanglingRepayments; // Expected: 0

// 6C. Savings Accounts without an Owner or Nominee
MATCH (a:SavingsAccount)
WHERE NOT (:Member)-[:HOLDS_ACCOUNT]->(a) OR NOT (a)-[:HAS_NOMINEE]->(:Member)
RETURN count(a) AS IncompleteAccounts; // Expected: 0

// 6D. Cooperative Groups without Society or Village Area
MATCH (g:CooperativeGroup)
WHERE NOT (g)-[:AFFILIATED_TO]->(:CooperativeSociety) OR NOT (g)-[:OPERATES_IN]->(:VillageArea)
RETURN count(g) AS DetachedGroups; // Expected: 0


// ==============================================================================
// CHECK 7: VISUAL GRAPH RENDERING QUERIES (FOR FACULTY DEMO)
// Run these in Neo4j Browser to generate stunning visual graph canvases.
// ==============================================================================

// 7A. Full Database Visual Canvas (Displays all 44 nodes and 45 edges)
MATCH (n)
RETURN n;

// 7B. Member & Account Financial Subgraph (Shows Members, Accounts, Nominees, Loans, Repayments)
MATCH (m:Member)-[r1:HOLDS_ACCOUNT]->(a:SavingsAccount)-[r2:HAS_NOMINEE]->(nom:Member)
OPTIONAL MATCH (m)-[r3:BORROWED]->(l:Loan)-[r4:HAS_REPAYMENT]->(rep:Repayment)
RETURN m, r1, a, r2, nom, r3, l, r4, rep;

// 7C. Society & Rural Governance Subgraph (Shows Societies, Groups, Villages, Members)
MATCH (s:CooperativeSociety)<-[r1:AFFILIATED_TO]-(g:CooperativeGroup)-[r2:OPERATES_IN]->(v:VillageArea)
OPTIONAL MATCH (m:Member)-[r3:BELONGS_TO]->(g)
RETURN s, r1, g, r2, v, r3, m;
