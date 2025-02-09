import { createQuery } from "../functions/home.functions"
import { Share } from "react-native"
import * as Clipboard from "expo-clipboard"
import * as Sharing from "expo-sharing"
import axios from "axios"
import { host } from "./requests"


export const homeMenuItems = [
    {
        iconName: "add", title: "Sahifa Qo'shish", onPress: (userId, title, navigation) => {
            console.log("userId: ", userId, "title: ", title)
            if (!title) return
            try {
                createQuery(userId, title)
                navigation.openDrawer()
            } catch (error) {
                console.log(error)
            }
        }
    },
    {
        iconName: "share", title: "Ulashish", onPress: async (userId, title) => {
            if (!title) return
            try {
                const result = await Sharing.shareAsync(title)
                console.log("result of share: ", result)
            } catch (error) {
                console.log("sharing error: ", error.message)
            }
        }
    },
    {
        iconName: "history", title: "Tarix", onPress: (userId, title, navigation) => {
            navigation.navigate("History")
        }
    },
    {
        iconName: "content-copy", title: "Linkni nushalash", onPress: (userId, title) => {
            if (!title) return
            Clipboard.setString(title)
            console.log("Copied")
        }
    },
    {
        iconName: "bookmark", title: "Bookmarklar", onPress: (userId, title, navigation) => {
            navigation.navigate("Bookmarks", {
                userId: userId,
                navigation: navigation
            })
            console.log("icon qo'shish bosildi")
        }
    },
    {
        iconName: "bookmark-outline", title: "Bookmark qo'shish", onPress: async (userId, title) => {
            console.log("adding bookmark")
            if (!title) return alert("Iltimos bookmark yaratish uchun biror sitega tashrif buyuring !")
            try {
                console.log("bookmark: ", title)
                const newBookmarks = await axios.put(`${host}/api/user/${userId}`, {
                    user_id: userId,
                    bookmark: title
                })
                console.log("new-bookmark: ", newBookmarks.data)
                alert("Bookmarklarga qo'shildi !")
            } catch (error) {
                console.log("bookmark yaratilmadi?: ", error.message)
                alert("Sizda bu allaqachon bor !")
            }
        }
    },
    {
        iconName: "share", title: "Do'stlarga ulashish", onPress: async () => {
            try {
                const result = await Share.share({
                    message: "Bu ilovani ulashing !"
                })
                if (result.action == Share.sharedAction) {
                    console.log("this app shared")
                } else if (result.action == Share.dismissedAction) {
                    console.log("this app not shared")
                }
            } catch (error) {
                console.log("share with friends error: ", error.message)
            }
        }
    },
    {
        iconName: "settings", title: "Sozlamalar", onPress: (userId, title, navigation) => {
            navigation.navigate("Settings")
        }
    },
    {
        iconName: "desktop-mac", title: "Desktop site", onPress: (userId, title, navigation, setIsDesktopMode, desktopMode) => {
            setIsDesktopMode(!desktopMode)
            console.log("the desktopMode changed")
        },
    },
]