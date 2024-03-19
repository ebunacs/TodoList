import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import LottieView from 'lottie-react-native';
import done from '../assets/done.json';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Button from "../components/Button";
import { Timestamp } from "firebase/firestore/lite";
import { createTask, dropTable, getTasks, getTasksByUserId, updateTaskStatus } from "../../db/db";
import AsyncStorage from "@react-native-async-storage/async-storage";


type HomeScreenProps = {
    navigation: NavigationProp<any>;
    route: any;
};
interface Task {
    id: number;
    task: string;
    status: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
// Tyu@gmail.com
// 46
// 000000
const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
    const [value, onChange] = useState('');
    const [data, setData] = useState<any>([]);
    const [focus, setFocus] = useState<number>(0);
    // const [userId, setUserId] = useState<number>(0);
    const { userId } = route.params
    useEffect(() => {
        getTasksByUserId(userId).then(({ data }) => {
            setData(data);
        }).catch((error) => {
            console.log(error)
        });
    }, [])

    const addTask = () => {
        onChange('')
        setFocus(0);
        Keyboard.dismiss();
        createTask(userId, value, 0).then(() => {
            getTasksByUserId(userId).then(({ data }) => {
                setData(data);
            }).catch((error) => {
                console.log(error)
            });
        }
        )
    }
    const Item = ({ item }: { item: Task }) => {
        const [autoPlay, setAutoPlay] = useState(false);
        const [progress, setProgress] = useState(0.5);
        const [disable, setDisable] = useState(false);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
            if (item?.status) {
                setProgress(1);
                setAutoPlay(true);
            } else if (item?.status) {
                setProgress(0.5);
                setAutoPlay(false);
            }
        }, [item?.status])


        useEffect(() => {
            if (Boolean(loading)) {
                if (autoPlay) {
                    setDisable(true);
                    setTimeout(() => {
                        setProgress(1);
                        setDisable(false);
                    }, 750);
                } else {
                    setProgress(0.5)
                }
            }
        }, [autoPlay]);


        useEffect(() => {
            if (Boolean(loading)) {
                let temp = [...data];
                let index = temp.findIndex((i) => i.id === item.id);
                if (progress === 1) {
                    let doneIndex = temp.findIndex((i) => i.status);
                    temp[index].status = true;
                    if (doneIndex === -1) {
                        doneIndex = temp.length;
                    }
                    temp = [...temp.slice(0, index), ...temp.slice(index + 1, doneIndex), temp[index], ...temp.slice(doneIndex)]
                } else if (progress === 0.5) {
                    temp[index].status = false;
                    temp = [temp[index], ...temp.slice(0, index), ...temp.slice(index + 1)];
                }
                setData(temp);
                setLoading(false);
            }
        }, [progress]);

        const handleTaskClick = () => {
            // console.log('autoPlay', autoPlay);
            updateTaskStatus(item.id, !item.status)
            setLoading(true)
            setAutoPlay(prev => !prev);
        }
        return (
            <TouchableOpacity disabled={disable} activeOpacity={0.6} style={[{ flexDirection: 'row', marginTop: hp("2%"), width: "100%", height: hp("10%"), borderRadius: 15, borderWidth: 2 }, item.status ? { borderColor: "#FFC700" } : { borderColor: "#ffffff" }]}
                onPress={handleTaskClick}
            >
                <LottieView source={done} style={{ flex: 1 }} loop={false} progress={progress} autoPlay={autoPlay} speed={2} />
                <Text style={[{ flex: 5, paddingStart: "4%", alignSelf: 'center' }]}>{item.task}</Text>
            </TouchableOpacity>
        )
    }
    const renderItem = ({ item }: { item: Task }) => {
        return (
            <Item key={item.id} item={item} />
        )
    }

    const handleLogout = () => {
        navigation.navigate("Login");
        AsyncStorage.removeItem('userToken')
    }
    return (
        <TouchableWithoutFeedback onPress={() => {
            setFocus(0);
            console.log('dismissed')
            Keyboard.dismiss();
        }} >
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', marginBottom: "4%" }}>
                    <View style={[{ flex: 3, paddingLeft: wp("3%"), borderRadius: 15, marginRight: "5%" }, focus && { borderColor: "#FFC700", borderWidth: 1 }]}>
                        <TextInput
                            placeholder={"Хийх зүйлс"}
                            onFocus={() => {
                                setFocus(1);
                            }}
                            onSubmitEditing={addTask}

                            onChangeText={onChange}
                            value={value}
                        />
                    </View>

                    <Button title="Нэмэх" onPress={addTask} style={{ width: wp("20%") }} />
                </View>
                <FlatList

                    showsVerticalScrollIndicator={false}
                    // style={{ width: "100%", height: "50%" }}
                    data={data}
                    renderItem={renderItem} />

                <Button title="Гарах" onPress={handleLogout} style={{ width: wp("20%") }} />
            </View>
        </TouchableWithoutFeedback>
    )
}


const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        padding: wp("5%"),
        backgroundColor: "#f9f9f9",
    },
});
export default HomeScreen;