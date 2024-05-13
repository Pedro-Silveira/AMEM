import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { AlertDialog, Box, Button, CheckIcon, FormControl, Icon, Input, Pressable, ScrollView, Select, Text, useToast, WarningOutlineIcon } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { db } from "../services/firebaseConfig";
import { ref, remove, update } from "firebase/database";
import { MaterialIcons } from '@expo/vector-icons';
import showToast from "../util/showToast";
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

const detalhesDoacao = ({ route }: { route: any }) => {
    const { evento, doacao } = route.params;
    const [tipo, setTipo] = useState(doacao.tipo);0
    const [organizacao, setOrganizacao] = useState(doacao.organizacao);
    const [material, setMaterial] = useState(doacao.material);
    const [quantidade, setQuantidade] = useState(doacao.quantidade);
    const [unidade, setUnidade] =  useState(doacao.unidade);
    const [erros, setErros] = useState({});
    const navigation = useNavigation<any>();
    const toast = useToast();
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = React.useRef(null);

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

    // Remove o registro do banco de dados.
    const excluirDoacao = () => {
        remove(ref(db, 'eventos/' + evento.id + '/doacoes/' + doacao.id))
        .then(() => {
            showToast(toast, "#404040", "A doação foi excluída com sucesso!");
            navigation.navigate("Detalhes do Evento - AMEM", { evento: evento });
        })
        .catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error));
        });
    };

    // Adiciona o registro no banco de dados.
    const editarDoacao = () => {
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
        });
    };

    // Cria os elementos visuais em tela.
    return (
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Pressable style={styles.box3} onPress={() => navigation.navigate("Detalhes do Evento - AMEM", { evento: evento })}>
                        <Icon as={MaterialIcons} name="navigate-before" size={25} color={"#818181"} />
                        <Text bold fontSize={"3xl"}>Detalhes da Doação</Text>
                    </Pressable>
                    <Box flexDirection={"row"}>
                        <Button onPress={() => setIsOpen(!isOpen)} marginRight={2} leftIcon={<Icon as={MaterialIcons} name="delete" />} size={"sm"} backgroundColor={"#E11D48"} _hover={{backgroundColor: "#BE123C"}}>Excluir</Button>
                        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                            <AlertDialog.Content>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header>Excluir Doação</AlertDialog.Header>
                            <AlertDialog.Body>
                                Você tem certeza que deseja excluir a doação? Esta ação não poderá ser revertida.
                            </AlertDialog.Body>
                            <AlertDialog.Footer>
                                <Button.Group space={2}>
                                <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                                    Cancelar
                                </Button>
                                <Button colorScheme="danger" onPress={excluirDoacao}>
                                    Excluir
                                </Button>
                                </Button.Group>
                            </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog>
                        <Button onPress={validarDoacao} leftIcon={<Icon as={MaterialIcons} name="save" />} h={35} size={"sm"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}}>Salvar</Button>
                    </Box>
                </Box>
                <Box style={styles.box2}>
                    <FormControl isRequired isInvalid={'tipo' in erros}>
                        <FormControl.Label>Tipo:</FormControl.Label>
                        <Select selectedValue={tipo} onValueChange={novoTipo => setTipo(novoTipo)} placeholder="Escolha um tipo..." _selectedItem={{bg: "teal.600", endIcon: <CheckIcon size={1} />}} backgroundColor={"white"} size={"lg"}>
                            <Select.Item label="Recebida" value="recebida" />
                            <Select.Item label="Efetuada" value="efetuada" />
                        </Select>
                        {'tipo' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.tipo}</FormControl.ErrorMessage> : ''}
                    </FormControl>
                    <FormControl isRequired isInvalid={'organizacao' in erros}>
                        <FormControl.Label>Organização:</FormControl.Label>
                        <Input value={organizacao} placeholder="Ex.: ONG Brasil" onChangeText={novaOrganizacao => setOrganizacao(novaOrganizacao)} backgroundColor={"white"} size={"lg"}/>
                        {'organizacao' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.organizacao}</FormControl.ErrorMessage> : ''}
                    </FormControl>
                    <FormControl isRequired isInvalid={'material' in erros}>
                        <FormControl.Label>Material:</FormControl.Label>
                        <Input value={material} placeholder="Ex.: Cesta Básica" onChangeText={novoMaterial => setMaterial(novoMaterial)} backgroundColor={"white"} size={"lg"}/>
                        {'material' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.material}</FormControl.ErrorMessage> : ''}
                    </FormControl>
                    <FormControl isRequired isInvalid={'quantidade' in erros}>
                        <FormControl.Label>Quantidade:</FormControl.Label>
                        <Input value={quantidade} placeholder="Ex.: 25" onChangeText={novaQuantidade => setQuantidade(novaQuantidade)} backgroundColor={"white"} size={"lg"}/>
                        {'quantidade' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.quantidade}</FormControl.ErrorMessage> : ''}
                    </FormControl>
                    <FormControl isInvalid={'unidade' in erros}>
                        <FormControl.Label>Unidade de Medida:</FormControl.Label>
                        <Select selectedValue={unidade} onValueChange={novaUnidade => setUnidade(novaUnidade)} placeholder="Escolha uma unidade de medida..." _selectedItem={{bg: "teal.600", endIcon: <CheckIcon size={1} />}} backgroundColor={"white"} size={"lg"}>
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
                        {'unidade' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.unidade}</FormControl.ErrorMessage> : ''}
                    </FormControl>
                </Box>
            </Box>
        </ScrollView>
    );
};

export default detalhesDoacao;