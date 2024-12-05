import { StyleSheet } from 'react-native';

const SettingsStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#CED0CE',
    },
});

export default SettingsStyles;