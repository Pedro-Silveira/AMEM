import React, { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import { Box, Button, FormControl, Icon, Input, Pressable, ScrollView, Select, Text, useToast, WarningOutlineIcon } from "native-base";
import { auth, db } from "../services/firebaseConfig";
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import showToast from "../util/showToast";
import errorTranslate from "../util/errorTranslate";
import showLoading from "../util/showLoading";

const NovoUsuario = () => {
    // Fixas
    const navigation = useNavigation<any>();
    const toast = useToast();

    // Variáveis
    const [uploading, setUploading] = useState(false);
    const [erros, setErros] = useState({});
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    // Gets & Sets
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaRepeticao, setSenhaRepeticao] = useState('');
    const [permissao, setPermissao] = useState('');

    // Refs
    const nomeRef = useRef(null);
    const emailRef = useRef(null);
    const senhaRef = useRef(null);
    const senhaRepeticaoRef = useRef(null);
    const permissaoRef = useRef(null);

    // Muda o foco do formulário ao pressionar enter.
    const mudarRef = (evento: any, proximaRef: any) => {
        if (evento === "Enter" || evento.nativeEvent.key === "Enter") {
            if (proximaRef) {
                proximaRef.current.focus();
            } else {
                validarUsuario();
            }
        }
    };

    // Limpa os campos do formulário.
    const limpar = () => {
        setNome('');
        setEmail('');
        setSenha('');
        setSenhaRepeticao('');
        setPermissao('');
        setErros({});
    };

    // Valida os campos do formulários através de expressões regulares.
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
            criarUsuario();
        }
    };

    // Cria o usuário no firebase e armazena no banco de dados.
    const criarUsuario = async () => {
        setUploading(true);

        await createUserWithEmailAndPassword(auth, email, senha)
        .then(() => {
            if (auth.currentUser) {
                updateProfile(auth.currentUser, {
                    displayName: nome
                }).then(() =>{
                    set(ref(db, 'usuarios/' + auth.currentUser?.uid), {
                        nome: nome,
                        email: email,
                        permissao: permissao
                    }).then(() => {
                        showToast(toast, "#404040", "O usuário foi cadastrado com sucesso!");
                        auth.signOut();
                    }).catch((error) => {
                        showToast(toast, "#E11D48", errorTranslate(error.code));
                    }).finally(() => {
                        setUploading(false);
                    });
                }).catch((error) => {
                    showToast(toast, "#E11D48", errorTranslate(error.code));
                    setUploading(false);
                });
            } else {
                showToast(toast, "#E11D48", errorTranslate(null));
                setUploading(false);
            }
        })
        .catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error.code));
            setUploading(false);
        });
    };

    return (
        <ScrollView contentContainerStyle={{width:'100%'}}>
            {showLoading(uploading, () => setUploading(false))}
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Pressable style={styles.box2} onPress={() => navigation.navigate("Controle de Usuários - AMEM")}>
                        <Icon as={MaterialIcons} name="navigate-before" size={25} color={"#818181"} />
                        <Text textAlign={"left"} bold fontSize={"3xl"}>Cadastrar Usuário</Text>
                    </Pressable>
                    <Text textAlign={"left"} fontSize={"lg"}>Preencha os campos abaixo para cadastrar um novo usuário.</Text>
                </Box>
                <Box style={styles.box1}>
                    <FormControl isRequired isInvalid={'nome' in erros}>
                        <FormControl.Label>Nome:</FormControl.Label>
                        <Input autoFocus ref={nomeRef} value={nome} placeholder="Escolha um nome..." onChangeText={novoNome => setNome(novoNome)} backgroundColor={"white"} size={"lg"} onKeyPress={(tecla) => mudarRef(tecla, permissaoRef)} />
                        {'nome' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.nome}</FormControl.ErrorMessage>
                        : null }
                    </FormControl>
                    <FormControl isRequired isInvalid={'permissao' in erros}>
                        <FormControl.Label>Permissão:</FormControl.Label>
                        <Select ref={permissaoRef} dropdownIcon={<Icon as={MaterialIcons} name="keyboard-arrow-down" color={"#bebebe"} mr={2} size={"xl"} />} selectedValue={permissao} onValueChange={novaPermissao => {setPermissao(novaPermissao); mudarRef("Enter", emailRef)}} placeholder="Escolha uma permissão..." backgroundColor={"white"} size={"lg"} >
                            <Select.Item label="Usuário" value="usuario" />
                            <Select.Item label="Editor" value="editor" />
                            <Select.Item label="Administrador" value="administrador" />
                        </Select>
                        {'permissao' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.permissao}</FormControl.ErrorMessage>
                        : null }
                    </FormControl>
                    <FormControl isRequired isInvalid={'email' in erros}>
                        <FormControl.Label>E-mail:</FormControl.Label>
                        <Input ref={emailRef} value={email} placeholder="Insira o e-mail..." onChangeText={novoEmail => setEmail(novoEmail)} backgroundColor={"white"} size={"lg"} onKeyPress={(tecla) => mudarRef(tecla, senhaRef)} />
                        {'email' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.email}</FormControl.ErrorMessage>
                        : null }
                    </FormControl>
                    <FormControl isRequired isInvalid={'senha' in erros}>
                        <FormControl.Label>Senha:</FormControl.Label>
                        <Input ref={senhaRef} value={senha} type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}><Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="3" color="#bebebe" /></Pressable>} placeholder="Escolha uma senha..." onChangeText={novaSenha => setSenha(novaSenha)} backgroundColor={"white"} size={"lg"} onKeyPress={(tecla) => mudarRef(tecla, senhaRepeticaoRef)} />
                        {'senha' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.senha}</FormControl.ErrorMessage>
                        : null }
                    </FormControl>
                    <FormControl isRequired isInvalid={'senhaRepeticao' in erros}>
                        <FormControl.Label>Confirmar Senha:</FormControl.Label>
                        <Input ref={senhaRepeticaoRef} value={senhaRepeticao} type={show2 ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow2(!show2)}><Icon as={<MaterialIcons name={show2 ? "visibility" : "visibility-off"} />} size={5} mr="3" color="#bebebe" /></Pressable>} placeholder="Repita a senha..." onChangeText={novaSenhaRepeticao => setSenhaRepeticao(novaSenhaRepeticao)} backgroundColor={"white"} size={"lg"} onKeyPress={(tecla) => mudarRef(tecla, null)} />
                        {'senhaRepeticao' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.senhaRepeticao}</FormControl.ErrorMessage>
                        : null }
                    </FormControl>
                </Box>
                <Box flexDirection={"row"}>
                    <Button size={"lg"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} flex={1} marginRight={1} onPress={validarUsuario}>Cadastrar</Button>
                    <Button size={"lg"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} flex={1} marginLeft={1} onPress={limpar}>Limpar</Button>
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
        marginBottom: 25
    },
    box2: {
        flexDirection: "row",
        alignItems: "center"
    }
});

export default NovoUsuario;