import { createNativeStackNavigator } from "@react-navigation/native-stack"
import DownloadInfoSheet from "./screens/DownloadInfoSheet.jsx"
import { NavigationContainer } from "@react-navigation/native"
import FeedbackSlider from "./screens/FeedbackSlider.jsx"
import VideoInfo from "./screens/VideoInfoSheet.jsx"
import { HomeBottoms } from "./navigations/index.js"
import Bookmarks from "./screens/Bookmarks.jsx"
import Settings from "./screens/Settings.jsx"
import FeedBack from "./screens/FeedBack.jsx"
import History from "./screens/Histories.jsx"

// context Api
import { DownloadProvider } from "./context/downloadContext.js"
import VideoPlayer from "./screens/VideoPlayer.jsx"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <DownloadProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={() => {
            return {
              headerShown: false
            }
          }}>
          <Stack.Screen name="Home" component={HomeBottoms} />
          <Stack.Screen name="FeedBack" component={FeedBack} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="FeedbackSlider" component={FeedbackSlider} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="Bookmarks" component={Bookmarks} />
          <Stack.Screen name="VideoInfo" component={VideoInfo} options={{
            presentation: "formSheet",
            sheetAllowedDetents: "all",
            sheetCornerRadius: 50
          }} />
          <Stack.Screen name="DownloadInfo" component={DownloadInfoSheet} options={{
            presentation: "formSheet",
            sheetAllowedDetents: "all",
            sheetCornerRadius: 25
          }} />
          <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
        </Stack.Navigator>
      </NavigationContainer>
    </DownloadProvider>
  );
}
