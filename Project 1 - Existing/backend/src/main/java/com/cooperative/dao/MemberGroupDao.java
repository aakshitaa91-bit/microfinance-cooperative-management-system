package com.cooperative.dao;

import com.cooperative.model.MemberGroup;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class MemberGroupDao {

    private final DataSource dataSource;

    public MemberGroupDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private MemberGroup mapRow(ResultSet rs) throws SQLException {
        MemberGroup mg = new MemberGroup();
        mg.setMemberId(rs.getInt("MemberID"));
        mg.setGroupId(rs.getInt("GroupID"));
        mg.setRole(rs.getString("Role"));
        return mg;
    }

    public List<MemberGroup> findAll() {
        List<MemberGroup> list = new ArrayList<>();
        String sql = "SELECT * FROM MEMBER_GROUP";
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

    public MemberGroup findById(Integer memberId, Integer groupId) {
        String sql = "SELECT * FROM MEMBER_GROUP WHERE MemberID = ? AND GroupID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, memberId);
            stmt.setInt(2, groupId);
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

    public void insert(MemberGroup mg) {
        String sql = "INSERT INTO MEMBER_GROUP (MemberID, GroupID, Role) VALUES (?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, mg.getMemberId());
            stmt.setInt(2, mg.getGroupId());
            stmt.setString(3, mg.getRole());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(Integer oldMemberId, Integer oldGroupId, MemberGroup mg) {
        String sql = "UPDATE MEMBER_GROUP SET MemberID=?, GroupID=?, Role=? WHERE MemberID=? AND GroupID=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, mg.getMemberId());
            stmt.setInt(2, mg.getGroupId());
            stmt.setString(3, mg.getRole());
            stmt.setInt(4, oldMemberId);
            stmt.setInt(5, oldGroupId);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(Integer memberId, Integer groupId) {
        String sql = "DELETE FROM MEMBER_GROUP WHERE MemberID = ? AND GroupID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, memberId);
            stmt.setInt(2, groupId);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
