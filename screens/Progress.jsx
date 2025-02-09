import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import { SafeAreaView } from "react-native-safe-area-context";
import { downloadContext } from "../context/downloadContext"
import { useContext, useEffect } from "react"
import Video from "../components/Video"
import { useTranslation } from "react-i18next";

export default function Progress({ navigation }) {
    const { state, dispatch } = useContext(downloadContext)
    const { querysChanging } = state
    const { t } = useTranslation()

    useEffect(() => {
        console.log("query changing updated progress:", querysChanging)
    }, [querysChanging])
    const downloadVideos = state.videos

    return (
        <SafeAreaView>
            <View style={{
                padding: 10,
                backgroundColor: "#afe2ec",
                width: 'auto',
                marginHorizontal: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 10,
            }}>
                <Text
                    style={{
                        fontSize: 20,
                        width: "60%"
                    }}>{t("TO BE CONTINUED...")}</Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate("FeedBack")}
                >
                    <MaterialIcon name="message" size={20}
                        style={{
                            width: 20,
                        }}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView style={{
                marginHorizontal: 10,
            }}>
                {
                    downloadVideos.map((item, index) => (<Video video={item} key={index} />))
                }
            </ScrollView>
        </SafeAreaView>
    );
}
