import React, { useEffect, useState } from "react";
import { NativeBaseProvider } from "native-base";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from "firebase/auth";
import Navbar from "./src/components/navbar";
import Footer from "./src/components/footer";
import CadastrarEvento from "./src/components/CadastrarEvento";
import PainelControle from "./src/components/PainelControle";
import Login from "./src/components/Login";
import { auth } from "./src/services/firebaseConfig";
import NovoUsuario from "./src/components/NovoUsuario";
import DetalhesEvento from "./src/components/DetalhesEvento";
import RegistrarDoacao from "./src/components/RegistrarDoacao";
import RegistrarVoluntario from "./src/components/RegistrarVoluntario";
import DetalhesDoacao from "./src/components/DetalhesDoacao";
import DetalhesVoluntario from "./src/components/DetalhesVoluntario";

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout(){
  return (
    <>
      <Navbar />
      <InsideStack.Navigator screenOptions={{headerShown: false}}>
        <InsideStack.Screen name="Painel de Controle - AMEM" component={PainelControle} />
        <InsideStack.Screen name="Cadastrar Evento - AMEM" component={CadastrarEvento} />
        <InsideStack.Screen name="Novo Usuário - AMEM" component={NovoUsuario} />
        <InsideStack.Screen name="Detalhes do Evento - AMEM" component={DetalhesEvento} />
        <InsideStack.Screen name="Registrar Doação - AMEM" component={RegistrarDoacao} />
        <InsideStack.Screen name="Registrar Voluntário - AMEM" component={RegistrarVoluntario} />
        <InsideStack.Screen name="Detalhes da Doação - AMEM" component={DetalhesDoacao} />
        <InsideStack.Screen name="Detalhes do Voluntário - AMEM" component={DetalhesVoluntario} />
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