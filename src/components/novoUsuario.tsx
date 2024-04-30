import React, { useState } from "react";
import { Box, Button, CheckIcon, FormControl, Input, ScrollView, Select, Text, useToast, WarningOutlineIcon } from "native-base";
import { auth, db } from "../services/firebaseConfig";
import { ref, set } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const NovoUsuario = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaRepeticao, setSenhaRepeticao] = useState('');
    const [permissao, setPermissao] = useState('');
    const [erros, setErros] = useState({});
    const toast = useToast();
    const navigation = useNavigation();
    const logina = auth;

    const validarUsuario = () => {
        const nomeRegex = new RegExp(/[A-Za-z][A-Za-z0-9 ()-]?/);
        const emailRegex = new RegExp(/([a-zA-Z0-9_.+-]+)@[a-zA-Z0-9_.+-]+\.[a-zA-Z0-9_.+-]/);
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
                        toast.show({
                            render: () => {
                                return <Box padding={2} mb={3} rounded="sm" _text={{color: "#fff"}} bg="green.500">O usuário foi cadastrado com sucesso!</Box>;
                            }
                        });
                        navigation.navigate("Painel de Controle - AMEM" as never);
                    }).catch((error) => {
                        toast.show({
                            render: () => {
                                return <Box padding={2} mb={3} rounded="sm" _text={{color: "#fff"}} bg="red.500">Erro: {error}.</Box>;
                            }
                        });
                    });
                }).catch((error) => {
                    toast.show({
                        render: () => {
                            return <Box padding={2} mb={3} rounded="sm" _text={{color: "#fff"}} bg="red.500">Erro: {error}.</Box>;
                        }
                    });
                });
            }
        })
        .catch((error) => {
            toast.show({
                render: () => {
                    return <Box padding={2} mb={3} rounded="sm" _text={{color: "#fff"}} bg="red.500">Erro: {error}.</Box>;
                }
            });
        });
    };


    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box padding={50}>
                <Box marginBottom={50}>
                    <Text textAlign={"center"} bold fontSize={"3xl"}>Cadastrar Evento</Text>
                    <Text textAlign={"center"} fontSize={"xl"}>Por gentileza, preencha os campos abaixo para cadastrar um novo evento.</Text>
                </Box>
                <Box marginBottom={25}>
                    <FormControl isRequired isInvalid={'nome' in erros}>
                        <FormControl.Label>Nome:</FormControl.Label>
                        <Input placeholder="Escolha um nome..." onChangeText={novoNome => setNome(novoNome)}/>
                        {'nome' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.nome}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'email' in erros}>
                        <FormControl.Label>E-mail:</FormControl.Label>
                        <Input placeholder="Insira o e-mail..." onChangeText={novoEmail => setEmail(novoEmail)}/>
                        {'email' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.email}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'senha' in erros}>
                        <FormControl.Label>Senha:</FormControl.Label>
                        <Input type="password" placeholder="Escolha uma senha..." onChangeText={novaSenha => setSenha(novaSenha)}/>
                        {'senha' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.senha}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'senhaRepeticao' in erros}>
                        <FormControl.Label>Confirmar Senha:</FormControl.Label>
                        <Input type="password" placeholder="Repita a senha..." onChangeText={novaSenhaRepeticao => setSenhaRepeticao(novaSenhaRepeticao)}/>
                        {'senhaRepeticao' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.senhaRepeticao}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'permissao' in erros}>
                        <FormControl.Label>Permissão:</FormControl.Label>
                        <Select onValueChange={novaPermissao => setPermissao(novaPermissao)} placeholder="Escolha uma permissão..." _selectedItem={{bg: "teal.600", endIcon: <CheckIcon size={1} />}}>
                            <Select.Item label="Usuário" value="usuario" />
                            <Select.Item label="Editor" value="editor" />
                            <Select.Item label="Administrador" value="administrator" />
                        </Select>
                        {'permissao' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.permissao}</FormControl.ErrorMessage> : ''
                        }
                    </FormControl>
                </Box>
                <Box flexDirection={"row"}>
                    <Button size={"lg"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} flex={1} marginRight={1} onPress={validarUsuario}>Cadastrar</Button>
                    <Button size={"lg"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} flex={1} marginRight={1} onPress={() => console.log("hello world")}>Limpar</Button>
                </Box>
            </Box>
        </ScrollView>
    );
};

export default NovoUsuario;