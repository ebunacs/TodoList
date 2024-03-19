import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Keyboard, StatusBar, StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, TextInputFocusEventData, NativeSyntheticEvent } from 'react-native';
// import * as React from "react"
import { useForm, Controller, useController } from "react-hook-form"

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { NavigationProp } from '@react-navigation/native';
import Button from '../components/Button';
import { loginUser } from '../../db/db';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenProps = {
    navigation: NavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const [focus, setFocus] = useState<string>("");
    const [placeholderEmail, sePplaceholderEmail] = useState<string>("Цахим хаяг");
    const [placeholderPassword, setPlaceholderPassword] = useState<string>("Нууц үг");
    const [message, setMessage] = useState<string>('')
    const handleFocus = (state: string) => {
        setFocus(state);
    };
    // Tyu@gmail.com
    // ty@gmail.com 
    // 000000
    // c 
    // 1
    // 2
    const handleLogin = (data: any) => {
        loginUser(data.email, data.password).then(({message, data}) => {
            setMessage(message)
            if(message === 'Амжилттай нэвтэрлээ'){
                navigation.navigate('Home', {userId: data.id})
                AsyncStorage.setItem('userToken', 'id');
                reset(); 
            }
        })
    }


    const handleSignUpLinkPress = () => {
        navigation.navigate("SignUp");
    };
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                setFocus("");
                Keyboard.dismiss();
            }}
        >

            <View style={styles.container}>
                <View
                    style={[
                        {
                            height: hp("25%"),
                            width: "100%",
                            alignItems: "center",
                        },
                    ]}
                >
                    <Text style={styles.title}>Тавтай морилно уу</Text>
                </View>
                <Text>{message}</Text>
                <View
                    style={{
                        height: hp("30%"),
                        justifyContent: "space-around",
                    }}
                >

                    <View style={[styles.input, focus == "email" && { borderColor: "#FFC700" }, errors.email && { borderColor: "red" }]}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder={placeholderEmail}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}

                                    onFocus={() => {
                                        handleFocus("email");
                                    }}
                                />
                            )}
                            name="email"
                        />
                    </View>
                    {errors.email && <Text>This is required.</Text>}

                    <View style={[styles.input, focus == "password" && { borderColor: "#FFC700" },
                    errors.password && { borderColor: "red" },]}>

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput

                                    onFocus={() => {
                                        handleFocus("password");
                                    }}
                                    placeholder={placeholderPassword}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="password"
                        />
                    </View>

                    {errors.password && <Text>This is required.</Text>}
                </View>

                <Button title="Submit" onPress={handleSubmit(handleLogin)} />
                <Text style={styles.signUpLinkText} onPress={handleSignUpLinkPress}>
                    Шинээр бүртгүүлэх
                </Text>
            </View>
        </TouchableWithoutFeedback>
    )
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // position: "relative",
        alignItems: "center",
        // justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 20,
        height: hp("10%"),
        // textAlign: "center",
        // top: "20%",
    },

    signUpLinkText: {
        color: "#FFC700",
    },
    input: {
        paddingLeft: "6%",

        width: wp("84%"),
        height: hp("10%"),
        // height:"30%",
        fontSize: 16,
        //   backgroundColor: "#00ffff",
        backgroundColor: "#ffffff",

        borderWidth: 1,
        borderColor: "#ffffff",
        borderRadius: 10,
    },
});
export default LoginScreen;