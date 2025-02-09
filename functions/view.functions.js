import AsyncStorage from "@react-native-async-storage/async-storage"
import * as FileSystem from "expo-file-system"
import * as MediaLibrary from "expo-media-library"

export const saveFiles = async (video, dispatch, querysChangingValue, formatActive) => {
    try {
        if (video) {
            console.log("save files: ", Object.values(video.downloadUrl)[formatActive].downloadUrl)

            const fileName = video.name + ".mp4"
            const downloadingResumble = FileSystem.createDownloadResumable(
                Object.values(video.downloadUrl)[formatActive].downloadUrl,
                FileSystem.documentDirectory + fileName,
                {},
                (progress) => {
                    dispatch({
                        type: "downloadProgress",
                        payload: {
                            id: video._id,
                            progress: progress
                        }
                    })
                }
            )
            // loading !
            dispatch({
                type: "add",
                payload: {
                    downloadingResumble,
                    video,
                }
            })

            const { status } = await MediaLibrary.getPermissionsAsync();
            if (status !== 'granted') {
                const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
                if (newStatus !== 'granted') {
                    console.log("Media kutubxonaga fayl saqlash uchun ruxsat berilmadi!");
                    return;
                }
            }

            const { uri } = await downloadingResumble.downloadAsync()
            console.log("yuklab olingan file: ", uri)

            const saveGalary = await AsyncStorage.getItem("saveGalary")

            if (saveGalary) {
                const asset = await MediaLibrary.createAssetAsync(uri)
                await MediaLibrary.createAlbumAsync("Download", asset, false)
                console.log("galareyaga saqlandi !")
            }

            dispatch({
                type: "querysChanging",
                payload: !querysChangingValue
            })

            console.log("queryChangingValue changed save files:", querysChangingValue)
        } else {
            console.log("video malumotlari mavjud emas !")
        }
    } catch (error) {
        console.log("save error", error)
    }
}
