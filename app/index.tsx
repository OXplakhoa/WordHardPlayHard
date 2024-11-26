import { theme } from "@/color";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
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
import AntDesign from "@expo/vector-icons/AntDesign";
import SwipeableToDo from "./components/SwipeableToDo";
const STORAGE_KEY = "@ToDos";
export default function Index() {
  const [editMode,setEditMode] = useState<boolean>(false);
  const [completed,setCompleted] = useState<boolean>(false);
  const [working, setWorking] = useState<boolean | null>(null);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState<{
    [key: string]: { text: string; working: boolean; completed: boolean };
  }>({});
  const complete = () => setCompleted(true);
  const work = () => setWorking(true);
  const travel = () => setWorking(false);
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
      const jsonVal: string | null = await AsyncStorage.getItem(STORAGE_KEY);
      console.log(jsonVal);
      if (jsonVal != null) {
        const parsedData = JSON.parse(jsonVal);
        // const keys = Object.keys(parsedData);
        // const lastKey = keys[keys.length-1];
        // const lastWorking = parsedData[lastKey].working;
        const lastWorking = parsedData[Object.keys(parsedData).pop()!]?.working;
        setWorking(lastWorking);
        setToDos(parsedData);
      } else {
        return;
      }
      return jsonVal != null ? setToDos(JSON.parse(jsonVal)) : null;
    } catch (e: any) {
      console.error(e);
    }
  };
  useEffect(() => {
    getToDo();
  }, []);
  const addToDo = async () => {
    if (text === "") return;
    const currentWorking = working ?? true;
    const currentComplete = completed ?? false;
    const newToDos = {
      ...toDos,
      [uuid.v4()]: { text, working: currentWorking, completed: currentComplete },
    };
    setToDos(newToDos);
    await saveToDo(newToDos);
    setText("");
  };
  const deleteToDo = (key: string) => {
    Alert.alert(
      working ? "Delete Works" : "Delete Travels",
      "Are you sure you want delete?",
      [
        {
          text: "Cancel",
          style: "destructive",
          onPress: () => {
            return;
          },
        },
        {
          text: "Yes",
          onPress: async () => {
            const { [key]: deleted, ...newToDo } = toDos;
            setToDos(newToDo);
            await saveToDo(newToDo);
          },
        },
      ]
    );
  };
  if (working === null) {
    return (
      <View style={styles.container}>
        <Text>
          <AntDesign name="loading1" size={24} color="white" />
        </Text>
      </View>
    );
  }
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
      {Object.keys(toDos).map((key) => {
        const todo = toDos[key];
        return todo.working === working ? (
          <SwipeableToDo key={key} todo={todo} onDelete={() => deleteToDo(key)} />
        ) : null;
      })}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "600",
  },
});


// 2. Add a completion function to Todo
// 3. Add an edit function to Todo