import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { AlertDialog, Box, Button, CheckIcon, FormControl, Icon, Input, Pressable, ScrollView, Select, Spinner, Text, useToast, WarningOutlineIcon } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { db } from "../services/firebaseConfig";
import { ref, push } from "firebase/database";
import { MaterialIcons } from '@expo/vector-icons';
import showToast from "../util/showToast";
import errorTranslate from "../util/errorTranslate";
import showLoading from "../util/showLoading";

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

const RegistrarDoacao = ({ route }: { route: any }) => {
    const { evento } = route.params;
    const [tipo, setTipo] = useState('');
    const [organizacao, setOrganizacao] = useState('');
    const [material, setMaterial] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [unidade, setUnidade] =  useState('');
    const [erros, setErros] = useState({});
    const navigation = useNavigation<any>();
    const toast = useToast();
    const [uploading, setUploading] = useState(false);

    const tipoRef = useRef(null);
    const organizacaoRef = useRef(null);
    const materialRef = useRef(null);
    const quantidadeRef = useRef(null);
    const unidadeRef = useRef(null);

    const handleKeyPress = (event: any, nextRef: any) => {
        if (event.nativeEvent.key === 'Enter') {
            if (nextRef) {
                nextRef.current.focus();
            } else {
                validarDoacao();
            }
        }
    };

    const limpar = () => {
        setTipo('');
        setOrganizacao('');
        setMaterial('');
        setQuantidade('');
        setUnidade('');
        setErros({});
    };

    const validarDoacao = () => {
        const organizacaoRegex = new RegExp(/^[^\s].*$/);
        const quantidadeRegex = new RegExp(/^\d+$/);
        let erros = 0;

        setUploading(true);
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

    const adicionarDoacao = () => {
        push(ref(db, 'eventos/' + evento.id + '/doacoes/'), {
            tipo: tipo,
            organizacao: organizacao,
            material: material,
            quantidade: quantidade,
            unidade: unidade
        }).then(() => {
            showToast(toast, "#404040", "A doação foi registrada com sucesso!");
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
                        <Text textAlign={"left"} bold fontSize={"3xl"}>Registrar Doação</Text>
                    </Pressable>
                    <Text textAlign={"left"} fontSize={"lg"}>Preencha os campos abaixo para registrar uma nova doação em {evento.nome}.</Text>
                </Box>
                <Box style={styles.box1}>
                    <FormControl isRequired isInvalid={'tipo' in erros}>
                        <FormControl.Label>Tipo:</FormControl.Label>
                        <Select
                            ref={tipoRef}
                            dropdownIcon={<Icon as={MaterialIcons} name="keyboard-arrow-down" color={"#bebebe"} mr={2} size={"xl"} />} 
                            selectedValue={tipo} 
                            onValueChange={novoTipo => setTipo(novoTipo)} 
                            placeholder="Escolha um tipo..." 
                            backgroundColor={"white"} 
                            size={"lg"}
                        >
                            <Select.Item label="Recebida" value="recebida" />
                            <Select.Item label="Efetuada" value="efetuada" />
                        </Select>
                        {'tipo' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.tipo}</FormControl.ErrorMessage> : null}
                    </FormControl>
                    <FormControl isRequired isInvalid={'organizacao' in erros}>
                        <FormControl.Label>Organização:</FormControl.Label>
                        <Input 
                            ref={organizacaoRef}
                            value={organizacao} 
                            placeholder="Ex.: ONG Brasil" 
                            onChangeText={novaOrganizacao => setOrganizacao(novaOrganizacao)} 
                            backgroundColor={"white"} 
                            size={"lg"}
                            onKeyPress={(e) => handleKeyPress(e, materialRef)}
                        />
                        {'organizacao' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.organizacao}</FormControl.ErrorMessage> : null}
                    </FormControl>
                    <FormControl isRequired isInvalid={'material' in erros}>
                        <FormControl.Label>Material:</FormControl.Label>
                        <Input 
                            ref={materialRef}
                            value={material} 
                            placeholder="Ex.: Cesta Básica" 
                            onChangeText={novoMaterial => setMaterial(novoMaterial)} 
                            backgroundColor={"white"} 
                            size={"lg"}
                            onKeyPress={(e) => handleKeyPress(e, quantidadeRef)}
                        />
                        {'material' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.material}</FormControl.ErrorMessage> : null}
                    </FormControl>
                    <FormControl isRequired isInvalid={'quantidade' in erros}>
                        <FormControl.Label>Quantidade:</FormControl.Label>
                        <Input 
                            ref={quantidadeRef}
                            value={quantidade} 
                            placeholder="Ex.: 25" 
                            onChangeText={novaQuantidade => setQuantidade(novaQuantidade)} 
                            backgroundColor={"white"} 
                            size={"lg"}
                            onKeyPress={(e) => handleKeyPress(e, unidadeRef)}
                        />
                        {'quantidade' in erros ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.quantidade}</FormControl.ErrorMessage> : null}
                    </FormControl>
                    <FormControl isRequired isInvalid={'unidade' in erros}>
                        <FormControl.Label>Unidade de Medida:</FormControl.Label>
                        <Select 
                            ref={unidadeRef}
                            dropdownIcon={<Icon as={MaterialIcons} name="keyboard-arrow-down" color={"#bebebe"} mr={2} size={"xl"} />} 
                            selectedValue={unidade} 
                            onValueChange={novaUnidade => setUnidade(novaUnidade)} 
                            placeholder="Escolha uma unidade de medida..." 
                            backgroundColor={"white"} 
                            size={"lg"}
                        >
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
                </Box>
                <Box flexDirection={"row"}>
                    <Button size={"lg"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} flex={1} marginRight={1} onPress={validarDoacao}>Registrar</Button>
                    <Button size={"lg"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} flex={1} marginLeft={1} onPress={limpar}>Limpar</Button>
                </Box>
            </Box>
        </ScrollView>
    );
};

export default RegistrarDoacao;
