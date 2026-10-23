package com.cooperative.dao;

import com.cooperative.model.VillageArea;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class VillageAreaDao {

    private final DataSource dataSource;

    public VillageAreaDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private VillageArea mapRow(ResultSet rs) throws SQLException {
        VillageArea va = new VillageArea();
        va.setVillageArea(rs.getString("VillageArea"));
        va.setPin(rs.getString("PIN"));
        return va;
    }

    public List<VillageArea> findAll() {
        List<VillageArea> list = new ArrayList<>();
        String sql = "SELECT * FROM VILLAGE_AREA";
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

    public VillageArea findById(String id) {
        String sql = "SELECT * FROM VILLAGE_AREA WHERE VillageArea = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
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

    public void insert(VillageArea va) {
        String sql = "INSERT INTO VILLAGE_AREA (VillageArea, PIN) VALUES (?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, va.getVillageArea());
            stmt.setString(2, va.getPin());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(VillageArea va) {
        String sql = "UPDATE VILLAGE_AREA SET PIN=? WHERE VillageArea=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, va.getPin());
            stmt.setString(2, va.getVillageArea());
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(String villageArea) {
        String sql = "DELETE FROM VILLAGE_AREA WHERE VillageArea = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, villageArea);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
