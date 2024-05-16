import { Box, Button, HStack, Icon, Input, Pressable, ScrollView, Select, Spacer, Text, VStack } from "native-base";
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

const controleEventos = () => {
    const navigation = useNavigation<any>();
    const [dados, setDados] = useState<any>([]);
    const [doacoes, setDoacoes] = useState<any>([0]);
    const [voluntarios, setVoluntarios] = useState<any>([0]);
    const [filtroNome, setFiltroNome] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("Planejado");
    const [filtroDataInicial, setFiltroDataInicial] = useState("");
    const [filtroDataFinal, setFiltroDataFinal] = useState("");

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
                        const [dia, mes, ano] = a.data.split('/');
                        const [dia2, mes2, ano2] = b.data.split('/');
                        const dataA = new Date(`${mes}/${dia}/${ano}`);
                        const dataB = new Date(`${mes2}/${dia2}/${ano2}`);

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
        }, [filtroNome, filtroStatus, filtroDataInicial, filtroDataFinal]);

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
                    <Text textAlign={"left"} bold fontSize={"3xl"}>Controle de Eventos</Text>
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
                <Input
                        value={filtroNome}
                        onChangeText={(text) => setFiltroNome(text)}
                        placeholder="Filtrar por nome"
                        size="md"
                        w={200}
                        mr={2}
                    />
                    <Select
                        selectedValue={filtroStatus}
                        minWidth={200}
                        placeholder="Filtrar por tipo"
                        onValueChange={(itemValue) => setFiltroStatus(itemValue)}
                        mr={2}
                    >
                        <Select.Item label="Tipo 1" value="tipo1" />
                        <Select.Item label="Tipo 2" value="tipo2" />
                        <Select.Item label="Tipo 3" value="tipo3" />
                    </Select>
                    <Input
                        value={filtroDataInicial}
                        onChangeText={(text) => setFiltroDataInicial(text)}
                        placeholder="Data inicial"
                        size="md"
                        w={200}
                        mr={2}
                    />
                    <Input
                        value={filtroDataFinal}
                        onChangeText={(text) => setFiltroDataFinal(text)}
                        placeholder="Data final"
                        size="md"
                        w={200}
                        mr={2}
                    />
                {exibirEventos()}
            </Box>
        </ScrollView>
    );
};

export default controleEventos;