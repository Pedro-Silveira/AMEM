import React, { useRef, useState } from "react";
import { Box, Button, Input, Image, ScrollView, Icon, Text, useToast, Pressable, Modal, FormControl, WarningOutlineIcon } from "native-base";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { MaterialIcons } from '@expo/vector-icons';
import showToast from "../util/showToast";
import errorTranslate from "../util/errorTranslate";

const Login = () => {
    // Fixas
    const ano = new Date().getFullYear();
    const toast = useToast();

    // Variáveis
    const [erros, setErros] = useState({});
    const [showModal, setShowModal] = useState(false);

    // Gets & Sets
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [emailRec, setEmailRec] = useState('');

    // Refs
    const emailRef = useRef(null);
    const senhaRef = useRef(null);    

    // Muda o foco do formulário ao pressionar enter.
    const mudarRef = (evento: any, proximaRef: any) => {
        if (evento.nativeEvent.key === "Enter") {
            if (proximaRef) {
                proximaRef.current.focus();
            } else {
                fazerLogin();
            }
        }
    };

    // Valida o login com base em expressões regulares.
    const validarRecuperacao = () => {
        let erros = 0;

        setErros({});

        if (emailRec == ''){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                emailRec: 'O e-mail não foi preenchido.',
            }));

            erros++;
        }

        if ( erros == 0 ) {
            recuperarSenha(emailRec);
        }
    };

    const fazerLogin = () => {
        signInWithEmailAndPassword(auth, email, senha)
        .catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error.code));
        });
    };

    const recuperarSenha = async (mailto: any) => {
        await sendPasswordResetEmail(auth, mailto)
        .then(() => {
            showToast(toast, "#404040", "Um e-mail de redefinição de senha foi enviado para o seu endereço de e-mail.");
        }).catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error.code));
        });
    };

    return(
        <ScrollView contentContainerStyle={{width: "100%", height: "100%", backgroundColor: "#F2F2F2", justifyContent: "center"}}>
            <Box padding={50} alignItems={"center"}>
                <Image height={150} marginBottom={50} resizeMode={"contain"} source={require("./../media/AMEMLogin.png")} alt="AMEM" />
                <FormControl isRequired isInvalid={'email' in erros} alignItems={"center"} mb={2}>
                    <Input ref={emailRef} onKeyPress={(tecla) => mudarRef(tecla, senhaRef)} value={email} placeholder="Insira seu e-mail..." onChangeText={novoEmail => setEmail(novoEmail)} backgroundColor={"white"} size={"xl"} w={{base: "100%", md: "50%", lg: "30%"}} InputLeftElement={<Icon as={<MaterialIcons name="email" />} size={5} ml="3" color="#bebebe" />} />
                </FormControl>
                <FormControl isRequired isInvalid={'senha' in erros} alignItems={"center"}>
                    <Input ref={senhaRef} onKeyPress={(tecla) => mudarRef(tecla, null)} value={senha} type={"password"} placeholder="Insira sua senha..." onChangeText={novaSenha => setSenha(novaSenha)} backgroundColor={"white"} size={"xl"} w={{base: "100%", md: "50%", lg: "30%"}} InputLeftElement={<Icon as={<MaterialIcons name="lock" />} size={5} ml="3" color="#bebebe" />} />
                </FormControl>
                <Button size={"lg"} mb={4} mt={4} w={{base: "100%", md: "50%", lg: "30%"}} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} onPress={fazerLogin}>Entrar</Button>
                <Pressable onPress={() => setShowModal(true)} marginBottom={50}>
                    <Text color={"#1C3D8C"}>Esqueceu sua senha?</Text>
                </Pressable>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Esqueceu sua senha?</Modal.Header>
                        <Modal.Body>
                            <Text mb={3}>Insira seu endereço de e-mail e redefina a senha.</Text>
                            <FormControl isRequired isInvalid={'emailRec' in erros}>
                                <FormControl.Label>E-mail:</FormControl.Label>
                                <Input value={emailRec} placeholder="Insira seu e-mail..." onChangeText={novoEmailRec => setEmailRec(novoEmailRec)} backgroundColor={"white"} size={"lg"}/>
                                {'emailRec' in erros ?
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.emailRec}</FormControl.ErrorMessage>: null
                                }
                            </FormControl>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="coolGray" onPress={() => {setShowModal(false);}}>Cancelar</Button>
                                <Button backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} onPress={() => {validarRecuperacao();}}>Enviar</Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
                <Text color="#bebebe">Universidade La Salle &copy; {ano}</Text>
            </Box>
        </ScrollView>
    );
}

export default Login;