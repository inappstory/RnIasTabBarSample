import { StyleSheet, useColorScheme, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { StoriesList, useIas, AppearanceManager, StoryManager, ListLoadStatus, Option } from "react-native-ias";

import ContentLoader, { Rect } from "react-content-loader/native";

import { Dimensions } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";

import StoriesListViewModel from "react-native-ias/types/StoriesListViewModel";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { createAppearanceManager, createStoryManager } from "../services/StoriesConfig";

const windowWidth = Dimensions.get("window").width;

enum LoadStatus {
    loading = "Loading",
    success = "LoadSuccess",
    fail = "LoadFail",
}
type StoryListComponentProps = {
    feedId: Option<string>;
    backgroundColor: string;
};
export const StoryListComponent = ({ feedId, backgroundColor }: StoryListComponentProps): JSX.Element => {
    const { storyManager, appearanceManager } = useIas(createStoryManager, createAppearanceManager);

    feedId = feedId || "default";

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(LoadStatus.loading);

    const loadStartAtRef = useRef<number>(null);

    const onLoadStart = () => {
        loadStartAtRef.current = new Date().getTime();
        setLoadStatus(LoadStatus.loading);
    };

    useEffect(() => {
        onLoadStart();
    }, []);

    const onLoadEnd = (listLoadStatus: ListLoadStatus) => {
        const minTime = 600;
        const now = new Date().getTime();
        const diff = Math.max(0, minTime - (now - loadStartAtRef.current));

        setTimeout(() => {
            if (listLoadStatus.defaultListLength > 0 || listLoadStatus.favoriteListLength > 0) {
                setLoadStatus(LoadStatus.success);
            } else {
                setLoadStatus(LoadStatus.fail);
            }

            if (listLoadStatus.error != null) {
                console.log({
                    name: listLoadStatus.error.name,
                    networkStatus: listLoadStatus.error.networkStatus,
                    networkMessage: listLoadStatus.error.networkMessage,
                });
            } else {
                console.log("LOAD SUCCESS", listLoadStatus);
            }
        }, diff);
    };

    const isDarkMode = useColorScheme() === "dark";

    const storiesListViewModel = useRef<StoriesListViewModel>();

    if (storyManager == null || appearanceManager == null) {
        return <></>;
    }

    appearanceManager.setStoriesListOptions({
        layout: {
            backgroundColor,
        },
        card: {
            title: {
                color: isDarkMode ? Colors.lighter : Colors.darker,
            },
        },
    });

    const viewModelExporterInner = (viewModel: StoriesListViewModel) => {
        storiesListViewModel.current = viewModel;
    };

    // @ts-ignore
    const containerHeight = storiesListViewModel.current?.storiesListDimensions?.totalHeight ?? 200;

    return (
        <View style={[styles.storyListContainer, { height: containerHeight }, loadStatus === LoadStatus.fail ? { display: "none" } : null]}>
            <AnimatedStoryList
                storyManager={storyManager}
                appearanceManager={appearanceManager}
                loadStatus={loadStatus}
                feedId={feedId}
                onLoadStart={onLoadStart}
                onLoadEnd={onLoadEnd}
                viewModelExporter={viewModelExporterInner}
            />
            <StoryListLoader loadStatus={loadStatus} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },

    storyListContainer: { position: "relative", width: "100%" },
    storyList: {
        flex: 1,
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
    },
    storyLoader: {
        width: "100%",
        paddingRight: 0,
        backgroundColor: "transparent",
        position: "absolute",
        top: 0,
        left: 0,
    },
});

const StoryListLoader = ({ loadStatus }: { loadStatus: LoadStatus }) => {
    const opacity = useSharedValue(1);

    const style = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, {
                duration: 250,
                // easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                easing: Easing.linear,
            }),
        };
    }, [opacity]);

    useEffect(() => {
        opacity.value = loadStatus === LoadStatus.success ? 0 : 1;
    }, [loadStatus, opacity]);

    const { appearanceManager } = useIas(createStoryManager, createAppearanceManager);

    const height = appearanceManager.storiesListOptions.card?.height ?? 0;
    const cardWidth = height;
    const paddingVertical = appearanceManager.storiesListOptions.topPadding;
    const sidePadding = appearanceManager.storiesListOptions.sidePadding ?? 0;
    const cardGap = appearanceManager.storiesListOptions.card?.gap ?? 0;

    const radius = height / 2;

    return (
        <Animated.View style={[styles.storyLoader, style, { height, paddingVertical, paddingLeft: sidePadding }]} pointerEvents="none">
            <ContentLoader
                width={windowWidth - sidePadding}
                height={height}
                viewBox={`0 0 ${windowWidth - sidePadding} ${height}`}
                speed={1}
                backgroundColor="#f0f0f0"
                foregroundColor="#777777">
                {[0, 1, 2, 3, 4].map(index => (
                    <Rect key={index} x={(cardWidth + cardGap) * index} y="0" rx={radius} ry={radius} width={cardWidth} height={height} />
                ))}
            </ContentLoader>
        </Animated.View>
    );
};

const AnimatedStoryList = ({
    loadStatus,
    storyManager,
    appearanceManager,
    feedId,
    onLoadStart,
    onLoadEnd,
    viewModelExporter,
}: {
    loadStatus: LoadStatus;
    storyManager: StoryManager;
    appearanceManager: AppearanceManager;
    feedId: string;
    onLoadStart: () => void;
    onLoadEnd: (listLoadStatus: ListLoadStatus) => void;
    viewModelExporter: (viewModel: StoriesListViewModel) => void;
}) => {
    const opacity = useSharedValue(0);

    const style = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, {
                duration: 250,
                easing: Easing.linear,
            }),
        };
    }, [opacity, loadStatus]);

    useEffect(() => {
        opacity.value = loadStatus === LoadStatus.success ? 1 : 0;
    }, [loadStatus, opacity]);

    return (
        <Animated.View style={[styles.storyList, style]}>
            <StoriesList
                storyManager={storyManager}
                appearanceManager={appearanceManager}
                feed={feedId}
                onLoadStart={onLoadStart}
                onLoadEnd={onLoadEnd}
                viewModelExporter={viewModelExporter}
            />
        </Animated.View>
    );
};