import React, { useContext, useEffect, useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { hasIcon } from "../functions/drawer.functions"
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { downloadContext } from "../context/downloadContext"


export default function DrawerElement({
    handleQueryDelete,
    query,
    index,
    navigation,
}) {
    const [currentNames, setCurrentNames] = useState([...query.history, query.name])

    const { state, dispatch } = useContext(downloadContext)
    const { activeQuery } = state

    useEffect(() => {
        setCurrentNames([...query.history, query.name])
    }, [query])

    useEffect(() => {
        const currentNamesOfActive = Array.isArray(activeQuery.history) && [...activeQuery?.history, activeQuery?.name]
        if (currentNames[activeQuery?.currentIndex] === "Home-Page") {
            navigation.navigate("Stack")
        } else {
            navigation.navigate("View", {
                url: currentNamesOfActive[activeQuery?.currentIndex]
            })
        }
    }, [activeQuery.currentIndex])

    const transform = useSharedValue(-400)

    const openReanimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: transform.value }]
        }
    }, [])

    useEffect(() => {
        transform.value = withTiming(0, { duration: 200 * index })
    }, [])
    const handleCloseAnimation = () => {
        transform.value = withTiming(-400, { duration: 500 })
    }

    const handlePromiseDispatch = (action) => {
        return new Promise((resolve, reject) => {
            dispatch({ type: action.type, payload: action.payload })
            resolve()
        })
    }

    const handleClick = async () => {
        await handlePromiseDispatch({
            type: "activeQueryUpdate",
            payload: query
        })
    }

    return (
        <Animated.View
            style={[openReanimatedStyle]}
        >
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: activeQuery._id === query._id ? "#e9ecef" : "#fff",
                    height: 50,
                    paddingHorizontal: 20,
                }}
                onPress={handleClick}
            >
                <View>
                    {
                        hasIcon(currentNames[query?.currentIndex])
                    }
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                    <Text style={{
                        marginLeft: 20,
                        fontSize: 17,
                        fontWeight: "500",
                        width: "75%",
                        fontFamily: "inter-bold"
                    }}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                    >{currentNames[query?.currentIndex]}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    handleQueryDelete(query._id)
                    handleCloseAnimation()
                }}>
                    <MaterialIcon name="close" size={25} color={"black"} style={{
                        marginRight: 5,
                    }} />
                </TouchableOpacity>
            </TouchableOpacity>
            <Animated.View style={{
                height: 3,
                backgroundColor: "lightgray",
                width: "100%"
            }}></Animated.View>
        </Animated.View >
    )
}