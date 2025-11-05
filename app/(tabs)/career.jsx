import {
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Career() {
  const jobs = [
    {
      id: 1,
      name: "Product Manager – Recruitment Portal",
      department: "Technology",
      vacancies: 237,
      salary: "₹65,000",
    },
    {
      id: 2,
      name: "Business Development Manager – Insurance",
      department: "Insurance",
      vacancies: 79,
      salary: "₹47,500",
    },
    {
      id: 3,
      name: "Program Manager – Healthcare Awards",
      department: "Healthcare",
      vacancies: 325,
      salary: "₹55,000",
    },
    {
      id: 4,
      name: "Software Developers (Full-Stack)",
      department: "Technology",
      vacancies: 3,
      salary: "₹55,000",
    },
    {
      id: 5,
      name: "Event & Sponsorship Manager",
      department: "Healthcare",
      vacancies: 73,
      salary: "₹42,500",
    },
    {
      id: 6,
      name: "Operations & Claims Executive",
      department: "Insurance",
      vacancies: 760,
      salary: "₹25,000",
    },
    {
      id: 7,
      name: "Customer Relationship Officer",
      department: "Insurance",
      vacancies: 15,
      salary: "₹21,500",
    },
    {
      id: 8,
      name: "Insurance Agents / Freelance Advisors",
      department: "Insurance",
      vacancies: 1550,
      salary: "15% commission",
    },
    {
      id: 9,
      name: "Medical Experts / Jury Members",
      department: "Medical Award",
      vacancies: 127,
      salary: "₹10,000 per cycle",
    },
  ];

  const handleApplyNow = async () => {
    const url = "https://globalhealthandalliedservices.com/currentopening";
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Cannot open URL:", url);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerIcon}>💼</Text>
          <Text style={styles.header}>Career Opportunities</Text>
          <Text style={styles.subHeader}>Multi-Domain Recruitment 2025</Text>
        </View>

        {/* Job Listings Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.row, styles.tableHeader]}>
            <Text style={[styles.cell, styles.headerCell, styles.slNoColumn]}>No.</Text>
            <Text style={[styles.cell, styles.headerCell, styles.postColumn]}>Position</Text>
            <Text style={[styles.cell, styles.headerCell, styles.deptColumn]}>Dept.</Text>
            <Text style={[styles.cell, styles.headerCell, styles.vacancyColumn]}>Openings</Text>
            <Text style={[styles.cell, styles.headerCell, styles.salaryColumn]}>Salary</Text>
          </View>

          {/* Table Rows */}
          {jobs.map((job, index) => (
            <View 
              key={job.id} 
              style={[
                styles.row, 
                index === jobs.length - 1 && styles.lastRow
              ]}
            >
              <Text style={[styles.cell, styles.slNoColumn, styles.centerText]}>
                {job.id}
              </Text>
              <Text style={[styles.cell, styles.postColumn, styles.postText]}>
                {job.name}
              </Text>
              <Text style={[styles.cell, styles.deptColumn]}>
                {job.department}
              </Text>
              <Text style={[styles.cell, styles.vacancyColumn, styles.centerText, styles.vacancyText]}>
                {job.vacancies}
              </Text>
              <Text style={[styles.cell, styles.salaryColumn, styles.salaryText]}>
                {job.salary}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary Section */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryIcon}>📊</Text>
            <Text style={styles.summaryTitle}>Recruitment Summary</Text>
          </View>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>9</Text>
              <Text style={styles.summaryLabel}>Total Positions</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>3,169</Text>
              <Text style={styles.summaryLabel}>Total Vacancies</Text>
            </View>
          </View>

          <View style={styles.departmentSection}>
            <Text style={styles.departmentTitle}>🏢 Departments</Text>
            <View style={styles.departmentList}>
              <View style={styles.departmentBadge}>
                <Text style={styles.departmentText}>💻 Technology</Text>
              </View>
              <View style={styles.departmentBadge}>
                <Text style={styles.departmentText}>🛡️ Insurance</Text>
              </View>
              <View style={styles.departmentBadge}>
                <Text style={styles.departmentText}>🏥 Healthcare</Text>
              </View>
              <View style={styles.departmentBadge}>
                <Text style={styles.departmentText}>🏆 Medical Award</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Apply Button */}
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={handleApplyNow}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonIcon}>🚀</Text>
          <Text style={styles.applyButtonText}>Apply Now</Text>
          <Text style={styles.applyButtonSubtext}>Join Our Growing Team</Text>
        </TouchableOpacity>

        {/* Footer Spacing */}
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 40 : 20,
  },
  
  // Header Styles
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 16,
  },
  headerIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  header: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: 4,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    textAlign: "center",
  },

  // Table Styles
  table: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  tableHeader: {
    backgroundColor: "#6C2DC7",
    borderBottomWidth: 0,
    paddingVertical: 12,
  },
  cell: {
    fontSize: 13,
    color: "#374151",
    paddingHorizontal: 4,
  },
  headerCell: {
    fontWeight: "700",
    color: "#ffffff",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  
  // Column Widths
  slNoColumn: {
    flex: 0.5,
  },
  postColumn: {
    flex: 2.2,
  },
  deptColumn: {
    flex: 1,
  },
  vacancyColumn: {
    flex: 0.8,
  },
  salaryColumn: {
    flex: 1.1,
  },
  
  // Cell Text Styles
  centerText: {
    textAlign: "center",
  },
  postText: {
    fontWeight: "600",
    color: "#1f2937",
    lineHeight: 18,
  },
  vacancyText: {
    fontWeight: "700",
    color: "#6C2DC7",
  },
  salaryText: {
    fontWeight: "600",
    color: "#059669",
    fontSize: 12,
  },

  // Summary Styles
  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#6C2DC7",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
    textAlign: "center",
  },
  departmentSection: {
    marginTop: 8,
  },
  departmentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 12,
  },
  departmentList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  departmentBadge: {
    backgroundColor: "#ede9fe",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#d8b4fe",
  },
  departmentText: {
    fontSize: 13,
    color: "#6C2DC7",
    fontWeight: "600",
  },

  // Apply Button Styles
  applyButton: {
    backgroundColor: "#6C2DC7",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#6C2DC7",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  applyButtonIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  applyButtonSubtext: {
    color: "#e9d5ff",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  footer: {
    height: 32,
  },
});