package com.cooperative.controller;

import com.cooperative.dao.MembershipDao;
import com.cooperative.model.Membership;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/memberships")
public class MembershipController {

    private final MembershipDao membershipDao;

    public MembershipController(MembershipDao membershipDao) {
        this.membershipDao = membershipDao;
    }

    @GetMapping
    public List<Membership> getAll() {
        return membershipDao.findAll();
    }

    @GetMapping("/{memberId}/{societyId}")
    public ResponseEntity<Membership> getById(@PathVariable Integer memberId, @PathVariable Integer societyId) {
        Membership m = membershipDao.findById(memberId, societyId);
        if (m != null) {
            return ResponseEntity.ok(m);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody Membership m) {
        membershipDao.insert(m);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{memberId}/{societyId}")
    public ResponseEntity<Void> update(@PathVariable Integer memberId, @PathVariable Integer societyId, @RequestBody Membership m) {
        int rows = membershipDao.update(memberId, societyId, m);
        if (rows > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{memberId}/{societyId}")
    public ResponseEntity<Void> delete(@PathVariable Integer memberId, @PathVariable Integer societyId) {
        int rows = membershipDao.delete(memberId, societyId);
        if (rows > 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
