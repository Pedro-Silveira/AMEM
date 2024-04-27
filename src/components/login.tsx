import React, { useState } from "react";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { Box, Button, Input, Image, ScrollView, Icon, Text, Link, useToast } from "native-base";
import { MaterialIcons } from '@expo/vector-icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const logina = auth;
    const toast = useToast();
    const ano = new Date().getFullYear();

    const handleLogin = async () => {
        await signInWithEmailAndPassword(logina, email, senha)
        .catch((error) => {
            toast.show({
                description: "Erro: " + error
              })
        });
    };

    return(
        <ScrollView contentContainerStyle={{width: "100%", height: "100%", backgroundColor: "#F2F2F2", justifyContent: "center"}}>
            <Box padding={50} alignItems={"center"}>
                <Image height={150} marginBottom={50} resizeMode={"contain"} source={require("./../media/AMEMLogin.png")} alt="AMEM" />
                <Input _hover={{borderColor: "#bebebe"}} marginBottom={2} focusOutlineColor={"#bebebe"} backgroundColor={"white"} size={"xl"} w={{base: "100%", md: "30%"}} InputLeftElement={<Icon as={<MaterialIcons name="email" />} size={5} ml="3" color="muted.400" />} placeholder="Digite seu e-mail..." onChangeText={novoEmail => setEmail(novoEmail)}></Input>
                <Input type={"password"} _hover={{borderColor: "#bebebe"}} marginBottom={25} focusOutlineColor={"#bebebe"} backgroundColor={"white"} size={"xl"} w={{base: "100%", md: "30%"}} InputLeftElement={<Icon as={<MaterialIcons name="lock" />} size={5} ml="3" color="muted.400" />} placeholder="Digite sua senha..."onChangeText={novaSenha => setSenha(novaSenha)}></Input>
                <Button size={"lg"} marginBottom={3} w={{base: "100%", md: "30%"}} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} onPress={handleLogin}>Entrar</Button>
                <Link isUnderlined={false} isExternal _text={{color: "#1C3D8C"}} marginBottom={50} href="https://www.linkedin.com/in/pedroh-silveira/" _hover={{_text: {color: "#043878"}}}>Esqueceu sua senha?</Link>
                <Text color="#bebebe">Universidade La Salle &copy; {ano}</Text>
            </Box>
        </ScrollView>
    );
}

export default Login;