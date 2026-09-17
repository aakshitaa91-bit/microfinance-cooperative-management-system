package com.cooperative.controller;

import com.cooperative.dao.MemberGroupDao;
import com.cooperative.model.MemberGroup;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/member-groups")
public class MemberGroupController {

    private final MemberGroupDao memberGroupDao;

    public MemberGroupController(MemberGroupDao memberGroupDao) {
        this.memberGroupDao = memberGroupDao;
    }

    @GetMapping
    public List<MemberGroup> getAll() {
        return memberGroupDao.findAll();
    }

    @GetMapping("/{memberId}/{groupId}")
    public ResponseEntity<MemberGroup> getById(@PathVariable Integer memberId, @PathVariable Integer groupId) {
        MemberGroup mg = memberGroupDao.findById(memberId, groupId);
        if (mg != null) {
            return ResponseEntity.ok(mg);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody MemberGroup mg) {
        memberGroupDao.insert(mg);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{memberId}/{groupId}")
    public ResponseEntity<Void> update(@PathVariable Integer memberId, @PathVariable Integer groupId, @RequestBody MemberGroup mg) {
        int rows = memberGroupDao.update(memberId, groupId, mg);
        if (rows > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{memberId}/{groupId}")
    public ResponseEntity<Void> delete(@PathVariable Integer memberId, @PathVariable Integer groupId) {
        int rows = memberGroupDao.delete(memberId, groupId);
        if (rows > 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
