import { View, Text, Image, TouchableOpacity, ScrollView, Switch, Modal } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import BackIcon from "../assets/icons/back.png"
import { useEffect, useState } from "react"
import * as FileSystem from "expo-file-system"
import { useTranslation } from "react-i18next"
import i18next from "i18next"

export default function Settings({ navigation }) {
    const [languageMenu, setLanguageMenu] = useState(false)
    const [saveProfile, setsaveProfile] = useState(false)
    const [currentLan, setCurrentLan] = useState("uz")
    const [saveGalary, setSaveGalary] = useState(true)
    const [searchOps, setSearchOps] = useState(false)
    const [onlyWifi, setOnlyWifi] = useState(false)
    const [userId, setUserId] = useState("")
    const [ads, setAds] = useState(false)

    const { t } = useTranslation()


    useEffect(() => {
        const getUserId = async () => {
            try {
                const user_id = await AsyncStorage.getItem("user_id")
                if (user_id) setUserId(user_id)
                console.log("settings-user_id: ", user_id)
            } catch (error) {
                console.log("userni olib bo'lmadi-settings: ", error.message)
            }
        }
        getUserId()
    }, [])


    useEffect(() => {
        const changeSettings = async () => {
            await AsyncStorage.setItem("saveProfile", JSON.stringify(saveProfile))
            await AsyncStorage.setItem("saveGalary", JSON.stringify(saveGalary))
            await AsyncStorage.setItem("onlyWifi", JSON.stringify(onlyWifi))
            await AsyncStorage.setItem("ads", JSON.stringify(ads))
        }

        changeSettings()
    }, [onlyWifi, ads, saveProfile, saveGalary]);

    const changeLanguage = (lan) => {
        i18next.changeLanguage(lan)
    }


    const chooseLanguage = (languageFlag) => {
        if (languageFlag === "uz") {
            return "Uzbek";
        } else if (languageFlag === "ru") {
            return "Russia";
        } else if (languageFlag === "ar") {
            return "Arabic";
        } else if (languageFlag === "de") {
            return "German";
        } else if (languageFlag === "ja") {
            return "Japanese";
        } else if (languageFlag === "tg") {
            return "Tajik";
        } else if (languageFlag === "kk") {
            return "Kazakh";
        } else {
            return "English";
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <ScrollView style={{
                    marginVertical: 20,
                    paddingHorizontal: 20,
                }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: 'center',
                        }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={BackIcon} style={{
                                width: 30,
                                height: 30,
                                objectFit: "contain"
                            }} />
                        </TouchableOpacity>
                        <Text
                            style={{
                                marginLeft: 10,
                                fontSize: 20,
                            }}>{t("Settings")}</Text>
                    </View>
                    <View
                        style={{
                            marginTop: 30,
                        }}>
                        <Text
                            style={{
                                color: "blue"
                            }}>{t("Download")}</Text>
                        <View
                            style={{
                                width: "100%",
                                height: 70,
                                marginVertical: 20,
                            }}>
                            <Text
                                style={{
                                    fontSize: 20,
                                }}>{t("Download location")}</Text>
                            <Text
                                style={{
                                    color: "gray"
                                }}>{FileSystem.documentDirectory}</Text>
                        </View>
                        <View style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: "lightgray",
                            marginBottom: 20,
                        }}></View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 20,
                            }}>
                            <Text style={{
                                fontSize: 20,
                            }}>{t("Upload via wifi only")}</Text>
                            <Switch
                                onValueChange={() => setOnlyWifi(!onlyWifi)}
                                value={onlyWifi} />
                        </View>
                        <View style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: "lightgray",
                            marginBottom: 20,
                        }}></View>
                        <Text style={{
                            color: "blue"
                        }}>{t("Browser")}</Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginVertical: 20,
                                alignItems: "center",
                                paddingHorizontal: 0.001,
                            }}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 16,
                                    }}>{t("Block ads")}</Text>
                                <Text>{ads ? `${t("On")}` : `${t("Off")}`}</Text>
                            </View>
                            <Switch
                                onValueChange={() => setAds(!ads)}
                                value={ads} />
                        </View>
                        <View style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: "lightgray",
                            marginBottom: 20,
                        }}></View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: "center",
                                paddingHorizontal: 0.001,
                            }}>
                            <View
                                style={{
                                    marginBottom: 20,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                    }}>{t("Save your password")}</Text>
                                <Text>{t("Well-known")}</Text>
                            </View>
                            <Switch
                                onValueChange={() => setsaveProfile(!saveProfile)}
                                value={saveProfile} />
                        </View>
                        <View style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: "lightgray",
                            marginBottom: 20,
                        }}></View>
                        <TouchableOpacity onPress={() => setSearchOps(true)}>
                            <View
                                style={{
                                    marginBottom: 20,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                    }}>{t("Search engine")}</Text>
                                <Text>Google</Text>
                            </View>
                        </TouchableOpacity>
                        {/* <Modal visible={searchOps}
                        // style={{
                        //     flex: 1,
                        //     justifyContent: "center",
                        //     alignItems: "center",
                        //     backgroundColor: "rgba(0,0,0,0.3)"
                        // }}
                        >
                            <View style={{

                            }}>
                                <TouchableOpacity onPress={() => setSearchOps(false)}>

                                </TouchableOpacity>
                                <View>
                                    <Text>Hello text</Text>
                                </View>
                            </View>
                        </Modal> */}
                        <View style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: "lightgray",
                            marginBottom: 20,
                        }}></View>
                        <TouchableOpacity onPress={() => alert("Done")}>
                            <View
                                style={{
                                    marginBottom: 20,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                    }}>{t("Clearing caches")}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: "lightgray",
                            marginBottom: 20,
                        }}></View>
                        <TouchableOpacity onPress={() => alert("Done")}>
                            <View
                                style={{
                                    marginBottom: 20,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                    }}>{t("Delete browser history")}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: "lightgray",
                            marginBottom: 20,
                        }}></View>
                        <TouchableOpacity onPress={() => alert("Done")}>
                            <View
                                style={{
                                    marginBottom: 20,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                    }}>{t("Clear cookies")}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: "lightgray",
                            marginBottom: 20,
                        }}></View>
                        <Text
                            style={{
                                color: "blue"
                            }}>
                            {t("General settings")}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <View
                                style={{
                                    marginBottom: 20,
                                    marginTop: 10,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                    }}>{t("Change language")}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setLanguageMenu(true)}
                            >
                                <Text
                                    style={{
                                        color: "blue",
                                    }}
                                >
                                    {chooseLanguage(currentLan)}
                                </Text>
                            </TouchableOpacity>
                            <Modal
                                visible={languageMenu}
                                onRequestClose={() => setLanguageMenu(false)}
                                animationType="slide"
                                presentationStyle="formSheet"
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",

                                }}>
                                    <View>
                                        {[{
                                            flag: "en",
                                            native: "English"
                                        }, {
                                            flag: "ru",
                                            native: "Russia"
                                        }, {
                                            flag: "uz",
                                            native: "Uzbek"
                                        }, {
                                            flag: "ar",
                                            native: "Arabic"
                                        }, {
                                            flag: "de",
                                            native: "German"
                                        }, {
                                            flag: "ja",
                                            native: "Japanese"
                                        }, {
                                            flag: "tg",
                                            native: "Tajik"
                                        }, {
                                            flag: "kk",
                                            native: "Kazakh"
                                        }].map((lan, index) => {
                                            return (
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={() => {
                                                        changeLanguage(lan.flag)
                                                        setCurrentLan(lan.flag)
                                                        setLanguageMenu(false)
                                                    }}
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: "center",
                                                        justifyContent: "space-between"
                                                    }}
                                                >
                                                    <View style={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: 50,
                                                        backgroundColor: currentLan == lan.flag ? "#3a86ff" : "lightgray"
                                                    }}></View>
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            fontWeight: "500",
                                                            marginVertical: 10,
                                                            marginLeft: 25,
                                                        }}
                                                    >{lan.native}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                            </Modal>
                        </View>
                        <View style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: "lightgray",
                            marginBottom: 20,
                        }}></View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: "center",
                                paddingHorizontal: 0.001,
                            }}>
                            <View
                                style={{
                                    marginBottom: 20,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                    }}>{t("Save to gallery")}</Text>
                                <Text>{saveGalary ? "Yoniq" : "O'chiq"}</Text>
                            </View>
                            <Switch
                                onValueChange={() => setSaveGalary(!saveGalary)}
                                value={saveGalary} />
                        </View>
                        <View style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: "lightgray",
                            marginBottom: 20,
                        }}></View>
                        <Text
                            style={{
                                color: "blue"
                            }}
                        >
                            {t("Help")}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("FeedbackSlider")}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: "center",
                                paddingHorizontal: 0.001,
                            }}>
                            <View
                                style={{
                                    marginBottom: 20,
                                    marginTop: 10,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                    }}>{t("How can I download it?")}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: "lightgray",
                            marginBottom: 20,
                        }}></View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("FeedBack")}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: "center",
                                paddingHorizontal: 0.001,
                            }}>
                            <View
                                style={{
                                    marginBottom: 20,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                    }}>{t("For reference")}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider >
    )
}