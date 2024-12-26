import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../../constants/Colors'; // Adjust the path according to your file structure

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
    },
    formContainer: {
      width: '100%',
      backgroundColor: theme === 'dark' ? '#1c1c1e' : '#ffffff',
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: theme === 'dark' ? '#ffffff' : '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    imageContainer: {
      width: '100%',
      height: 250,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imagePicker: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 30,
      padding: 12,
    },
    formContent: {
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginVertical: 20,
      color: selectedTheme.text,
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      marginBottom: 15,
      paddingHorizontal: 15,
      backgroundColor: theme === 'dark' ? '#2c2c2e' : '#f2f2f7',
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
      fontSize: 16,
    },
    placeholderText: {
      color: theme === 'dark' ? '#8e8e93' : '#c7c7cc',
    },
    button: {
      width: '100%',
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      backgroundColor: selectedTheme.primary,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
};

export default createStyles;

