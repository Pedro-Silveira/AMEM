import React, { useEffect, useState } from "react";
import { NativeBaseProvider } from "native-base";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Navbar from "./src/components/navbar";
import Footer from "./src/components/footer";
import CadastrarEvento from "./src/components/cadastrarEvento";
import ConsultarEvento from "./src/components/consultarEvento";
import Login from "./src/components/login";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./src/services/firebaseConfig";
import NovoUsuario from "./src/components/novoUsuario";

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout(){
  return (
    <>
      <Navbar />
      <InsideStack.Navigator screenOptions={{headerShown: false}}>
        <InsideStack.Screen name="Painel de Controle - AMEM" component={ConsultarEvento} />
        <InsideStack.Screen name="Cadastrar Evento - AMEM" component={CadastrarEvento} />
        <InsideStack.Screen name="Novo Usuário - AMEM" component={NovoUsuario} />
      </InsideStack.Navigator>
      <Footer />
    </>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Autenticação - AMEM" screenOptions={{headerShown: false}}>
          {!user ? (<Stack.Screen name="Autenticação - AMEM" component={Login} />) : (<Stack.Screen name="AMEM" component={InsideLayout} />)}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}