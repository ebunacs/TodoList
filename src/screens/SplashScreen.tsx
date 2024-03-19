import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';


type SplashScreenProps = {
    navigation: NavigationProp<any>;
};
const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');

            setTimeout(() => {
                if (userToken) {
                    navigation.navigate('Home');
                    setLoggedIn(true);
                }
                else {
                    navigation.navigate('SignUp');
                }
            }, 500)
        } catch (error) {

            console.error('Error checking login status:', error);
        }
    };
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{fontSize:24}}>Hello</Text>
        </View>
    );
};

export default SplashScreen;