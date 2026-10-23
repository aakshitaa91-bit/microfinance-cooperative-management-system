// ==============================================================================
// DA3: MICROFINANCE AND COOPERATIVE SOCIETY MANAGEMENT SYSTEM
// SCRIPT: 04_graph_queries.cypher
// DATABASE: CooperativeDA3 (Neo4j Desktop)
//
// PURPOSE:
// Demonstrates advanced graph-native queries for academic DBMS evaluation.
// These queries highlight capabilities that are either extremely complex,
// slow, or impractical in relational databases (MySQL):
//
// 1. Multi-Hop Traversals (traversing 5+ entities without expensive JOINs)
// 2. Circular Pattern Detection (identifying mutual nominee collusion loops)
// 3. Joint-Liability Risk Aggregation (group-level financial exposure)
// 4. Graph Path Finding (shortest path across social and institutional links)
// 5. Village-Level Spatial Financial Performance
// ==============================================================================


// ==============================================================================
// QUERY 1: MULTI-HOP GRAPH TRAVERSAL (No Relational JOINs)
//
// ACADEMIC PROBLEM:
// "Trace rural credit flow: Find which Village Areas and Cooperative Groups
// contain members whose loans are funded by the 'Agriculture Fund' (Fund 303)."
//
// RELATIONAL (MySQL) CHALLENGE:
// In MySQL, this requires joining 6 separate tables:
//   VILLAGE_AREA ⨝ COOPERATIVE_GROUP ⨝ MEMBER_GROUP ⨝ MEMBER ⨝ LOAN ⨝ LOAN_FUND ⨝ FUND
// Each join scans indexes and builds intermediate hash/nested-loop tables.
//
// GRAPH ADVANTAGE:
// In Neo4j, Cypher follows pointer chains directly from memory in O(1) per hop.
// ==============================================================================
MATCH (v:VillageArea)<-[:OPERATES_IN]-(g:CooperativeGroup)
MATCH (g)<-[:BELONGS_TO]-(m:Member)
MATCH (m)-[:BORROWED]->(l:Loan)-[:FINANCED_BY]->(f:Fund {fundId: 303})
RETURN v.villageArea AS RuralVillage,
       v.pin AS PostalPIN,
       g.groupName AS SelfHelpGroup,
       m.name AS BeneficiaryMember,
       l.loanType AS SanctionedLoan,
       l.amount AS AmountSanctioned,
       f.fundType AS FundingSource;


// ==============================================================================
// QUERY 2: CIRCULAR NOMINEE FRAUD DETECTION (Academic Showstopper)
//
// ACADEMIC PROBLEM:
// "In microfinance, mutual nominee cycles (Member A nominates Member B, and
// Member B nominates Member A for their savings accounts) create severe moral
// hazard and collusion risks during default audits. Detect all circular nominee pairs."
//
// RELATIONAL (MySQL) CHALLENGE:
// In SQL, detecting cyclic paths requires complex self-joins or recursive CTEs
// (WITH RECURSIVE) with cycle termination guards.
//
// GRAPH ADVANTAGE:
// Graph databases naturally express cycles through ASCII-art pattern matching.
// Notice in our verified sample dataset:
//   - Account 100001 (Akshita) has Nominee Rahul (Member 2)
//   - Account 100002 (Rahul) has Nominee Akshita (Member 1)
// This query cleanly catches this exact cycle!
// ==============================================================================
MATCH (m1:Member)-[:HOLDS_ACCOUNT]->(a1:SavingsAccount)-[:HAS_NOMINEE]->(m2:Member),
      (m2:Member)-[:HOLDS_ACCOUNT]->(a2:SavingsAccount)-[:HAS_NOMINEE]->(m1)
WHERE m1.memberId < m2.memberId // Eliminates mirrored duplicates (A-B vs B-A)
RETURN m1.memberId AS Member1_ID,
       m1.name AS Member1_Name,
       a1.accountNo AS Member1_Account,
       m2.memberId AS Member2_ID,
       m2.name AS Member2_Name,
       a2.accountNo AS Member2_Account,
       'MUTUAL NOMINEE LOOP DETECTED' AS AuditFlag;


// ==============================================================================
// QUERY 3: COOPERATIVE GROUP JOINT-LIABILITY & RISK EXPOSURE
//
// ACADEMIC PROBLEM:
// "In microfinance Joint Liability Groups (JLGs), group members co-guarantee
// each other's loans. Calculate total sanctioned debt, total repayments collected,
// and the outstanding liability for every Cooperative Group."
//
// DEMONSTRATES:
// Aggregation, multi-edge traversal, OPTIONAL MATCH for repayments, and
// null-safe arithmetic using coalesce().
// ==============================================================================
MATCH (g:CooperativeGroup)<-[bg:BELONGS_TO]-(m:Member)
OPTIONAL MATCH (m)-[:BORROWED]->(l:Loan)
OPTIONAL MATCH (l)-[:HAS_REPAYMENT]->(r:Repayment)
WITH g, m, bg, l, coalesce(sum(r.amountPaid), 0) AS LoanRepaid
WITH g.groupId AS GroupID,
     g.groupName AS GroupName,
     count(DISTINCT m) AS TotalMembers,
     count(DISTINCT l) AS ActiveLoans,
     coalesce(sum(l.amount), 0) AS TotalBorrowed,
     coalesce(sum(LoanRepaid), 0) AS TotalRepaid
RETURN GroupID,
       GroupName,
       TotalMembers,
       ActiveLoans,
       TotalBorrowed,
       TotalRepaid,
       (TotalBorrowed - TotalRepaid) AS NetOutstandingExposure
ORDER BY NetOutstandingExposure DESC;


// ==============================================================================
// QUERY 4: SOCIAL & INSTITUTIONAL CONNECTION PATH (Shortest Path)
//
// ACADEMIC PROBLEM:
// "How are two members in different cities connected through the network?
// Find the shortest relationship path between Member 1 (Akshita, Chennai)
// and Member 3 (Priya, Madurai)."
//
// RELATIONAL (MySQL) CHALLENGE:
// Calculating arbitrary path distances in SQL requires unbounded recursive CTEs
// with visited-node tracking tables, which is computationally prohibitive.
//
// GRAPH ADVANTAGE:
// Neo4j includes built-in graph algorithms like shortestPath() powered by
// bidirectional Breadth-First Search (BFS).
// ==============================================================================
MATCH (m1:Member {memberId: 1}), (m3:Member {memberId: 3})
MATCH p = shortestPath((m1)-[*]-(m3))
RETURN p,
       length(p) AS NetworkHops,
       [n IN nodes(p) | coalesce(n.name, n.groupName, n.societyName, n.accountNo, 'Node')] AS PathEntities;


// ==============================================================================
// QUERY 5: VILLAGE-LEVEL CAPITAL DEPLOYMENT & PERFORMANCE
//
// ACADEMIC PROBLEM:
// "Provide a regional summary of rural development by Village Area:
// Show total operating groups, resident borrowers, capital disbursed, and
// repayment collection totals."
//
// DESIGN NOTE ON NODE-IDENTITY DEDUPLICATION:
// Multiple repayments on the same loan create row-level duplication.
// We deduplicate loan nodes by identity via `collect(DISTINCT l)` before summing
// their amounts via `reduce()`, ensuring that distinct loans with identical amounts
// are accurately preserved and counted.
// ==============================================================================
MATCH (v:VillageArea)
OPTIONAL MATCH (v)<-[:OPERATES_IN]-(g:CooperativeGroup)
OPTIONAL MATCH (g)<-[:BELONGS_TO]-(m:Member)
OPTIONAL MATCH (m)-[:BORROWED]->(l:Loan)
OPTIONAL MATCH (l)-[:HAS_REPAYMENT]->(r:Repayment)
WITH v,
     count(DISTINCT g) AS OperatingGroups,
     count(DISTINCT m) AS RegisteredMembers,
     count(DISTINCT l) AS TotalLoansIssued,
     collect(DISTINCT l) AS UniqueLoans,
     coalesce(sum(r.amountPaid), 0) AS TotalRepaymentsCollected
RETURN v.villageArea AS VillageName,
       v.pin AS PostalPIN,
       OperatingGroups,
       RegisteredMembers,
       TotalLoansIssued,
       reduce(total = 0.0, loan IN UniqueLoans | total + loan.amount) AS CapitalDisbursed,
       TotalRepaymentsCollected
ORDER BY CapitalDisbursed DESC;


// ==============================================================================
// QUERY 6: MULTI-VALUED ATTRIBUTE FILTERING (Phone Numbers)
//
// ACADEMIC PROBLEM:
// "Find all members with multiple contact numbers, showing primary and secondary
// contacts without performing join table aggregations."
//
// DEMONSTRATES:
// Neo4j's native array handling (size(), indexing [0], [1]) vs 1NF SQL decomposition.
// ==============================================================================
MATCH (m:Member)
WHERE size(m.phoneNumbers) > 1
RETURN m.memberId AS MemberID,
       m.name AS MemberName,
       m.phoneNumbers[0] AS PrimaryContact,
       m.phoneNumbers[1] AS SecondaryContact,
       size(m.phoneNumbers) AS TotalPhoneNumbers;
