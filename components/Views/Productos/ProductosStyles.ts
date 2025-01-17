import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 80,
    width: '100%',
  },
  scrollView: {
    width: '100%',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25, // Increased border radius for a more rounded look
    paddingHorizontal: 15,
    margin: 10,
    width: '95%', // Increased width to take up more space on mobile
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    height: 50, // Fixed height for better touch targets
  },
  searchIcon: {
    marginRight: 10,
    color: '#888',
    fontSize: 18, // Slightly larger icon for better visibility
  },
  searchBar: {
    flex: 1,
    height: '100%', // Take up full height of the container
    borderColor: '#ccc',
    borderWidth: 0,
    borderRadius: 25,
    paddingHorizontal: 10,
    backgroundColor: 'transparent', // Remove background color from input
    fontSize: 16, // Slightly larger font for better readability on mobile
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  graficButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'semibold',
  },
  clearButton: {
    padding: 8,
  },
  clearIcon: {
    color: '#888',
    fontSize: 18,
  },
});

