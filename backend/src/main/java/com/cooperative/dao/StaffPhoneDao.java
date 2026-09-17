package com.cooperative.dao;

import com.cooperative.model.StaffPhone;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class StaffPhoneDao {

    private final DataSource dataSource;

    public StaffPhoneDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private StaffPhone mapRow(ResultSet rs) throws SQLException {
        StaffPhone sp = new StaffPhone();
        sp.setStaffId(rs.getInt("StaffID"));
        sp.setPhoneNo(rs.getString("PhoneNo"));
        return sp;
    }

    public List<StaffPhone> findAll() {
        List<StaffPhone> list = new ArrayList<>();
        String sql = "SELECT * FROM STAFF_PHONE";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return list;
    }

    public StaffPhone findById(Integer staffId, String phoneNo) {
        String sql = "SELECT * FROM STAFF_PHONE WHERE StaffID = ? AND PhoneNo = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, staffId);
            stmt.setString(2, phoneNo);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    public void insert(StaffPhone sp) {
        String sql = "INSERT INTO STAFF_PHONE (StaffID, PhoneNo) VALUES (?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, sp.getStaffId());
            stmt.setString(2, sp.getPhoneNo());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(Integer oldStaffId, String oldPhoneNo, StaffPhone sp) {
        String sql = "UPDATE STAFF_PHONE SET StaffID=?, PhoneNo=? WHERE StaffID=? AND PhoneNo=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, sp.getStaffId());
            stmt.setString(2, sp.getPhoneNo());
            stmt.setInt(3, oldStaffId);
            stmt.setString(4, oldPhoneNo);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(Integer staffId, String phoneNo) {
        String sql = "DELETE FROM STAFF_PHONE WHERE StaffID = ? AND PhoneNo = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, staffId);
            stmt.setString(2, phoneNo);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
