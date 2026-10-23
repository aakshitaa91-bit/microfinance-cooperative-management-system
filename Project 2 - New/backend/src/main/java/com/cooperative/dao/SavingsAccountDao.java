package com.cooperative.dao;

import com.cooperative.model.SavingsAccount;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class SavingsAccountDao {

    private final DataSource dataSource;

    public SavingsAccountDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private SavingsAccount mapRow(ResultSet rs) throws SQLException {
        SavingsAccount account = new SavingsAccount();
        account.setAccountNo(rs.getLong("AccountNo"));
        account.setMemberId(rs.getInt("MemberID"));
        Date opDate = rs.getDate("OpeningDate");
        if (opDate != null) account.setOpeningDate(opDate.toLocalDate());
        account.setAccountType(rs.getString("AccountType"));
        
        int nomineeId = rs.getInt("NomineeID");
        if (!rs.wasNull()) {
            account.setNomineeId(nomineeId);
        }
        return account;
    }

    public List<SavingsAccount> findAll() {
        List<SavingsAccount> list = new ArrayList<>();
        String sql = "SELECT * FROM SAVINGS_ACCOUNT";
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

    public SavingsAccount findById(Long id) {
        String sql = "SELECT * FROM SAVINGS_ACCOUNT WHERE AccountNo = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
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

    public void insert(SavingsAccount account) {
        String sql = "INSERT INTO SAVINGS_ACCOUNT (AccountNo, MemberID, OpeningDate, AccountType, NomineeID) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, account.getAccountNo());
            stmt.setInt(2, account.getMemberId());
            stmt.setDate(3, account.getOpeningDate() != null ? Date.valueOf(account.getOpeningDate()) : null);
            stmt.setString(4, account.getAccountType());
            if (account.getNomineeId() != null) {
                stmt.setInt(5, account.getNomineeId());
            } else {
                stmt.setNull(5, Types.INTEGER);
            }
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int update(SavingsAccount account) {
        String sql = "UPDATE SAVINGS_ACCOUNT SET MemberID=?, OpeningDate=?, AccountType=?, NomineeID=? WHERE AccountNo=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, account.getMemberId());
            stmt.setDate(2, account.getOpeningDate() != null ? Date.valueOf(account.getOpeningDate()) : null);
            stmt.setString(3, account.getAccountType());
            if (account.getNomineeId() != null) stmt.setInt(4, account.getNomineeId());
            else stmt.setNull(4, java.sql.Types.INTEGER);
            stmt.setLong(5, account.getAccountNo());
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int delete(Long id) {
        String sql = "DELETE FROM SAVINGS_ACCOUNT WHERE AccountNo = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
