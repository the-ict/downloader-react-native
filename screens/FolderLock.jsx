import { View, Text, TouchableOpacity, TouchableWithoutFeedback, TextInput, Vibration, Dimensions, Pressable, Linking } from 'react-native'
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import { SafeAreaView } from "react-native-safe-area-context"
import { useEffect, useState } from "react"
import * as Font from "expo-font"
import axios from 'axios'
import { host } from '../constants/requests'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from "react-i18next"

export default function FolderLock({ navigation, route }) {
    const [passwordStatus, setPasswordStatus] = useState("")
    const [isLoadFont, setIsLoadFont] = useState(false)
    const [lockEmail, setLockEmail] = useState(false)
    const [password, setPassword] = useState([])
    const [isEmail, setIsEmail] = useState(false)
    const [userInfo, setInfoUser] = useState([])
    const [email, setEmail] = useState("")

    const { t } = useTranslation()



    useEffect(() => {
        const loadFont = async () => {
            try {
                await Font.loadAsync({
                    "sans-bold": require("../font/mono-sans/NotoSansMono-Bold.ttf"),
                    "sans-medium": require("../font/mono-sans/NotoSansMono-Light.ttf")
                })
                setIsLoadFont(true)
            } catch (error) {
                setIsLoadFont(false)
                console.log("Font error", error)
            }
        }
        loadFont()

        const getUser = async () => {
            const user_id = await AsyncStorage.getItem("user_id")
            if (user_id) {
                try {
                    const user = await axios.get(`${host}/api/user/${user_id}`)
                    console.log("user: ", user.data)
                    setInfoUser(user.data)
                } catch (error) {
                    console.log("get User error: ", error.message)
                }
            }
        }

        getUser()
    }, [])

    useEffect(() => {
        console.log("password changed: ", password)
        if (password.length === 4 && userInfo.user_id) {
            const correctPassword = userInfo.password
            const isCorrect = password.join(",") === correctPassword
            if (!userInfo.email && !route.params?.type) {
                console.log("userPass:", password.join(","))
                console.log("correctPass:", correctPassword)
                if (correctPassword.length > 3 && isCorrect) {
                    setLockEmail(true)
                    setPassword([])
                } else {
                    setPasswordStatus("Parol no'tog'ri")
                    Vibration.vibrate(1000)
                    setPassword([])
                }
            } else {
                console.log("userPass:", password.join(","))
                console.log("correctPass:", correctPassword)

                if (correctPassword.length > 3 && isCorrect && !route.params?.type) {
                    setPassword([])
                    navigation.navigate("IsSecret")
                }
                else if (route.params?.type && isCorrect) {
                    setPassword([])
                    navigation.navigate("NewPassword", {
                        userId: userInfo.user_id
                    })
                }
                else {
                    setPasswordStatus("Parol no'tog'ri")
                    Vibration.vibrate(1000)
                    setPassword([])
                }
            }
        }
        setTimeout(() => {
            setPasswordStatus("")
        }, 2000)
    }, [password])


    const handlePassword = (value) => {
        if (password.length < 4) {
            setPassword(prev => ([...prev, value]))
        }
    }

    const handleChangeEmail = (text) => {
        setEmail(text)
        if (text.includes(".com", ".mail", ".ru")) {
            console.log("topildi")
            setIsEmail(true)
        } else {
            setIsEmail(false)
            console.log("topilmadi!")
        }
    }

    const handleSubmit = async () => {
        try {

            const updatedUser = await axios.put(`${host}/api/user/${userInfo.user_id}`, {
                email,
            })

            if (updatedUser) {
                navigation.navigate("IsSecret")
            }

            console.log("email entered: ", updatedUser.data)
        } catch (error) {
            console.log("submit error: ", error)
        }
    }

    return (
        <SafeAreaView>
            {
                lockEmail ? (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            height: "100%",
                            width: "100%"
                        }}>
                        <TouchableWithoutFeedback onPress={() => {
                            setLockEmail(false)
                            setPassword([])
                        }}>
                            <View
                                style={{
                                    backgroundColor: "#ededed",
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 40,
                                    height: 40,
                                    borderRadius: 50,
                                    position: "absolute",
                                    top: 20,
                                    left: 20,
                                }}
                            >
                                <MaterialIcon name="arrow-back" size={30} style={{
                                    borderRadius: 20,
                                }} />
                            </View>
                        </TouchableWithoutFeedback>
                        <Text style={{
                            fontSize: 16,
                            marginVertical: 10,
                        }}>{t("enter email")}</Text>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "gray",
                                borderStyle: "solid",
                                paddingHorizontal: 10,
                                width: "80%",
                                borderRadius: 15,
                                justifyContent: "space-between"
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                            >
                                <MaterialIcon name='email' size={17} color={"gray"} />
                                <TextInput style={{
                                    marginLeft: 10,
                                }} placeholder={t("enter email")}
                                    onChangeText={(title) => handleChangeEmail(title)}
                                    keyboardType="email-address"
                                />
                            </View>
                            {
                                isEmail && (
                                    <MaterialIcon name='arrow-right' size={30} color={"gray"} onPress={handleSubmit} />
                                )
                            }
                        </View>
                    </View>
                ) : (
                    <View
                        style={{
                            backgroundColor: "#ffffff",
                            height: "100%",
                            width: "100%",
                        }}>
                        <View
                            style={{
                                padding: 30,
                                justifyContent: 'space-between',
                                alignItems: "center",
                                height: "100%",
                            }}>
                            <View style={{
                                flexDirection: 'row',
                                width: "100%",
                            }}>
                                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                                    <View
                                        style={{
                                            backgroundColor: "#ededed",
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 40,
                                            height: 40,
                                            borderRadius: 50,
                                        }}
                                    >
                                        <MaterialIcon name="arrow-back" size={30} style={{
                                            borderRadius: 20,
                                        }} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            <View style={{
                                marginBottom: 50,
                                justifyContent: "center",
                                alignItems: 'center',
                            }}>
                                <View>
                                    <Text style={{
                                        fontSize: 10,
                                        fontFamily: "sans-bold",
                                        marginBottom: 50,
                                        color: passwordStatus ? "red" : "black",
                                        width: "100%",
                                        textAlign: "center"
                                    }}>{passwordStatus ? passwordStatus : route.params?.type === "modify" ? `${t("enter old password")}` : `${t("enter password")}`}</Text>

                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginVertical: 10
                                        }}>
                                        {
                                            password.map((item, index) => (
                                                <View
                                                    key={index}
                                                    style={{
                                                        width: 10,
                                                        height: 10,
                                                        backgroundColor: item ? "black" : "gray",
                                                        borderRadius: "50%",
                                                        marginRight: 20,
                                                    }}></View>
                                            ))
                                        }
                                    </View>
                                </View>

                                <View style={{
                                    flexDirection: "row",
                                    width: "100%",
                                }}>
                                    {
                                        [0, 1, 2].map((num, index) => (
                                            <TouchableOpacity
                                                onPress={() => handlePassword(num)}
                                                key={index}
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    flexDirection: 'row',
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    backgroundColor: "#efefef",
                                                    margin: 10,
                                                    borderRadius: "50%"
                                                }}>
                                                <Text style={{
                                                    fontSize: 20,
                                                }}>{num.toString()}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>

                                <View style={{
                                    flexDirection: "row",
                                    width: "100%",
                                }}>
                                    {
                                        [3, 4, 5].map((num, index) => (
                                            <TouchableOpacity
                                                onPress={() => handlePassword(num)}
                                                key={index}
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    flexDirection: 'row',
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    backgroundColor: "#efefef",
                                                    margin: 10,
                                                    borderRadius: "50%"
                                                }}>
                                                <Text style={{
                                                    fontSize: 20,
                                                }}>{num.toString()}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>

                                <View style={{
                                    flexDirection: "row",
                                    width: "100%",
                                }}>
                                    {
                                        [6, 7, 8].map((num, index) => (
                                            <TouchableOpacity
                                                onPress={() => handlePassword(num)}
                                                key={index}
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    flexDirection: 'row',
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    backgroundColor: "#efefef",
                                                    margin: 10,
                                                    borderRadius: "50%"
                                                }}>
                                                <Text style={{
                                                    fontSize: 20,
                                                }}>{num.toString()}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>

                                <View style={{
                                    flexDirection: "row",
                                    width: "100%",
                                }}>
                                    <TouchableOpacity
                                        onPress={() => handlePassword(9)}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            flexDirection: 'row',
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#efefef",
                                            margin: 10,
                                            borderRadius: "50%"
                                        }}>
                                        <Text style={{
                                            fontSize: 20,
                                        }}>9</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setPassword(prev => {
                                            const newPassword = [...prev]
                                            newPassword.pop()
                                            return newPassword
                                        })}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            flexDirection: 'row',
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#efefef",
                                            margin: 10,
                                            borderRadius: "50%"
                                        }}>
                                        <MaterialIcon name='backspace' size={20} />
                                    </TouchableOpacity>
                                </View>
                                <Pressable onPress={() => {
                                    Linking.openURL("mailto:davlatjonsoqqamode@gmail.com")
                                }}>
                                    <Text
                                        style={{
                                            fontSize: Dimensions.get("window").height < 1300 ? 10 : 12,
                                            color: "blue"
                                        }}
                                    >{t("Forgot your password?")}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                )
            }
        </SafeAreaView >
    )
}