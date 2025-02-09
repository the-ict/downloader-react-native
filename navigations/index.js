// navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome"
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../components/DrawerContent"
import FinishedPng from "../assets/icons/finished.png"
import TabsPng from "../assets/icons/tabs.png"
import FinishedDrawer from "./finishedDrawer"
import Progress from "../screens/Progress"
import Finished from "../screens/Finished";
import HomeStack from "../screens/Home";
import HomeView from "../screens/View";
import { Image } from "react-native";
import React from "react"


const Drawer = createDrawerNavigator()
const BottomTab = createBottomTabNavigator()

export const HomeBottoms = () => {
    return (
        <BottomTab.Navigator
            initialRouteName='Tabs'
            screenOptions={({ route }) => {
                return {
                    tabBarIcon: ({ focused, size, color }) => {
                        if (route.name == "Tabs") {
                            return <Image source={TabsPng} style={{ width: 20, height: 20, objectFit: "cover" }} />
                        } else if (route.name == "Progress") {
                            return <FontAwesomeIcons name='download' size={20} color={color} />
                        } else {
                            return <Image source={FinishedPng} style={{
                                width: 20,
                                height: 20,
                                objectFit: "cover"
                            }} />
                        }
                    },
                    headerShown: false
                }
            }}>
            <BottomTab.Screen name='Tabs' component={HomeDrawer} />
            <BottomTab.Screen name='Progress' component={Progress} />
            <BottomTab.Screen name="Finished" component={FinishedDrawer} />
        </BottomTab.Navigator>
    )
}

export default function HomeDrawer() {
    return (
        <Drawer.Navigator screenOptions={() => {
            return {
                headerShown: false,
                drawerStyle: {
                    paddingVertical: 20
                },

            }
        }}
            drawerContent={DrawerContent}>
            <Drawer.Screen name="Stack" component={HomeStack} />
            <Drawer.Screen name="View" component={HomeView} />
        </Drawer.Navigator>
    )
}
