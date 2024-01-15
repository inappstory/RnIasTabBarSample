/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from "react";
import { Text, View } from "react-native";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RNWelcomeScreen } from "./Screens/RNWelocmeScreen";
import { useIas, StoryReader } from "react-native-ias";
import { createAppearanceManager, createStoryManager } from "./services/StoriesConfig";

// function App(): JSX.Element {
//     return <NavigationContainer />;
// }

// function HomeScreen() {
//     return (
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//             <Text>Home!</Text>
//         </View>
//     );
// }

function SettingsScreen() {
    const { storyManager, appearanceManager } = useIas(createStoryManager, createAppearanceManager);
    useFocusEffect(() => {
        setTimeout(() => storyManager.showStory(16932, appearanceManager), 1000);
    });
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Settings!</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarActiveTintColor: "tomato",
                    tabBarInactiveTintColor: "gray",
                })}>
                <Tab.Screen name="Home" component={RNWelcomeScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
            <StoryReader storyManager={useIas(createStoryManager, createAppearanceManager).storyManager} />
        </NavigationContainer>
    );
}
