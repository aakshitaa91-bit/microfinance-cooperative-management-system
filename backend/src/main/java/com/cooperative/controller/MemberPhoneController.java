package com.cooperative.controller;

import com.cooperative.dao.MemberPhoneDao;
import com.cooperative.model.MemberPhone;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/member-phones")
public class MemberPhoneController {

    private final MemberPhoneDao memberPhoneDao;

    public MemberPhoneController(MemberPhoneDao memberPhoneDao) {
        this.memberPhoneDao = memberPhoneDao;
    }

    @GetMapping
    public List<MemberPhone> getAll() {
        return memberPhoneDao.findAll();
    }

    @GetMapping("/{memberId}/{phoneNo}")
    public ResponseEntity<MemberPhone> getById(@PathVariable Integer memberId, @PathVariable String phoneNo) {
        MemberPhone mp = memberPhoneDao.findById(memberId, phoneNo);
        if (mp != null) {
            return ResponseEntity.ok(mp);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody MemberPhone mp) {
        memberPhoneDao.insert(mp);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{memberId}/{phoneNo}")
    public ResponseEntity<Void> update(@PathVariable Integer memberId, @PathVariable String phoneNo, @RequestBody MemberPhone mp) {
        int rows = memberPhoneDao.update(memberId, phoneNo, mp);
        if (rows > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{memberId}/{phoneNo}")
    public ResponseEntity<Void> delete(@PathVariable Integer memberId, @PathVariable String phoneNo) {
        int rows = memberPhoneDao.delete(memberId, phoneNo);
        if (rows > 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
