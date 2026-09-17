package com.cooperative.controller;

import com.cooperative.dao.RepaymentDao;
import com.cooperative.model.Repayment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/repayments")
public class RepaymentController {

    private final RepaymentDao repaymentDao;

    public RepaymentController(RepaymentDao repaymentDao) {
        this.repaymentDao = repaymentDao;
    }

    @GetMapping
    public List<Repayment> getAll() {
        return repaymentDao.findAll();
    }

    @GetMapping("/{loanId}/{repaymentNo}")
    public ResponseEntity<Repayment> getById(@PathVariable Integer loanId, @PathVariable Integer repaymentNo) {
        Repayment r = repaymentDao.findById(loanId, repaymentNo);
        if (r != null) {
            return ResponseEntity.ok(r);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody Repayment r) {
        repaymentDao.insert(r);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{loanId}/{repaymentNo}")
    public ResponseEntity<Void> update(@PathVariable Integer loanId, @PathVariable Integer repaymentNo, @RequestBody Repayment r) {
        int rows = repaymentDao.update(loanId, repaymentNo, r);
        if (rows > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{loanId}/{repaymentNo}")
    public ResponseEntity<Void> delete(@PathVariable Integer loanId, @PathVariable Integer repaymentNo) {
        int rows = repaymentDao.delete(loanId, repaymentNo);
        if (rows > 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
