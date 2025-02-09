import { View, Text, Image, TouchableOpacity } from "react-native";
import { useContext, useEffect, useState } from "react";
import { host } from "../constants/requests";
import { saveFiles } from "../functions/view.functions"
import axios from "axios"

import MaterialIcons from "react-native-vector-icons/MaterialIcons"

import ClosePng from "../assets/icons/close.png"
import DownloadPng from "../assets/icons/download.png"
import { downloadContext } from "../context/downloadContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import "../services/i18next.js"


export default function DownloadInfoSheet(props) {
    const [formatActive, setFormatActive] = useState(0)
    const { state, dispatch } = useContext(downloadContext)


    const { querysChanging } = state
    const { t } = useTranslation()

    const file = props.route.params.file

    const handleClose = async () => {
        props.navigation.goBack()
        try {
            const user_id = await AsyncStorage.getItem("user_id")
            const res = await axios.delete(`${host}/api/file/${file._id}`, {
                user_id: user_id
            })
            console.log("downloadInfo: ", res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const downloadVideo = () => {
        saveFiles(file, dispatch, querysChanging, formatActive)
        props.navigation.goBack()
    }


    return (
        <View
            style={{
                padding: 20,
                height: "100%",
                width: "100%"
            }}>
            <View style={{
                flexDirection: "row",
                height: 100,
                width: "100%"
            }}>
                <View>
                    <Image source={{ uri: host + `/${file?.image}` }} style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 10,
                    }} />
                </View>
                <View style={{
                    marginLeft: 10,
                }}>
                    <Text style={{
                        fontSize: 15,
                        fontWeight: "500",
                    }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >{file.name}.mp4</Text>
                    <MaterialIcons name="movie" size={25} color={"gray"}
                        style={{
                            marginTop: 20,
                        }} />
                </View>
            </View>
            <View
                style={{
                    marginTop: 10,
                    flexDirection: "row",
                    justifyContent: 'center',
                    gap: 10,
                }}>
                {
                    file.downloadUrl.map((format, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setFormatActive(index)}
                        >
                            <View
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 10,
                                    borderWidth: formatActive == index ? 5 : 3,
                                    borderStyle: "solid",
                                    borderColor: "#0ac8f3",
                                    justifyContent: "center",
                                }}>
                                <Text
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        fontSize: 12,
                                    }}>{format.resolution}p</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 30,
                    marginHorizontal: "auto",
                }}
            >
                <TouchableOpacity style={{
                    justifyContent: "center",
                    alignItems: "center"
                }}
                    onPress={handleClose}
                >
                    <Image source={ClosePng} style={{
                        width: 30,
                        height: 30,
                        objectFit: "cover",
                    }} />
                    <Text style={{
                        textAlign: "center", fontWeight: "bold",
                        marginTop: 5,
                    }}>{t("Close")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 50,
                }}
                    onPress={downloadVideo}
                >
                    <Image source={DownloadPng} style={{
                        width: 30,
                        height: 30,
                        objectFit: "cover",
                    }} />
                    <Text style={{
                        textAlign: "center", fontWeight: "bold",
                        marginTop: 5,
                    }}>{t("Download")}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}