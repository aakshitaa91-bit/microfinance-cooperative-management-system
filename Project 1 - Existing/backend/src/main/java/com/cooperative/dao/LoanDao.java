package com.cooperative.dao;

import com.cooperative.model.Loan;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class LoanDao {

    private final DataSource dataSource;

    public LoanDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private Loan mapRow(ResultSet rs) throws SQLException {
        Loan loan = new Loan();
        loan.setLoanId(rs.getInt("LoanID"));
        loan.setMemberId(rs.getInt("MemberID"));
        loan.setLoanType(rs.getString("LoanType"));
        loan.setAmount(rs.getBigDecimal("Amount"));
        Date sDate = rs.getDate("StartDate");
        if (sDate != null) loan.setStartDate(sDate.toLocalDate());
        loan.setTenure(rs.getInt("Tenure"));
        return loan;
    }

    public List<Loan> findAll() {
        List<Loan> list = new ArrayList<>();
        String sql = "SELECT * FROM LOAN";
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

    public Loan findById(Integer id) {
        String sql = "SELECT * FROM LOAN WHERE LoanID = ?";
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

    public void insert(Loan loan) {
        String sql = "INSERT INTO LOAN (LoanID, MemberID, LoanType, Amount, StartDate, Tenure) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, loan.getLoanId());
            stmt.setInt(2, loan.getMemberId());
            stmt.setString(3, loan.getLoanType());
            stmt.setBigDecimal(4, loan.getAmount());
            stmt.setDate(5, loan.getStartDate() != null ? Date.valueOf(loan.getStartDate()) : null);
            stmt.setInt(6, loan.getTenure());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(Loan loan) {
        String sql = "UPDATE LOAN SET MemberID=?, LoanType=?, Amount=?, StartDate=?, Tenure=? WHERE LoanID=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, loan.getMemberId());
            stmt.setString(2, loan.getLoanType());
            stmt.setBigDecimal(3, loan.getAmount());
            stmt.setDate(4, loan.getStartDate() != null ? Date.valueOf(loan.getStartDate()) : null);
            stmt.setInt(5, loan.getTenure());
            stmt.setInt(6, loan.getLoanId());
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(Integer id) {
        String sql = "DELETE FROM LOAN WHERE LoanID = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
