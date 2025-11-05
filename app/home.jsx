import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const coverageItems = [
    { icon: 'home', title: 'Structure Damage', description: 'Fire, storm, vandalism' },
    { icon: 'shield-checkmark', title: 'Personal Property', description: 'Furniture, electronics' },
    { icon: 'people', title: 'Liability Protection', description: 'Legal & medical costs' },
    { icon: 'medkit', title: 'Medical Payments', description: 'Guest injuries' },
  ];

  const notCoveredItems = [
    { icon: 'water', title: 'Floods', description: 'Requires separate policy' },
    { icon: 'earth', title: 'Earthquakes', description: 'Need additional coverage' },
    { icon: 'bug', title: 'Pest Damage', description: 'Termites, rodents' },
    { icon: 'construct', title: 'Poor Maintenance', description: 'Wear and tear' },
  ];

  const insuranceTypes = [
    { icon: 'home-outline', title: 'HO-3', subtitle: 'Most Popular', color: '#4A90E2' },
    { icon: 'business', title: 'HO-5', subtitle: 'Premium Coverage', color: '#7B68EE' },
    { icon: 'apartment', title: 'HO-6', subtitle: 'Condo Insurance', color: '#50C878' },
    { icon: 'key', title: 'HO-4', subtitle: 'Renters Insurance', color: '#FF6B6B' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="home" size={48} color="#4A90E2" />
        <Text style={styles.headerTitle}>Home Insurance</Text>
        <Text style={styles.headerSubtitle}>Protect your most valuable asset</Text>
      </View>

      {/* What's Covered Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
          <Text style={styles.sectionTitle}>What's Covered</Text>
        </View>
        <View style={styles.grid}>
          {coverageItems.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name={item.icon} size={32} color="#4CAF50" />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Not Covered Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="close-circle" size={28} color="#F44336" />
          <Text style={styles.sectionTitle}>Not Covered</Text>
        </View>
        <View style={styles.grid}>
          {notCoveredItems.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name={item.icon} size={32} color="#F44336" />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Types of Insurance Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="documents" size={28} color="#4A90E2" />
          <Text style={styles.sectionTitle}>Types of Home Insurance</Text>
        </View>
        <View style={styles.typesList}>
          {insuranceTypes.map((type, index) => (
            <TouchableOpacity key={index} style={styles.typeCard}>
              <View style={[styles.typeIcon, { backgroundColor: type.color + '20' }]}>
                <Ionicons name={type.icon} size={36} color={type.color} />
              </View>
              <View style={styles.typeInfo}>
                <Text style={styles.typeTitle}>{type.title}</Text>
                <Text style={styles.typeSubtitle}>{type.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaText}>Get a Quote</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  typesList: {
    gap: 12,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  typeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  typeInfo: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  typeSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    marginHorizontal: 20,
    marginTop: 32,
    padding: 18,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  bottomPadding: {
    height: 40,
  },
});