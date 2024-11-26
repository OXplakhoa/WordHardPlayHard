import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { theme } from "@/color"; // Your color theme

// Define types for ToDo object
interface ToDo {
  text: string;
  working: boolean;
  completed: boolean;
}

// Props for SwipeableToDo component
interface SwipeableToDoProps {
  todo: ToDo;
  onDelete: () => void;
}

const SwipeableToDo: React.FC<SwipeableToDoProps> = ({ todo, onDelete }) => {
  const translateX = useSharedValue(0); // Shared value for swipe translation
  const [isSwiped, setIsSwiped] = useState(false); // To track swipe state

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const translation = event.nativeEvent.translationX;

    // Prevent right swipe from going beyond 0
    if (translation > 0) {
      translateX.value = withSpring(0); // Snap back if swipe is right
    } else {
      translateX.value = withSpring(translation, { damping: 20, stiffness: 100 }); // Apply spring with custom config
    }
  };

  const onGestureEnd = () => {
    if (translateX.value < -75) {
      // If swipe exceeds threshold (e.g. -100), show delete button
      setIsSwiped(true);
    } else {
      // If swipe is canceled or too small, snap back to original position
      translateX.value = withSpring(0, { damping: 20, stiffness: 100 }); 
      setIsSwiped(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const confirmDelete = () => {
    Alert.alert("Delete ToDo", "Are you sure you want to delete this item?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onGestureEnd}
    >
      <Animated.View style={[styles.toDo, animatedStyle]}>
        <View style={styles.swipeableContent}>
          <Text style={styles.toDoText}>{todo.text}</Text>
        </View>

        {isSwiped && (
          <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
            <MaterialIcons name="delete" size={26} color="white" />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  swipeableContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toDoText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "tomato",
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
});

export default SwipeableToDo;