import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Box, Button, CheckIcon, FormControl, Input, ScrollView, Select, Text, useToast, WarningOutlineIcon } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { db } from "../services/firebaseConfig";
import { ref, push } from "firebase/database";
import showToast from "../util/showToast";

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

const registrarDoacao = ({ route }: { route: any }) => {
    const { evento } = route.params;
    const [tipo, setTipo] = useState('');
    const [organizacao, setOrganizacao] = useState('');
    const [material, setMaterial] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [unidade, setUnidade] =  useState('');
    const [erros, setErros] = useState({});
    const navigation = useNavigation<any>();
    const toast = useToast();

    // Limpa os campos do formulário.
    const limpar = () => {
        setTipo('');
        setOrganizacao('');
        setMaterial('');
        setQuantidade('');
        setUnidade('');
        setErros({});
    };

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
            adicionarDoacao();
        }
    };

    // Adiciona o registro no banco de dados.
    const adicionarDoacao = () => {
        push(ref(db, 'eventos/' + evento.id + '/doacoes/'), {
            tipo: tipo,
            organizacao: organizacao,
            material: material,
            quantidade: quantidade,
            unidade: unidade
        }).then(() => {
            showToast(toast, "green.700", "A doação foi registrada com sucesso!");
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
                    <Text textAlign={"center"} bold fontSize={"3xl"}>Registrar Doação</Text>
                    <Text textAlign={"center"} fontSize={"xl"}>Por gentileza, preencha os campos abaixo para registrar uma nova doação em {evento.nome}.</Text>
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
                <Box flexDirection={"row"}>
                    <Button size={"lg"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} flex={1} marginRight={1} onPress={validarDoacao}>Registrar</Button>
                    <Button size={"lg"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} flex={1} marginRight={1} onPress={limpar}>Limpar</Button>
                </Box>
            </Box>
        </ScrollView>
    );
};

export default registrarDoacao;