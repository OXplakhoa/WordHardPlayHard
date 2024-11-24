import { theme } from "@/color";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY = "@ToDos";
export default function Index() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState<{
    [key: string]: { text: string; working: boolean };
  }>({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload: string) => setText(payload);
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const saveToDo = async (value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e: any) {
      console.error(e);
    }
  };
  const getToDo = async () => {
    try {
      const jsonVal: string | null= await AsyncStorage.getItem(STORAGE_KEY);
      return jsonVal != null ? setToDos(JSON.parse(jsonVal)) : null;
    } catch (e: any) {
      console.error(e);
    }
  };
  useEffect(() => {
    getToDo();
  },[])
  const addToDo = async () => {
    if (text === "") return;
    const newToDos = { ...toDos, [uuid.v4()]: { text, working } };
    setToDos(newToDos);
    await saveToDo(newToDos);
    setText("");
  };
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
        <ScrollView>
          {Object.keys(toDos).map((k) =>
            toDos[k].working === working ? (
              <View style={styles.toDo} key={k}>
                <Text style={styles.toDoText}> {toDos[k].text} </Text>
              </View>
            ) : null
          )}
        </ScrollView>
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
    marginVertical: 15,
    borderWidth: 1,
    borderRadius: 30,
    fontSize: 17,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  toDoText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
