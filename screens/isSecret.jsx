import { Image, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import React, { useContext, useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { downloadContext } from "../context/downloadContext"
import FontIcon from "react-native-vector-icons/FontAwesome"
import FinishedVideo from "../components/FinishedVideo"
import DotsMenuIcon from "../assets/icons/dots.png"
import { host } from "../constants/requests"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import axios from "axios"
import { useTranslation } from "react-i18next"



export default function IsSecret({ navigation }) {
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteItem, setDeleteItem] = useState(false)
    const [selected, setSelected] = useState([])
    const [userId, setUserId] = useState("")
    const [menu, setMenu] = useState(false)
    const [files, setFiles] = useState([])

    const { state, dispatch } = useContext(downloadContext)
    const { t } = useTranslation()
    const { querysChanging } = state

    useEffect(() => {
        const getUserId = async () => {
            const id = await AsyncStorage.getItem("user_id")
            if (id) setUserId(id)
            else {
                console.log('storageda id mavjud emas-isSecret:')
            }
        }
        getUserId()
        const getFiles = async () => {
            try {
                if (userId) {
                    const filesRes = await axios.get(host + "/api/file/" + userId)
                    setFiles(filesRes.data)
                    console.log("isSecret files: ", filesRes.data)
                } else {
                    console.log("userId mavjud emas: ", userId)
                }
            } catch (error) {
                console.log("Files error:", error)
            }
        }
        getFiles()
    }, [querysChanging])


    const handleCheck = (check_id, check) => {
        if (!check) {
            setSelected(prev => ([...prev, check_id]))
        } else if (selected.includes(check_id)) {
            setSelected(prev => prev.filter(item => item !== check_id))
        }
    }

    const handleDelete = async () => {
        setDeleteLoading(true)
        if (!selected) return 0;
        try {
            for (let oneSelected of selected) {
                const oneSelectedFile = files.filter(file => file._id === oneSelected)
                console.log("oneSelectedFile:", oneSelectedFile[0].name)
                const res = await axios.delete(`${host}/api/file/${oneSelected}?user_id=${userId}`)
                console.log("handleDelete:", res.data)
                DeleteFromDirectory(FileSystem.documentDirectory + oneSelectedFile[0].name + ".mp4")
                dispatch({
                    type: "querysChanging",
                    payload: !querysChanging
                })
                setSelected([])
                setDeleteLoading(false)
            }
        } catch (error) {
            console.log("delete error:", error)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => setDeleteItem(false)}>
            <View>
                <SafeAreaView >
                    <View style={{
                        marginHorizontal: 10,
                        position: "relative"
                    }}>
                        <View style={{
                            padding: 10,
                            backgroundColor: "#afe2ec",
                            marginVertical: 3,
                            borderRadius: 10,
                            flexDirection: 'row',
                            justifyContent: "space-between",
                        }}>
                            {/* {deleteItem && <FontIcon onPress={() => {
                            setDeleteItem(false)
                            setSelected([])

                        }} name='arrow-left' size={30} />}
                        // {
                            // !deleteItem && (
                                //  deleteItem ? `${selected.length} video tanlandi` :
                            // )
                        // } */}
                            {
                                deleteItem ? <FontIcon name="arrow-left" size={30} onPress={() => setDeleteItem(!deleteItem)} /> : (
                                    <FontIcon name="arrow-left" size={30} onPress={() => navigation.goBack()} />
                                )
                            }

                            <Text
                                style={{
                                    fontFamily: "inter-medium",
                                    fontSize: 20,
                                }}>
                                {
                                    deleteItem ? `${t("deleting")} ${selected.length}` : `${t("secret file")}`
                                }
                            </Text>
                            {
                                deleteItem ? (
                                    <MaterialIcon name="delete" size={30} onPress={handleDelete} />
                                ) : (
                                    <View style={{
                                        flexDirection: 'row'
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => setMenu(!menu)}
                                        >
                                            <Image source={DotsMenuIcon} style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                            }} />
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </View>
                        {
                            menu && (
                                <View style={{
                                    position: "absolute",
                                    top: 50,
                                    right: 0,
                                    zIndex: 999
                                }}>
                                    <IsSecretMenu navigation={navigation} setDeleteItem={setDeleteItem} setMenu={setMenu} />
                                </View>
                            )
                        }
                    </View>
                    <ScrollView style={{
                        marginHorizontal: 10,
                    }}>
                        {
                            files.length > 0
                                ?
                                files?.map(file => file.isSecret && (
                                    <FinishedVideo
                                        navigation={navigation}
                                        deleteMenu={deleteItem}
                                        deleteLoading={deleteLoading}
                                        setDeleteLoading={setDeleteLoading}
                                        handleCheck={handleCheck}
                                        file={file}
                                        key={file._id}
                                        id={file._id}
                                        selected={selected}
                                        secret={true}
                                    />
                                ))
                                :
                                <View>
                                    <Text style={{
                                        textAlign: "center",
                                        marginTop: 30,
                                        fontSize: 16,
                                        fontWeight: "500"
                                    }}>{t("You don't have any videos uploaded yet.")}</Text>
                                </View>
                        }
                    </ScrollView>
                </SafeAreaView>
            </View >
        </TouchableWithoutFeedback >
    )
}

const IsSecretMenu = ({ navigation, setDeleteItem, setMenu }) => {

    const top = useSharedValue(0)
    const right = useSharedValue(0)

    const { t } = useTranslation()

    useEffect(() => {
        top.value = withTiming(10, { duration: 200 })
        right.value = withTiming(20, { duration: 300 })
    }, [])

    const isSecretMenuAnimation = useAnimatedStyle(() => {
        return {
            top: top.value,
            right: right.value
        }
    }, [])

    const handleDelete = () => {
        console.log("O'chirish")
        setDeleteItem(true)
        setMenu(false)
    }

    const handleModify = () => {
        navigation.navigate("FolderLock", {
            type: "modify"
        })
        console.log("Parolni o'zgartirish")
    }

    return (
        <Animated.View
            style={[
                {
                    width: 150,
                    backgroundColor: "#000",
                    borderRadius: 5,
                    padding: 10,
                },
                isSecretMenuAnimation
            ]}
        >
            <TouchableOpacity onPress={handleDelete}>
                <Text style={{
                    color: "white",
                    marginVertical: 5,
                }}>O'chirish</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModify}>
                <Text style={{
                    color: "white",
                    marginVertical: 5,
                }}>Parolni o'zgartirish</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}