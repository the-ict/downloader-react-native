import { DeleteFromDirectory, MoveToFile } from "../functions/file.functions"
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    Image, Linking
} from "react-native"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { downloadContext } from "../context/downloadContext"
import BrowserIcon from "../assets/icons/browser.png"
import RenameIcon from "../assets/icons/rename.png"
import * as FileSystem from "expo-file-system"
import { host } from "../constants/requests"
import * as Sharing from "expo-sharing"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTranslation } from "react-i18next"


export default function VidoeInfoSheet(props) {
    const [changeNameMenu, setChangeNameMenu] = useState(false)
    const [changeName, setChangeName] = useState("")
    const [userId, setUserId] = useState("")

    const { state, dispatch } = useContext(downloadContext)
    const { t } = useTranslation()

    const { querysChanging } = state

    const directory = FileSystem.documentDirectory
    const route = props.route
    const navigation = props.navigation

    useEffect(() => {
        const getUserId = async () => {
            const id = await AsyncStorage.getItem("user_id")
            if (id) setUserId(id)
        }
        getUserId()
    }, [])

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`${host}/api/file/${route.params.file._id}?user_id=${userId}`)
            console.log("video-info:", res.data)
            DeleteFromDirectory(directory + route.params.file.name + ".mp4")
                .then(() => {
                    console.log("Directorydan o'chirib tashlandi...")
                })
                .catch((err) => {
                    console.log("directorydan o'chirib tashlanmadi:", err)
                })
            dispatch({
                type: "querysChanging",
                payload: !querysChanging
            })
            console.log("query changed:", querysChanging)
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                if (route.params.secret) {
                    navigation.navigate('IsSecret'); // Asosiy ekran nomi
                } else {
                    navigation.navigate("FinishedDrawer")
                }
            }
        } catch (error) {
            console.log("deleting error")
        }
    }

    const handleShareVideo = async () => {
        try {
            await Sharing.shareAsync(directory + route.params.file.name + ".mp4")
            console.log("video ulashildi !")
        } catch (error) {
            console.log("sharing video error: ", error.message)
        }
    }

    const handleChangeName = async () => {
        console.log("change name menu")
        console.log("change name: ", changeName)
        try {
            const result = await axios.put(`${host}/api/file/${route.params.file._id}`, {
                name: changeName,
                user_id: userId
            })
            console.log("result: ", result.data)
            if (result.data) {
                MoveToFile(directory + route.params.file.name + ".mp4", directory + changeName + ".mp4")

                dispatch({
                    type: "querysChanging",
                    payload: !querysChanging
                })
                if (navigation.canGoBack()) {
                    navigation.goBack();
                } else {
                    if (route.params.secret) {
                        navigation.navigate('IsSecret'); // Asosiy ekran nomi
                    } else {
                        navigation.navigate("FinishedDrawer")
                    }
                }
            }
        } catch (error) {
            console.log("video info error: ", error.message)
        }
    }

    console.log("file-id: ", route.params.file._id)
    console.log("userId: ", userId)

    const handleToSecret = async () => {
        try {
            const updatedFile = await axios.put(`${host}/api/file/${route.params.file._id}`, {
                isSecret: true,
                user_id: userId
            })

            console.log(updatedFile.data, "secret data")

            dispatch({
                type: "querysChanging",
                payload: !querysChanging
            })

            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                if (route.params.secret) {
                    navigation.navigate('IsSecret'); // Asosiy ekran nomi
                } else {
                    navigation.navigate("FinishedDrawer")
                }
            }

            console.log("updatedFile: ", updatedFile.data)
        } catch (error) {
            console.log("to secret file error")
        }
    }

    const handleToPublic = async () => {
        try {
            const updatedFile = await axios.put(`${host}/api/file/${route.params.file._id}`, {
                isSecret: false,
                user_id: userId
            })

            dispatch({
                type: "querysChanging",
                payload: !querysChanging
            })

            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                if (route.params.secret) {
                    navigation.navigate('IsSecret'); // Asosiy ekran nomi
                } else {
                    navigation.navigate("FinishedDrawer")
                }
            }

            console.log("updatedFile: ", updatedFile.data)
        } catch (error) {
            console.log("to secret file error")
        }
    }

    const handleOpenBrowser = async () => {
        Linking.openURL(route.params.file.downloadUrl[0].downloadUrl)
            .catch(err => console.log("Bu urlni ochib bo'lmadi !"))

    }

    return (
        <View style={{
            padding: 30,
        }}>
            <Modal
                transparent={true}
                visible={changeNameMenu}
                animationType="slide"
                onRequestClose={() => setChangeNameMenu(false)}
                style={{
                    position: "relative",
                }}
                statusBarTranslucent
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View style={{
                        width: 200,
                        height: changeName.length > 0 ? 125 : 100,
                        backgroundColor: "#efefef",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                    }}>
                        <View
                            style={{
                                paddingVertical: 20,
                                paddingHorizontal: 10,
                            }}
                        >
                            <MaterialIcons name="close" size={25} color={"gray"}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                }}
                                onPress={() => {
                                    setChangeNameMenu(false)
                                    setChangeName("")
                                }}
                            />
                            <TextInput
                                placeholder={t("Change name")}
                                style={{
                                    borderStyle: "solid",
                                    borderBottomColor: "black",
                                    borderBottomWidth: 1,
                                }}
                                onChangeText={(text) => setChangeName(text)}
                            />
                            {
                                changeName.length > 0 && (
                                    <TouchableOpacity
                                        style={{
                                            marginVertical: 10,
                                        }}
                                        onPress={handleChangeName}
                                    >
                                        <Text style={{
                                            textAlign: "center",
                                        }}>{t("Change")}</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                </View>
            </Modal>
            <Text style={{
                fontSize: 30,
            }}>{route.params.file.name}.mp4</Text>
            <View style={{
                height: 1,
                width: "100%",
                backgroundColor: "lightgray",
                marginVertical: 10
            }}>

            </View>
            <View>
                {
                    route.params.secret ? (
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            marginBottom: 20,
                            alignItems: "center"
                        }}
                            onPress={handleToPublic}
                        >
                            <MaterialIcons name="folder" size={30} />
                            <Text style={{
                                fontSize: 16,
                                marginLeft: 10,
                                fontWeight: "500",

                            }}>{t("Extract to a hidden file")}</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                marginBottom: 20,
                                alignItems: "center"
                            }}
                                onPress={handleToSecret}
                            >
                                <MaterialIcons name="folder" size={30} />
                                <Text style={{
                                    fontSize: 16,
                                    marginLeft: 10,
                                    fontWeight: "500",

                                }}>{t("Add to hidden file")}</Text>
                            </TouchableOpacity>
                        </>
                    )
                }
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    marginBottom: 20,
                    alignItems: "center"
                }}
                    onPress={handleShareVideo}
                >
                    <MaterialIcons name="share" size={30} />
                    <Text style={{
                        fontSize: 16,
                        marginLeft: 10,
                        fontWeight: "500",

                    }}>Ulashish</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    marginBottom: 20,
                    alignItems: "center"
                }}
                    onPress={() => setChangeNameMenu(true)}
                >
                    <Image source={RenameIcon} style={{
                        width: 30,
                        height: 30,
                    }} />
                    <Text style={{
                        fontSize: 16,
                        marginLeft: 10,
                        fontWeight: "500",

                    }}>{t("Change name")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    marginBottom: 20,
                    alignItems: "center"
                }}
                    onPress={handleOpenBrowser}
                >
                    <Image source={BrowserIcon} style={{
                        width: 30,
                        height: 30,
                    }} />
                    <Text style={{
                        fontSize: 16,
                        marginLeft: 10,
                        fontWeight: "500",

                    }}>{t("Open from browser")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    marginBottom: 20,
                    alignItems: "center"
                }}
                    onPress={handleDelete}
                >
                    <MaterialIcons name="delete" size={30} />
                    <Text style={{
                        fontSize: 16,
                        marginLeft: 10,
                        fontWeight: "500",

                    }}>{t("deleting")}</Text>
                </TouchableOpacity>
            </View >
        </View >
    )
}