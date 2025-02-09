import {
    View,
    Text,
    TouchableWithoutFeedback,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator
} from "react-native"
import React, { useContext, useEffect, useState } from "react"
import FontIcon from "react-native-vector-icons/FontAwesome"
import { downloadContext } from "../context/downloadContext"
import DotsIcon from "../assets/icons/dots.png"
import * as Font from "expo-font"


// querys
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createQuery } from "../functions/home.functions"
import { host } from "../constants/requests"
import DrawerElement from "./DrawerElement"
import axios from "axios"
import { t } from "i18next"


export default function DrawerContent(navigation) {
    // handleLeft backend bilan bo'g'lash
    // hanldeRightni backend bilan bo'g'lash
    const [menuLoading, setMenuLoading] = useState(false)
    const [userId, setUserId] = useState("")
    const [querys, setQuerys] = useState([])
    const [menu, setMenu] = useState(false)

    const { state, dispatch } = useContext(downloadContext)
    const { activeQuery, querysChanging } = state

    // load fonts
    useEffect(() => {
        const loadFont = async () => {
            await Font.loadAsync({
                "inter-bold": require("../font/inter/Inter_18pt-Bold.ttf"),
                "inter-medium": require("../font/inter/Inter_18pt-Medium.ttf")
            });
        };
        loadFont();
    }, [])


    useEffect(() => {
        const getUserId = async () => {
            const newId = await AsyncStorage.getItem("user_id")
            if (newId) {
                setUserId(newId)
                try {
                    const res = await axios.get(`${host}/api/query/${newId}`)
                    console.log("drawer content querys: ", res.data)

                    setQuerys(res.data)

                    dispatch({
                        type: "querysChanging",
                        payload: !state.querysChanging
                    })
                } catch (error) {
                    console.log("Drawer querys error: ", error.message)
                }
            }
        }
        getUserId()
    }, [querysChanging])


    useEffect(() => {
        const updateQuerys = () => {
            if (querys.length === 0) {
                createQuery(userId, "Home-Page")
                dispatch({
                    type: "querysChanging",
                    payload: !querysChanging
                })

                const objKeys = Object.keys(querys[0] ? querys[0] : {})

                if (objKeys.length !== 0) {
                    dispatch({
                        type: "activeQueryUpdate",
                        payload: querys[0]
                    })
                }

            }
        }

        const getActiveQuery = () => {
            const objectKeys = Object.keys(activeQuery)
            if (objectKeys.length === 0) {
                const objKeys = Object.keys(querys[0] ? querys[0] : {})

                if (objKeys.length !== 0) {
                    console.log(querys?.[0], "this is activeQuery")
                    dispatch({
                        type: 'activeQueryUpdate',
                        payload: querys[0],
                    })
                }
            }
        }
        getActiveQuery()

        updateQuerys()

    }, [querys])

    const handleQueryDelete = async (queryId) => {
        try {
            console.log("queryId: ", queryId)
            console.log("userId: ", userId)
            const res = await axios.delete(`${host}/api/query/${queryId}?user_id=${userId}`)


            console.log(res.data, "response")

            dispatch({
                type: "querysChanging",
                payload: !querysChanging
            })
        } catch (error) {
            console.log('delete error: ', error.message)
        }
    }

    const handleDeleteAll = async () => {
        try {
            for (let query of querys) {
                setMenuLoading(true)
                const res = await axios.delete(`${host}/api/query/${query._id}?user_id=${userId}`)
                if (res) setMenuLoading(false)
                console.log(res.data)
            }

            dispatch({
                type: "querysChanging",
                payload: !querysChanging
            })
            setMenu(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handlePrevious = async () => {
        try {
            const res = await axios.put(`${host}/api/query/click-left/${activeQuery._id}`)
            console.log(res.data)
            dispatch({
                type: "activeQueryUpdate",
                payload: res.data
            })
        } catch (error) {
            console.log("handlePreviouse: ", error)
        }
    };


    const handleNext = async () => {
        try {
            const res = await axios.put(`${host}/api/query/click-right/${activeQuery._id}`)
            dispatch({
                type: "activeQueryUpdate",
                payload: res.data
            })
            console.log(res.data)
        } catch (error) {
            console.log("handleNext: ", error)
        }
    };


    const handleNew = () => {
        try {
            createQuery(userId, "Home-Page")
            dispatch({
                type: "querysChanging",
                payload: !querysChanging
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View
            style={{
                height: "100%",
                justifyContent: "space-between",
                position: "relative",
            }}>
            {menu && (
                <TouchableWithoutFeedback onPress={() => setMenu(false)}>
                    <View
                        style={{
                            height: "100%",
                            width: "100%",
                            flexDirection: 'row',
                            justifyContent: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            alignItems: "center",
                            zIndex: 10,
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}>
                        <View style={{
                            padding: 10,
                            backgroundColor: "white",
                            width: "80%",
                            borderRadius: 10,
                        }}>
                            <TouchableOpacity
                                onPress={handleDeleteAll}
                            >
                                {!menuLoading ? <Text style={{
                                    fontSize: 14,
                                    marginVertical: 10,
                                    flexDirection: "row",
                                }}>
                                    Hamma sahifalarni yopish
                                </Text> : (
                                    <ActivityIndicator style={{
                                        marginLeft: 10,
                                    }} size={"small"} color={"black"} />
                                )
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
            }
            <View

                style={{
                    padding: 20,
                    backgroundColor: "#e9ecef",
                    position: "relative"
                }}>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                    }}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontFamily: "inter-bold",
                            fontWeight: "400,"
                        }}>{t("Tabs")}</Text>
                    <TouchableWithoutFeedback onPress={() => setMenu(!menu)}>
                        <Image source={DotsIcon} style={{
                            width: 25,
                            height: 25,
                            objectFit: "contain",
                        }} />
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <FlatList
                data={querys}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                    <DrawerElement
                        query={item}
                        handleQueryDelete={handleQueryDelete}
                        index={index}
                        navigation={navigation.navigation}
                    />
                )}
            />
            <View>
                <View
                    style={{
                        padding: 20,
                        backgroundColor: "#e9ecef"
                    }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                        }}>
                        <FontIcon name="arrow-left" size={25} color={"#000"}
                            onPress={handlePrevious}
                        />
                        <FontIcon name="home" size={25} color={"#000"} onPress={() => {
                            navigation.navigation.closeDrawer()
                        }} />
                        <FontIcon name="arrow-right" size={25} color={"#000"}
                            onPress={handleNext}
                        />
                        <FontIcon name="plus" onPress={handleNew} size={25} color={"#000"} />
                    </View>
                </View>
            </View>
        </View >
    )
}