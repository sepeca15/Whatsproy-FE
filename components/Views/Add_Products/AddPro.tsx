import React from "react";
import AddProduct from "./components/AddProduct";
import { useRouter } from "expo-router";
import { useUser } from "@/hooks/redux/useUser";

const AddPro: React.FC = () => {
  const { user } = useUser();

  const router = useRouter();
  return <AddProduct visible={true} onClose={() => router.navigate("/(tabs)/productos")} onSuccess={() => router.navigate("/(tabs)/productos")} />;
};

export default AddPro;
