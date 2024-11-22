import { theme } from "@/color";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import uuid from "react-native-uuid";

export default function Index() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload: string) => setText(payload);
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const addToDo = () => {
    if (text === "") return;
    const newToDos = Object.assign({}, toDos, {
      [uuid.v4()]: { text, work: working },
    });
    setToDos(newToDos);
    setText("");
  };
  console.log(toDos);
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <TouchableOpacity onPress={work}>
            <Text
              style={{
                ...styles.btnText,
                color: working ? theme.df : theme.grey,
              }}
            >
              Work
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={travel}>
            <Text
              style={{
                ...styles.btnText,
                color: working ? theme.grey : theme.df,
              }}
            >
              Travel
            </Text>
          </TouchableOpacity>
        </View>
        <TextInput
          onSubmitEditing={addToDo}
          value={text}
          onChangeText={onChangeText}
          returnKeyType="done"
          placeholder={working ? "Add ToDo !" : "Where You Wanna Go ?"}
          placeholderTextColor="grey"
          style={styles.input}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "space-between",
  },
  btnText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 13,
    paddingHorizontal: 13,
    margin: 13,
    borderWidth: 1,
    borderRadius: 30,
    fontSize: 17,
  },
});
