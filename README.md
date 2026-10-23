# Microfinance and Cooperative Society Management System

A full-stack database management application designed to organise and streamline the operations of a microfinance and cooperative society. The project manages structured records related to members, cooperative societies, funds, loans, savings accounts, and repayments using a React frontend, Java Spring Boot backend, and MySQL database.

The extended version introduces **DA3: Neo4j Graph Database Integration**, adding a graph-based approach to representing and analysing relationships between connected entities in the cooperative and microfinance domain.

## Team Members

| Role | Team Member | Registration Number |
|---|---|---|
| Frontend Development | Karthikeyan Saravana | 25BCE1675 |
| Backend Development | Hitesh J Shenoy | 25BCE1603 |
| Backend and Frontend Connection | Akshita Agrawal | 25BCE1589 |

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Objectives](#2-objectives)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Key Features](#5-key-features)
6. [Functional Modules](#6-functional-modules)
7. [DA3: Neo4j Graph Database Integration](#7-da3-neo4j-graph-database-integration)
8. [Why Neo4j Was Chosen](#8-why-neo4j-was-chosen)
9. [Graph Data Model](#9-graph-data-model)
10. [Graph Analytics and Features](#10-graph-analytics-and-features)
11. [Database Design](#11-database-design)
12. [Database Tables](#12-database-tables)
13. [Relationships and Constraints](#13-relationships-and-constraints)
14. [CRUD Operations](#14-crud-operations)
15. [API Documentation](#15-api-documentation)
16. [Frontend](#16-frontend)
17. [Backend](#17-backend)
18. [Frontend–Backend–Database Connection](#18-frontendbackenddatabase-connection)
19. [Project Structure](#19-project-structure)
20. [Prerequisites](#20-prerequisites)
21. [Installation and Setup](#21-installation-and-setup)
22. [Database Setup](#22-database-setup)
23. [Environment Variables and Configuration](#23-environment-variables-and-configuration)
24. [Backend Setup](#24-backend-setup)
25. [Frontend Setup](#25-frontend-setup)
26. [Neo4j Setup](#26-neo4j-setup)
27. [How to Run the Application](#27-how-to-run-the-application)
28. [Application Workflow](#28-application-workflow)
29. [Validation and Data Integrity](#29-validation-and-data-integrity)
30. [Testing](#30-testing)
31. [Limitations](#31-limitations)
32. [Future Enhancements](#32-future-enhancements)
33. [Academic Purpose](#33-academic-purpose)
34. [Screenshots](#34-screenshots)
35. [License](#35-license)

## 1. Project Overview

The Microfinance and Cooperative Society Management System is designed to manage interconnected records within a cooperative society environment. The application supports the organisation of member details, cooperative societies, staff, funds, savings accounts, loans, and repayments.

The original DA2 implementation uses a relational database to store structured information and maintain relationships through primary keys, foreign keys, and junction tables.

DA3 extends the project by introducing Neo4j, a graph database that represents data as nodes and relationships. This allows the application to support graph-oriented queries and relationship analysis alongside conventional relational database operations.

## 2. Objectives

- Digitise the management of cooperative society records.
- Organise member, society, fund, loan, and savings information.
- Demonstrate database relationships and relational integrity using MySQL.
- Implement a frontend and backend architecture for database operations.
- Introduce graph database concepts through Neo4j.
- Represent connected entities using graph nodes and relationships.
- Use Cypher queries for relationship-oriented analysis where implemented.
- Demonstrate how relational and graph databases can complement each other.

## 3. System Architecture

The application uses a frontend, backend, and database architecture. DA3 adds a graph database integration layer to the existing application.

```text
              React Frontend
                    |
              HTTP / JSON APIs
                    |
           Spring Boot Backend
              /           \
             /             \
        MySQL Database    Neo4j Database
        Relational Data   Graph Data
                          and Analysis
```

The exact endpoints, database connections, and data flow depend on the implementation in `Project 2 - New/`. The diagram represents the intended high-level architecture; it does not imply that MySQL and Neo4j automatically synchronise.

## 4. Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend | React | User interface |
| Frontend build tool | Vite | Development server and frontend build |
| Backend | Java and Spring Boot | Application logic and REST APIs |
| Build tool | Maven | Backend dependency management and build |
| Relational database | MySQL | Structured records and relational operations |
| Graph database | Neo4j | Graph modelling and relationship-oriented queries |
| Graph query language | Cypher | Querying graph nodes and relationships |
| API communication | HTTP / JSON | Communication between frontend and backend |

Versions and additional libraries should be taken from the actual project configuration.

## 5. Key Features

The application is organised around two complementary database approaches.

### Existing DA2 functionality

- Management of cooperative society records.
- Management of member and staff information.
- Management of funds, savings accounts, and loans.
- Recording of loan repayments.
- Relational data management through MySQL.
- Frontend and backend integration for database operations.

### DA3 graph database extension

- Neo4j graph data modelling, where implemented.
- Representation of connected entities through nodes and relationships.
- Cypher-based relationship queries.
- Backend integration for graph-related requests, where implemented.
- Graph analytics interface and query results, where implemented.

The precise list of working DA3 features should be confirmed against the graph controllers, DAO/service classes, frontend components, and Cypher scripts.

## 6. Functional Modules

The original relational schema includes the following modules:

1. **Member Management:** Maintains member profiles.
2. **Cooperative Society Management:** Stores cooperative society information.
3. **Village Area Management:** Maintains village-area information and postal codes.
4. **Staff Management:** Stores staff details and designations.
5. **Fund Management:** Manages fund records.
6. **Member Phone Management:** Stores multiple phone numbers for members.
7. **Membership Management:** Represents membership associations between members and societies.
8. **Cooperative Group Management:** Manages cooperative groups.
9. **Member Group Management:** Represents member associations with groups and their roles.
10. **Savings Account Management:** Stores savings account information.
11. **Loan Management:** Maintains loan records.
12. **Loan Fund Management:** Represents associations between loans and funds.
13. **Staff Phone Management:** Stores staff contact numbers.
14. **Repayment Management:** Records repayment information associated with loans.

These are the modules represented in the original relational schema. Their availability in the updated frontend should be checked against the current implementation.

## 7. DA3: Neo4j Graph Database Integration

DA3 introduces graph database functionality to complement the existing relational database.

In a graph database, entities are represented as **nodes**, while the connections between entities are represented as **relationships**. Properties store information about nodes and relationships.

For a cooperative and microfinance application, graph modelling can represent connections between members, groups, societies, loans, funds, and other entities that are included in the actual graph model.

Neo4j uses Cypher to express graph patterns and retrieve connected data. The DA3 implementation should be documented through its actual graph configuration, Cypher scripts, backend integration, and frontend components.

## 8. Why Neo4j Was Chosen

MySQL and Neo4j serve different purposes within the application.

### MySQL

MySQL is suitable for storing structured records and handling conventional database operations. It supports relational tables, primary keys, foreign keys, and integrity constraints.

### Neo4j

Neo4j is designed to represent connected data using nodes and relationships. It provides a natural way to express relationship patterns, multi-hop traversals, and paths using Cypher.

### Comparison

| Aspect | MySQL | Neo4j |
|---|---|---|
| Data representation | Tables and rows | Nodes and relationships |
| Main role in this project | Structured records and CRUD | Graph-oriented queries and relationship analysis |
| Relationship representation | Foreign keys and junction tables | Explicit graph relationships |
| Query language | SQL | Cypher |
| Suitable operations | Relational queries and record management | Connected-entity queries and graph traversal |

Using both databases allows the application to retain its existing relational functionality while introducing graph-based analysis. Neo4j does not replace MySQL, and the actual method of populating or synchronising graph data must be determined from the implementation.

## 9. Graph Data Model

The DA3 graph data model should be documented using the node labels, relationship types, and properties present in the actual Cypher scripts and backend code.

The graph model may include entities from the existing domain, such as members, societies, groups, funds, loans, savings accounts, repayments, staff, and village areas, but only where those entities are actually represented in Neo4j.

A complete graph model description should identify:

- Node labels and their purpose.
- Relationship types and direction.
- Important properties and identifiers.
- Constraints and indexes.
- The scripts or application code used to populate the graph.

## 10. Graph Analytics and Features

This section documents the graph queries and analytics that are actually implemented.

For each verified feature, describe its purpose, relevant nodes and relationships, Cypher query, backend endpoint, frontend integration, and verification status.

Potential areas to investigate in the source code include graph status checks, graph statistics, relationship-path queries, group or village analysis, and connected-entity exploration. These are examples of feature categories to check, not a claim that every feature is available.

A feature should be marked as implemented only when the source code provides evidence. If a query exists but has not been tested, that limitation should be stated.

## 11. Database Design

The relational database is designed to store structured information about cooperative society operations. Its tables represent entities and associations, with keys used to identify records and maintain relationships.

DA3 adds a graph representation for the relationship-oriented queries implemented in Neo4j. The relational schema and graph schema should be documented separately so that their different roles are clear.

## 12. Database Tables

The original DA2 relational schema includes the following tables:

- `MEMBER`
- `COOPERATIVE_SOCIETY`
- `VILLAGE_AREA`
- `STAFF`
- `FUND`
- `MEMBER_PHONE`
- `MEMBERSHIP`
- `COOPERATIVE_GROUP`
- `MEMBER_GROUP`
- `SAVINGS_ACCOUNT`
- `LOAN`
- `LOAN_FUND`
- `STAFF_PHONE`
- `REPAYMENT`

Refer to the SQL schema in the project for the current columns, primary keys, foreign keys, and constraints.

## 13. Relationships and Constraints

The relational schema includes associations such as:

- Members and cooperative societies through `MEMBERSHIP`.
- Members and cooperative groups through `MEMBER_GROUP`.
- Loans and funds through `LOAN_FUND`.
- Societies and their cooperative groups.
- Members and their phone numbers.
- Staff and their phone numbers.
- Members and savings accounts.
- Members and loans.
- Loans and repayments.

The Neo4j graph relationships should be documented independently from these relational associations, based on the actual graph creation scripts and queries.

## 14. CRUD Operations

The original application provides relational database operations through its backend and frontend.

- **Create:** Adds records to supported entities.
- **Read:** Retrieves and displays stored records.
- **Update:** Modifies existing records.
- **Delete:** Removes records according to application and database rules.

The exact operations and endpoints should be verified in the current source code. Graph analytics endpoints should not be described as CRUD endpoints unless they actually perform those operations.

## 15. API Documentation

The backend exposes REST APIs for the frontend. The exact endpoint list must be extracted from the controller classes.

For DA3, inspect the graph controller and record the real HTTP methods, paths, parameters, response formats, and purpose of each endpoint.

| Method | Endpoint | Purpose |
|---|---|---|
| — | To be documented from the actual controller code | Graph-related API details must be verified |

Do not use guessed endpoint paths in the final project documentation.

## 16. Frontend

The frontend uses React and Vite to provide the application interface.

The DA3 version should be inspected for graph-related components, including any graph analytics page or controls. Document the actual queries requested by the interface, how results are displayed, and how loading or error states are handled where implemented.

## 17. Backend

The backend uses Java and Spring Boot to implement application logic and REST endpoints.

For DA3, the report should identify the actual graph controller, DAO/service classes, Neo4j driver or integration library, and Cypher queries. Explain how graph requests are handled and how results are returned to the frontend.

## 18. Frontend–Backend–Database Connection

The general request flow is:

1. The user interacts with the frontend.
2. The frontend sends an HTTP request to a backend API.
3. The backend processes the request.
4. The relevant database operation or graph query is executed.
5. The backend returns a response.
6. The frontend displays the returned data or an appropriate error.

The exact flow for MySQL and Neo4j should be verified against the actual application code.

## 19. Project Structure

The GitHub repository preserves two versions of the project:

```text
microfinance-cooperative-management-system/
├── Project 1 - Existing/
│   ├── backend/
│   ├── database/
│   ├── frontend/
│   └── README.md
│
├── Project 2 - New/
│   ├── backend/
│   ├── database/
│   ├── frontend/
│   ├── da3_neo4j/
│   └── README.md
│
├── .gitignore
└── README.md
```

The exact contents of each directory should be checked against the uploaded repository.

## 20. Prerequisites

The extended application may require the following, depending on its actual configuration:

- Java Development Kit compatible with the backend.
- Maven.
- Node.js and npm.
- MySQL Server.
- Neo4j database service for DA3.

Refer to the project's configuration files for the required versions.

## 21. Installation and Setup

1. Download or clone the repository.
2. Open `Project 2 - New/` for the extended DA2 and DA3 application.
3. Review the project README and configuration files.
4. Install the required backend and frontend dependencies.
5. Configure the MySQL and Neo4j connections securely.
6. Execute the relevant database setup scripts in the documented order.
7. Start the backend and frontend according to their setup instructions.

## 22. Database Setup

For MySQL, inspect the SQL scripts under `Project 2 - New/database/` and follow their instructions.

For Neo4j, inspect the Cypher scripts under `Project 2 - New/da3_neo4j/` and follow the actual creation, constraint, import, and query execution order.

Do not assume that executing the MySQL setup automatically creates or updates the Neo4j graph.

## 23. Environment Variables and Configuration

Database credentials should be configured locally and should not be committed to GitHub.

Inspect the backend configuration to determine the actual variable names, database URLs, usernames, and ports used by the application. Do not publish passwords, tokens, or other secrets in this README.

## 24. Backend Setup

Open a terminal in the backend directory inside `Project 2 - New/`.

Use the Maven commands specified by the project's configuration and README. Confirm the required Java version and database settings before starting the backend.

The actual startup command, port, and expected success message should be documented after checking the current backend configuration.

## 25. Frontend Setup

Open a separate terminal in the frontend directory inside `Project 2 - New/`.

Install the dependencies using the project's package manager and start the Vite development server using the script defined in `package.json`.

Use the actual configured frontend URL and backend API address.

## 26. Neo4j Setup

1. Ensure that Neo4j is installed or available in the configured environment.
2. Check the Neo4j connection settings in the backend configuration.
3. Start the Neo4j service or database.
4. Execute the required Cypher setup scripts in the documented order.
5. Verify connectivity using the application's actual health/status mechanism or a safe test query, if implemented.
6. Test the graph endpoints and frontend integration using the available verification procedures.

Do not include credentials in the README.

## 27. How to Run the Application

The general startup order is:

1. Start MySQL.
2. Start Neo4j if required by the DA3 application.
3. Verify the database configuration.
4. Start the Spring Boot backend.
5. Start the React/Vite frontend in a separate terminal.
6. Open the configured frontend address.
7. Test the existing relational modules.
8. Test the implemented DA3 graph features.

The exact commands and ports must be taken from the current project configuration rather than assumed.

## 28. Application Workflow

The user interacts with the React frontend, which sends requests to the Spring Boot backend.

For relational operations, the backend communicates with MySQL according to the existing implementation. For graph-related operations, the backend executes the corresponding Neo4j queries where implemented.

The results are returned to the frontend for display. The actual data-population and synchronisation workflow between the databases must be documented based on the source code.

## 29. Validation and Data Integrity

Document the validation mechanisms actually implemented in the frontend, backend, MySQL schema, and Neo4j configuration.

These may include required fields, primary keys, foreign keys, uniqueness constraints, indexes, and graph relationship rules where present. Do not claim that a constraint or validation exists unless it is supported by the code or database configuration.

## 30. Testing

Testing documentation should distinguish between:

- Successful frontend builds.
- Successful backend builds.
- MySQL connectivity.
- Neo4j connectivity.
- Individual Cypher query results.
- REST endpoint verification.
- Complete frontend-to-backend-to-database testing.

Only report tests that were actually executed and whose results are available. Clearly identify tests that remain unverified.

## 31. Limitations

Document the limitations demonstrated by the implementation or testing. Relevant areas to investigate include database connectivity, graph data population, consistency between MySQL and Neo4j, incomplete tests, and unavailable features.

Do not present a possible limitation as a confirmed defect without evidence.

## 32. Future Enhancements

Potential future work may include additional graph analytics, enhanced graph visualisation, improved automated testing, or better database synchronisation.

These are proposed enhancements and should not be described as completed functionality unless they are implemented.

## 33. Academic Purpose

This project demonstrates practical database management concepts, relational data modelling, frontend and backend integration, and the application of graph database concepts to a cooperative and microfinance domain.

DA2 focuses on the existing relational application, while DA3 extends it with Neo4j graph modelling and relationship-oriented analysis.

## 34. Screenshots

Add genuine screenshots of the application, dashboard, graph analytics interface, and relevant query results where available.

Each screenshot should have a caption describing the feature demonstrated. Do not include fabricated screenshots or results.

## 35. License

This project is intended for educational and academic purposes.

---

*Note: The repository documents the original application and its Neo4j-extended version. Actual feature availability, configuration, and testing status should be verified against the corresponding source code and database scripts.*
