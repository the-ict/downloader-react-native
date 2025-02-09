import AsyncStorage from "@react-native-async-storage/async-storage"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { SafeAreaView } from "react-native-safe-area-context"
import { hasIcon } from "../functions/drawer.functions"
import { View, Text, TouchableOpacity } from "react-native"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { host } from "../constants/requests"
import { ActivityIndicator } from "react-native"

export default function Bookmarks({ route }) {
    const [bookmarks, setBookmarks] = useState([])

    const navigation = route.params.navigation
    console.log("bookmark: ", navigation)


    useEffect(() => {

        const getUser = async () => {
            try {
                const getBookmarks = await axios.get(`${host}/api/user/${route.params.userId}`)
                console.log(getBookmarks.data)
                setBookmarks(getBookmarks.data)
            } catch (error) {
                console.log("bookmarks olinmadi?.", error.message)
            }
        }
        getUser()
    }, [])

    console.log("Bookmark User: ", bookmarks)

    return (
        <SafeAreaView>
            <View
                style={{
                    padding: 20,
                }}
            >
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
                        }}>Bookmarks</Text>
                </View>
                <SafeAreaView>
                    {
                        Array.isArray(bookmarks.bookmarks) ? bookmarks?.bookmarks.map((bookmark, index) => (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("View", {
                                        url: bookmark
                                    })
                                }}
                                key={index}>
                                <View
                                    style={{
                                        height: 50,
                                        padding: 10,
                                        flexDirection: "row",
                                        marginBottom: 10,
                                    }}
                                >
                                    {hasIcon(bookmark)}
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={{
                                            marginLeft: 20,
                                            fontWeight: "500",
                                            fontSize: 17,
                                        }}
                                    >{bookmark}</Text>
                                </View>
                            </TouchableOpacity>
                        )) : (
                            <ActivityIndicator size={"small"} />
                        )
                    }
                </SafeAreaView>
            </View >
        </SafeAreaView >
    )
}