/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RNWelcomeScreen } from "./Screens/RNWelocmeScreen";
import { StoryReader } from "react-native-ias";
import { storyManager } from "./services/StoryService";
import { MoreScreen } from "./Screens/MoreScreen.tsx";
import { navigationRef } from "./RootNavigation.ts";

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

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer ref={navigationRef}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarActiveTintColor: "tomato",
                    tabBarInactiveTintColor: "gray",
                    headerShown: false,
                })}>
                <Tab.Screen name="Home" component={RNWelcomeScreen} />
                <Tab.Screen name="More" component={MoreScreen} />
            </Tab.Navigator>
            <StoryReader storyManager={storyManager} />
        </NavigationContainer>
    );
}

// version migrate
