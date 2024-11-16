import AsyncStorage from '@react-native-async-storage/async-storage';

const StoreData = async (key : string,value : string) => {
    try {
        await AsyncStorage.setItem(`${key}`,value)
    } catch (error) {
        console.log(error);
    }
}

const StoreJsonData = async (key : string,value : string) => {
    try {
        const valueToJson = JSON.stringify(CSSMathValue)
        await AsyncStorage.setItem(`${key}`,valueToJson)
    } catch (error) {
        console.log(error);
    }
}

const getData = async(value:string) => {
    try {
        await AsyncStorage.getItem(value)
    } catch (error) {
        console.log(error);
    }
}

const removeData = async(key:string) => {
    try {
        await AsyncStorage.getItem(key)
    } catch (error) {
        console.log(error);
    }
}