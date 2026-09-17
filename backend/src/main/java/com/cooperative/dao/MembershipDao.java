package com.cooperative.dao;

import com.cooperative.model.Membership;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class MembershipDao {

    private final DataSource dataSource;

    public MembershipDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private Membership mapRow(ResultSet rs) throws SQLException {
        Membership m = new Membership();
        m.setMemberId(rs.getInt("MemberID"));
        m.setSocietyId(rs.getInt("SocietyID"));
        Date jDate = rs.getDate("JoinDate");
        if (jDate != null) m.setJoinDate(jDate.toLocalDate());
        return m;
    }

    public List<Membership> findAll() {
        List<Membership> list = new ArrayList<>();
        String sql = "SELECT * FROM MEMBERSHIP";
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

    public Membership findById(Integer memberId, Integer societyId) {
        String sql = "SELECT * FROM MEMBERSHIP WHERE MemberID = ? AND SocietyID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, memberId);
            stmt.setInt(2, societyId);
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

    public void insert(Membership m) {
        String sql = "INSERT INTO MEMBERSHIP (MemberID, SocietyID, JoinDate) VALUES (?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, m.getMemberId());
            stmt.setInt(2, m.getSocietyId());
            stmt.setDate(3, m.getJoinDate() != null ? Date.valueOf(m.getJoinDate()) : null);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(Integer oldMemberId, Integer oldSocietyId, Membership m) {
        String sql = "UPDATE MEMBERSHIP SET MemberID=?, SocietyID=?, JoinDate=? WHERE MemberID=? AND SocietyID=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, m.getMemberId());
            stmt.setInt(2, m.getSocietyId());
            stmt.setDate(3, m.getJoinDate() != null ? Date.valueOf(m.getJoinDate()) : null);
            stmt.setInt(4, oldMemberId);
            stmt.setInt(5, oldSocietyId);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(Integer memberId, Integer societyId) {
        String sql = "DELETE FROM MEMBERSHIP WHERE MemberID = ? AND SocietyID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, memberId);
            stmt.setInt(2, societyId);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
