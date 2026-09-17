package com.cooperative.dao;

import com.cooperative.model.Repayment;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class RepaymentDao {

    private final DataSource dataSource;

    public RepaymentDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private Repayment mapRow(ResultSet rs) throws SQLException {
        Repayment repayment = new Repayment();
        repayment.setLoanId(rs.getInt("LoanID"));
        repayment.setRepaymentNo(rs.getInt("RepaymentNo"));
        Date pDate = rs.getDate("PaymentDate");
        if (pDate != null) repayment.setPaymentDate(pDate.toLocalDate());
        repayment.setAmountPaid(rs.getBigDecimal("AmountPaid"));
        repayment.setModeOfPayment(rs.getString("ModeOfPayment"));
        return repayment;
    }

    public List<Repayment> findAll() {
        List<Repayment> list = new ArrayList<>();
        String sql = "SELECT * FROM REPAYMENT";
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

    public Repayment findById(Integer loanId, Integer repaymentNo) {
        String sql = "SELECT * FROM REPAYMENT WHERE LoanID = ? AND RepaymentNo = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, loanId);
            stmt.setInt(2, repaymentNo);
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

    public void insert(Repayment repayment) {
        String sql = "INSERT INTO REPAYMENT (LoanID, RepaymentNo, PaymentDate, AmountPaid, ModeOfPayment) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, repayment.getLoanId());
            stmt.setInt(2, repayment.getRepaymentNo());
            stmt.setDate(3, repayment.getPaymentDate() != null ? Date.valueOf(repayment.getPaymentDate()) : null);
            stmt.setBigDecimal(4, repayment.getAmountPaid());
            stmt.setString(5, repayment.getModeOfPayment());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(Integer oldLoanId, Integer oldRepaymentNo, Repayment r) {
        String sql = "UPDATE REPAYMENT SET LoanID=?, RepaymentNo=?, PaymentDate=?, AmountPaid=?, ModeOfPayment=? WHERE LoanID=? AND RepaymentNo=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, r.getLoanId());
            stmt.setInt(2, r.getRepaymentNo());
            stmt.setDate(3, r.getPaymentDate() != null ? Date.valueOf(r.getPaymentDate()) : null);
            stmt.setBigDecimal(4, r.getAmountPaid());
            stmt.setString(5, r.getModeOfPayment());
            stmt.setInt(6, oldLoanId);
            stmt.setInt(7, oldRepaymentNo);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(Integer loanId, Integer repaymentNo) {
        String sql = "DELETE FROM REPAYMENT WHERE LoanID = ? AND RepaymentNo = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, loanId);
            stmt.setInt(2, repaymentNo);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
