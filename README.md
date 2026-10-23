# Microfinance and Cooperative Society Management System

This repository hosts two progressive stages of the Microfinance and Cooperative Society Management System developed for Database Management Systems (DBMS):

---

## Repository Structure

`
microfinance-cooperative-management-system/
â”œâ”€â”€ Project 1 - Existing/     # Digital Assignments 1 & 2 (DA1 & DA2): MySQL Relational DBMS
â””â”€â”€ Project 2 - New/          # Digital Assignment 3 (DA3): Neo4j Graph DB Extension + MySQL Full-Stack App
`

---

## 1. Project 1 â€” Existing (DA1 & DA2 Baseline)
* **Location**: [Project 1 - Existing/](./Project%201%20-%20Existing)
* **Architecture**: 14-table highly normalized relational database in **MySQL** with Spring Boot JDBC backend and React/Vite management interface.
* **Scope**: Core cooperative management operations (members, societies, groups, loans, repayments, funds, staff, savings accounts).

---

## 2. Project 2 â€” New (DA3 Extended Neo4j Implementation)
* **Location**: [Project 2 - New/](./Project%202%20-%20New)
* **Architecture**: Dual-database enterprise architecture combining **MySQL** (transactional/relational storage) and **Neo4j** (graph database for network analysis & relationship traversal).
* **Key Additions**:
  * **Neo4j Graph Database**: Joint-Liability Group (JLG) exposure analysis, circular nominee fraud detection, multi-tier rural credit flow tracing, and shortest-path connection algorithms.
  * **Graph Analytics Dashboard**: Interactive visual exploration and real-time graph metric queries in the React frontend.
  * **Complete Cypher Artifacts**: Cypher schema constraints, seed data, CRUD operations, and analytical queries under [da3_neo4j/](./Project%202%20-%20New/da3_neo4j).
  * **Comparative Analysis**: Comprehensive SQL vs Cypher performance and design study.

---

## Team Members

| Role | Team Member | Registration Number |
| :--- | :--- | :--- |
| **Graph Database Modeling & Cypher Queries** | Akshita Agrawal | 25BCE1589 |
| **Backend & Graph Architecture** | Hitesh J Shenoy | 25BCE1603 |
| **Frontend & Visual Analytics** | Karthikeyan Saravana | 25BCE1675 |
