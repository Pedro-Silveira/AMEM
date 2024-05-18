import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { AlertDialog, Box, Button, FormControl, Icon, Input, Pressable, ScrollView, Select, Text, useToast, WarningOutlineIcon } from "native-base";
import { db } from "../services/firebaseConfig";
import { ref, update, remove } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import showToast from "../util/showToast";
import errorTranslate from "../util/errorTranslate";
import showLoading from "../util/showLoading";

const DetalhesUsuario = ({ route }: { route: any }) => {
    // Fixas
    const { usuario } = route.params;
    const navigation = useNavigation<any>();
    const toast = useToast();

    // Variáveis
    const [uploading, setUploading] = useState(false);
    const [erros, setErros] = useState({});
    const [isOpen, setIsOpen] = React.useState(false);

    // Gets & Sets
    const [nome, setNome] = useState(usuario.nome);
    const [email, setEmail] = useState(usuario.email);
    const [permissao, setPermissao] = useState(usuario.permissao);

    // Valida os campos do formulário através de expressões regulares.
    const validarUsuario = () => {
        let erros = 0;

        setErros({});

        if (permissao != "usuario" && permissao != "editor" && permissao != "administrador"){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                permissao: 'Escolha uma das permissões.',
            }));

            erros++;
        }

        if ( erros == 0 ) {
            editarUsuario();
        }
    };

    // Adiciona o registro no banco de dados.
    const editarUsuario = () => {
        setUploading(true);

        update(ref(db, 'usuarios/' + usuario.id), {
            permissao: permissao
        }).then(() => {
            showToast(toast, "#404040", "O usuário foi editado com sucesso!");
            navigation.navigate("Controle de Usuários - AMEM");
        }).catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error));
        }).finally(() => {
            setUploading(false);
        });
    };

    // Remove o registro do banco de dados.
    const excluirUsuario = () => {
        setUploading(true);

        remove(ref(db, 'usuarios/' + usuario.id))
        .then(() => {
            showToast(toast, "#404040", "O usuário foi excluído com sucesso!");
            navigation.navigate("Controle de Usuários - AMEM");
        })
        .catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error));
        }).finally(() => {
            setUploading(false);
        });
    };

    // Cria os elementos visuais em tela.
    return (
        <ScrollView contentContainerStyle={{width:'100%'}}>
            {showLoading(uploading, () => setUploading(false))}
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Pressable style={styles.box3} onPress={() => navigation.navigate("Controle de Usuários - AMEM")}>
                        <Icon as={MaterialIcons} name="navigate-before" size={25} color={"#818181"} />
                        <Text bold fontSize={"3xl"}>Detalhes do Usuário</Text>
                    </Pressable>
                </Box>
                <Box style={styles.box2}>
                    <FormControl isDisabled>
                        <FormControl.Label>Nome:</FormControl.Label>
                        <Input value={nome} placeholder="Escolha um nome..." onChangeText={novoNome => setNome(novoNome)} backgroundColor={"white"} size={"lg"} />
                    </FormControl>
                    <FormControl isDisabled>
                        <FormControl.Label>E-mail:</FormControl.Label>
                        <Input value={email} placeholder="Insira o e-mail..." onChangeText={novoEmail => setEmail(novoEmail)} backgroundColor={"white"} size={"lg"}/>
                    </FormControl>
                    <FormControl isRequired isInvalid={'permissao' in erros}>
                        <FormControl.Label>Permissão:</FormControl.Label>
                        <Select dropdownIcon={<Icon as={MaterialIcons} name="keyboard-arrow-down" color={"#bebebe"} mr={2} size={"xl"} />} selectedValue={permissao} onValueChange={novaPermissao => setPermissao(novaPermissao)} placeholder="Escolha uma permissão..." backgroundColor={"white"} size={"lg"}>
                            <Select.Item label="Usuário" value="usuario" />
                            <Select.Item label="Editor" value="editor" />
                            <Select.Item label="Administrador" value="administrador" />
                        </Select>
                        {'permissao' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.permissao}</FormControl.ErrorMessage>
                        : null }
                    </FormControl>
                    <Box flexDirection={"row"} mt={25}>
                        <Button onPress={() => setIsOpen(!isOpen)} marginRight={2} leftIcon={<Icon as={MaterialIcons} name="delete" />} size={"sm"} backgroundColor={"#E11D48"} _hover={{backgroundColor: "#BE123C"}}>Excluir</Button>
                        <AlertDialog leastDestructiveRef={React.useRef(null)} isOpen={isOpen} onClose={() => setIsOpen(false)}>
                            <AlertDialog.Content>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header>Excluir Usuário</AlertDialog.Header>
                            <AlertDialog.Body>
                                Você tem certeza que deseja excluir o usuário? Esta ação não poderá ser revertida.
                            </AlertDialog.Body>
                            <AlertDialog.Footer>
                                <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="coolGray" onPress={() => setIsOpen(false)} ref={React.useRef(null)}>
                                    Cancelar
                                </Button>
                                <Button colorScheme="danger" onPress={excluirUsuario}>
                                    Excluir
                                </Button>
                                </Button.Group>
                            </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog>
                        <Button onPress={validarUsuario} leftIcon={<Icon as={MaterialIcons} name="save" />} size={"sm"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}}>Salvar</Button>
                    </Box>
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
        flexDirection: "row",
        flexWrap: "wrap",
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

export default DetalhesUsuario;