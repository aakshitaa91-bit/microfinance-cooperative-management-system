package com.cooperative.controller;

import com.cooperative.dao.CooperativeSocietyDao;
import com.cooperative.model.CooperativeSociety;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/societies")
public class CooperativeSocietyController {

    private final CooperativeSocietyDao cooperativeSocietyDao;

    public CooperativeSocietyController(CooperativeSocietyDao cooperativeSocietyDao) {
        this.cooperativeSocietyDao = cooperativeSocietyDao;
    }

    @GetMapping
    public List<CooperativeSociety> getAll() {
        return cooperativeSocietyDao.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CooperativeSociety> getById(@PathVariable Integer id) {
        CooperativeSociety cs = cooperativeSocietyDao.findById(id);
        if (cs != null) {
            return ResponseEntity.ok(cs);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody CooperativeSociety cs) {
        cooperativeSocietyDao.insert(cs);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Integer id, @RequestBody CooperativeSociety cs) {
        cs.setSocietyId(id);
        int rows = cooperativeSocietyDao.update(cs);
        if (rows > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        int rows = cooperativeSocietyDao.delete(id);
        if (rows > 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
