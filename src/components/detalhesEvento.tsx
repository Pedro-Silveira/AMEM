import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, HStack, Input, ScrollView, Text, TextArea, useToast, VStack, WarningOutlineIcon } from "native-base";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onValue, ref } from "firebase/database";
import { db } from "../services/firebaseConfig";

const DetalhesEvento = ({ route }: { route: any }) => {
    const { evento } = route.params;
    const [nome, setNome] = useState(evento.nome);
    const [data, setData] = useState(evento.data);
    const [local, setLocal] = useState(evento.local);
    const [investimento, setInvestimento] = useState(evento.investimento);
    const [observacoes, setObservacoes] = useState(evento.observacoes);
    const [erros, setErros] = useState({});
    const navigation = useNavigation();
    const toast = useToast();
    const [dados, setDados] = useState<any>([]);

    useEffect(() => {
        const eventoID = evento.id;
        const eventoRef = ref(db, "eventos/" + evento.id);

        onValue(eventoRef, (snapshot) => {
            const eventoData = snapshot.val();

            if (eventoData) {
                const evento = [{ id: eventoID, ...eventoData }];
                setDados(evento);
            } else {
                setDados([]);
            }
        });
    }, []);

    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Text textAlign={"left"} bold fontSize={"3xl"}>Detalhes do Evento</Text>
                </Box>
                <Box style={styles.box1}>
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
                </Box>
                <Box style={styles.box2}>
                    <Text textAlign={"left"} bold fontSize={"xl"}>Doações</Text>
                </Box>
                <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"}>
                    {dados.map((item: any, index: any) => (
                        <Box key={index} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py="2" pl="4" pr={5}>
                            <HStack space={[2, 3]} justifyContent="space-between" alignItems={"center"}>
                                <VStack>
                                    <Text bold>
                                        {item.usuarios}
                                    </Text>
                                </VStack>
                            </HStack>
                        </Box>
                    ))}
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
        marginBottom: 5
    }
});

export default DetalhesEvento;