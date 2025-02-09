import { Image, Text, Dimensions } from "react-native"
import FontIcon from "react-native-vector-icons/FontAwesome"
import { dataOfSites } from "../constants/downloadingSites";
import Browser from "../assets/icons/browser.png"


export const hasIcon = (url) => {
    const isPhone = Dimensions.get('window').height

    if (typeof url !== "string") return <Text>Bunday malumot qabul qilinmaydi {url} !</Text>
    for (const item of dataOfSites) {
        if (url.toLowerCase().includes(item.title.toLowerCase())) {
            return item.iconName ? <FontIcon name={item.iconName} size={isPhone ? 20 : 25} color={item.iconColor} style={{
                textAlign: 'center'
            }} /> : <Image source={item.iconImage} style={{
                width: isPhone ? 20 : 25,
                height: isPhone ? 20 : 25,
                justifyContent: "center",
                alignItems: "center",
                objectFit: "contain"
            }} />
        }
    }
    return (<Image source={Browser} style={{
        width: isPhone ? 20 : 25,
        height: isPhone ? 20 : 25,
        objectFit: "contain"
    }} />);
};