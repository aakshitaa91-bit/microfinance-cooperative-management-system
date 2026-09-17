package com.cooperative.dao;

import com.cooperative.model.CooperativeSociety;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class CooperativeSocietyDao {

    private final DataSource dataSource;

    public CooperativeSocietyDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private CooperativeSociety mapRow(ResultSet rs) throws SQLException {
        CooperativeSociety society = new CooperativeSociety();
        society.setSocietyId(rs.getInt("SocietyID"));
        society.setSocietyName(rs.getString("SocietyName"));
        Date regDate = rs.getDate("RegistrationDate");
        if (regDate != null) society.setRegistrationDate(regDate.toLocalDate());
        society.setStreet(rs.getString("Street"));
        society.setCity(rs.getString("City"));
        society.setState(rs.getString("State"));
        society.setPin(rs.getString("PIN"));
        return society;
    }

    public List<CooperativeSociety> findAll() {
        List<CooperativeSociety> list = new ArrayList<>();
        String sql = "SELECT * FROM COOPERATIVE_SOCIETY";
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

    public CooperativeSociety findById(Integer id) {
        String sql = "SELECT * FROM COOPERATIVE_SOCIETY WHERE SocietyID = ?";
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

    public void insert(CooperativeSociety society) {
        String sql = "INSERT INTO COOPERATIVE_SOCIETY (SocietyID, SocietyName, RegistrationDate, Street, City, State, PIN) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, society.getSocietyId());
            stmt.setString(2, society.getSocietyName());
            stmt.setDate(3, society.getRegistrationDate() != null ? Date.valueOf(society.getRegistrationDate()) : null);
            stmt.setString(4, society.getStreet());
            stmt.setString(5, society.getCity());
            stmt.setString(6, society.getState());
            stmt.setString(7, society.getPin());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(CooperativeSociety cs) {
        String sql = "UPDATE COOPERATIVE_SOCIETY SET SocietyName=?, RegistrationDate=?, Street=?, City=?, State=?, PIN=? WHERE SocietyID=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, cs.getSocietyName());
            stmt.setDate(2, cs.getRegistrationDate() != null ? Date.valueOf(cs.getRegistrationDate()) : null);
            stmt.setString(3, cs.getStreet());
            stmt.setString(4, cs.getCity());
            stmt.setString(5, cs.getState());
            stmt.setString(6, cs.getPin());
            stmt.setInt(7, cs.getSocietyId());
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(Integer id) {
        String sql = "DELETE FROM COOPERATIVE_SOCIETY WHERE SocietyID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
