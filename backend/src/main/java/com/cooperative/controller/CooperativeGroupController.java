package com.cooperative.controller;

import com.cooperative.dao.CooperativeGroupDao;
import com.cooperative.model.CooperativeGroup;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/groups")
public class CooperativeGroupController {

    private final CooperativeGroupDao cooperativeGroupDao;

    public CooperativeGroupController(CooperativeGroupDao cooperativeGroupDao) {
        this.cooperativeGroupDao = cooperativeGroupDao;
    }

    @GetMapping
    public List<CooperativeGroup> getAll() {
        return cooperativeGroupDao.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CooperativeGroup> getById(@PathVariable Integer id) {
        CooperativeGroup g = cooperativeGroupDao.findById(id);
        if (g != null) {
            return ResponseEntity.ok(g);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody CooperativeGroup g) {
        cooperativeGroupDao.insert(g);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Integer id, @RequestBody CooperativeGroup g) {
        int rows = cooperativeGroupDao.update(id, g);
        if (rows > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        int rows = cooperativeGroupDao.delete(id);
        if (rows > 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
