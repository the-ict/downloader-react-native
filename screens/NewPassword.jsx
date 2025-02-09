import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { useState, useEffect, useContext } from "react"
import { ActivityIndicator, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import { host } from "../constants/requests"
import { downloadContext } from "../context/downloadContext"
import { useTranslation } from "react-i18next"


export default function NewPassword({ navigation }) {
    const [confirmPassword, setConfirmPassword] = useState([])
    const [passwordStatus, setPasswordStatus] = useState("")
    const [password, setPassword] = useState([])

    const { t } = useTranslation()


    useEffect(() => {
        if (password.length === 4) {
            setPasswordStatus("confirm")
        }
    }, [password, confirmPassword])


    const handlePassword = (num) => {
        if (password.length < 4) {
            setPassword(prev => [...prev, num])
        }
    }


    return (
        passwordStatus === "confirm" ? (
            <ConfirmPassword
                navigation={navigation}
                setPassword={setConfirmPassword}
                password={confirmPassword}
                confirmPassword={password}
                setStatus={setPasswordStatus}
                setConfirmPassword={setPassword}
            />

        ) : (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 20,
                }}
            >
                <TouchableWithoutFeedback onPress={() => {
                    navigation.navigate("FinishedDrawer")
                    setPassword([])
                    setConfirmPassword([])
                    setPasswordStatus("")
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
                <View style={{
                    marginBottom: 50,
                    justifyContent: "center",
                    alignItems: 'center',
                }}>
                    <View>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: "sans-bold",
                            marginBottom: 50,
                            textAlign: "center"
                        }}>{t("Enter new password")}</Text>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
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
                </View>
            </View>
        )
    )
}

const ConfirmPassword = ({
    navigation,
    setPassword,
    password,
    confirmPassword,
    setStatus,
    setConfirmPassword
}) => {
    const [loading, setLoading] = useState(false)
    const [failure, setFailure] = useState(false)

    const { state, dispatch } = useContext(downloadContext)
    const { t } = useTranslation()

    useEffect(() => {
        if (password.length === 4) {
            console.log("confirm password to'ldirildi !")
            const createPassword = async () => {
                setLoading(true)
                const id = await AsyncStorage.getItem("user_id")
                const passwordString = password.toString()
                const confirmPasswordString = confirmPassword.toString()
                console.log("passwordString: ", passwordString)
                console.log("confirmPasswordString: ", confirmPasswordString)
                if (password.length > 3 && confirmPassword.length > 3) {
                    if (passwordString === confirmPasswordString) {
                        console.log("passwordString va confirmPasswordString to'g'ri !")
                        try {
                            const updatedUser = await axios.put(`${host}/api/user/${id}`, {
                                password: passwordString
                            })

                            setLoading(false)

                            if (updatedUser.data) {
                                dispatch({
                                    type: "querysChanging",
                                    payload: !state.querysChanging
                                })
                                navigation.navigate("IsSecret")
                                setPassword([])
                                setConfirmPassword([])
                                setStatus("")
                            }

                        } catch (error) {
                            console.log("change passwrod error: ", error)
                            setLoading(false)
                        }
                    }
                } else {
                    console.log("password va confirm password teng emas !")
                    setPassword([])
                    setConfirmPassword([])
                    setStatus("")
                    setLoading(false)
                }
            }
            createPassword()
        }

        if (failure) {
            setTimeout(() => {
                setFailure(false)
            }, 2000)
        }
    }, [password])

    const handlePassword = (num) => {
        if (password.length < 4) {
            setPassword(prev => [...prev, num])
        }
    }


    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 20,
            }}
        >
            <TouchableWithoutFeedback onPress={() => {
                setPassword([])
                setConfirmPassword([])
                setStatus("")
                navigation.navigate("FinishedDrawer")
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
            <View style={{
                marginBottom: 50,
                justifyContent: "center",
                alignItems: 'center',
            }}>
                <View>
                    <Text style={{
                        fontSize: 12,
                        fontFamily: "sans-bold",
                        marginBottom: 50,
                        textAlign: "center",
                        color: failure ? "red" : "black"
                    }}>{failure ? `${t("Incorrect password")}` : loading ? <ActivityIndicator size={"small"} /> : `${t("Repeat password")}`}</Text>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
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
            </View>
        </View>
    )
}