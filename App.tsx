import React, { useState } from "react";
import { NativeBaseProvider } from "native-base";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Navbar from "./src/components/navbar";
import Footer from "./src/components/footer";
import CadastrarEvento from "./src/components/cadastrarEvento";
import ConsultarEvento from "./src/components/consultarEvento";
import Login from "./src/components/login";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState();

  return !user ? <NavigationContainer>
  <NativeBaseProvider><Login setUser={setUser} /></NativeBaseProvider>
    </NavigationContainer> : (
    <NavigationContainer>
      <NativeBaseProvider>
        <Navbar />
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="AMEM" component={ConsultarEvento} />
          <Stack.Screen name="Novo Evento - AMEM" component={CadastrarEvento} />
        </Stack.Navigator>
        <Footer />
      </NativeBaseProvider>
    </NavigationContainer>
  );
}