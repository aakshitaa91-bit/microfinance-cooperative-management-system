package com.cooperative.dao;

import com.cooperative.model.Member;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class MemberDao {

    private final DataSource dataSource;

    public MemberDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private Member mapRow(ResultSet rs) throws SQLException {
        Member member = new Member();
        member.setMemberId(rs.getInt("MemberID"));
        member.setName(rs.getString("Name"));
        Date dob = rs.getDate("DateOfBirth");
        if (dob != null) member.setDateOfBirth(dob.toLocalDate());
        member.setHouseNo(rs.getString("HouseNo"));
        member.setStreet(rs.getString("Street"));
        member.setCity(rs.getString("City"));
        member.setState(rs.getString("State"));
        member.setPin(rs.getString("PIN"));
        return member;
    }

    public List<Member> findAll() {
        List<Member> list = new ArrayList<>();
        String sql = "SELECT * FROM `MEMBER`";
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

    public Member findById(Integer id) {
        String sql = "SELECT * FROM `MEMBER` WHERE MemberID = ?";
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

    public void insert(Member member) {
        String sql = "INSERT INTO `MEMBER` (MemberID, Name, DateOfBirth, HouseNo, Street, City, State, PIN) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, member.getMemberId());
            stmt.setString(2, member.getName());
            stmt.setDate(3, member.getDateOfBirth() != null ? Date.valueOf(member.getDateOfBirth()) : null);
            stmt.setString(4, member.getHouseNo());
            stmt.setString(5, member.getStreet());
            stmt.setString(6, member.getCity());
            stmt.setString(7, member.getState());
            stmt.setString(8, member.getPin());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(Member member) {
        String sql = "UPDATE `MEMBER` SET Name=?, DateOfBirth=?, HouseNo=?, Street=?, City=?, State=?, PIN=? WHERE MemberID=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, member.getName());
            stmt.setDate(2, member.getDateOfBirth() != null ? Date.valueOf(member.getDateOfBirth()) : null);
            stmt.setString(3, member.getHouseNo());
            stmt.setString(4, member.getStreet());
            stmt.setString(5, member.getCity());
            stmt.setString(6, member.getState());
            stmt.setString(7, member.getPin());
            stmt.setInt(8, member.getMemberId());
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(Integer id) {
        String sql = "DELETE FROM `MEMBER` WHERE MemberID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
