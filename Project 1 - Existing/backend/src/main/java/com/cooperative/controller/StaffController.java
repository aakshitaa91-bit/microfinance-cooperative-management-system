package com.cooperative.controller;

import com.cooperative.dao.StaffDao;
import com.cooperative.model.Staff;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffDao staffDao;

    public StaffController(StaffDao staffDao) {
        this.staffDao = staffDao;
    }

    @GetMapping
    public List<Staff> getAll() {
        return staffDao.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getById(@PathVariable Integer id) {
        Staff staff = staffDao.findById(id);
        if (staff != null) {
            return ResponseEntity.ok(staff);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody Staff staff) {
        staffDao.insert(staff);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Integer id, @RequestBody Staff staff) {
        staff.setStaffId(id);
        int rows = staffDao.update(staff);
        if (rows > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        int rows = staffDao.delete(id);
        if (rows > 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
