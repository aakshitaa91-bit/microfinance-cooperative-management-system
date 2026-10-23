package com.cooperative.controller;

import com.cooperative.dao.FundDao;
import com.cooperative.model.Fund;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/funds")
public class FundController {

    private final FundDao fundDao;

    public FundController(FundDao fundDao) {
        this.fundDao = fundDao;
    }

    @GetMapping
    public List<Fund> getAll() {
        return fundDao.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fund> getById(@PathVariable Integer id) {
        Fund fund = fundDao.findById(id);
        if (fund != null) {
            return ResponseEntity.ok(fund);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody Fund fund) {
        fundDao.insert(fund);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Integer id, @RequestBody Fund fund) {
        fund.setFundId(id);
        int rows = fundDao.update(fund);
        if (rows > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        int rows = fundDao.delete(id);
        if (rows > 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
