import { createQuery, updateQuery } from "../functions/home.functions"
import Materialicons from "react-native-vector-icons/MaterialIcons"
import { Text, TouchableOpacity } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { dataOfSites } from "../constants/downloadingSites"
import { hasIcon } from "../functions/drawer.functions"
import * as Font from "expo-font"
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated"

import { downloadContext } from "../context/downloadContext"


export default function SearchItems({
    navigation,
    searchMenu,
    title,
    searched,
    setSearchMenu
}) {
    const [userId, setUserid] = useState("")
    const { state, dispatch } = useContext(downloadContext)
    const { activeQuery, querysChanging } = state


    // animation
    React.useEffect(() => {
        const getFonts = async () => {
            await Font.loadAsync({
                "mongo-light": require("../font/mono-sans/NotoSansMono-Light.ttf")
            })
        }
        getFonts()
    }, [])


    useEffect(() => {
        const getUserId = async () => {
            const newId = await AsyncStorage.getItem("user_id")
            console.log("newId: ", newId)
            if (newId) {
                setUserid(newId)
            }
            else {
                const newGeneratedId = generateId()

                await AsyncStorage.setItem("user_id", newGeneratedId).then(() => {
                    console.log("user id changed", newGeneratedId)
                })
            }
        }
        getUserId()
    }, [])


    // aniamtion
    const opacity = useSharedValue(0)

    const searchItemAnimation = useAnimatedStyle(() => {
        return {
            opacity: opacity.value
        }
    }, [])

    useEffect(() => {
        if (searchMenu) {
            opacity.value = withTiming(1, { duration: 400 })
        } else {
            opacity.value = withTiming(0, { duration: 200 })
        }
    }, [searchMenu])


    const handleNavigate = (page) => {
        if (page) {
            if (activeQuery._id) {
                const updatedQuery = updateQuery(activeQuery, page)
                dispatch({
                    type: "activeQueryUpdate",
                    payload: updatedQuery
                })

                console.log("udpated queyr: ", updateQuery)
                setSearchMenu(false)
            } else {
                createQuery(userId, title)
                dispatch({
                    type: "querysChanging",
                    payload: !querysChanging
                })
            }
            navigation.navigate("View", {
                url: page
            })
            setSearchMenu(false)
        }
    }


    return (
        <Animated.ScrollView
            style={[{
                backgroundColor: "#fff",
                width: "100%",
                shadowColor: "#000",
                padding: 10,
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,

                elevation: 10,
                position: "absolute",
                top: 30,
                // height: HEIGHT / 3,
                // overflow: "hidden"
            }, searchItemAnimation]}>
            {
                dataOfSites
                    .filter(site => site.url.toLowerCase().includes(title.toLowerCase()))
                    .slice(0, 5)
                    .map((site, index) => {
                        return (
                            <TouchableOpacity style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 10,
                                borderRadius: 5,
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "#000",
                                padding: 10,
                            }}
                                key={index}
                                onPress={() => handleNavigate(site.url)}
                            >
                                {
                                    searched ? (
                                        <Materialicons name="search" size={25} color={"gray"} />
                                    ) : hasIcon(site.url)
                                }
                                <Text style={{
                                    fontSize: 15,
                                    fontWeight: "500",
                                    marginLeft: 10,
                                }}>{site.url}</Text>
                            </TouchableOpacity>
                        )
                    })
            }
        </Animated.ScrollView>
    )
}