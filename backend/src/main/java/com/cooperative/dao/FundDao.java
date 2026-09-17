package com.cooperative.dao;

import com.cooperative.model.Fund;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class FundDao {

    private final DataSource dataSource;

    public FundDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private Fund mapRow(ResultSet rs) throws SQLException {
        Fund fund = new Fund();
        fund.setFundId(rs.getInt("FundID"));
        fund.setFundType(rs.getString("FundType"));
        fund.setTotalAmount(rs.getBigDecimal("TotalAmount"));
        return fund;
    }

    public List<Fund> findAll() {
        List<Fund> list = new ArrayList<>();
        String sql = "SELECT * FROM FUND";
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

    public Fund findById(Integer id) {
        String sql = "SELECT * FROM FUND WHERE FundID = ?";
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

    public void insert(Fund fund) {
        String sql = "INSERT INTO FUND (FundID, FundType, TotalAmount) VALUES (?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, fund.getFundId());
            stmt.setString(2, fund.getFundType());
            stmt.setBigDecimal(3, fund.getTotalAmount());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(Fund fund) {
        String sql = "UPDATE FUND SET FundType=?, TotalAmount=? WHERE FundID=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, fund.getFundType());
            stmt.setBigDecimal(2, fund.getTotalAmount());
            stmt.setInt(3, fund.getFundId());
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(Integer id) {
        String sql = "DELETE FROM FUND WHERE FundID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
