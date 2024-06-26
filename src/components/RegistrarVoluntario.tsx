import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Box, Button, FormControl, Icon, Input, Pressable, ScrollView, Text, useToast, WarningOutlineIcon } from "native-base";
import { db } from "../services/firebaseConfig";
import { ref, push } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import showToast from "../util/showToast";
import errorTranslate from "../util/errorTranslate";
import showLoading from "../util/showLoading";

const RegistrarVoluntario = ({ route }: { route: any }) => {
    // Fixas
    const { evento } = route.params;
    const navigation = useNavigation<any>();
    const toast = useToast();

    // Variáveis
    const [uploading, setUploading] = useState(false);
    const [erros, setErros] = useState({});

    // Gets & Sets
    const [nome, setNome] = useState('');
    const [curso, setCurso] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [horas, setHoras] =  useState('');

    // Refs
    const nomeRef = useRef(null);
    const cursoRef = useRef(null);
    const telefoneRef = useRef(null);
    const emailRef = useRef(null);
    const horasRef = useRef(null);

    // Muda o foco do formulário ao pressionar enter.
    const mudarRef = (evento: any, proximaRef: any) => {
        if (evento === "Enter" || evento.nativeEvent.key === "Enter") {
            if (proximaRef) {
                proximaRef.current.focus();
            } else {
                validarVoluntario();
            }
        }
    };

    // Formata o telefone conforme o usuário digita.
    const formatarTelefone = (telefone: any) => {
        const novoTelefone = telefone.replace(/\D/g, "");
      
        if (novoTelefone.length === 10 || novoTelefone.length === 11) {
            setTelefone(novoTelefone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3'));
        } else {
            setTelefone(telefone);
        }
    };

    // Limpa os campos do formulário.
    const limpar = () => {
        setNome('');
        setCurso('');
        setTelefone('');
        setEmail('');
        setHoras('');
        setErros({});
    };

    // Valida os campos do formulário através de expressões regulares.
    const validarVoluntario = () => {
        const nomeRegex = new RegExp(/^[A-Za-zÀ-ú]+(?:\s[A-Za-zÀ-ú]+)*$/);
        const cursoRegex = new RegExp(/^[^\s].*$/);
        const telefoneRegex = new RegExp(/^\(\d{2}\) (\d{5}-\d{4}|\d{4}-\d{4})$/);
        const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        const horasRegex = new RegExp(/^\d+$/);
        let erros = 0;

        setErros({});

        if (!nomeRegex.test(nome)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                nome: 'O nome do voluntário inserido é inválido.',
            }));

            erros++;
        }

        if (!cursoRegex.test(curso)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                curso: 'O nome do curso inserido é inválido.',
            }));

            erros++;
        }

        if (telefone != '' && !telefoneRegex.test(telefone)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                telefone: 'O número de telefone precisa seguir o padrão brasileiro, assim como (XX) XXXXX-XXXX.',
            }));

            erros++;
        }

        if (email != '' && !emailRegex.test(email)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                email: 'O e-mail inserido é inválido.',
            }));

            erros++;
        }

        if (!horasRegex.test(horas)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                horas: 'O número de horas inserido é inválido.',
            }));

            erros++;
        }

        if ( erros == 0 ) {
            adicionarVoluntario();
        }
    };

    // Registra o voluntário no banco de dados.
    const adicionarVoluntario = () => {
        setUploading(true);

        push(ref(db, 'eventos/' + evento.id + '/voluntarios/'), {
            nome: nome,
            curso: curso,
            telefone: telefone,
            email: email,
            horas: horas
        }).then(() => {
            showToast(toast, "#404040", "O voluntário foi registrado com sucesso!");
            navigation.navigate("Detalhes do Evento - AMEM", { evento: evento });
        }).catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error));
        }).finally(() => {
            setUploading(false);
        });
    };

    return (
        <ScrollView contentContainerStyle={{width:'100%'}}>
            {showLoading(uploading, () => setUploading(false))}
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Pressable style={styles.box2} onPress={() => navigation.navigate("Detalhes do Evento - AMEM", { evento: evento })}>
                        <Icon as={MaterialIcons} name="navigate-before" size={25} color={"#818181"} />
                        <Text textAlign={"left"} bold fontSize={"3xl"}>Registrar Voluntário</Text>
                    </Pressable>
                    <Text textAlign={"left"} fontSize={"lg"}>Preencha os campos abaixo para registrar um novo voluntário em {evento.nome}.</Text>
                </Box>
                <Box style={styles.box1}>
                    <FormControl isRequired isInvalid={'nome' in erros}>
                        <FormControl.Label>Nome Completo:</FormControl.Label>
                        <Input autoFocus value={nome} ref={nomeRef} onKeyPress={(tecla) => mudarRef(tecla, cursoRef)} placeholder="Ex.: João Vithor" onChangeText={novoNome => setNome(novoNome)} backgroundColor={"white"} size={"lg"}/>
                        {'nome' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.nome}</FormControl.ErrorMessage> : null}
                    </FormControl>
                    <FormControl isRequired isInvalid={'curso' in erros}>
                        <FormControl.Label>Curso:</FormControl.Label>
                        <Input value={curso} ref={cursoRef} onKeyPress={(tecla) => mudarRef(tecla, telefoneRef)} placeholder="Ex.: Ciência da Computação" onChangeText={novoCurso => setCurso(novoCurso)} backgroundColor={"white"} size={"lg"}/>
                        {'curso' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.curso}</FormControl.ErrorMessage> : null}
                    </FormControl>
                    <FormControl isInvalid={'telefone' in erros}>
                        <FormControl.Label>Telefone:</FormControl.Label>
                        <Input value={telefone} ref={telefoneRef} onKeyPress={(tecla) => mudarRef(tecla, emailRef)} placeholder="Ex.: (51) 91234-5678" onChangeText={novoTelefone => formatarTelefone(novoTelefone)} backgroundColor={"white"} size={"lg"}/>
                        {'telefone' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.telefone}</FormControl.ErrorMessage> : null}
                    </FormControl>
                    <FormControl isInvalid={'email' in erros}>
                        <FormControl.Label>E-mail:</FormControl.Label>
                        <Input value={email} ref={emailRef} onKeyPress={(tecla) => mudarRef(tecla, horasRef)} placeholder="Ex.: pedro.silveira@unilasalle.edu.br" onChangeText={novoEmail => setEmail(novoEmail)} backgroundColor={"white"} size={"lg"}/>
                        {'email' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.email}</FormControl.ErrorMessage> : null}
                    </FormControl>
                    <FormControl isRequired isInvalid={'horas' in erros}>
                        <FormControl.Label>Horas Complementares:</FormControl.Label>
                        <Input value={horas} ref={horasRef} onKeyPress={(tecla) => mudarRef(tecla, null)} placeholder="Ex.: 5" onChangeText={novaHoras => setHoras(novaHoras)} backgroundColor={"white"} size={"lg"}/>
                        {'horas' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.horas}</FormControl.ErrorMessage> : null}
                    </FormControl>
                </Box>
                <Box flexDirection={"row"}>
                    <Button size={"lg"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} flex={1} marginRight={1} onPress={validarVoluntario}>Registrar</Button>
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

export default RegistrarVoluntario;
