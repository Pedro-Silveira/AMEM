import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, FormControl, HStack, Input, ScrollView, Spacer, Text, TextArea, useToast, VStack, WarningOutlineIcon } from "native-base";
import { StyleSheet } from "react-native";
import { db } from "../services/firebaseConfig";
import { ref, push, onValue } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

const cadastrarEvento = () => {
    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [local, setLocal] = useState('');
    const [investimento, setInvestimento] = useState('');
    const [usuarios, setUsuarios] =  useState<string[]>([]);
    const [observacoes, setObservacoes] = useState('');
    const [erros, setErros] = useState({});
    const navigation = useNavigation();
    const toast = useToast();

    const handleCheckboxChange = (id: string) => {
        if (usuarios.includes(id)) {
            setUsuarios(usuarios.filter(item => item !== id));
        } else {
            setUsuarios([...usuarios, id]);
        }
    };

    const buscarUsuarios = () => {
        const [dados, setDados] = useState<any>([]);
    
        useEffect(() => {
            const query = ref(db, "usuarios/");
            onValue(query, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const novosUsuarios = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }))
                    .sort((a, b) => {
                        const nomeA = a.nome.toUpperCase();
                        const nomeB = b.nome.toUpperCase();
    
                        if (nomeA < nomeB) {
                            return -1;
                        }
                        if (nomeA > nomeB) {
                            return 1;
                        }
                        return 0;
                    });
                    setDados(novosUsuarios);
                } else {
                    setDados([]);
                }
            });
        }, []);
    
        return (
            <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"} rounded={5}>
                {dados.map((item: { nome: any; email: any; }, index: any) => (
                    <Box key={index} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py="2" pl="4" pr={5}>
                        <HStack space={[2, 3]} justifyContent="space-between" alignItems={"center"}>
                            <VStack>
                                <Text bold>
                                    {item.nome}
                                </Text>
                                <Text>
                                    {item.email}
                                </Text>
                            </VStack>
                            <Spacer />
                            <Checkbox onChange={() => handleCheckboxChange(item.email)} _checked={{ bgColor: "#1C3D8C", borderColor: "#1C3D8C" }} value={item.email} />
                        </HStack>
                    </Box>
                ))}
            </Box>
        );
    };

    const limpar = () => {
        setNome('');
        setData('');
        setLocal('');
        setInvestimento('');
        setObservacoes('');
        setErros({});
    };

    const validarEvento = () => {
        const nomeRegex = new RegExp(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/);
        const dataRegex = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);
        const localRegex = new RegExp(/^[^\s].*$/);
        const investimentoRegex = new RegExp(/^(?:0|[1-9]\d{0,2}(?:\.\d{3})*(?:,\d{1,2})?|,\d{1,2})$/);
        let erros = 0;

        setErros({});

        if (!nomeRegex.test(nome)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                nome: 'O nome inserido é inválido.',
            }));

            erros++;
        }

        if (!dataRegex.test(data)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                data: 'A data precisa seguir o formato dd/mm/aaaa.',
            }));

            erros++;
        }

        if (!localRegex.test(local)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                local: 'O nome do local inserido é inválido.',
            }));

            erros++;
        }

        if (!investimentoRegex.test(investimento)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                investimento: 'O valor precisa seguir o padrão do real brasileiro, assim como 1.234,56.',
            }));

            erros++;
        }

        if ( erros == 0 ) {
            addEvento();
        }
    };

    const addEvento = () => {
        push(ref(db, 'eventos/'), {
            nome: nome,
            data: data,
            local: local,
            investimento: investimento,
            observacoes: observacoes,
            usuarios: usuarios
        }).then(() => {
            toast.show({
                render: () => {
                    return <Box padding={2} mb={3} rounded="sm" _text={{color: "#fff"}} bg="green.500">O evento foi cadastrado com sucesso!</Box>;
                }
            });
            navigation.navigate("Painel de Controle - AMEM" as never)
        }).catch((error) => {
            toast.show({
                render: () => {
                    return <Box padding={2} mb={3} rounded="sm" _text={{color: "#fff"}} bg="red.500">Erro: {error}.</Box>;
                }
            });
        });
    };

    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Text textAlign={"center"} bold fontSize={"3xl"}>Cadastrar Evento</Text>
                    <Text textAlign={"center"} fontSize={"xl"}>Por gentileza, preencha os campos abaixo para cadastrar um novo evento.</Text>
                </Box>
                <Box style={styles.box2}>
                    <FormControl isRequired isInvalid={'nome' in erros}>
                        <FormControl.Label>Nome:</FormControl.Label>
                        <Input value={nome} placeholder="Ex.: Ação de Graças" onChangeText={novoNome => setNome(novoNome)} backgroundColor={"white"} size={"lg"} />
                        {'nome' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.nome}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'data' in erros}>
                        <FormControl.Label>Data:</FormControl.Label>
                        <Input value={data} placeholder="Ex.: 02/08/1972" onChangeText={novaData => setData(novaData)} backgroundColor={"white"} size={"lg"}/>
                        {'data' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.data}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'local' in erros}>
                        <FormControl.Label>Local:</FormControl.Label>
                        <Input value={local} placeholder="Ex.: Capela São José" onChangeText={novoLocal => setLocal(novoLocal)} backgroundColor={"white"} size={"lg"}/>
                        {'local' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.local}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'investimento' in erros}>
                        <FormControl.Label>Investimento:</FormControl.Label>
                        <Input value={investimento} placeholder="Ex.: 1.080,00" onChangeText={novoInvestimento => setInvestimento(novoInvestimento)} backgroundColor={"white"} size={"lg"}/>
                        {'investimento' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.investimento}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isInvalid={'observacoes' in erros}>
                        <FormControl.Label>Observações:</FormControl.Label>
                        <TextArea value={observacoes} onChangeText={novaObservacao => setObservacoes(novaObservacao)} backgroundColor={"white"} w="100%" h={100} autoCompleteType={undefined} />
                        {'observacoes' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.observacoes}</FormControl.ErrorMessage> : ''
                        }
                    </FormControl>
                    <FormControl isInvalid={'usuarios' in erros}>
                        <FormControl.Label>Usuários Envolvidos:</FormControl.Label>
                        {buscarUsuarios()}
                    </FormControl>
                </Box>
                <Box flexDirection={"row"}>
                    <Button size={"lg"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} flex={1} marginRight={1} onPress={validarEvento}>Cadastrar</Button>
                    <Button size={"lg"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} flex={1} marginRight={1} onPress={limpar}>Limpar</Button>
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
        marginBottom: 50
    },
    box2: {
        marginBottom: 25
    }
});

export default cadastrarEvento;