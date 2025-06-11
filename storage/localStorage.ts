import AsyncStorage from "@react-native-async-storage/async-storage";

export const StoreData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(`${key}`, value);
  } catch (error) {
    console.log(error);
  }
};

export const StoreJsonData = async (key: string, value: string) => {
  try {
    const valueToJson = JSON.stringify(CSSMathValue);
    await AsyncStorage.setItem(`${key}`, valueToJson);
  } catch (error) {
    console.log(error);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);    
    return value;
  } catch (error) {
    console.log(error);
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};
