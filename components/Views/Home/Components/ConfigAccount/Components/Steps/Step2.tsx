import React, { useRef, useEffect } from "react";
import { ScrollView as RNScrollView, View } from "react-native";
import { styles } from "../../ConfigAccountStyles";
import MethodOfPayCard from "../MethodOfpaycard";

interface IStep2 {
  onContinue: ()=> void;
}

const typesOfPlan = [
  {
    name:'Basic Plan',
    price:'9.90',
    adventages: [
      'Mensajes ilimitados',
      'Respuesta rapida',
    ]
  },
  {
    name:'Medium Plan',
    price:'19.90',
    adventages: [
      'Mensajes ilimitados',
      'Respuesta rapida',
      'Cierre provisorio',
    ],
    isPopular: true
  },
  {
    name:'Hard Plan',
    price:'49.90',
    adventages: [
      'Mensajes ilimitados',
      'Respuesta rapida',
      'Cierre provisorio',
      'Multiples cuentas',
      'Calendario'
    ]
  }
]

const Step2 = ({onContinue}: IStep2) => {
  const scrollViewRef = useRef<RNScrollView>(null); 

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 200, animated: false });
    }
  }, []);

  return (
    <RNScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.containerStep2}
      ref={scrollViewRef}
    >
      <View style={styles.test}>
        {
          typesOfPlan.map((Plan)=> {
            return <MethodOfPayCard next={onContinue} Plan={Plan} />
          })
        }
      </View>
    </RNScrollView>
  );
};

export default Step2;
