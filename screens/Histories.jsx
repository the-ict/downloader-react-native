import { View, Text, Image, TouchableOpacity, Modal, FlatList, Share, Dimensions } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Materialicons from "react-native-vector-icons/MaterialIcons"
import { SafeAreaView } from "react-native-safe-area-context"
import { useEffect, useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { hasIcon } from "../functions/drawer.functions"
import { ActivityIndicator } from "react-native"
import BackImg from "../assets/icons/back.png"
import DotsImg from "../assets/icons/dots.png"
import { host } from "../constants/requests"
import * as Clipboard from "expo-clipboard"
import { Button } from "react-native"
import axios from "axios"

import { useTranslation } from "react-i18next"



export default function History({ navigation }) {
    const [historiesMenu, setHistoriesMenu] = useState({})
    const [deleteMenu, setDeleteMenu] = useState(false)
    const [loading, setLoading] = useState(false)
    const [histories, setHistories] = useState([])
    const [userId, setUserId] = useState("")
    const [querys, setQuerys] = useState([])

    const isPhone = Dimensions.get("window").height < 1300

    const { t } = useTranslation()

    useEffect(() => {
        const getHistories = async () => {
            const id = await AsyncStorage.getItem("user_id")
            setLoading(true)
            if (id) {
                try {
                    setUserId(id)
                    const userHistories = await axios.get(`${host}/api/query/${id}`)
                    const userHis = userHistories.data.map(item => item.history)

                    userHis.map(his => {
                        if (his.length > 0) {
                            for (let i of his) {
                                console.log("I: ", i)
                                setHistories(prev => [...prev, i])
                            }
                        }
                    })
                    setLoading(false)
                    setQuerys(userHistories.data)
                } catch (error) {
                    console.log("histories olinmadi: ", error)
                    setLoading(false)
                }
            }
        }
        getHistories()
    }, [])

    useEffect(() => {
        if (Array.isArray(histories)) {
            const initialMenuState = {};
            histories.forEach((_, index) => {
                initialMenuState[index] = false;
            });
            setHistoriesMenu(initialMenuState);
        }
    }, [histories])


    const handleMenuClick = (index) => {
        setHistoriesMenu(prev => ({ ...prev, [index]: !prev[index] }))
    }

    const handleGoBack = () => {
        navigation.goBack()
    }

    const handleDeleteAll = () => {
        setDeleteMenu(true)
    }

    const deletionAccepted = async () => {
        setLoading(true)
        for (let query of querys) {
            if (userId) {
                console.log('querys id: ', query._id)
                console.log("userId: ", userId)
                try {
                    const res = await axios.delete(`${host}/api/query/${query._id}?user_id=${userId}`)
                    console.log(res.data)
                } catch (error) {
                    setLoading(false)
                    setDeleteMenu(false)
                    console.log("querylarni o'chirib tashlab bo'lmadi: ", error)
                }
            } else {
                console.log("userId mavjud emas !")
            }
        }
        setLoading(false)
        setDeleteMenu(false)

    }
    return (
        <SafeAreaView>
            <View style={{
                width: "100%",
                justifyContent: 'center',
                paddingHorizontal: 20,
            }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%"
                    }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 10,
                        }}
                    >
                        <TouchableOpacity
                            onPress={handleGoBack}
                        >
                            <Image source={BackImg} style={{
                                width: isPhone ? 30 : 40,
                                height: isPhone ? 30 : 40,
                                resizeMode: "contain"
                            }} />
                        </TouchableOpacity>
                        <Text
                            style={{
                                marginLeft: 20,
                                fontSize: 20,
                                fontWeight: "500",
                            }}
                        >{t("history")}</Text>
                    </View>
                    <Materialicons name="delete" size={isPhone ? 25 : 30} onPress={handleDeleteAll} />
                </View>
                <Modal
                    visible={deleteMenu}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setDeleteMenu(false)}
                >
                    <View

                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: isPhone ? 14 : 17,
                                }}
                            >{loading ? <ActivityIndicator size={"small"} /> : `${t("Should all history really be erased?")}`}</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                marginVertical: 7,
                            }}
                        >
                            <Button title={t("yes")} color={"green"} onPress={() => {
                                deletionAccepted()
                            }} />
                            <View style={{
                                marginHorizontal: 10,
                            }}></View>
                            <Button title={t("no")} color={"red"} onPress={() => {
                                setDeleteMenu(false)
                            }} />
                        </View>
                    </View>
                </Modal>
                {
                    histories.length > 0 ? (
                        <FlatList
                            data={histories}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <View
                                        key={index + 10 - 20 + 224}
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%",
                                            borderBottomColor: "#000",
                                            borderBottomWidth: 1,
                                            borderStyle: "solid",
                                            position: "relative",
                                            paddingVertical: 7,
                                        }}
                                    >
                                        <View>
                                            <Text style={{
                                                fontSize: isPhone ? 13 : 15,
                                                fontWeight: "500",
                                            }}
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >{item}</Text>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    marginVertical: 10,
                                                }}
                                            >
                                                {hasIcon(item)}
                                                <Text style={{
                                                    fontSize: isPhone ? 12 : 15,
                                                    marginLeft: 10,
                                                    color: "gray"
                                                }}
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >{item}</Text>
                                            </View>
                                        </View>
                                        <TouchableWithoutFeedback
                                            onPress={() => handleMenuClick(index)}
                                        >
                                            <Image source={DotsImg} style={{
                                                width: isPhone ? 25 : 30,
                                                height: isPhone ? 25 : 30,
                                                resizeMode: "contain"
                                            }} />
                                        </TouchableWithoutFeedback>
                                        {
                                            historiesMenu[index] && (
                                                <HistoryMenu setHistoriesMenu={setHistoriesMenu} history={item} />
                                            )
                                        }
                                    </View>
                                )
                            }}
                        />
                    ) : histories.length === 0 && <Text style={{ textAlign: "center" }}>{t("no history")}</Text>
                }
            </View>
        </SafeAreaView >
    )
}

const HistoryMenu = ({ history }) => {

    const handleCopy = () => {
        Clipboard.setString(history)
    }

    const handleShare = async () => {
        await Share.share({
            message: history
        })
    }

    return (
        <Modal
            visible
        >
            <View
                style={{
                    position: "absolute",
                    top: 50,
                    right: 10,
                    width: 200,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 11 },
                    shadowOpacity: 0.57,
                    shadowRadius: 15.19,
                    elevation: 30,
                    padding: 10,
                    zIndex: 999,
                    backgroundColor: "#efefef",
                    flex: 1,  // Qo'shildi
                }}
            >
                <TouchableOpacity
                    style={{ width: '100%', flexDirection: "row", marginVertical: 10, alignItems: "center" }}
                    onPress={handleCopy}
                >
                    <Materialicons name="content-copy" size={25} />
                    <Text style={{ marginLeft: 10, width: "50%" }}>Nusxalash</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: '100%', flexDirection: "row", marginVertical: 10, alignItems: "center" }}
                    onPress={handleShare}
                >
                    <Materialicons name="share" size={25} />
                    <Text style={{
                        marginLeft: 10,
                    }}>Ulashish</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}