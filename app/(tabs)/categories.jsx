import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const user = [
  {
    id: '1',
    img: require('../../assets/images/car-icons.png'),
    Title: 'Car Insurance',
  },
  {
    id: '2',
    img: require('../../assets/images/bike-icon.png'),
    Title: 'Bike Insurance',
  },
  {
    id: '3',
    img: require('../../assets/images/health-icon.png'),
    Title: 'Health Insurance',
  },
  {
    id: '4',
    img: require('../../assets/images/rick.png'),
    Title: 'Auto Insurance',
  },
  {
    id: '5',
    img: require('../../assets/images/home-icon.png'),
    Title: 'Home Insurance',
  },
];

const Categories = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => alert(item.Title)}>
      <Image source={item.img} style={styles.image} />
      <Text style={styles.text}>{item.Title}</Text>
    </TouchableOpacity>
  );

  return (
    <>
     {/* <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-2xl font-bold text-blue-700">Hello Tailwind in RN!</Text>
    </View> */}
      <View style={styles.container}>
      <FlatList
        data={user}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        numColumns={2} // shows cards in grid (2 per row)
        columnWrapperStyle={{ justifyContent: 'space-between' }} // space between columns
      />
    </View>   
    </>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
    paddingTop:300
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    width: '48%',
    marginBottom: 16,
    borderRadius: 10,
    alignItems: 'center',
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
