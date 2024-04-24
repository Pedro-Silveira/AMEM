import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { Box, Button, Input, Image } from "native-base";

export default function login({setUser}: {setUser: any}){
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            setUser(user);
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
        });
    };

    return(
        <Box flex={1} padding={50} backgroundColor={"#bebebe"}>
            <Image alignSelf={"center"} source={require("./../media/AMEMLogin.png")} alt="AMEM" flex={1} />
            <Input onChangeText={novoEmail => setEmail(novoEmail)}></Input>
            <Input onChangeText={novaSenha => setSenha(novaSenha)}></Input>
            <Button onPress={handleLogin}>Login</Button>
        </Box>
    );
};