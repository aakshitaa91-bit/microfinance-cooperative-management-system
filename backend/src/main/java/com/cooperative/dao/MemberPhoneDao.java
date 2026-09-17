package com.cooperative.dao;

import com.cooperative.model.MemberPhone;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class MemberPhoneDao {

    private final DataSource dataSource;

    public MemberPhoneDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private MemberPhone mapRow(ResultSet rs) throws SQLException {
        MemberPhone mp = new MemberPhone();
        mp.setMemberId(rs.getInt("MemberID"));
        mp.setPhoneNo(rs.getString("PhoneNo"));
        return mp;
    }

    public List<MemberPhone> findAll() {
        List<MemberPhone> list = new ArrayList<>();
        String sql = "SELECT * FROM MEMBER_PHONE";
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

    public MemberPhone findById(Integer memberId, String phoneNo) {
        String sql = "SELECT * FROM MEMBER_PHONE WHERE MemberID = ? AND PhoneNo = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, memberId);
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

    public void insert(MemberPhone mp) {
        String sql = "INSERT INTO MEMBER_PHONE (MemberID, PhoneNo) VALUES (?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, mp.getMemberId());
            stmt.setString(2, mp.getPhoneNo());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(Integer oldMemberId, String oldPhoneNo, MemberPhone mp) {
        String sql = "UPDATE MEMBER_PHONE SET MemberID=?, PhoneNo=? WHERE MemberID=? AND PhoneNo=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, mp.getMemberId());
            stmt.setString(2, mp.getPhoneNo());
            stmt.setInt(3, oldMemberId);
            stmt.setString(4, oldPhoneNo);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(Integer memberId, String phoneNo) {
        String sql = "DELETE FROM MEMBER_PHONE WHERE MemberID = ? AND PhoneNo = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, memberId);
            stmt.setString(2, phoneNo);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
