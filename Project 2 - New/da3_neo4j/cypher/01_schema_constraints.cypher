// ==============================================================================
// DA3: MICROFINANCE AND COOPERATIVE SOCIETY MANAGEMENT SYSTEM
// SCRIPT: 01_schema_constraints.cypher
// DATABASE: CooperativeDA3 (Neo4j Desktop)
//
// PURPOSE:
// In Neo4j, schema constraints enforce data integrity analogous to PRIMARY KEY
// and UNIQUE constraints in relational databases (MySQL).
// Uniqueness constraints ensure no two nodes of the same label can have the same
// key identifier, and automatically create an underlying index for fast lookups.
//
// COMPATIBILITY: Neo4j 5.x / Neo4j 2025+ syntax
// IDEMPOTENCY: Uses `IF NOT EXISTS` so this script can be executed multiple times safely.
// ==============================================================================

// ------------------------------------------------------------------------------
// 1. MEMBER CONSTRAINT
// Equivalent to: MEMBER(MemberID INT PRIMARY KEY) in MySQL
// Enforces that every :Member node has a unique memberId.
// ------------------------------------------------------------------------------
CREATE CONSTRAINT member_id_unique IF NOT EXISTS
FOR (m:Member)
REQUIRE m.memberId IS UNIQUE;

// ------------------------------------------------------------------------------
// 2. COOPERATIVE SOCIETY CONSTRAINT
// Equivalent to: COOPERATIVE_SOCIETY(SocietyID INT PRIMARY KEY) in MySQL
// Enforces that every :CooperativeSociety node has a unique societyId.
// ------------------------------------------------------------------------------
CREATE CONSTRAINT society_id_unique IF NOT EXISTS
FOR (s:CooperativeSociety)
REQUIRE s.societyId IS UNIQUE;

// ------------------------------------------------------------------------------
// 3. VILLAGE AREA CONSTRAINT
// Equivalent to: VILLAGE_AREA(VillageArea VARCHAR(100) PRIMARY KEY) in MySQL
// Enforces that each geographic rural operating zone name is unique.
// ------------------------------------------------------------------------------
CREATE CONSTRAINT village_area_unique IF NOT EXISTS
FOR (v:VillageArea)
REQUIRE v.villageArea IS UNIQUE;

// ------------------------------------------------------------------------------
// 4. STAFF CONSTRAINT
// Equivalent to: STAFF(StaffID INT PRIMARY KEY) in MySQL
// Enforces that every :Staff node has a unique staffId.
// ------------------------------------------------------------------------------
CREATE CONSTRAINT staff_id_unique IF NOT EXISTS
FOR (st:Staff)
REQUIRE st.staffId IS UNIQUE;

// ------------------------------------------------------------------------------
// 5. FUND CONSTRAINT
// Equivalent to: FUND(FundID INT PRIMARY KEY) in MySQL
// Enforces that every institutional funding category has a unique fundId.
// ------------------------------------------------------------------------------
CREATE CONSTRAINT fund_id_unique IF NOT EXISTS
FOR (f:Fund)
REQUIRE f.fundId IS UNIQUE;

// ------------------------------------------------------------------------------
// 6. COOPERATIVE GROUP CONSTRAINT
// Equivalent to: COOPERATIVE_GROUP(GroupID INT PRIMARY KEY) in MySQL
// Enforces that every Self-Help Group (SHG) has a unique groupId.
// ------------------------------------------------------------------------------
CREATE CONSTRAINT group_id_unique IF NOT EXISTS
FOR (g:CooperativeGroup)
REQUIRE g.groupId IS UNIQUE;

// ------------------------------------------------------------------------------
// 7. SAVINGS ACCOUNT CONSTRAINT
// Equivalent to: SAVINGS_ACCOUNT(AccountNo BIGINT PRIMARY KEY) in MySQL
// Enforces that every deposit account has a globally unique accountNo.
// ------------------------------------------------------------------------------
CREATE CONSTRAINT account_no_unique IF NOT EXISTS
FOR (a:SavingsAccount)
REQUIRE a.accountNo IS UNIQUE;

// ------------------------------------------------------------------------------
// 8. LOAN CONSTRAINT
// Equivalent to: LOAN(LoanID INT PRIMARY KEY) in MySQL
// Enforces that every issued loan contract has a unique loanId.
// ------------------------------------------------------------------------------
CREATE CONSTRAINT loan_id_unique IF NOT EXISTS
FOR (l:Loan)
REQUIRE l.loanId IS UNIQUE;

// ------------------------------------------------------------------------------
// 9. REPAYMENT CONSTRAINT (Handling Relational Composite Primary Key)
//
// RELATIONAL BACKGROUND (MySQL):
// REPAYMENT was defined as a weak entity dependent on LOAN:
//   PRIMARY KEY (LoanID, RepaymentNo)
// This meant RepaymentNo is only unique within the scope of a specific LoanID
// (e.g., Loan 501 has Repayment 1, and Loan 502 also has Repayment 1).
//
// GRAPH IMPLEMENTATION IN NEO4J:
// We provide a dual approach to ensure absolute reliability across all environments:
//
// A. Synthesized Unique Key `repaymentId`:
//    Each repayment node stores a composite string identifier:
//    repaymentId = toString(loanId) + "-" + toString(repaymentNo) (e.g., "501-1", "501-2").
//    This allows standard single-property uniqueness constraints compatible with
//    all Neo4j editions (Community and Desktop/Enterprise).
//
// B. Composite Key Constraint / Index:
//    Neo4j Desktop includes Enterprise developer licensing which natively supports
//    multi-property constraints: REQUIRE (r.loanId, r.repaymentNo) IS UNIQUE.
//    Both are declared below with IF NOT EXISTS.
// ------------------------------------------------------------------------------
CREATE CONSTRAINT repayment_id_unique IF NOT EXISTS
FOR (r:Repayment)
REQUIRE r.repaymentId IS UNIQUE;

CREATE CONSTRAINT repayment_composite_unique IF NOT EXISTS
FOR (r:Repayment)
REQUIRE (r.loanId, r.repaymentNo) IS UNIQUE;

// ------------------------------------------------------------------------------
// VERIFY ACTIVE CONSTRAINTS:
// Run the query below in Neo4j Browser to verify that all constraints are active:
// ------------------------------------------------------------------------------
SHOW CONSTRAINTS;
