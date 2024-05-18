import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { AlertDialog, Box, Button, FormControl, Icon, Input, Pressable, ScrollView, Select, Skeleton, Text, useToast, WarningOutlineIcon } from "native-base";
import { db } from "../services/firebaseConfig";
import { ref, remove, update } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import showToast from "../util/showToast";
import errorTranslate from "../util/errorTranslate";
import useUserPermission from "../util/getPermission";
import showLoading from "../util/showLoading";

const DetalhesDoacao = ({ route }: { route: any }) => {
    // Fixas
    const { evento, doacao } = route.params;
    const navigation = useNavigation<any>();
    const userPermission = useUserPermission();
    const toast = useToast();

    // Variáveis
    const [uploading, setUploading] = useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [erros, setErros] = useState({});

    // Gets & Sets
    const [tipo, setTipo] = useState(doacao.tipo);
    const [organizacao, setOrganizacao] = useState(doacao.organizacao);
    const [material, setMaterial] = useState(doacao.material);
    const [quantidade, setQuantidade] = useState(doacao.quantidade);
    const [unidade, setUnidade] =  useState(doacao.unidade);    

    // Valida os campos do formulário através de expressões regulares.
    const validarDoacao = () => {
        const organizacaoRegex = new RegExp(/^[^\s].*$/);
        const quantidadeRegex = new RegExp(/^\d+$/);
        let erros = 0;

        setErros({});

        if (tipo != "recebida" && tipo != "efetuada"){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                tipo: 'Escolha um dos tipos.',
            }));

            erros++;
        }

        if (!organizacaoRegex.test(organizacao)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                organizacao: 'O nome da organização inserido é inválido.',
            }));

            erros++;
        }

        if (!organizacaoRegex.test(material)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                material: 'O nome do material inserido é inválido.',
            }));

            erros++;
        }

        if (!quantidadeRegex.test(quantidade)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                quantidade: 'A quantidade inserida é inválida.',
            }));

            erros++;
        }

        if (unidade != "cx." && unidade != "fdo." && unidade != "gal." && unidade != "L" && unidade != "m" && unidade != "pac." && unidade != "pal." && unidade != "Kg" && unidade != "rol." && unidade != "un."){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                unidade: 'Escolha uma das unidades de medida.',
            }));

            erros++;
        }

        if ( erros == 0 ) {
            editarDoacao();
        }
    };

    // Adiciona o registro no banco de dados.
    const editarDoacao = () => {
        setUploading(true);

        update(ref(db, 'eventos/' + evento.id + '/doacoes/' + doacao.id), {
            tipo: tipo,
            organizacao: organizacao,
            material: material,
            quantidade: quantidade,
            unidade: unidade
        }).then(() => {
            showToast(toast, "#404040", "A doação foi editada com sucesso!");
            navigation.navigate("Detalhes do Evento - AMEM", { evento: evento });
        }).catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error));
        }).finally(() => {
            setUploading(false);
        });
    };

    // Remove o registro do banco de dados.
    const excluirDoacao = () => {
        setUploading(true);

        remove(ref(db, 'eventos/' + evento.id + '/doacoes/' + doacao.id))
        .then(() => {
            showToast(toast, "#404040", "A doação foi excluída com sucesso!");
            navigation.navigate("Detalhes do Evento - AMEM", { evento: evento });
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
                    <Pressable style={styles.box3} onPress={() => navigation.navigate("Detalhes do Evento - AMEM", { evento: evento })}>
                        <Icon as={MaterialIcons} name="navigate-before" size={25} color={"#818181"} />
                        <Text bold fontSize={"3xl"}>Detalhes da Doação</Text>
                    </Pressable>
                </Box>
                <Box style={styles.box2}>
                    <FormControl isRequired isInvalid={'tipo' in erros}>
                        <FormControl.Label>Tipo:</FormControl.Label>
                        <Select dropdownIcon={<Icon as={MaterialIcons} name="keyboard-arrow-down" color={"#bebebe"} mr={2} size={"lg"} />} selectedValue={tipo} onValueChange={novoTipo => setTipo(novoTipo)} placeholder="Escolha um tipo..." backgroundColor={"white"} size={"lg"}>
                            <Select.Item label="Recebida" value="recebida" />
                            <Select.Item label="Efetuada" value="efetuada" />
                        </Select>
                        {'tipo' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.tipo}</FormControl.ErrorMessage> : null}
                    </FormControl>
                    <FormControl isRequired isInvalid={'organizacao' in erros}>
                        <FormControl.Label>Organização:</FormControl.Label>
                        <Input value={organizacao} placeholder="Ex.: ONG Brasil" onChangeText={novaOrganizacao => setOrganizacao(novaOrganizacao)} backgroundColor={"white"} size={"lg"}/>
                        {'organizacao' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.organizacao}</FormControl.ErrorMessage> : null}
                    </FormControl>
                    <FormControl isRequired isInvalid={'material' in erros}>
                        <FormControl.Label>Material:</FormControl.Label>
                        <Input value={material} placeholder="Ex.: Cesta Básica" onChangeText={novoMaterial => setMaterial(novoMaterial)} backgroundColor={"white"} size={"lg"}/>
                        {'material' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.material}</FormControl.ErrorMessage> : null}
                    </FormControl>
                    <FormControl isRequired isInvalid={'quantidade' in erros}>
                        <FormControl.Label>Quantidade:</FormControl.Label>
                        <Input value={quantidade} placeholder="Ex.: 25" onChangeText={novaQuantidade => setQuantidade(novaQuantidade)} backgroundColor={"white"} size={"lg"}/>
                        {'quantidade' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.quantidade}</FormControl.ErrorMessage> : null}
                    </FormControl>
                    <FormControl isInvalid={'unidade' in erros}>
                        <FormControl.Label>Unidade de Medida:</FormControl.Label>
                        <Select dropdownIcon={<Icon as={MaterialIcons} name="keyboard-arrow-down" color={"#bebebe"} mr={2} size={"xl"} />} selectedValue={unidade} onValueChange={novaUnidade => setUnidade(novaUnidade)} placeholder="Escolha uma unidade de medida..." backgroundColor={"white"} size={"lg"}>
                            <Select.Item label="Caixa" value="cx." />
                            <Select.Item label="Fardo" value="fdo." />
                            <Select.Item label="Galão" value="gal." />
                            <Select.Item label="Litro" value="L" />
                            <Select.Item label="Metro" value="m" />
                            <Select.Item label="Pacote" value="pac." />
                            <Select.Item label="Pallet" value="pal." />
                            <Select.Item label="Quilograma" value="Kg" />
                            <Select.Item label="Rolo" value="rol." />
                            <Select.Item label="Unidade" value="un." />
                        </Select>
                        {'unidade' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.unidade}</FormControl.ErrorMessage> : null}
                    </FormControl>
                    {userPermission == "editor" && evento.status != "Encerrado" || userPermission == "administrador" ? 
                        <Box flexDirection={"row"} mt={25}>
                            {userPermission == "administrador" ? 
                                <Button onPress={() => setIsOpen(!isOpen)} marginRight={2} leftIcon={<Icon as={MaterialIcons} name="delete" />} size={"sm"} backgroundColor={"#E11D48"} _hover={{backgroundColor: "#BE123C"}}>Excluir</Button>
                            : null }
                            <AlertDialog leastDestructiveRef={React.useRef(null)} isOpen={isOpen} onClose={() => setIsOpen(false)}>
                                <AlertDialog.Content>
                                <AlertDialog.CloseButton />
                                <AlertDialog.Header>Excluir Doação</AlertDialog.Header>
                                <AlertDialog.Body>
                                    Você tem certeza que deseja excluir a doação? Esta ação não poderá ser revertida.
                                </AlertDialog.Body>
                                <AlertDialog.Footer>
                                    <Button.Group space={2}>
                                    <Button variant="ghost" colorScheme="coolGray" onPress={() => setIsOpen(false)} ref={React.useRef(null)}>
                                        Cancelar
                                    </Button>
                                    <Button colorScheme="danger" onPress={excluirDoacao}>
                                        Excluir
                                    </Button>
                                    </Button.Group>
                                </AlertDialog.Footer>
                                </AlertDialog.Content>
                            </AlertDialog>
                            <Button onPress={validarDoacao} leftIcon={<Icon as={MaterialIcons} name="save" />} size={"sm"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}}>Salvar</Button>
                        </Box>
                    : userPermission ? null : <Skeleton rounded="5" mt={25} /> }
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

export default DetalhesDoacao;