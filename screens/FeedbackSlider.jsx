import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { View, Text, FlatList } from "react-native"
import { Dimensions, Image } from "react-native"
import {
    SafeAreaView
} from "react-native-safe-area-context"


const renderItemFeedback = [
    {
        image: require("../assets/slider/1.jpg"),
        text: "O'zingiz yuklab olmoqchi bo'lgan videoni urlini kiriting !"
    },
    {
        image: require("../assets/slider/2.jpg"),
        text: "Videoni ko'rayotgan paytingizda shu tugma chiqadi shunga bosing va video yuklanishni boshlaydi !"
    },
]

const { width } = Dimensions.get("window")


export default function FeedbackSlider({ navigation }) {
    return (
        <SafeAreaView>
            <View style={{
                height: "100%",
                width: "100%",
                backgroundColor: "#003049",
                paddingHorizontal: 10,
            }}>
                <View>
                    <MaterialIcons name="close" size={30} color={"white"} onPress={() => navigation.goBack()} />
                </View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}

                    data={renderItemFeedback} renderItem={(info) => {
                        return (
                            <View
                                style={{
                                    height: "50%",
                                    width: width - 20,
                                    marginTop: "30%"
                                }}>
                                <Image source={info.item.image}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: 10,
                                    }} />
                                <Text style={{
                                    color: "white",
                                    textAlign: "center",
                                    marginTop: 20,
                                    fontWeight: "bold",
                                    fontSize: 20,
                                }}>{info.item.text}</Text>
                            </View>
                        )
                    }} />
            </View>
        </SafeAreaView>
    )
}