package com.cooperative.dao;

import com.cooperative.model.CooperativeGroup;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class CooperativeGroupDao {

    private final DataSource dataSource;

    public CooperativeGroupDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private CooperativeGroup mapRow(ResultSet rs) throws SQLException {
        CooperativeGroup g = new CooperativeGroup();
        g.setGroupId(rs.getInt("GroupID"));
        g.setSocietyId(rs.getInt("SocietyID"));
        g.setGroupName(rs.getString("GroupName"));
        Date fDate = rs.getDate("ForwardDate");
        if (fDate != null) g.setForwardDate(fDate.toLocalDate());
        g.setVillageArea(rs.getString("VillageArea"));
        g.setCity(rs.getString("City"));
        g.setState(rs.getString("State"));
        return g;
    }

    public List<CooperativeGroup> findAll() {
        List<CooperativeGroup> list = new ArrayList<>();
        String sql = "SELECT * FROM COOPERATIVE_GROUP";
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

    public CooperativeGroup findById(Integer groupId) {
        String sql = "SELECT * FROM COOPERATIVE_GROUP WHERE GroupID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, groupId);
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

    public void insert(CooperativeGroup g) {
        String sql = "INSERT INTO COOPERATIVE_GROUP (GroupID, SocietyID, GroupName, ForwardDate, VillageArea, City, State) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, g.getGroupId());
            stmt.setInt(2, g.getSocietyId());
            stmt.setString(3, g.getGroupName());
            stmt.setDate(4, g.getForwardDate() != null ? Date.valueOf(g.getForwardDate()) : null);
            stmt.setString(5, g.getVillageArea());
            stmt.setString(6, g.getCity());
            stmt.setString(7, g.getState());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(Integer groupId, CooperativeGroup g) {
        String sql = "UPDATE COOPERATIVE_GROUP SET SocietyID=?, GroupName=?, ForwardDate=?, VillageArea=?, City=?, State=? WHERE GroupID=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, g.getSocietyId());
            stmt.setString(2, g.getGroupName());
            stmt.setDate(3, g.getForwardDate() != null ? Date.valueOf(g.getForwardDate()) : null);
            stmt.setString(4, g.getVillageArea());
            stmt.setString(5, g.getCity());
            stmt.setString(6, g.getState());
            stmt.setInt(7, groupId);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(Integer groupId) {
        String sql = "DELETE FROM COOPERATIVE_GROUP WHERE GroupID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, groupId);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
