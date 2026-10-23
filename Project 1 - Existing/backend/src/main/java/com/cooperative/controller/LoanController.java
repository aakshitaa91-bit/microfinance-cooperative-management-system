package com.cooperative.controller;

import com.cooperative.dao.LoanDao;
import com.cooperative.model.Loan;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanDao loanDao;

    public LoanController(LoanDao loanDao) {
        this.loanDao = loanDao;
    }

    @GetMapping
    public List<Loan> getAll() {
        return loanDao.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Loan> getById(@PathVariable Integer id) {
        Loan loan = loanDao.findById(id);
        if (loan != null) {
            return ResponseEntity.ok(loan);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody Loan loan) {
        loanDao.insert(loan);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Integer id, @RequestBody Loan loan) {
        loan.setLoanId(id);
        int rows = loanDao.update(loan);
        if (rows > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        int rows = loanDao.delete(id);
        if (rows > 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
