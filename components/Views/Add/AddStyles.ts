import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../../constants/Colors'; // Ajusta la ruta según tu estructura de archivos

const { width } = Dimensions.get('window');

const createStyles = (theme: 'light' | 'dark') => {
  const selectedTheme = theme === 'dark' ? Colors.dark : Colors.light;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: selectedTheme.background,
    },
    scrollContainer: {
      flexGrow: 1,
      alignItems: 'center',
      padding: 20,
    },
    image: {
      width: width,
      height: width * 0.5, // Adjust this ratio as needed
      resizeMode: 'cover',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 20,
      color: selectedTheme.text,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      marginBottom: 15,
      paddingHorizontal: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      backgroundColor: selectedTheme.background,
      width: '100%',
    },
    icon: {
      marginRight: 10,
      color: selectedTheme.primary,
    },
    input: {
      flex: 1,
      height: 50,
      color: selectedTheme.text,
    },
    placeholderText: {
      color: selectedTheme.tabIconDefault,
    },
    button: {
      width: '50%',
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      backgroundColor: selectedTheme.primary,
    },
    buttonDisabled: {
      backgroundColor: selectedTheme.primary,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
};

export default createStyles;

