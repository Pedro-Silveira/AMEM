import React, { useState } from "react";
import { Box, Button, CheckIcon, FormControl, Input, ScrollView, Select, Text, useToast, WarningOutlineIcon } from "native-base";
import { StyleSheet } from "react-native";
import { auth, db } from "../services/firebaseConfig";
import { ref, set } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import showToast from "../util/showToast";
import errorTranslate from "../util/errorTranslate";

const NovoUsuario = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaRepeticao, setSenhaRepeticao] = useState('');
    const [permissao, setPermissao] = useState('');
    const [erros, setErros] = useState({});
    const navigation = useNavigation();
    const toast = useToast();
    const logina = auth;

    const limpar = () => {
        setNome('');
        setEmail('');
        setSenha('');
        setSenhaRepeticao('');
        setPermissao('');
        setErros({});
    };

    const validarUsuario = () => {
        const nomeRegex = new RegExp(/^[A-Za-zÀ-ú]+(?:\s[A-Za-zÀ-ú]+)*$/);
        const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        const senhaRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
        let erros = 0;

        setErros({});

        if (!nomeRegex.test(nome)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                nome: 'O nome inserido é inválido.',
            }));

            erros++;
        }

        if (!emailRegex.test(email)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                email: 'O e-mail inserido é inválido.',
            }));

            erros++;
        }

        if (!senhaRegex.test(senha)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                senha: 'A senha precisa conter ao menos oito caracteres, incluindo uma letra maiúscula, uma minúscula e um número.',
            }));

            erros++;
        }
        
        if (senhaRepeticao != senha || senhaRepeticao == "") { 
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                senhaRepeticao: 'As senhas informadas não conferem.',
            }));

            erros++;
        }

        if (permissao != "usuario" && permissao != "editor" && permissao != "administrador"){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                permissao: 'Escolha uma das permissões.',
            }));

            erros++;
        }

        if ( erros == 0 ) {
            handleSignin();
        }
    };

    const handleSignin = async () => {
        await createUserWithEmailAndPassword(logina, email, senha)
        .then((userCredentials) => {
            if(auth.currentUser){
                updateProfile(auth.currentUser, {
                    displayName: nome
                }).finally(() =>{
                    set(ref(db, 'usuarios/' + auth.currentUser?.uid), {
                        nome: nome,
                        email: email,
                        permissao: permissao
                    }).then(() => {
                        showToast(toast, "#404040", "O usuário foi cadastrado com sucesso!");
                        navigation.navigate("Painel de Controle - AMEM" as never);
                    }).catch((error) => {
                        showToast(toast, "#E11D48", errorTranslate(error));
                    });
                }).catch((error) => {
                    showToast(toast, "#E11D48", errorTranslate(error));
                });
            }
        })
        .catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error));
        });
    };


    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Text textAlign={"center"} bold fontSize={"3xl"}>Novo Usuário</Text>
                    <Text textAlign={"center"} fontSize={"xl"}>Por gentileza, preencha os campos abaixo para cadastrar um novo usuário.</Text>
                </Box>
                <Box style={styles.box2}>
                    <FormControl isRequired isInvalid={'nome' in erros}>
                        <FormControl.Label>Nome:</FormControl.Label>
                        <Input value={nome} placeholder="Escolha um nome..." onChangeText={novoNome => setNome(novoNome)} backgroundColor={"white"} size={"lg"} />
                        {'nome' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.nome}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'email' in erros}>
                        <FormControl.Label>E-mail:</FormControl.Label>
                        <Input value={email} placeholder="Insira o e-mail..." onChangeText={novoEmail => setEmail(novoEmail)} backgroundColor={"white"} size={"lg"}/>
                        {'email' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.email}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'senha' in erros}>
                        <FormControl.Label>Senha:</FormControl.Label>
                        <Input value={senha} type="password" placeholder="Escolha uma senha..." onChangeText={novaSenha => setSenha(novaSenha)} backgroundColor={"white"} size={"lg"}/>
                        {'senha' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.senha}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'senhaRepeticao' in erros}>
                        <FormControl.Label>Confirmar Senha:</FormControl.Label>
                        <Input value={senhaRepeticao} type="password" placeholder="Repita a senha..." onChangeText={novaSenhaRepeticao => setSenhaRepeticao(novaSenhaRepeticao)} backgroundColor={"white"} size={"lg"}/>
                        {'senhaRepeticao' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.senhaRepeticao}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'permissao' in erros}>
                        <FormControl.Label>Permissão:</FormControl.Label>
                        <Select selectedValue={permissao} onValueChange={novaPermissao => setPermissao(novaPermissao)} placeholder="Escolha uma permissão..." _selectedItem={{bg: "teal.600", endIcon: <CheckIcon size={1} />}} backgroundColor={"white"} size={"lg"}>
                            <Select.Item label="Usuário" value="usuario" />
                            <Select.Item label="Editor" value="editor" />
                            <Select.Item label="Administrador" value="administrador" />
                        </Select>
                        {'permissao' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.permissao}</FormControl.ErrorMessage> : ''
                        }
                    </FormControl>
                </Box>
                <Box flexDirection={"row"}>
                    <Button size={"lg"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} flex={1} marginRight={1} onPress={validarUsuario}>Cadastrar</Button>
                    <Button size={"lg"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} flex={1} marginRight={1} onPress={limpar}>Limpar</Button>
                </Box>
            </Box>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    boxCentral: {
        padding: 50
    },
    box1: {
        marginBottom: 50
    },
    box2: {
        marginBottom: 25
    }
});

export default NovoUsuario;