import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Box, Button, FormControl, Input, ScrollView, Text, useToast, WarningOutlineIcon } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { db } from "../services/firebaseConfig";
import { ref, push } from "firebase/database";
import showToast from "../util/showToast";
import testRegex from "../util/testRegex";

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

const registrarVoluntario = ({ route }: { route: any }) => {
    const { evento } = route.params;
    const [nome, setNome] = useState('');
    const [curso, setCurso] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [horas, setHoras] =  useState('');
    const [erros, setErros] = useState({});
    const navigation = useNavigation<any>();
    const toast = useToast();

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
        let erros = 0;

        setErros({});

        if (!testRegex(/^[A-Za-zÀ-ú]+(?:\s[A-Za-zÀ-ú]+)*$/, nome)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                nome: 'O nome do voluntário inserido é inválido.',
            }));

            erros++;
        }

        if (!testRegex(/^[^\s].*$/, curso)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                curso: 'O nome do curso inserido é inválido.',
            }));

            erros++;
        }

        if (!testRegex(/^\(\d{2}\) (9\d{4}-\d{4}|\d{4}-\d{4})$/, telefone)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                telefone: 'O número de telefone precisa seguir o padrão brasileiro, assim como (DD) 9XXXX-XXXX.',
            }));

            erros++;
        }

        if (!testRegex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, email)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                email: 'O e-mail inserido é inválido.',
            }));

            erros++;
        }

        if (!testRegex(/^\d+$/, horas)){
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

    // Adiciona o registro no banco de dados.
    const adicionarVoluntario = () => {
        push(ref(db, 'eventos/' + evento.id + '/voluntarios/'), {
            nome: nome,
            curso: curso,
            telefone: telefone,
            email: email,
            horas: horas
        }).then(() => {
            showToast(toast, "green.700", "O voluntário foi registrado com sucesso!");
            navigation.navigate("Detalhes do Evento - AMEM", { evento: evento });
        }).catch((error) => {
            showToast(toast, "red.700", "Erro: " + error);
        });
    };

    // Cria os elementos visuais em tela.
    return (
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Text textAlign={"center"} bold fontSize={"3xl"}>Registrar Voluntário</Text>
                    <Text textAlign={"center"} fontSize={"xl"}>Por gentileza, preencha os campos abaixo para registrar um novo voluntário em {evento.nome}.</Text>
                </Box>
                <Box style={styles.box2}>
                    <FormControl isRequired isInvalid={'nome' in erros}>
                        <FormControl.Label>Nome Completo:</FormControl.Label>
                        <Input value={nome} placeholder="Ex.: João Vithor" onChangeText={novoNome => setNome(novoNome)} backgroundColor={"white"} size={"lg"}/>
                        {'nome' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.nome}</FormControl.ErrorMessage> : ''}
                    </FormControl>
                    <FormControl isRequired isInvalid={'curso' in erros}>
                        <FormControl.Label>Curso:</FormControl.Label>
                        <Input value={curso} placeholder="Ex.: Ciência da Computação" onChangeText={novoCurso => setCurso(novoCurso)} backgroundColor={"white"} size={"lg"}/>
                        {'curso' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.curso}</FormControl.ErrorMessage> : ''}
                    </FormControl>
                    <FormControl isRequired isInvalid={'telefone' in erros}>
                        <FormControl.Label>Telefone:</FormControl.Label>
                        <Input value={telefone} placeholder="Ex.: (51) 91234-5678" onChangeText={novoTelefone => setTelefone(novoTelefone)} backgroundColor={"white"} size={"lg"}/>
                        {'telefone' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.telefone}</FormControl.ErrorMessage> : ''}
                    </FormControl>
                    <FormControl isRequired isInvalid={'email' in erros}>
                        <FormControl.Label>E-mail:</FormControl.Label>
                        <Input value={email} placeholder="Ex.: pedro.silveira@unilasalle.edu.br" onChangeText={novoEmail => setEmail(novoEmail)} backgroundColor={"white"} size={"lg"}/>
                        {'email' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.email}</FormControl.ErrorMessage> : ''}
                    </FormControl>
                    <FormControl isRequired isInvalid={'horas' in erros}>
                        <FormControl.Label>Horas Complementares:</FormControl.Label>
                        <Input value={horas} placeholder="Ex.: 5" onChangeText={novaHoras => setHoras(novaHoras)} backgroundColor={"white"} size={"lg"}/>
                        {'horas' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.horas}</FormControl.ErrorMessage> : ''}
                    </FormControl>
                </Box>
                <Box flexDirection={"row"}>
                    <Button size={"lg"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} flex={1} marginRight={1} onPress={validarVoluntario}>Registrar</Button>
                    <Button size={"lg"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} flex={1} marginRight={1} onPress={limpar}>Limpar</Button>
                </Box>
            </Box>
        </ScrollView>
    );
};

export default registrarVoluntario;