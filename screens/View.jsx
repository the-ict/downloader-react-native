import {
    View,
    Text,
    TouchableWithoutFeedback,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Image,
    ActivityIndicator,
    Linking,
    Alert
} from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring } from "react-native-reanimated"
import React, { useContext, useEffect, useRef, useState } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { SafeAreaView } from "react-native-safe-area-context"
import { downloadContext } from "../context/downloadContext"
import {
    updateQuery
} from "../functions/home.functions"
import ReloadIcon from "../assets/icons/reload.png"
import SearchItems from "../components/SearchItems"
import DotsIcon from "../assets/icons/dots.png"
import { WebView } from "react-native-webview"
import HomeMenu from "../components/HomeMenu"
import { host } from "../constants/requests"
import axios from "axios"


const injectJs = `
       setInterval(() => {
        const video = document.querySelector("video")
        if(video) {
            window.ReactNativeWebView.postMessage(video ? true : false);
        }else {
            window.ReactNativeWebView.postMessage('no-video');
        }
        }, 1000)
        true;
`


const WIDTH = Dimensions.get("window").width

const HomeView = (props) => {
    const [downloadLoading, setDownloadLoading] = useState(false)
    const [isDesktopMode, setIsDesktopMode] = useState(false)
    const [searchMenu, setSearchMenu] = useState(false)
    const [downloadUrl, setDownloadUrl] = useState("")
    const [video, setVideo] = useState(false)
    const [userId, setUserId] = useState("")
    const [querys, setQuerys] = useState([])
    const [menu, setMenu] = useState(false)
    const [title, setTitle] = useState("")

    const navigation = props.navigation
    const route = props.route

    const isPhone = Dimensions.get("window").height < 1300

    const { state, dispatch } = useContext(downloadContext)


    const viewRef = useRef(null)
    useEffect(() => {
        const getQuerys = async () => {
            const newId = await AsyncStorage.getItem("user_id")
            if (newId) {
                setUserId(newId)
                const res = await axios.get(`${host}/api/query/${newId}`)
                setQuerys(res.data)

                dispatch({
                    type: "querysChanging",
                    payload: !state.querysChanging
                })
            }
        }
        getQuerys()
    }, [])

    useEffect(() => {
        if (!menu) {
            opacity.value = 0;
            transform.value = -150
        }
    }, [menu])


    // animation 
    const transform = useSharedValue(-150)
    const opacity = useSharedValue(0)

    const menuReanimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{
                translateY: transform.value,
            }]
        }
    }, [])

    const handleDownloader = async () => {
        setDownloadLoading(true)
        try {
            const termuxCommand = `yt-dlp -o "/sdcard/Download/%(title)s.%(ext)s" "${downloadUrl}"`;
            await Linking.openURL(`termux://shell?command=${encodeURIComponent(termuxCommand)}`);

            setDownloadLoading(false)
            Alert.alert("Yuklab olish boshlandi!", "Termux-da yuklab olish jarayoni boshlandi.");
        } catch (error) {
            Alert.alert("Xatolik", "Yuklab olishni boshlashda xatolik yuz berdi.");
            setDownloadLoading(false)
        }
    }

    const handleSearch = () => {
        setSearchMenu(true)
    }

    return (
        <SafeAreaView>
            <TouchableWithoutFeedback
                onPress={() => {
                    setMenu(false)
                    setSearchMenu(false)
                }}>
                <View
                    style={{
                        position: "relative",
                        paddingVertical: 10,
                    }}
                >
                    <View
                        style={{
                            paddingLeft: 20,
                            paddingTop: 5,
                            flexDirection: "row",
                            width: WIDTH / 1.1,
                            justifyContent: "space-between"
                        }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%"
                        }}>
                            <TouchableOpacity
                                onPress={() => navigation.openDrawer()}>
                                <View
                                    style={{
                                        width: isPhone ? 25 : 30,
                                        height: isPhone ? 25 : 30,
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderWidth: 2,
                                        borderColor: "gray",
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: isPhone ? 17 : 20,
                                            color: "black"
                                        }}
                                    >{querys.length}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setTitle("")
                                    updateQuery(state.activeQuery, "Home-Page")
                                        .then(() => {
                                            dispatch({
                                                type: "querysChanging",
                                                payload: !state.querysChanging
                                            })
                                            navigation.navigate("Stack")
                                        })
                                        .catch(err => console.log("view has error: ", err))
                                }}
                            >
                                <MaterialIcons
                                    name="home"
                                    size={isPhone ? 25 : 30}
                                    color={"black"}
                                />
                            </TouchableOpacity>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: "lightblue",
                                    borderRadius: 15,
                                    paddingRight: 20,
                                    width: "60%",
                                    justifyContent: "space-between",
                                    paddingHorizontal: 2,
                                    height: 40,
                                }}
                            >
                                <TextInput
                                    numberOfLines={1}
                                    value={title ? title : route.params.url}
                                    onChangeText={(text) => setTitle(text)}
                                    placeholderTextColor={"gray"}
                                    style={{
                                        color: "gray",
                                        overflow: "hidden",
                                    }}
                                    onPress={handleSearch}
                                />
                                <TouchableOpacity onPress={() => {
                                    viewRef.current.reload()
                                }}>
                                    <Image source={ReloadIcon} style={[
                                        {
                                            width: 20,
                                            height: 20,
                                            objectFit: 'contain'
                                        },
                                        menuReanimatedStyle
                                    ]} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => {
                                setMenu(!menu)
                                opacity.value = withTiming(1, { duration: 100 })
                                transform.value = withSpring(0, { duration: 500 })
                            }}>
                                <Image source={DotsIcon} style={{
                                    height: isPhone ? 30 : 40,
                                    width: isPhone ? 25 : 30,
                                    objectFit: "contain",
                                }} />
                            </TouchableOpacity>

                        </View>
                        {
                            menu && (
                                <Animated.View style={[
                                    {
                                        position: "absolute",
                                        top: 60,
                                        right: 0,
                                        width: "70%",
                                        padding: 10,
                                        backgroundColor: "#e5e5e5",
                                        zIndex: 11,
                                        borderRadius: 10,
                                        shadowOffset: {
                                            width: 0,
                                            height: 4,
                                        },
                                        shadowOpacity: 0.32,
                                        shadowRadius: 5.46,

                                        elevation: 9,
                                    },
                                    menuReanimatedStyle
                                ]}>
                                    <HomeMenu
                                        userId={userId}
                                        title={route.params.url}
                                        navigation={navigation}
                                        desktopMode={isDesktopMode}
                                        setIsDesktopMode={setIsDesktopMode}
                                    />
                                </Animated.View>
                            )
                        }
                    </View>
                    <View style={{
                        zIndex: 222,
                    }}>
                        {
                            searchMenu && (
                                <SearchItems searched title={title} navigation={navigation} searchMenu={searchMenu} setSearchMenu={setSearchMenu} />
                            )
                        }
                    </View>
                    <View style={{
                        width: WIDTH,
                        height: Dimensions.get("window").height - 150,
                        marginVertical: 20,
                        position: "relative",
                        opacity: searchMenu ? 0 : 1
                    }}>
                        <WebView source={{
                            uri: route.params.url
                        }}
                            userAgent={isDesktopMode ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" : undefined}
                            ref={viewRef}
                            injectedJavaScript={injectJs}
                            onMessage={(event) => {
                                const message = event.nativeEvent.data
                                if (message !== "no-video") {
                                    setVideo(true)
                                } else {
                                    setVideo(false)
                                }
                            }}
                            renderLoading={() => {
                                return (
                                    <ActivityIndicator
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                        size={"large"} color={"black"} />
                                )
                            }}
                            startInLoadingState={true}
                            onNavigationStateChange={(e) => setDownloadUrl(e.url)}
                        />
                        <TouchableOpacity
                            onPress={handleDownloader}
                            activeOpacity={1}
                            disabled={downloadLoading && video}>
                            <View
                                style={{
                                    width: 50,
                                    height: 50,
                                    justifyContent: "center",
                                    position: "absolute",
                                    right: 70,
                                    bottom: 200,
                                    backgroundColor: video ? "purple" : "#ce5fa7",
                                    borderRadius: "50%",
                                }}
                            >
                                {
                                    downloadLoading
                                        ? <ActivityIndicator size={"small"} color={"white"} />
                                        : <MaterialIcons name="download" size={20} color={"white"}
                                            style={{
                                                textAlign: "center",
                                            }} />
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default HomeView;