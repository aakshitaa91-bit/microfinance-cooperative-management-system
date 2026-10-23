package com.cooperative.controller;

import com.cooperative.dao.StaffPhoneDao;
import com.cooperative.model.StaffPhone;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/staff-phones")
public class StaffPhoneController {

    private final StaffPhoneDao staffPhoneDao;

    public StaffPhoneController(StaffPhoneDao staffPhoneDao) {
        this.staffPhoneDao = staffPhoneDao;
    }

    @GetMapping
    public List<StaffPhone> getAll() {
        return staffPhoneDao.findAll();
    }

    @GetMapping("/{staffId}/{phoneNo}")
    public ResponseEntity<StaffPhone> getById(@PathVariable Integer staffId, @PathVariable String phoneNo) {
        StaffPhone sp = staffPhoneDao.findById(staffId, phoneNo);
        if (sp != null) {
            return ResponseEntity.ok(sp);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody StaffPhone sp) {
        staffPhoneDao.insert(sp);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{staffId}/{phoneNo}")
    public ResponseEntity<Void> update(@PathVariable Integer staffId, @PathVariable String phoneNo, @RequestBody StaffPhone sp) {
        int rows = staffPhoneDao.update(staffId, phoneNo, sp);
        if (rows > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{staffId}/{phoneNo}")
    public ResponseEntity<Void> delete(@PathVariable Integer staffId, @PathVariable String phoneNo) {
        int rows = staffPhoneDao.delete(staffId, phoneNo);
        if (rows > 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
