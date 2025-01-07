import { StyleSheet } from "react-native";

export const ModalStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerContent: {
        width: "90%",
        backgroundColor: 'white',
        borderRadius: 12,
    },
    headerContent: {
        borderTopEndRadius: 12,
        borderTopStartRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: '#2C2C2C',
        alignItems: 'center',
    },
    containerCreate: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    containerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    bodyContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingVertical: 30,
    },
    input: {
        marginTop: 5,
        width: '100%',
        borderWidth: 1,
        borderColor: '#cfcfcf',
        borderRadius: 5,
    },
    inputElement: {},
    decorateDiv: {
        marginBottom: 12,
        width: '60%',
        height: 12,
        borderRadius: 12,
        backgroundColor: '#818181',
    },
    containerInput: {
        marginTop: 15,
        width: '100%',
    },
});