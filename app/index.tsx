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
  Platform,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
const STORAGE_KEY = "@ToDos";

export default function Index() {
  const [working, setWorking] = useState<boolean | null>(null);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState<{
    [key: string]: {
      text: string;
      working: boolean;
      completed: boolean;
      isEditing: boolean;
    };
  }>({});
  const [editingText, setEditingText] = useState<string>(""); 

  const work = () => setWorking(true);
  const travel = () => setWorking(false);
  const onChangeText = (payload: string) => setText(payload);

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
      if (jsonVal != null) {
        const parsedData = JSON.parse(jsonVal);
        const lastWorking = parsedData[Object.keys(parsedData).pop()!]?.working;
        setWorking(lastWorking);
        setToDos(parsedData);
      }
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
    const newToDos = {
      ...toDos,
      [uuid.v4()]: {
        text,
        working: currentWorking,
        completed: false,
        isEditing: false,
      },
    };
    setToDos(newToDos);
    await saveToDo(newToDos);
    setText("");
  };

  const deleteToDo = (key: string) => {
    if (Platform.OS === "web") {
      const ok = confirm("Are you sure you want to delete?");
      if (ok) {
        const { [key]: deleted, ...newToDo } = toDos;
        setToDos(newToDo);
        saveToDo(newToDo);
      }
    } else {
      Alert.alert(
        working ? "Delete Works" : "Delete Travels",
        "Are you sure you want to delete?",
        [
          {
            text: "Cancel",
            onPress: () => {
              return;
            },
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              const { [key]: deleted, ...newToDo } = toDos;
              setToDos(newToDo);
              await saveToDo(newToDo);
            },
          },
        ]
      );
    }
  };

  const toggleComplete = async (key: string) => {
    const newToDos = { ...toDos };
    newToDos[key].completed = !newToDos[key].completed;
    setToDos(newToDos);
    await saveToDo(newToDos);
  };

  const updateText = (newText: string) => {
    setEditingText(newText); 
  };

  const saveEditedText = async (key: string) => {
    const newToDos = { ...toDos };
    newToDos[key].text = editingText; 
    newToDos[key].isEditing = false; 
    setToDos(newToDos);
    await saveToDo(newToDos);
  };

  const toggleEdit = (key: string) => {
    const newToDos = { ...toDos };
    if (newToDos[key].isEditing) {
      saveEditedText(key);
    } else {
      setEditingText(newToDos[key].text);
      newToDos[key].isEditing = true;
      setToDos(newToDos);
    }
  };

  return (
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
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              {toDos[key].isEditing ? (
                <TextInput
                  value={editingText}
                  onChangeText={updateText}
                  style={styles.toDoText}
                  autoFocus
                />
              ) : (
                <Text
                  style={StyleSheet.compose(
                    styles.toDoText,
                    toDos[key].completed && {
                      opacity: 0.4,
                      textDecorationLine: "line-through",
                    }
                  )}
                >
                  {toDos[key].text}
                </Text>
              )}
              <View style={styles.toDoButtons}>
                <TouchableOpacity onPress={() => toggleEdit(key)}>
                  <MaterialIcons
                    name="edit"
                    size={26}
                    color={toDos[key].isEditing ? "#9090ff" : "#fff"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => toggleComplete(key)}
                  style={styles.toDoIcon}
                >
                  <Fontisto
                    name={toDos[key].completed ? "checkbox-active" : "checkbox-passive"}
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteToDo(key)}
                  style={styles.toDoIcon}
                >
                  <MaterialIcons name="cancel" size={26} color="tomato" />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
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
  toDoButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: -15,
  },
  toDoIcon: {
    paddingHorizontal: 5,
  },
});
