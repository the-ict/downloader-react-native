import { createDrawerNavigator } from "@react-navigation/drawer"
import NewPassword from "../screens/NewPassword"
import FolderLock from "../screens/FolderLock"
import Finished from "../screens/Finished"
import IsSecret from "../screens/isSecret"

const Drawer = createDrawerNavigator()

export default function FinishedDrawer() {
    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }} initialRouteName="FinishedDrawer">
            <Drawer.Screen name="FinishedDrawer" component={Finished} />
            <Drawer.Screen name="IsSecret" component={IsSecret} />
            <Drawer.Screen name="FolderLock" component={FolderLock} />
            <Drawer.Screen name="NewPassword" component={NewPassword} />
        </Drawer.Navigator>
    )
}   