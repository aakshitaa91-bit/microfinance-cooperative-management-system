package com.cooperative.controller;

import com.cooperative.dao.LoanFundDao;
import com.cooperative.model.LoanFund;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/loan-funds")
public class LoanFundController {

    private final LoanFundDao loanFundDao;

    public LoanFundController(LoanFundDao loanFundDao) {
        this.loanFundDao = loanFundDao;
    }

    @GetMapping
    public List<LoanFund> getAll() {
        return loanFundDao.findAll();
    }

    @GetMapping("/{loanId}/{fundId}")
    public ResponseEntity<LoanFund> getById(@PathVariable Integer loanId, @PathVariable Integer fundId) {
        LoanFund lf = loanFundDao.findById(loanId, fundId);
        if (lf != null) {
            return ResponseEntity.ok(lf);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody LoanFund lf) {
        loanFundDao.insert(lf);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{loanId}/{fundId}")
    public ResponseEntity<Void> update(@PathVariable Integer loanId, @PathVariable Integer fundId, @RequestBody LoanFund lf) {
        int rows = loanFundDao.update(loanId, fundId, lf);
        if (rows > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{loanId}/{fundId}")
    public ResponseEntity<Void> delete(@PathVariable Integer loanId, @PathVariable Integer fundId) {
        int rows = loanFundDao.delete(loanId, fundId);
        if (rows > 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
