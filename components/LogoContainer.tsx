import React from "react";
import { Box, Image } from "native-base";

const LogoContainer: React.FC = () => {
  return <Box size={150} bg="gray.300" borderRadius="full">
    <Image 
      alt="logo" w="100%"
      h="100%"
      resizeMode="cover"
      rounded={'full'} 
      source={{ uri: "/assets/images/icon.png" }} />
  </Box>;
};

export default LogoContainer;
