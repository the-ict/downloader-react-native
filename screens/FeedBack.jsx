import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import Checkbox from "expo-checkbox"
import * as Font from "expo-font"
import { useTranslation } from "react-i18next"
import "../services/i18next.js"



export default function FeedBack({ navigation }) {
    const [isOther, setIsOther] = useState(false)
    const [isAds, setIsAds] = useState(false)
    const [isDownloadError, setIsDownloaderError] = useState(false)
    const [isButton, setIsButton] = useState(false)
    const [errorTitle, setErrorTitle] = useState("")

    const { t } = useTranslation()

    useEffect(() => {
        const loadFont = async () => {
            await Font.loadAsync({
                "inter-bold": require("../font/inter/Inter_18pt-Bold.ttf"),
                "inter-medium": require("../font/inter/Inter_18pt-Medium.ttf")
            })
        }
        loadFont()
    }, [])


    const hanldeSubmit = () => {
        navigation.goBack()
        alert("Sizning xabaringiz yuborildi !")
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <View>
                    <View
                        style={{
                            width: "100%",
                            backgroundColor: "#ededed",
                            padding: 20,
                        }}>
                        <View
                            style={{
                                flexDirection: "row",
                                width: 400,
                                alignItems: "center",
                            }}
                        >
                            <MaterialIcons
                                style={{
                                    backgroundColor: "lightblue",
                                    marginRight: 10,
                                    borderRadius: 20,
                                }}
                                name="arrow-left" size={40} color={"black"}
                                onPress={() => {
                                    navigation.goBack()
                                }} />
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "400"
                                }}>{t('Feedback')}</Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 20,
                                marginVertical: 10,
                                fontWeight: "bold",
                                fontFamily: "inter-medium",
                                color: "#505A5B"
                            }}>
                            {t('Tell us about the problem you are experiencing!')}
                        </Text>
                        <Text
                            style={{
                                fontFamily: "inter-bold",
                                fontSize: 15,
                                color: 'gray'
                            }}>
                            {t("Type")}
                        </Text>
                    </View>
                    <View
                        style={{
                            paddingHorizontal: 20,
                        }}>
                        <View

                            style={{
                                flexDirection: "row",
                                marginVertical: 5,
                            }}>
                            <Checkbox
                                style={{}}
                                value={isDownloadError}
                                onValueChange={() => {
                                    setIsDownloaderError(!isDownloadError)
                                    setIsButton(true)
                                }}
                                color={isDownloadError ? '#0dce80' : undefined}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    marginLeft: 10,
                                }}>
                                {t('Cannot view videos!')}
                            </Text>
                        </View>
                        <View

                            style={{
                                flexDirection: "row",
                                marginVertical: 5,

                            }}>
                            <Checkbox
                                style={{}}
                                value={isAds}
                                onValueChange={() => {
                                    setIsAds(!isAds)
                                    setIsButton(true)
                                }}
                                color={isAds ? '#0dce80' : undefined}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    marginLeft: 10,
                                }}>
                                {t("Too many ads!")}
                            </Text>
                        </View>
                        <View

                            style={{
                                flexDirection: "row",
                                marginVertical: 5,
                            }}>
                            <Checkbox
                                value={isOther}
                                onValueChange={() => {
                                    setIsOther(!isOther)
                                    setIsButton(true)
                                }}
                                color={isOther ? '#0dce80' : undefined}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    marginLeft: 10,
                                }}>
                                {t("Other reasons!")}
                            </Text>
                        </View>
                        <View
                            style={{
                                width: "100%",
                                height: 100,
                                backgroundColor: "#efefef",
                                marginTop: 20,
                                shadowColor: "#000000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                padding: 10,
                            }}
                        >
                            <TextInput
                                placeholder={t("Write!")}
                                numberOfLines={1}
                                onChangeText={(title) => {
                                    setErrorTitle(title)
                                }}
                            />
                        </View>
                        {
                            isButton && (
                                <TouchableOpacity
                                    onPress={hanldeSubmit}
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        borderRadius: 10,
                                        backgroundColor: "#4fce8c"
                                    }}>
                                    <Text style={{
                                        fontSize: 15,
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        color: "#efefef",
                                        fontFamily: "inter-bold"
                                    }}>{t("Write!")}</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}