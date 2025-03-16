import { BaseToast, ErrorToast } from "react-native-toast-message";

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "green",
        backgroundColor: "#f9f9f9",
        zIndex: 99999,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
      }}
      text2Style={{
        fontSize: 14,
        color: "#666",
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "red",
        backgroundColor: "#fef2f2",
        zIndex: 99999,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#b91c1c",
      }}
      text2Style={{
        fontSize: 14,
        color: "#b91c1c",
      }}
    />
  ),
};

export default toastConfig;
