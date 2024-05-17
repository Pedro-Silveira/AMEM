import React, { useEffect, useState } from "react";
import { NativeBaseProvider } from "native-base";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from "firebase/auth";
import Navbar from "./src/components/Navbar";
import Footer from "./src/components/Footer";
import CadastrarEvento from "./src/components/CadastrarEvento";
import ControleEventos from "./src/components/ControleEventos";
import Login from "./src/components/Login";
import { auth, db } from "./src/services/firebaseConfig";
import NovoUsuario from "./src/components/NovoUsuario";
import DetalhesEvento from "./src/components/DetalhesEvento";
import RegistrarDoacao from "./src/components/RegistrarDoacao";
import RegistrarVoluntario from "./src/components/RegistrarVoluntario";
import DetalhesDoacao from "./src/components/DetalhesDoacao";
import DetalhesVoluntario from "./src/components/DetalhesVoluntario";
import ListaDoacoes from "./src/components/ListaDoacoes";
import ListaVoluntarios from "./src/components/ListaVoluntarios";
import controleUsuarios from "./src/components/ControleUsuarios";
import DetalhesUsuario from "./src/components/DetalhesUsuario";
import { LogBox } from 'react-native';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout(){
  return (
    <>
      <Navbar />
      <InsideStack.Navigator screenOptions={{headerShown: false}}>
        <InsideStack.Screen name="Controle de Eventos - AMEM" component={ControleEventos} />
        <InsideStack.Screen name="Cadastrar Evento - AMEM" component={CadastrarEvento} />
        <InsideStack.Screen name="Cadastrar Usuário - AMEM" component={NovoUsuario} />
        <InsideStack.Screen name="Detalhes do Evento - AMEM" component={DetalhesEvento} />
        <InsideStack.Screen name="Registrar Doação - AMEM" component={RegistrarDoacao} />
        <InsideStack.Screen name="Registrar Voluntário - AMEM" component={RegistrarVoluntario} />
        <InsideStack.Screen name="Detalhes da Doação - AMEM" component={DetalhesDoacao} />
        <InsideStack.Screen name="Detalhes do Voluntário - AMEM" component={DetalhesVoluntario} />
        <InsideStack.Screen name="Todas as Doações - AMEM" component={ListaDoacoes} />
        <InsideStack.Screen name="Todos os Voluntários - AMEM" component={ListaVoluntarios} />
        <InsideStack.Screen name="Controle de Usuários - AMEM" component={controleUsuarios} />
        <InsideStack.Screen name="Detalhes do Usuário - AMEM" component={DetalhesUsuario} />
      </InsideStack.Navigator>
      <Footer />
    </>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
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