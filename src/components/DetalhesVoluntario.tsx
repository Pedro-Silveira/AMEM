import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { AlertDialog, Box, Button, FormControl, Icon, Input, Pressable, ScrollView, Text, useToast, WarningOutlineIcon } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { db } from "../services/firebaseConfig";
import { ref, update, remove } from "firebase/database";
import { MaterialIcons } from '@expo/vector-icons';
import showToast from "../util/showToast";
import testRegex from "../util/testRegex";
import errorTranslate from "../util/errorTranslate";

const styles = StyleSheet.create({
    boxCentral: {
        padding: 50
    },
    box1: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25
    },
    box2: {
        marginBottom: 25
    },
    box3: {
        flexDirection: "row",
        alignItems: "center"
    }
});

const DetalhesVoluntario = ({ route }: { route: any }) => {
    const { evento, voluntario } = route.params;
    const [nome, setNome] = useState(voluntario.nome);
    const [curso, setCurso] = useState(voluntario.curso);
    const [telefone, setTelefone] = useState(voluntario.telefone);
    const [email, setEmail] = useState(voluntario.email);
    const [horas, setHoras] =  useState(voluntario.horas);
    const [erros, setErros] = useState({});
    const navigation = useNavigation<any>();
    const toast = useToast();
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = React.useRef(null);

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

        if (telefone != '' && !testRegex(/^\(\d{2}\) (9\d{4}-\d{4}|\d{4}-\d{4})$/, telefone)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                telefone: 'O número de telefone precisa seguir o padrão brasileiro, assim como (DD) 9XXXX-XXXX.',
            }));

            erros++;
        }

        if (email != '' && !testRegex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, email)){
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
            editarVoluntario();
        }
    };

    // Remove o registro do banco de dados.
    const excluirVoluntario = () => {
        remove(ref(db, 'eventos/' + evento.id + '/voluntarios/' + voluntario.id))
        .then(() => {
            showToast(toast, "#404040", "O voluntário foi excluído com sucesso!");
            navigation.navigate("Detalhes do Evento - AMEM", { evento: evento });
        })
        .catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error));
        });
    };

    // Adiciona o registro no banco de dados.
    const editarVoluntario = () => {
        update(ref(db, 'eventos/' + evento.id + '/voluntarios/' + voluntario.id), {
            nome: nome,
            curso: curso,
            telefone: telefone,
            email: email,
            horas: horas
        }).then(() => {
            showToast(toast, "#404040", "O voluntário foi editado com sucesso!");
            navigation.navigate("Detalhes do Evento - AMEM", { evento: evento });
        }).catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error));
        });
    };

    // Cria os elementos visuais em tela.
    return (
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Pressable style={styles.box3} onPress={() => navigation.navigate("Detalhes do Evento - AMEM", { evento: evento })}>
                        <Icon as={MaterialIcons} name="navigate-before" size={25} color={"#818181"} />
                        <Text bold fontSize={"3xl"}>Detalhes do Voluntário</Text>
                    </Pressable>
                    <Box flexDirection={"row"}>
                        <Button onPress={() => setIsOpen(!isOpen)} marginRight={2} leftIcon={<Icon as={MaterialIcons} name="delete" />} size={"sm"} backgroundColor={"#E11D48"} _hover={{backgroundColor: "#BE123C"}}>Excluir</Button>
                        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                            <AlertDialog.Content>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header>Excluir Voluntário</AlertDialog.Header>
                            <AlertDialog.Body>
                                Você tem certeza que deseja excluir o voluntário? Esta ação não poderá ser revertida.
                            </AlertDialog.Body>
                            <AlertDialog.Footer>
                                <Button.Group space={2}>
                                <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                                    Cancelar
                                </Button>
                                <Button colorScheme="danger" onPress={excluirVoluntario}>
                                    Excluir
                                </Button>
                                </Button.Group>
                            </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog>
                        <Button onPress={validarVoluntario} leftIcon={<Icon as={MaterialIcons} name="save" />} h={35} size={"sm"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}}>Salvar</Button>
                    </Box>
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
                    <FormControl isInvalid={'telefone' in erros}>
                        <FormControl.Label>Telefone:</FormControl.Label>
                        <Input value={telefone} placeholder="Ex.: (51) 91234-5678" onChangeText={novoTelefone => setTelefone(novoTelefone)} backgroundColor={"white"} size={"lg"}/>
                        {'telefone' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.telefone}</FormControl.ErrorMessage> : ''}
                    </FormControl>
                    <FormControl isInvalid={'email' in erros}>
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
            </Box>
        </ScrollView>
    );
};

export default DetalhesVoluntario;