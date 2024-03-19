import 'react-native-gesture-handler';
import React, { useCallback, useEffect } from 'react';


import { NavigationContainer } from '@react-navigation/native';
// import LoginScreen from './src/screens/LoginScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import { connectToDatabase, createTables } from './db/db';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SplashScreen from './src/screens/SplashScreen';


function App(): React.JSX.Element {
  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase()
      await createTables(db)

      return db; 
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();

  return (
    // <NavigationContainer>
    //   <Drawer.Navigator initialRouteName="Home">
    //     <Drawer.Screen name="Home" component={HomeScreen} />
    //     <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    //   </Drawer.Navigator>
    // </NavigationContainer>
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Login" >
        <Drawer.Screen name="Splash" component={SplashScreen} />
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="SignUp" component={SignUpScreen} />
        <Drawer.Screen name="Home" component={HomeScreen} />

      </Drawer.Navigator>
    </NavigationContainer>
  );
}


export default App;
