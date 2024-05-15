import { Box, Button, HStack, Icon, Pressable, ScrollView, Spacer, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { db } from "../services/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import calcularDias from "../util/dateCalculator";

const styles = StyleSheet.create({
    boxCentral: {
        padding: 50,
        flex: 1
    },
    box1: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25
    }
});

const painelControle = () => {
    const navigation = useNavigation<any>();
    const [dados, setDados] = useState<any>([]);
    const [doacoes, setDoacoes] = useState<any>([0]);
    const [voluntarios, setVoluntarios] = useState<any>([0]);
    const [filtroStatus, setFiltroStatus] = useState("Planejado");

    const exibirEventos = () => {
        useEffect(() => {
            const query = ref(db, "eventos/");
            onValue(query, (snapshot) => {
                const data = snapshot.val();
                let totalDoacoes = 0;
                let totalVoluntarios = 0;
                let totalEventos = 0;

                if (data) {
                    const novosUsuarios = Object.keys(data)
                    .map(key => ({
                        id: key,
                        ...data[key]
                    }))
                    .sort((a, b) => {
                        const dataA = new Date(a.data);
                        const dataB = new Date(b.data);

                        return dataA.getTime() - dataB.getTime();
                    });

                    Object.keys(data).forEach((eventoKey) => {
                        if (data[eventoKey]?.doacoes) {
                            totalDoacoes += Object.keys(data[eventoKey].doacoes).length;
                        }

                        if (data[eventoKey]?.voluntarios) {
                            totalVoluntarios += Object.keys(data[eventoKey].voluntarios).length;
                        }

                        totalEventos += 1;
                    });

                    setDados(novosUsuarios);
                    setDoacoes(totalDoacoes);
                    setVoluntarios(totalVoluntarios);
                } else {
                    setDados([]);
                }
            });
        }, []);

        return (
            <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"} rounded={5}>
                {dados.filter((evento: { status: string; }) => evento.status === filtroStatus).map((item: any, index: any) => (
                    <Pressable key={index} onPress={() => navigation.navigate("Detalhes do Evento - AMEM", { evento: item })}>
                        {({
                            isHovered,
                            isPressed
                        }) => {
                            return <Box bg={isPressed || isHovered ? "coolGray.100" : ""} rounded={isPressed || isHovered ? 5 : 0} key={index} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py="2" pl="4" pr={5}>
                                <HStack space={[2, 3]} justifyContent="space-between" alignItems={"center"}>
                                    <VStack>
                                        <Text bold>
                                            {item.nome}
                                        </Text>
                                        <Text>
                                            {calcularDias(item.data)}
                                        </Text>
                                    </VStack>
                                    <Spacer />
                                    <Icon as={MaterialIcons} name="navigate-next" size={5} color={"#bebebe"} />
                                </HStack>
                            </Box>
                        }}
                    </Pressable>
                ))}
            </Box>
        );
    };

    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Text textAlign={"left"} bold fontSize={"3xl"}>Painel de Controle</Text>
                    <Box flexDirection={"row"}>
                        <Button onPress={() => navigation.navigate("Cadastrar Evento - AMEM")} leftIcon={<Icon as={MaterialIcons} name="add" />} size={"sm"} backgroundColor={"#16A34A"} _hover={{backgroundColor: "green.700"}}>Cadastrar Evento</Button>
                    </Box>
                </Box>
                <HStack justifyContent="center" mb={25}>
                    <Pressable onPress={() => setFiltroStatus("Planejado")} flex={1}>
                    {({
                        isHovered,
                        isPressed
                    }) => {
                        return (
                            <Box bg={isPressed || isHovered ? "coolGray.100" : "white"} py={25} mr={2} borderWidth={1} borderColor={"#D4D4D4"} rounded={5} alignItems={"center"}>
                            <Text bold fontSize={"3xl"}>{dados.filter((evento: { status: string; }) => evento.status === "Planejado").length}</Text>
                            <Text textAlign={"center"}>evento(s) <Text bold color={"#1C3D8C"}>planejado(s)</Text></Text>
                        </Box>
                    );
                }}
                    </Pressable>
                    <Pressable onPress={() => setFiltroStatus("Encerrado")} flex={1}>
                        {({
                            isHovered,
                            isPressed
                        }) => {
                            return (
                                <Box bg={isPressed || isHovered ? "coolGray.100" : "white"} py={25} mr={2} borderWidth={1} borderColor={"#D4D4D4"} rounded={5} alignItems={"center"}>
                                    <Text bold fontSize={"3xl"}>{dados.filter((evento: { status: string; }) => evento.status === "Encerrado").length}</Text>
                                    <Text textAlign={"center"}>evento(s) <Text bold color={"#16A34A"}>encerrado(s)</Text></Text>
                                </Box>
                            );
                        }}
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Lista de Doações - AMEM")} flex={1}>
                        {({
                            isHovered,
                            isPressed
                        }) => {
                            return (
                                <Box bg={isPressed || isHovered ? "coolGray.100" : "white"} py={25} mr={2} borderWidth={1} borderColor={"#D4D4D4"} rounded={5} alignItems={"center"}>
                                    <Text bold fontSize={"3xl"}>{doacoes}</Text>
                                    <Text textAlign={"center"}>doação(ões)</Text>
                                </Box>
                            );
                        }}
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Lista de Voluntários - AMEM")} flex={1}>
                        {({
                            isHovered,
                            isPressed
                        }) => {
                            return (
                                <Box bg={isPressed || isHovered ? "coolGray.100" : "white"} py={25} mr={2} borderWidth={1} borderColor={"#D4D4D4"} rounded={5} alignItems={"center"}>
                                    <Text bold fontSize={"3xl"}>{voluntarios}</Text>
                                    <Text textAlign={"center"}>voluntário(s)</Text>
                                </Box>
                            );
                        }}
                    </Pressable>
                </HStack>
                {exibirEventos()}
            </Box>
        </ScrollView>
    );
};

export default painelControle;