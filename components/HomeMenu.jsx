import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import { View, Text, TouchableOpacity, Dimensions } from "react-native"
import { homeMenuItems } from "../constants/homeMenuItems"

export default function HomeMenu({ userId, title, navigation, setIsDesktopMode, desktopMode, isView }) {
    const isPhone = Dimensions.get('window').height < 1300
    return (
        <View
            style={{
                width: "100%",
            }}>
            {
                homeMenuItems.map((items, index) => {
                    if (items.title == "Desktop site" && isView) return
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                items.onPress(userId, title, navigation, setIsDesktopMode, desktopMode)
                            }}
                            key={index}
                            style={{
                                flexDirection: "row",
                                width: "100%",
                                marginBottom: 5,
                                alignItems: 'center',
                                padding: isPhone ? 5 : 10,
                            }}
                        >
                            <MaterialIcon name={items.iconName} size={isPhone ? 20 : 27} color={"gray"} />
                            <Text style={{
                                color: "#000",
                                marginLeft: 15,
                                fontSize: isPhone ? 14 : 17,
                            }}>{items.title}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}