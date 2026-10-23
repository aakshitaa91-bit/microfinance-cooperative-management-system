package com.cooperative.dao;

import com.cooperative.model.LoanFund;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class LoanFundDao {

    private final DataSource dataSource;

    public LoanFundDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private LoanFund mapRow(ResultSet rs) throws SQLException {
        LoanFund lf = new LoanFund();
        lf.setLoanId(rs.getInt("LoanID"));
        lf.setFundId(rs.getInt("FundID"));
        return lf;
    }

    public List<LoanFund> findAll() {
        List<LoanFund> list = new ArrayList<>();
        String sql = "SELECT * FROM LOAN_FUND";
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

    public LoanFund findById(Integer loanId, Integer fundId) {
        String sql = "SELECT * FROM LOAN_FUND WHERE LoanID = ? AND FundID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, loanId);
            stmt.setInt(2, fundId);
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

    public void insert(LoanFund lf) {
        String sql = "INSERT INTO LOAN_FUND (LoanID, FundID) VALUES (?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, lf.getLoanId());
            stmt.setInt(2, lf.getFundId());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(Integer oldLoanId, Integer oldFundId, LoanFund lf) {
        String sql = "UPDATE LOAN_FUND SET LoanID=?, FundID=? WHERE LoanID=? AND FundID=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, lf.getLoanId());
            stmt.setInt(2, lf.getFundId());
            stmt.setInt(3, oldLoanId);
            stmt.setInt(4, oldFundId);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(Integer loanId, Integer fundId) {
        String sql = "DELETE FROM LOAN_FUND WHERE LoanID = ? AND FundID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, loanId);
            stmt.setInt(2, fundId);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
