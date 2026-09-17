# Microfinance and Cooperative Society Management System

## 1. Project Title
Microfinance and Cooperative Society Management System

## 2. Project Overview
This project is a comprehensive database management system designed to digitize and manage the core operations of a microfinance and cooperative society. It provides a robust, text-based academic interface for efficiently managing members, cooperative societies, funds, loan distributions, and savings accounts.

## 3. Project Objectives
- To digitize manual cooperative society and microfinance operations.
- To demonstrate a robust relational database design with complex relationships (One-to-Many, Many-to-Many, and Weak Entities).
- To provide a text-focused, professional, and accessible user interface for seamless data entry and management.
- To maintain absolute data consistency and referential integrity using strict SQL constraints and JDBC transactions.

## 4. Key Features
- Centralized Dashboard for system-wide statistical overview.
- 14 distinct management modules for handling all entity types.
- Clean, responsive, text-only user interface without unnecessary visual clutter or icons.
- Strict mapping of frontend forms to SQL schema fields.
- Real-time interaction with a MySQL backend purely via JDBC.

## 5. Dashboard
The Dashboard serves as the central landing page and provides a real-time overview of the system state. It dynamically aggregates data directly from the database using SQL queries through the JDBC implementation. It presents 9 key summary statistic cards (e.g., Total Members, Societies, Village Areas, Staff Members, Funds, Cooperative Groups, Savings Accounts, Total Loans, Total Repayments) and a Quick Actions panel. It strictly avoids fake data, arbitrary activity feeds, or decorative charts.

## 6. Module-wise Functionality
The application provides full management capabilities for the following 14 modules. The fields described reflect the exact physical schema of the database.

1. **Member Management**: Manages individual member profiles. (Fields: MemberID, Name, DateOfBirth, HouseNo, Street, City, State, PIN).
2. **Cooperative Society Management**: Manages registered societies. (Fields: SocietyID, SocietyName, RegistrationDate, Street, City, State, PIN).
3. **Village Area Management**: Manages operating regions mapped to postal codes. (Fields: VillageArea, PIN).
4. **Staff Management**: Manages society employees and their designations. (Fields: StaffID, Name, Designation, Street, City, State, PIN).
5. **Fund Management**: Tracks available financial funds by type. (Fields: FundID, FundType, TotalAmount).
6. **Member Phone Management**: Handles multi-valued contact numbers for members. (Fields: MemberID, PhoneNo).
7. **Membership Management**: Manages the many-to-many relationship between Members and Cooperative Societies. (Fields: MemberID, SocietyID, JoinDate).
8. **Cooperative Group Management**: Manages sub-groups under specific societies. (Fields: GroupID, SocietyID, GroupName, ForwardDate, VillageArea, City, State).
9. **Member Group Management**: Manages the roles members play within specific cooperative groups. (Fields: MemberID, GroupID, Role).
10. **Savings Account Management**: Manages member deposit accounts and nominees. (Fields: AccountNo, MemberID, OpeningDate, AccountType, NomineeID).
11. **Loan Management**: Manages loan issuance to members. (Fields: LoanID, MemberID, LoanType, Amount, StartDate, Tenure).
12. **Loan Fund Management**: Tracks which funds finance which loans via a many-to-many junction. (Fields: LoanID, FundID).
13. **Staff Phone Management**: Handles multi-valued contact numbers for staff. (Fields: StaffID, PhoneNo).
14. **Repayment Management**: Tracks installment payments made against specific loans as a weak entity. (Fields: LoanID, RepaymentNo, PaymentDate, AmountPaid, ModeOfPayment).

## 7. CRUD Operations
Each of the 14 modules fully supports the following Create, Read, Update, and Delete operations:
- **Create/Add**: Enter new records via structured forms matching exact database columns.
- **Read/View**: View existing records in clean, responsive data tables.
- **Update/Edit**: Modify existing records with pre-populated forms, protecting primary key integrity.
- **Delete**: Remove records safely using a confirmation dialog, respecting foreign-key constraints (e.g., cascading deletes where applicable).

## 8. Database Design
The database (`cooperative_db`) is designed using normalized relational structures. It avoids redundancy and clearly separates distinct entities (Members, Staff, Funds, Societies, Loans). Multi-valued attributes like Phone Numbers are broken out into separate tables (`MEMBER_PHONE`, `STAFF_PHONE`) mapped back to their parent entities via composite primary keys.

## 9. Database Relationships
The database utilizes foreign keys to strictly map out real-world associations:
- **Member to Society**: Many-to-Many (Resolved via `MEMBERSHIP`).
- **Member to Group**: Many-to-Many (Resolved via `MEMBER_GROUP`).
- **Loan to Fund**: Many-to-Many (Resolved via `LOAN_FUND`).
- **Society to Group**: One-to-Many.
- **Member to Loan**: One-to-Many.
- **Loan to Repayment**: One-to-Many (Identifying relationship).

## 10. Keys and Constraints
- **Primary Keys**: Used uniquely across all main entity tables (e.g., `MemberID`, `SocietyID`, `AccountNo`).
- **Composite Primary Keys**: Used in junction tables and multi-valued attribute tables (e.g., `(MemberID, SocietyID)` in `MEMBERSHIP`, `(LoanID, RepaymentNo)` in `REPAYMENT`).
- **Foreign Keys**: Enforce parent-child relationships and structural dependencies.
- **Check Constraints**: Ensure logical data validity (e.g., `TotalAmount >= 0` in `FUND`, `Amount > 0` in `LOAN`).

## 11. System Architecture
The application follows a standard three-tier architecture:
```text
React Frontend (Vite)
        |
        | HTTP REST API (JSON)
        v
Spring Boot Backend (Java)
        |
        | JDBC (Pure SQL Execution)
        v
MySQL Database
```
- **Presentation Layer (Frontend)**: Renders the UI, manages component state, and captures user input.
- **Application Layer (Backend)**: Exposes REST controllers, handles business logic, and manages pure JDBC database access.
- **Data Layer (Database)**: Persists and enforces constraints on relational data.

## 12. Frontend
The frontend is built using **React** and bundled with **Vite**. It features a modern, text-centric user interface leveraging functional components, React Hooks (`useState`, `useEffect`), and a responsive CSS layout (Flexbox/Grid). It strictly avoids icons, relying purely on typography and structured spacing for an academic, professional look.

## 13. Backend
The backend runs on **Java Spring Boot**, acting as a lightweight API provider. It maps HTTP requests to appropriate backend controllers. It completely avoids complex ORMs like JPA or Hibernate to maintain direct control over the SQL queries execution.

## 14. Database Connectivity
Connectivity is strictly achieved through pure **JDBC** (Java Database Connectivity). The backend establishes connections using the MySQL Connector/J driver and executes explicit SQL `SELECT`, `INSERT`, `UPDATE`, and `DELETE` queries via JDBC `PreparedStatement` interfaces.

## 15. API and Backend Structure
The backend is structured into distinct layers:
- **Controllers**: Define REST API endpoints (e.g., `DashboardController.java`, `MemberController.java`).
- **DAOs (Data Access Objects)**: Contain the raw JDBC SQL queries and execute the database interactions (e.g., `DashboardDao.java`, `MemberDao.java`).
- **Models**: Simple POJOs (Plain Old Java Objects) mirroring the database rows.

## 16. Validation and Data Integrity
- **Frontend**: Forms enforce basic data types, max lengths, and required fields.
- **Database**: The MySQL schema acts as the ultimate gatekeeper, utilizing `NOT NULL`, `CHECK` constraints, and strict foreign key definitions (`ON DELETE CASCADE`, `ON DELETE RESTRICT`) to prevent orphaned records or logical inconsistencies.

## 17. Security
- The system operates without complex user authentication or authorization tiers, matching the scope of a standard academic DBMS project.
- **Database Credentials** are protected. They are supplied to the Spring Boot application exclusively through system environment variables (`DB_USERNAME` and `DB_PASSWORD`), preventing hardcoded secrets in the `application.properties` file. Environment-specific secrets like `.env` files are excluded through `.gitignore`.

## 18. Project Structure
The repository is logically organized into three main directories:
```text
backend/         # Java Spring Boot application (Controllers, DAOs, Models)
frontend/        # React application (Components, Services, CSS)
database/        # MySQL script (cooperative_db.sql)
.gitignore       # Excludes node_modules, target directories, and secrets
README.md        # Project documentation
```

## 19. Technologies Used
- **Frontend**: React, Vite, CSS
- **Backend**: Java 17, Spring Boot, JDBC
- **Database**: MySQL

## 20. How to Run the Project
**Prerequisites:** Ensure MySQL is running on your system and the `cooperative_db` database is created.

**1. Setup Database:**
Execute the `database/cooperative_db.sql` script in your MySQL environment to create the tables and mock data.

**2. Start Backend:**
Configure your environment variables with your MySQL credentials, then run the Spring Boot application on port 8081. Open PowerShell and run:
```powershell
cd D:\cooperative\backend
$env:DB_USERNAME="root"
$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
mvn spring-boot:run
```

**3. Start Frontend:**
Install dependencies and run the Vite server on port 5173. Open a new PowerShell window and run:
```powershell
cd D:\cooperative\frontend
npm.cmd install
npm.cmd run dev
```

**4. Access Application:**
- Frontend Interface: http://localhost:5173
- Backend API Base: http://localhost:8081

## 21. Application Workflow
Users navigate via the text-based sidebar. Selecting a module fetches existing records via an API `GET` request. Users can toggle the "Add Record" form to `POST` new entries. Clicking `[Edit]` populates the form for `PUT` updates, and `[Delete]` triggers a `DELETE` request upon confirmation.

## 22. Testing
The application underwent manual functional testing. CRUD operations were successfully executed across all 14 modules, including add, view, edit, and delete operations, with special attention to preserving foreign-key dependencies and composite-key records.

## 23. Error Handling
The React components implement robust frontend error handling. Network failures, API errors, or database constraint violations are caught and displayed as plain text alerts (e.g., "Unable to load records."). The backend correctly relays SQL exceptions back to the client.

## 24. Dashboard Functionality
The dashboard provides an immediate, unembellished, at-a-glance view of system scale, querying the total counts of members, societies, areas, staff, funds, groups, accounts, loans, and repayments via an aggregate JDBC query.

## 25. Many-to-Many Relationships
Implemented using dedicated junction tables with composite primary keys:
- `MEMBERSHIP` (Members <-> Societies)
- `MEMBER_GROUP` (Members <-> Groups)
- `LOAN_FUND` (Loans <-> Funds)

## 26. One-to-Many Relationships
Implemented by placing the parent's primary key as a foreign key in the child table:
- `MEMBER` to `SAVINGS_ACCOUNT` (1 Member has many Accounts).
- `COOPERATIVE_SOCIETY` to `COOPERATIVE_GROUP` (1 Society manages many Groups).

## 27. Referential Integrity
Referential integrity is guaranteed by InnoDB foreign keys. Behaviors like `ON DELETE CASCADE` ensure that deleting a member automatically removes their associated multi-valued phones and group associations, while `ON DELETE RESTRICT` prevents the deletion of a member if they hold an active loan.

## 28. Key Database Features
- **Normalized Schema**: Eliminates redundant data storage.
- **Weak Entities**: `REPAYMENT` cannot exist without a corresponding `LOAN`.
- **Domain Constraints**: Validates logical boundaries (e.g., ensuring negative loan amounts cannot be inserted).

## 29. Project Highlights
- **Zero ORM Overhead**: Uncompromised learning of database interaction using pure JDBC.
- **Academic Purity**: Adherence to formal DBMS principles without reliance on distracting visual icon libraries.
- **Robust Architecture**: Clear separation of concerns between database, backend APIs, and frontend state.

## 30. Future Enhancements
- Integration of a dedicated user authentication and role-based access control system.
- Expansion of JDBC queries to support advanced filtering, searching, and pagination.
- Implementation of automated transaction rollbacks in complex multi-table inserts.

## 31. Academic Relevance
This project serves as a comprehensive demonstration of DBMS concepts, including ER modeling, normalization, DDL/DML script writing, referential integrity, and full-stack integration utilizing standard web technologies.

## 32. Database Script
The foundational SQL script (`cooperative_db.sql`) is included in the `database/` directory. It contains all table definitions, keys, constraints, and mock seed data required to fully instantiate the application's testing environment.

## 33. Project Type
Academic Database Management System (DBMS) Project

## 34. License
This project is intended for educational and academic purposes.
