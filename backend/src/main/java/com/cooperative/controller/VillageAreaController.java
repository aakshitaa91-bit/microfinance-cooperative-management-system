package com.cooperative.controller;

import com.cooperative.dao.VillageAreaDao;
import com.cooperative.model.VillageArea;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/village-areas")
public class VillageAreaController {

    private final VillageAreaDao villageAreaDao;

    public VillageAreaController(VillageAreaDao villageAreaDao) {
        this.villageAreaDao = villageAreaDao;
    }

    @GetMapping
    public List<VillageArea> getAll() {
        return villageAreaDao.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VillageArea> getById(@PathVariable String id) {
        VillageArea va = villageAreaDao.findById(id);
        if (va != null) {
            return ResponseEntity.ok(va);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody VillageArea va) {
        villageAreaDao.insert(va);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable String id, @RequestBody VillageArea va) {
        va.setVillageArea(id);
        int rows = villageAreaDao.update(va);
        if (rows > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        int rows = villageAreaDao.delete(id);
        if (rows > 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
