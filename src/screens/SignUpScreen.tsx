import axios from 'axios';
import React, { Key, useEffect, useRef, useState } from 'react';
import { Keyboard, StatusBar, StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, TextInputFocusEventData, NativeSyntheticEvent, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
// import * as React from "react"
import { useForm, Controller, useController } from "react-hook-form"

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { NavigationProp } from '@react-navigation/native';
import Button from '../components/Button';
import { createUser, dropTable, getUsers } from '../../db/db';
// import PreviousIcon from '../assets/previous.svg';
// import NextIcon from '../assets/next.svg';

type SignUpScreenProps = {
    navigation: NavigationProp<any>;
};
interface TextInputProps {
    key: Key;
    placeholder: string;
    name: string;
    length: number;
    RegExp: string;

}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            firstName: "",
            phoneNumber: "",
            email: "",
            password: "",
        }
    })
    // useEffect(() => {
    //     console.log('SignUpScreen')

    // }, [])
    const [focus, setFocus] = useState<string>("");
    const [el, setEl] = useState<number>(0);
    const [message, setMessage] = useState<string>('')
    const handleFocus = (state: string) => {
        // console.log(event.nativeEvent.target);
        setFocus(state);
    };
    const steps = 3;
    const handleSignUpLinkPress = () => {
        navigation.navigate("Login");
    };
    const flatListRef = useRef<FlatList | null>(null);
    const textInputProps = [
        { placeholder: 'Нэр', name: 'firstName', length: 1, RegExp: '.{1,}', key: 1 },
        { placeholder: 'Цахим хаяг', name: 'email', RegExp: '^(?=.{1,254}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', length: 2, key: 2 },
        { placeholder: 'Утасны дугаар', name: 'phoneNumber', RegExp: '^[0-9]+$', length: 1, key: 3 },
        { placeholder: 'Нууц үг', name: 'password', length: 6, RegExp: '.', key: 4 },
    ];

    // Tulgaa
    // Tulgaa@gmail.com
    // 99168881
    const handleSwipeRight = async (data: any) => {
        if (el !== steps) {
            setEl(el + 1);
        } else {
            await createUser(data.firstName, data.email, data.phoneNumber, data.password).then((res: any) => {
                if (res.data[0]?.insertId) {
                    navigation.navigate("Home", { "userId": res.data[0].insertId })
                }
                reset()
                setMessage(res.message)
            }).catch((error) => {
                console.log(error)
            })
        }
    };
    const handleSwipeLeft = () => {
        setEl(el - 1);
    };
    useEffect(() => {
        if (el === 4) {
            console.log('submit')
        }
        else {
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({ index: el, animated: true });
            }
        }
    }, [el])
    // 89676888
    // a45@gmail.com
    // abcdefgG
    const renderItem = ({ item, index }: { item: TextInputProps, index: number }) => (
        <View style={styles.inputContainer}>
            <View style={[styles.input, errors[item.name as keyof typeof errors] && { borderColor: "red" }]}>
                <Controller
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (index == el) {
                                return textInputProps[el].length <= value.length && new RegExp(textInputProps[el].RegExp).test(value);
                            }
                        },

                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder={item.placeholder}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={item.name === 'password' ? true : false}
                        />
                    )}
                    name={item.name as any}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>

            <View style={{ height: hp("20%"), justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.title}>Бүртгүүлэх</Text>
            </View>

            <View style={{ height: hp("5%"), alignItems: 'center', justifyContent: 'center' }}>
                <Text>
                    {message}
                </Text>
            </View>
            <FlatList
                ref={(ref) => (flatListRef.current = ref)}
                horizontal
                data={textInputProps}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                snapToInterval={wp('100%')}
                style={{
                    height: hp("25%"), flexGrow: 0,
                }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: wp("8%") }}>

                {
                    el !== 0 &&
                    <Button title="Буцах" onPress={handleSwipeLeft} style={{ width: hp("15%") }}>
                        {/* <Text style={{
                            color: 'white',
                        }}>Буцах</Text> */}
                    </Button>
                }
                {
                    el === 0 && <View style={[styles.swipeButton, { backgroundColor: "#f9f9f9" }]} />
                }
                <Button
                    title={el !== 3 ? "Дараагийнх" : "Бүртгүүлэх"}
                    onPress={handleSubmit(handleSwipeRight)}
                    style={{ width: hp("15%") }}
                />
            </View>
            {/* f@gmailc.om */}

        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // width: wp("100%"),
        // height: hp("100%"),
        // backgroundColor: "#f9f9f9",

    },
    title: {
        fontSize: 24,
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9c2ff',
        width: wp("100%"),
        height: hp("20%"),
    },
    swipeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: hp("8%"),
        minWidth: wp("25%"),
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        zIndex: 1,
        backgroundColor: 'black',
    },

    signUpLinkText: {
        color: "#FFC700",
    },
    input: {
        width: wp("84%"),
        backgroundColor: "#ffffff",
        paddingLeft: wp("6%"),
        height: hp("10%"),
        borderWidth: 1,
        borderColor: "#ffffff",
        borderRadius: 10,
    },
    inputContainer: {
        alignItems: "center",
        width: wp("100%"),
        height: hp("20%"),
        fontSize: 16,
    },
});
export default SignUpScreen;
