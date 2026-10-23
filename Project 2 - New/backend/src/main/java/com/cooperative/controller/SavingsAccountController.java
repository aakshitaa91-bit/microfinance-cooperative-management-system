package com.cooperative.controller;

import com.cooperative.dao.SavingsAccountDao;
import com.cooperative.model.SavingsAccount;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/savings-accounts")
public class SavingsAccountController {

    private final SavingsAccountDao savingsAccountDao;

    public SavingsAccountController(SavingsAccountDao savingsAccountDao) {
        this.savingsAccountDao = savingsAccountDao;
    }

    @GetMapping
    public List<SavingsAccount> getAll() {
        return savingsAccountDao.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavingsAccount> getById(@PathVariable Long id) {
        SavingsAccount sa = savingsAccountDao.findById(id);
        if (sa != null) {
            return ResponseEntity.ok(sa);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody SavingsAccount sa) {
        savingsAccountDao.insert(sa);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody SavingsAccount sa) {
        sa.setAccountNo(id);
        int rows = savingsAccountDao.update(sa);
        if (rows > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        int rows = savingsAccountDao.delete(id);
        if (rows > 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
