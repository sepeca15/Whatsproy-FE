import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';

const createStyles = (theme: typeof Colors.light | typeof Colors.dark) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.text,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userName: {
    fontSize: 18,
    color: '#fff',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: theme.secondary,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    
  },
});

export default createStyles;