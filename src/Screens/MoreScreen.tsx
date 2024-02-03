import { Button, Text, View } from "react-native";
import * as React from "react";

import { TabActions, useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import WebView from "react-native-webview";
import { useEffect } from "react";

type MoreScreenStackNavigatorParamList = {
    Main: undefined;
    ExternalLink: { url: string };
};
const Stack = createNativeStackNavigator<MoreScreenStackNavigatorParamList>();

export function MoreScreen() {
    return (
        <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
                animation: "default",
                presentation: "card",
                headerShown: true,
                gestureEnabled: false,
                headerStyle: {
                    backgroundColor: "#0c62f3",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="ExternalLink" component={ExternalLinkScreen} />
        </Stack.Navigator>
    );
}

function MainScreen() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Settings!</Text>
        </View>
    );
}
function ExternalLinkScreen({ route, navigation }: NativeStackScreenProps<MoreScreenStackNavigatorParamList, "ExternalLink">) {
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <Button onPress={() => navigation.dispatch(TabActions.jumpTo("Home"))} title="Back" />,
        });
    }, [navigation]);

    return <WebView source={{ uri: route.params.url }} style={{ flex: 1 }} />;
}
