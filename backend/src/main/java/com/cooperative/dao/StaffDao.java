package com.cooperative.dao;

import com.cooperative.model.Staff;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class StaffDao {

    private final DataSource dataSource;

    public StaffDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private Staff mapRow(ResultSet rs) throws SQLException {
        Staff staff = new Staff();
        staff.setStaffId(rs.getInt("StaffID"));
        staff.setName(rs.getString("Name"));
        staff.setDesignation(rs.getString("Designation"));
        staff.setStreet(rs.getString("Street"));
        staff.setCity(rs.getString("City"));
        staff.setState(rs.getString("State"));
        staff.setPin(rs.getString("PIN"));
        return staff;
    }

    public List<Staff> findAll() {
        List<Staff> list = new ArrayList<>();
        String sql = "SELECT * FROM STAFF";
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

    public Staff findById(Integer id) {
        String sql = "SELECT * FROM STAFF WHERE StaffID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
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

    public void insert(Staff staff) {
        String sql = "INSERT INTO STAFF (StaffID, Name, Designation, Street, City, State, PIN) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, staff.getStaffId());
            stmt.setString(2, staff.getName());
            stmt.setString(3, staff.getDesignation());
            stmt.setString(4, staff.getStreet());
            stmt.setString(5, staff.getCity());
            stmt.setString(6, staff.getState());
            stmt.setString(7, staff.getPin());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(Staff staff) {
        String sql = "UPDATE STAFF SET Name=?, Designation=?, Street=?, City=?, State=?, PIN=? WHERE StaffID=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, staff.getName());
            stmt.setString(2, staff.getDesignation());
            stmt.setString(3, staff.getStreet());
            stmt.setString(4, staff.getCity());
            stmt.setString(5, staff.getState());
            stmt.setString(6, staff.getPin());
            stmt.setInt(7, staff.getStaffId());
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(Integer id) {
        String sql = "DELETE FROM STAFF WHERE StaffID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
