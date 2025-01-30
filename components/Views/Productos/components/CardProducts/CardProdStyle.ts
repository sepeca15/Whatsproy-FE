import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    height: 150,
    width: '95%', 
  },
  imageContainer: {
    width: 130, 
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titlePriceContainer: {
    flex: 1,
    marginRight: 8,
    
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2ecc71',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // category: {
  //   fontSize: 12,
  //   color: '#888',
  //   flex: 1,
  // },
  editButton: {
    padding: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  categoryLabel: {
    position: 'absolute',
    top: 3,
    left: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10, 
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  containerFatehr: {
    width: '100%', 

  },
  
  
});
