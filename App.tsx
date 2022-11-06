import { FlatList, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { ViewToken } from "react-native";
import { useCallback } from "react";

const data = new Array(50).fill(0).map((_, index) => ({ id: index }));

type ListItemProps = {
  viewAbleItems: Animated.SharedValue<ViewToken[]>;
  item: {
    id: number;
  };
};

const ListItems = ({ viewAbleItems, item }: ListItemProps) => {
  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewAbleItems.value
        .filter(item => item.isViewable)
        .find(viewAbleItems => viewAbleItems.item.id === item.id)
    );

    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.6)
        }
      ]
    };
  }, []);

  return <Animated.View style={[styles.card, rStyle]} />;
};

const viewabilityConfig = {
  waitForInteraction: true,
  viewAreaCoveragePercentThreshold: 80
};

interface ChangeImageProps {
  viewableItems: ViewToken[];
}

export default function App() {
  const viewAbleItems = useSharedValue<ViewToken[]>([]);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: ChangeImageProps) => {
      viewAbleItems.value = viewableItems;
    },
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={data}
          contentContainerStyle={{ paddingTop: 40 }}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={handleViewableItemsChanged}
          renderItem={({ item }) => {
            return <ListItems item={item} viewAbleItems={viewAbleItems} />;
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24
  },
  card: {
    height: 80,
    width: "100%",
    backgroundColor: "#78cad2",
    marginTop: 20,
    borderRadius: 15
  }
});
