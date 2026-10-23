package com.cooperative.controller;

import com.cooperative.dao.DashboardDao;
import com.cooperative.model.DashboardSummary;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardDao dashboardDao;

    public DashboardController(DashboardDao dashboardDao) {
        this.dashboardDao = dashboardDao;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> getSummary() {
        DashboardSummary summary = dashboardDao.getSummary();
        return ResponseEntity.ok(summary);
    }
}
