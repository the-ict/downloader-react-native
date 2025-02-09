import { Video } from "expo-av"
import { useState } from "react"
import { TouchableOpacity, View, Text, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import FontIcon from "react-native-vector-icons/FontAwesome"

import { useTranslation } from "react-i18next"

const VideoPlayer = (props) => {
    const [videoError, setVideoError] = useState("")
    const navigation = props.navigation
    const route = props.route

    const { t } = useTranslation()
    return (
        <SafeAreaView>
            <View
                style={{
                    position: "relative",
                    padding: 20,
                    backgroundColor: "#000"
                }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        position: "absolute",
                        padding: 20,
                        zIndex: 1,
                        left: 20,
                        top: 20,
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack()
                        }}>
                        <FontIcon
                            name='arrow-left'
                            size={25}
                            style={{
                                textAlign: "center",
                                borderRadius: 50,
                                backgroundColor: "black",
                                padding: 10,
                                width: 45
                            }}
                            color={"white"}
                        />
                    </TouchableOpacity>
                    <Text style={{
                        marginLeft: 20,
                        fontSize: 25,
                        fontWeight: "400",
                        color: "white"
                    }}>{t("RETURN")}</Text>
                </View>
                {
                    videoError && (
                        <View style={{
                            marginTop: 300,
                        }}>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontWeight: "500",
                                    fontSize: 25,
                                }}>{videoError}</Text>
                        </View>
                    )
                }
                {route.params.videoUri
                    ?
                    <Video
                        source={{
                            uri: route.params.videoUri,
                        }}
                        useNativeControls // Tabiiy boshqaruvni yoqadi
                        resizeMode="contain" // Video hajmini moslashtirish
                        isLooping // Qayta boshlashni yoqish
                        onError={(error) => console.log(error)}
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 10,
                            padding: 10,
                        }}
                        shouldPlay
                    />
                    :
                    <ActivityIndicator size="small" />}
            </View>
        </SafeAreaView>
    )
}

export default VideoPlayer