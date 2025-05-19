import GlobalModal from "@/components/Modal";
import { Image, Text, View } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { StyleSheet, Dimensions } from "react-native";
import { FormattedMessage } from "react-intl";

const { width } = Dimensions.get("window");

const TutorialGreenApi = ({ open, setOpen }: any) => {
  const carouselItems = [
    {
      title: <FormattedMessage id="tutorial.step1.title" />,
      text: <FormattedMessage id="tutorial.step1.text" />,
      urlImage: require("../../../assets/steps/step1GreenApi.png"),
    },
    {
      title: <FormattedMessage id="tutorial.step2.title" />,
      text: <FormattedMessage id="tutorial.step2.text" />,
      urlImage: require("../../../assets/steps/step2GreenApi.png"),
    },
    {
      title: <FormattedMessage id="tutorial.step3.title" />,
      text: <FormattedMessage id="tutorial.step3.text" />,
      urlImage: require("../../../assets/steps/step3GreenApi.png"),
    },
    {
      title: <FormattedMessage id="tutorial.step4.title" />,
      text: <FormattedMessage id="tutorial.step4.text" />,
      urlImage: require("../../../assets/steps/step4GreenApi.png"),
    },
    {
      title: <FormattedMessage id="tutorial.step5.title" />,
      text: <FormattedMessage id="tutorial.step5.text" />,
      urlImage: require("../../../assets/steps/step5GreenApi.png"),
    },
  ];

  return (
    <GlobalModal
      key="addAction"
      isVisible={open}
      onClose={() => setOpen(false)}
      manyItems={true}
      label={<FormattedMessage id="tutorialConnectWhatsapp" />}
      content={
        <View style={styles.modalContent}>
          <SafeAreaView>
            <Swiper
              loop={false}
              showsButtons={false}
              dotStyle={styles.dot}
              activeDotStyle={styles.activeDot}
              buttonWrapperStyle={styles.buttonWrapper}
              nextButton={<></>}
              prevButton={<></>}
              height={400}
            >
              {carouselItems.map((item, index) => (
                <View key={index} style={styles.slide}>
                  <View
                    shadow={"5"}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      visibility: "hidden",
                      overflow: "hidden",
                      borderRadius: 20,
                    }}
                  >
                    <Image
                      source={item?.urlImage}
                      style={{
                        width: 150,
                        height: 230,
                        maxHeight: 230,
                        objectFit: "cover",
                      }}
                    />
                  </View>

                  <Text fontSize={20} fontWeight="bold" mt={2} mb={2}>
                    {item.title}
                  </Text>
                  <Text fontSize={14} textAlign="center">
                    {item.text}
                  </Text>
                </View>
              ))}
            </Swiper>

            <View style={styles.backButtonContainer}>
              <Text onPress={() => setOpen(false)} style={styles.closeText}>
                <FormattedMessage id="tryAgain" />
              </Text>
            </View>
          </SafeAreaView>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  modalContent: {
    minHeight: 280,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    height: 350,
    paddingHorizontal: 20,
    marginBottom: 30
  },
  dot: {
    backgroundColor: "#ccc",
    width: 8,
    
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    marginVertical: 2,
  },
  activeDot: {
    
    backgroundColor: "#128c7e",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
    marginVertical: 2,
  },
  navText: {
    color: "#128c7e",
    fontSize: 30,
    fontWeight: "bold",
    position: "absolute",
  },
  buttonWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    marginTop: -30,
    color: "#128c7e",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  backButtonContainer: {
    paddingTop: 10,
    alignItems: "center",
    marginTop: -60,
  },
});

export default TutorialGreenApi;
