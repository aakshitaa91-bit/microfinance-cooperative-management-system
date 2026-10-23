package com.cooperative.dao;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Record;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.neo4j.driver.SessionConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.*;

/**
 * Data Access Object for executing Cypher queries against the Neo4j graph database.
 * Uses the official Neo4j Java Driver and explicit read-only transactions.
 * Completely independent of the MySQL DataSource.
 */
@Repository
public class GraphDao {

    private final Driver driver;

    @Value("${neo4j.database:neo4j}")
    private String databaseName;

    public GraphDao(Driver driver) {
        this.driver = driver;
    }

    public String getDatabaseName() {
        return databaseName;
    }

    private SessionConfig getSessionConfig() {
        return (databaseName != null && !databaseName.trim().isEmpty())
                ? SessionConfig.forDatabase(databaseName.trim())
                : SessionConfig.defaultConfig();
    }

    /**
     * Executes a read-only Cypher query with parameters and converts rows to a list of maps.
     */
    private List<Map<String, Object>> executeReadOnlyQuery(String cypher, Map<String, Object> params) {
        try (Session session = driver.session(getSessionConfig())) {
            return session.executeRead(tx -> {
                Result result = (params != null && !params.isEmpty()) ? tx.run(cypher, params) : tx.run(cypher);
                List<Map<String, Object>> rows = new ArrayList<>();
                while (result.hasNext()) {
                    Record record = result.next();
                    Map<String, Object> row = new LinkedHashMap<>();
                    for (String key : record.keys()) {
                        row.put(key, convertValue(record.get(key)));
                    }
                    rows.add(row);
                }
                return rows;
            });
        }
    }

    /**
     * Simple health check verification.
     */
    public boolean checkHealth() {
        try (Session session = driver.session(getSessionConfig())) {
            return session.executeRead(tx -> {
                Result result = tx.run("RETURN 1 AS status");
                return result.hasNext();
            });
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Returns graph summary statistics (total nodes, total relationships, counts by label, counts by type).
     */
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new LinkedHashMap<>();

        try (Session session = driver.session(getSessionConfig())) {
            session.executeRead(tx -> {
                // 1. Total counts
                Result totalResult = tx.run(
                        "CALL { MATCH (n) RETURN count(n) AS totalNodes }\n" +
                        "CALL { MATCH ()-[r]->() RETURN count(r) AS totalRelationships }\n" +
                        "RETURN totalNodes, totalRelationships"
                );
                if (totalResult.hasNext()) {
                    Record rec = totalResult.next();
                    stats.put("totalNodes", rec.get("totalNodes").asLong());
                    stats.put("totalRelationships", rec.get("totalRelationships").asLong());
                } else {
                    stats.put("totalNodes", 0L);
                    stats.put("totalRelationships", 0L);
                }

                // 2. Counts by Label
                Result labelResult = tx.run(
                        "MATCH (n)\n" +
                        "UNWIND labels(n) AS label\n" +
                        "RETURN label, count(*) AS count\n" +
                        "ORDER BY count DESC, label ASC"
                );
                Map<String, Long> labelsMap = new LinkedHashMap<>();
                while (labelResult.hasNext()) {
                    Record rec = labelResult.next();
                    labelsMap.put(rec.get("label").asString(), rec.get("count").asLong());
                }
                stats.put("nodeLabels", labelsMap);

                // 3. Counts by Relationship Type
                Result relResult = tx.run(
                        "MATCH ()-[r]->()\n" +
                        "RETURN type(r) AS type, count(*) AS count\n" +
                        "ORDER BY count DESC, type ASC"
                );
                Map<String, Long> relsMap = new LinkedHashMap<>();
                while (relResult.hasNext()) {
                    Record rec = relResult.next();
                    relsMap.put(rec.get("type").asString(), rec.get("count").asLong());
                }
                stats.put("relationshipTypes", relsMap);

                stats.put("database", databaseName);
                return null;
            });
        }

        return stats;
    }

    /**
     * Query 1: Multi-Hop Rural Credit Flow Traversal.
     * Traces funding sources through loans and members to groups and village operating areas.
     */
    public List<Map<String, Object>> getRuralCreditFlow(int fundId) {
        String cypher =
                "MATCH (v:VillageArea)<-[:OPERATES_IN]-(g:CooperativeGroup)\n" +
                "MATCH (g)<-[:BELONGS_TO]-(m:Member)\n" +
                "MATCH (m)-[:BORROWED]->(l:Loan)-[:FINANCED_BY]->(f:Fund {fundId: $fundId})\n" +
                "RETURN v.villageArea AS ruralVillage,\n" +
                "       v.pin AS postalPin,\n" +
                "       g.groupName AS selfHelpGroup,\n" +
                "       m.name AS beneficiaryMember,\n" +
                "       l.loanType AS sanctionedLoan,\n" +
                "       l.amount AS amountSanctioned,\n" +
                "       f.fundType AS fundingSource\n" +
                "ORDER BY ruralVillage, beneficiaryMember";
        return executeReadOnlyQuery(cypher, Collections.singletonMap("fundId", fundId));
    }

    /**
     * Query 2: Circular Nominee Fraud Loop Detection.
     * Detects mutual nominee pairs where Member A nominates Member B, and Member B nominates Member A.
     */
    public List<Map<String, Object>> getCircularNominees() {
        String cypher =
                "MATCH (m1:Member)-[:HOLDS_ACCOUNT]->(a1:SavingsAccount)-[:HAS_NOMINEE]->(m2:Member),\n" +
                "      (m2:Member)-[:HOLDS_ACCOUNT]->(a2:SavingsAccount)-[:HAS_NOMINEE]->(m1)\n" +
                "WHERE m1.memberId < m2.memberId\n" +
                "RETURN m1.memberId AS member1Id,\n" +
                "       m1.name AS member1Name,\n" +
                "       a1.accountNo AS member1Account,\n" +
                "       m2.memberId AS member2Id,\n" +
                "       m2.name AS member2Name,\n" +
                "       a2.accountNo AS member2Account,\n" +
                "       'MUTUAL NOMINEE LOOP DETECTED' AS auditFlag\n" +
                "ORDER BY member1Id";
        return executeReadOnlyQuery(cypher, Collections.emptyMap());
    }

    /**
     * Query 3: Cooperative Group Joint-Liability & Risk Exposure.
     * Calculates total borrowed, total repaid, and net outstanding liability per group.
     */
    public List<Map<String, Object>> getGroupRiskExposure() {
        String cypher =
                "MATCH (g:CooperativeGroup)<-[bg:BELONGS_TO]-(m:Member)\n" +
                "OPTIONAL MATCH (m)-[:BORROWED]->(l:Loan)\n" +
                "OPTIONAL MATCH (l)-[:HAS_REPAYMENT]->(r:Repayment)\n" +
                "WITH g, m, bg, l, coalesce(sum(r.amountPaid), 0) AS loanRepaid\n" +
                "WITH g.groupId AS groupId,\n" +
                "     g.groupName AS groupName,\n" +
                "     count(DISTINCT m) AS totalMembers,\n" +
                "     count(DISTINCT l) AS activeLoans,\n" +
                "     coalesce(sum(l.amount), 0) AS totalBorrowed,\n" +
                "     coalesce(sum(loanRepaid), 0) AS totalRepaid\n" +
                "RETURN groupId,\n" +
                "       groupName,\n" +
                "       totalMembers,\n" +
                "       activeLoans,\n" +
                "       totalBorrowed,\n" +
                "       totalRepaid,\n" +
                "       (totalBorrowed - totalRepaid) AS netOutstandingExposure\n" +
                "ORDER BY netOutstandingExposure DESC";
        return executeReadOnlyQuery(cypher, Collections.emptyMap());
    }

    /**
     * Query 4: Social / Institutional Connection Path (Shortest Path).
     */
    public Map<String, Object> getShortestPath(int member1Id, int member2Id) {
        String cypher =
                "MATCH (m1:Member {memberId: $member1Id}), (m2:Member {memberId: $member2Id})\n" +
                "OPTIONAL MATCH p = shortestPath((m1)-[*]-(m2))\n" +
                "RETURN p IS NOT NULL AS pathFound,\n" +
                "       coalesce(length(p), 0) AS networkHops,\n" +
                "       CASE WHEN p IS NOT NULL THEN [n IN nodes(p) | coalesce(n.name, n.groupName, n.societyName, toString(n.accountNo), 'Node')] ELSE [] END AS pathEntities,\n" +
                "       CASE WHEN p IS NOT NULL THEN [r IN relationships(p) | type(r)] ELSE [] END AS relationshipTypes";

        Map<String, Object> params = new HashMap<>();
        params.put("member1Id", member1Id);
        params.put("member2Id", member2Id);

        List<Map<String, Object>> list = executeReadOnlyQuery(cypher, params);
        if (!list.isEmpty()) {
            Map<String, Object> result = new LinkedHashMap<>(list.get(0));
            result.put("sourceMemberId", member1Id);
            result.put("targetMemberId", member2Id);
            return result;
        }

        Map<String, Object> fallback = new LinkedHashMap<>();
        fallback.put("pathFound", false);
        fallback.put("networkHops", 0);
        fallback.put("pathEntities", Collections.emptyList());
        fallback.put("relationshipTypes", Collections.emptyList());
        fallback.put("sourceMemberId", member1Id);
        fallback.put("targetMemberId", member2Id);
        return fallback;
    }

    /**
     * Query 5: Village-Level Capital Deployment & Performance.
     * Uses node-identity deduplication via reduce() to handle multiple repayments on loans.
     */
    public List<Map<String, Object>> getVillagePerformance() {
        String cypher =
                "MATCH (v:VillageArea)\n" +
                "OPTIONAL MATCH (v)<-[:OPERATES_IN]-(g:CooperativeGroup)\n" +
                "OPTIONAL MATCH (g)<-[:BELONGS_TO]-(m:Member)\n" +
                "OPTIONAL MATCH (m)-[:BORROWED]->(l:Loan)\n" +
                "OPTIONAL MATCH (l)-[:HAS_REPAYMENT]->(r:Repayment)\n" +
                "WITH v,\n" +
                "     count(DISTINCT g) AS operatingGroups,\n" +
                "     count(DISTINCT m) AS registeredMembers,\n" +
                "     count(DISTINCT l) AS totalLoansIssued,\n" +
                "     collect(DISTINCT l) AS uniqueLoans,\n" +
                "     coalesce(sum(r.amountPaid), 0) AS totalRepaymentsCollected\n" +
                "RETURN v.villageArea AS villageName,\n" +
                "       v.pin AS postalPin,\n" +
                "       operatingGroups,\n" +
                "       registeredMembers,\n" +
                "       totalLoansIssued,\n" +
                "       reduce(total = 0.0, loan IN uniqueLoans | total + loan.amount) AS capitalDisbursed,\n" +
                "       totalRepaymentsCollected\n" +
                "ORDER BY capitalDisbursed DESC";
        return executeReadOnlyQuery(cypher, Collections.emptyMap());
    }

    /**
     * Query 6: Multi-Valued Attribute Filtering (Phone Numbers).
     */
    public List<Map<String, Object>> getMultiPhoneMembers() {
        String cypher =
                "MATCH (m:Member)\n" +
                "WHERE size(m.phoneNumbers) > 1\n" +
                "RETURN m.memberId AS memberId,\n" +
                "       m.name AS memberName,\n" +
                "       m.phoneNumbers[0] AS primaryContact,\n" +
                "       m.phoneNumbers[1] AS secondaryContact,\n" +
                "       size(m.phoneNumbers) AS totalPhoneNumbers\n" +
                "ORDER BY memberId";
        return executeReadOnlyQuery(cypher, Collections.emptyMap());
    }

    /**
     * Returns graph nodes and relationships formatted for React graph visualization.
     * Includes stable identifiers, primary labels, captions, and sanitized properties.
     */
    public Map<String, Object> getVisualizationData(int limit) {
        int safeLimit = Math.min(Math.max(limit, 10), 500);
        Map<String, Object> visualization = new LinkedHashMap<>();

        try (Session session = driver.session(getSessionConfig())) {
            session.executeRead(tx -> {
                // Fetch nodes
                Result nodesResult = tx.run(
                        "MATCH (n)\n" +
                        "RETURN elementId(n) AS id, labels(n) AS labels, properties(n) AS props\n" +
                        "LIMIT $limit",
                        Collections.singletonMap("limit", safeLimit)
                );

                List<Map<String, Object>> nodes = new ArrayList<>();
                Set<String> nodeIds = new HashSet<>();

                while (nodesResult.hasNext()) {
                    Record rec = nodesResult.next();
                    String id = rec.get("id").asString();
                    nodeIds.add(id);

                    List<String> labels = rec.get("labels").asList(org.neo4j.driver.Value::asString);
                    String primaryLabel = labels.isEmpty() ? "Entity" : labels.get(0);
                    Map<String, Object> props = new LinkedHashMap<>();
                    rec.get("props").asMap(this::convertValue).forEach(props::put);

                    String caption = generateCaption(primaryLabel, props, id);

                    Map<String, Object> nodeMap = new LinkedHashMap<>();
                    nodeMap.put("id", id);
                    nodeMap.put("label", primaryLabel);
                    nodeMap.put("labels", labels);
                    nodeMap.put("caption", caption);
                    nodeMap.put("properties", props);
                    nodes.add(nodeMap);
                }

                // Fetch relationships connecting the returned nodes
                Result relsResult = tx.run(
                        "MATCH (n)-[r]->(m)\n" +
                        "RETURN elementId(r) AS id,\n" +
                        "       elementId(n) AS source,\n" +
                        "       elementId(m) AS target,\n" +
                        "       type(r) AS type,\n" +
                        "       properties(r) AS props\n" +
                        "LIMIT $limit",
                        Collections.singletonMap("limit", safeLimit * 2)
                );

                List<Map<String, Object>> relationships = new ArrayList<>();
                while (relsResult.hasNext()) {
                    Record rec = relsResult.next();
                    String source = rec.get("source").asString();
                    String target = rec.get("target").asString();

                    // Only include relationships between nodes present in the visualization
                    if (nodeIds.contains(source) && nodeIds.contains(target)) {
                        Map<String, Object> relMap = new LinkedHashMap<>();
                        relMap.put("id", rec.get("id").asString());
                        relMap.put("source", source);
                        relMap.put("target", target);
                        relMap.put("type", rec.get("type").asString());

                        Map<String, Object> props = new LinkedHashMap<>();
                        rec.get("props").asMap(this::convertValue).forEach(props::put);
                        relMap.put("properties", props);
                        relationships.add(relMap);
                    }
                }

                visualization.put("nodes", nodes);
                visualization.put("relationships", relationships);
                visualization.put("totalNodes", nodes.size());
                visualization.put("totalRelationships", relationships.size());
                return null;
            });
        }

        return visualization;
    }

    private String generateCaption(String label, Map<String, Object> props, String fallbackId) {
        switch (label) {
            case "Member":
                return props.getOrDefault("name", fallbackId).toString();
            case "CooperativeSociety":
                return props.getOrDefault("societyName", fallbackId).toString();
            case "CooperativeGroup":
                return props.getOrDefault("groupName", fallbackId).toString();
            case "VillageArea":
                return props.getOrDefault("villageArea", fallbackId).toString();
            case "SavingsAccount":
                return "Acc #" + props.getOrDefault("accountNo", fallbackId);
            case "Loan":
                return props.getOrDefault("loanType", "Loan") + " (#" + props.getOrDefault("loanId", "") + ")";
            case "Repayment":
                return "Paid " + props.getOrDefault("amountPaid", "Repayment");
            case "Fund":
                return props.getOrDefault("fundType", fallbackId).toString();
            case "Staff":
                return props.getOrDefault("name", fallbackId).toString();
            default:
                return props.getOrDefault("name", label).toString();
        }
    }

    private Object convertValue(org.neo4j.driver.Value val) {
        if (val == null || val.isNull()) {
            return null;
        }
        switch (val.type().name()) {
            case "DATE":
            case "DATE_TIME":
            case "LOCAL_DATE_TIME":
            case "TIME":
            case "LOCAL_TIME":
                return val.asObject().toString();
            case "LIST":
                List<Object> list = new ArrayList<>();
                for (org.neo4j.driver.Value item : val.values()) {
                    list.add(convertValue(item));
                }
                return list;
            case "MAP":
                Map<String, Object> map = new LinkedHashMap<>();
                for (String k : val.keys()) {
                    map.put(k, convertValue(val.get(k)));
                }
                return map;
            case "INTEGER":
                return val.asLong();
            case "FLOAT":
                return val.asDouble();
            case "BOOLEAN":
                return val.asBoolean();
            case "STRING":
                return val.asString();
            default:
                return val.asObject().toString();
        }
    }
}
