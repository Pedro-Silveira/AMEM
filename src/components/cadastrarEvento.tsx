import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, HStack, Input, ScrollView, Spacer, Text, TextArea, useToast, VStack } from "native-base";
import { db } from "../services/firebaseConfig";
import { ref, push, onValue } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

const buscarUsuarios = () => {
    const [dados, setDados] = useState<any>([]);

    useEffect(() => {
        const query = ref(db, "eventos/");
        onValue(query, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const novosUsuarios = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setDados(novosUsuarios);
            } else {
                setDados([]); // Sem dados disponíveis
            }
        });
    }, []);

    return (
        <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"}>
            {dados.map((item: { nome: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; data: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                <Box key={index} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py="2" pl="4" pr={5}>
                    <HStack space={[2, 3]} justifyContent="space-between" alignItems={"center"}>
                        <VStack>
                            <Text bold>
                                {item.nome} {/* Verifique se essa chave existe nos seus dados */}
                            </Text>
                            <Text>
                                {item.data} {/* Verifique se essa chave existe nos seus dados */}
                            </Text>
                        </VStack>
                        <Spacer />
                        <Checkbox _checked={{ bgColor: "#1C3D8C", borderColor: "#1C3D8C" }} value="one" />
                    </HStack>
                </Box>
            ))}
        </Box>
    );
};

const cadastrarEvento = () => {
    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [local, setLocal] = useState('');
    const [investimento, setInvestimento] = useState('');
    const [usuarios, setUsuarios] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const toast = useToast();
    const navigation = useNavigation();

    const addEvento = () => {
        push(ref(db, 'eventos/'), {
            nome: nome,
            data: data,
            local: local,
            investimento: investimento,
            observacoes: observacoes
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
            <Box padding={50}>
                <Text textAlign={"center"} bold fontSize={"3xl"}>Cadastrar Evento</Text>
                <Text textAlign={"center"} fontSize={"xl"} marginBottom={50}>Por gentileza, preencha os campos abaixo para cadastrar um novo evento.</Text>
                <Text alignSelf={"flex-start"} marginBottom={1}>Nome do Evento:</Text>
                <Input onChangeText={novoNome => setNome(novoNome)} marginBottom={2} _hover={{borderColor: "#bebebe"}} focusOutlineColor={"#bebebe"} backgroundColor={"white"} size={"xl"} placeholder="Ex.: Ação de Graças" w="100%" />
                <Text alignSelf={"flex-start"} marginBottom={1}>Data do Evento:</Text>
                <Input onChangeText={novaData => setData(novaData)} _hover={{borderColor: "#bebebe"}} focusOutlineColor={"#bebebe"} marginBottom={2} backgroundColor={"white"} size={"xl"} placeholder="Ex.: 02/08/1972" w="100%" />
                <Text alignSelf={"flex-start"} marginBottom={1}>Local do Evento:</Text>
                <Input onChangeText={novoLocal => setLocal(novoLocal)} _hover={{borderColor: "#bebebe"}} focusOutlineColor={"#bebebe"} marginBottom={2} backgroundColor={"white"} size={"xl"} placeholder="Ex.: Capela São José" w="100%" />
                <Text alignSelf={"flex-start"} marginBottom={1}>Investimento Inicial:</Text>
                <Input onChangeText={novoInvestimento => setInvestimento(novoInvestimento)} _hover={{borderColor: "#bebebe"}} focusOutlineColor={"#bebebe"} keyboardType="number-pad" marginBottom={2} backgroundColor={"white"} size={"xl"} placeholder="Ex.: R$ 1.080,00" w="100%" />
                <Text alignSelf={"flex-start"} marginBottom={1}>Observações:</Text>
                <TextArea onChangeText={novaObservacao => setObservacoes(novaObservacao)} _hover={{borderColor: "#bebebe"}} focusOutlineColor={"#bebebe"} backgroundColor={"white"} w="100%" h={100} marginBottom={2} autoCompleteType={undefined} />
                <Text alignSelf={"flex-start"} marginBottom={1}>Usuários Envolvidos:</Text>
                {buscarUsuarios()}
                <Box flexDirection={"row"}>
                    <Button size={"lg"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} flex={1} marginRight={1} onPress={addEvento}>Cadastrar</Button>
                    <Button size={"lg"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} flex={1} marginRight={1} onPress={() => console.log("hello world")}>Limpar</Button>
                </Box>
            </Box>
        </ScrollView>
    );
};

export default cadastrarEvento;