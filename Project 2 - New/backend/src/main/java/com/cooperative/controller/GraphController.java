package com.cooperative.controller;

import com.cooperative.dao.GraphDao;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller exposing read-only analytical and visualization endpoints for DA3 Neo4j Graph.
 * Completely independent of the existing MySQL / DA2 controllers.
 */
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/graph")
public class GraphController {

    private final GraphDao graphDao;

    public GraphController(GraphDao graphDao) {
        this.graphDao = graphDao;
    }

    /**
     * Health check endpoint for Neo4j database.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new LinkedHashMap<>();
        boolean isUp = graphDao.checkHealth();
        if (isUp) {
            response.put("status", "UP");
            response.put("database", graphDao.getDatabaseName());
            response.put("message", "Connected to Neo4j graph database");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "DOWN");
            response.put("database", graphDao.getDatabaseName());
            response.put("message", "Unable to connect to Neo4j graph database");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }

    /**
     * High-level graph statistics: total nodes, total relationships, counts by label, counts by type.
     */
    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        try {
            Map<String, Object> stats = graphDao.getStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch graph statistics", e);
        }
    }

    /**
     * Query 1: Multi-Hop Rural Credit Flow Traversal.
     * Traces funding sources through loans and members to groups and villages.
     */
    @GetMapping("/queries/rural-credit-flow")
    public ResponseEntity<?> getRuralCreditFlow(@RequestParam(defaultValue = "303") int fundId) {
        try {
            List<Map<String, Object>> result = graphDao.getRuralCreditFlow(fundId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return buildErrorResponse("Failed to execute rural credit flow query", e);
        }
    }

    /**
     * Query 2: Circular Nominee Fraud Loop Detection.
     * Identifies mutual nominee loops between members.
     */
    @GetMapping("/queries/circular-nominees")
    public ResponseEntity<?> getCircularNominees() {
        try {
            List<Map<String, Object>> result = graphDao.getCircularNominees();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return buildErrorResponse("Failed to execute circular nominee detection query", e);
        }
    }

    /**
     * Query 3: Cooperative Group Joint-Liability & Risk Exposure.
     * Aggregates borrowings, repayments, and net outstanding liability per group.
     */
    @GetMapping("/queries/group-risk-exposure")
    public ResponseEntity<?> getGroupRiskExposure() {
        try {
            List<Map<String, Object>> result = graphDao.getGroupRiskExposure();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return buildErrorResponse("Failed to execute group risk exposure query", e);
        }
    }

    /**
     * Query 4: Social / Institutional Connection Path (Shortest Path).
     */
    @GetMapping("/queries/shortest-path")
    public ResponseEntity<?> getShortestPath(
            @RequestParam(defaultValue = "1") int member1Id,
            @RequestParam(defaultValue = "3") int member2Id) {
        try {
            Map<String, Object> result = graphDao.getShortestPath(member1Id, member2Id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return buildErrorResponse("Failed to compute shortest path query", e);
        }
    }

    /**
     * Query 5: Village-Level Capital Deployment & Performance.
     */
    @GetMapping("/queries/village-performance")
    public ResponseEntity<?> getVillagePerformance() {
        try {
            List<Map<String, Object>> result = graphDao.getVillagePerformance();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return buildErrorResponse("Failed to execute village performance query", e);
        }
    }

    /**
     * Query 6: Multi-Valued Attribute Filtering (Phone Numbers).
     */
    @GetMapping("/queries/multi-phone-members")
    public ResponseEntity<?> getMultiPhoneMembers() {
        try {
            List<Map<String, Object>> result = graphDao.getMultiPhoneMembers();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return buildErrorResponse("Failed to execute multi-phone members query", e);
        }
    }

    /**
     * Interactive Graph Visualization payload (Nodes and Relationships) for React.
     */
    @GetMapping("/visualization")
    public ResponseEntity<?> getVisualizationData(@RequestParam(defaultValue = "300") int limit) {
        try {
            Map<String, Object> data = graphDao.getVisualizationData(limit);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch graph visualization data", e);
        }
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(String message, Exception e) {
        Map<String, Object> error = new LinkedHashMap<>();
        error.put("error", message);
        error.put("database", graphDao.getDatabaseName());
        error.put("details", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
