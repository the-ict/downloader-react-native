import * as FileSystem from "expo-file-system"

export const GetSize = async (uri) => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(uri)
        if (fileInfo.exists) {
            return fileInfo
        } else {
            console.log("file mavjud emas !")
        }
    } catch (error) {
        console.log("get size error:", error)
    }
}

export const DeleteFromDirectory = async (uri) => {
    console.log("delete file name: ", uri)
    try {
        await FileSystem.deleteAsync(uri)
        console.log("file deleted")
    } catch (error) {
        console.log("delete from directory error:", error)
    }
}

export const MoveToFile = async (fromUri, toUri) => {
    try {
        await FileSystem.moveAsync({
            from: fromUri,
            to: toUri
        })
        console.log("file has been moved")
    } catch (error) {
        console.log("move to file", error)
    }
}