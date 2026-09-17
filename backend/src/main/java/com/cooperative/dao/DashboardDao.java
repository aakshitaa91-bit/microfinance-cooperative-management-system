package com.cooperative.dao;

import com.cooperative.model.DashboardSummary;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;

@Repository
public class DashboardDao {

    private final DataSource dataSource;

    public DashboardDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public DashboardSummary getSummary() {
        DashboardSummary summary = new DashboardSummary();
        String sql = "SELECT " +
                "(SELECT COUNT(*) FROM `MEMBER`) AS totalMembers, " +
                "(SELECT COUNT(*) FROM COOPERATIVE_SOCIETY) AS totalSocieties, " +
                "(SELECT COUNT(*) FROM VILLAGE_AREA) AS totalVillageAreas, " +
                "(SELECT COUNT(*) FROM STAFF) AS totalStaff, " +
                "(SELECT COUNT(*) FROM FUND) AS totalFunds, " +
                "(SELECT COUNT(*) FROM COOPERATIVE_GROUP) AS totalGroups, " +
                "(SELECT COUNT(*) FROM SAVINGS_ACCOUNT) AS totalSavingsAccounts, " +
                "(SELECT COUNT(*) FROM LOAN) AS totalLoans, " +
                "(SELECT COUNT(*) FROM REPAYMENT) AS totalRepayments";
                
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                summary.setTotalMembers(rs.getInt("totalMembers"));
                summary.setTotalSocieties(rs.getInt("totalSocieties"));
                summary.setTotalVillageAreas(rs.getInt("totalVillageAreas"));
                summary.setTotalStaff(rs.getInt("totalStaff"));
                summary.setTotalFunds(rs.getInt("totalFunds"));
                summary.setTotalGroups(rs.getInt("totalGroups"));
                summary.setTotalSavingsAccounts(rs.getInt("totalSavingsAccounts"));
                summary.setTotalLoans(rs.getInt("totalLoans"));
                summary.setTotalRepayments(rs.getInt("totalRepayments"));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return summary;
    }
}
