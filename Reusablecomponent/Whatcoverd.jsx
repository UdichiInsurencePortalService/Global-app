import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Whatcoverd = ({ title = 'Coverage Items', data = [] }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  const handleCardPress = (item) => {
    if (!item.title) return;
    setSelectedItem(item);
    setModalVisible(true);
    
    // Reset animations
    scaleAnim.setValue(0);
    fadeAnim.setValue(0);
    slideAnim.setValue(300);
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedItem(null);
    });
  };

  // Pad to make the number of items divisible by 3
  const paddedData = (() => {
    const mod = data.length % 3;
    if (mod === 0) return data;
    const padding = new Array(3 - mod).fill({ id: 'placeholder' });
    return [...data, ...padding];
  })();

  const renderCoverageItem = ({ item, index }) => {
    if (item.id === 'placeholder') {
      return <View style={styles.cardPlaceholder} />;
    }

    return (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: item.backgroundColor || '#F8FAFC' },
        ]}
        activeOpacity={0.7}
        onPress={() => handleCardPress(item)}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            {typeof item.iconText === 'string' ? (
              <Text style={styles.cardIconText}>{item.iconText}</Text>
            ) : (
              <Image
                source={item.iconText}
                style={styles.cardImageIcon}
                resizeMode="contain"
              />
            )}
          </View>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>{title}</Text>
        {/* <View style={styles.underline} /> */}
      </View>

      <FlatList
        data={paddedData}
        renderItem={renderCoverageItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      {/* Enhanced Modal */}
      <Modal
        animationType="none"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim },
                ],
              },
            ]}
          >
            {selectedItem && (
              <>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <View style={styles.closeButtonBackground}>
                    <Text style={styles.closeButtonText}>×</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.modalHeader}>
                  <View style={[
                    styles.modalIconContainer,
                    { backgroundColor: selectedItem.backgroundColor || '#F3F4F6' }
                  ]}>
                    {typeof selectedItem.iconText === 'string' ? (
                      <Text style={styles.modalIconText}>
                        {selectedItem.iconText}
                      </Text>
                    ) : (
                      <Image
                        source={selectedItem.iconText}
                        style={styles.modalImageIcon}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                  
                  <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.modalDescription}>
                    {selectedItem.description}
                  </Text>
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.okButton}
                    onPress={closeModal}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.okButtonText}>Got it</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FFFFFF',
    // paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 10,
  },
  headerContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  heading: {
    fontWeight: '700',
    fontSize: 24,
    textAlign: 'center',
    color: '#1F2937',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  underline: {
    width: 50,
    height: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    width: (width - 60) / 3,
    height: 120,
    borderRadius: 16,
    padding: 10,
    // margin:2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardPlaceholder: {
    width: (width - 40) / 3,
    height: 120,
    backgroundColor: 'transparent',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIconText: {
    fontSize: 20,
    fontWeight: '600',
  },
  cardImageIcon: {
    width: 33,
    height: 33,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 16,
    // fontFamily:""
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 28,
    width: '100%',
    maxWidth: 380,
    minHeight: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  closeButtonBackground: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '600',
    lineHeight: 20,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalIconText: {
    fontSize: 36,
    fontWeight: '600',
  },
  modalImageIcon: {
    width: 48,
    height: 48,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    minHeight: 80,
    justifyContent: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  modalFooter: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  okButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default Whatcoverd;