import { Box, Button, Divider, HStack, Icon, Input, Pressable, ScrollView, Select, Spacer, Text, Tooltip, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { db } from "../services/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import useUserPermission from "../util/getPermission";

const styles = StyleSheet.create({
    boxCentral: {
        padding: 50,
        flex: 1
    },
    box1: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25
    }
});

const ControleEventos = () => {
    const userPermission = useUserPermission();
    const navigation = useNavigation<any>();
    const [dados, setDados] = useState<any>([]);
    const [planejados, setPlanejados] = useState<any>([0]);
    const [encerrados, setEncerrados] = useState<any>([0]);
    const [doacoes, setDoacoes] = useState<any>([0]);
    const [voluntarios, setVoluntarios] = useState<any>([0]);
    const [filtroNome, setFiltroNome] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("Planejado");
    const [filtroDataInicial, setFiltroDataInicial] = useState("");
    const [filtroDataFinal, setFiltroDataFinal] = useState("");

    const limparFiltros = () => {
        setFiltroNome("");
        setFiltroStatus("Planejado");
        setFiltroDataInicial("");
        setFiltroDataFinal("");
    };

    const exibirEventos = () => {
        useEffect(() => {
            const query = ref(db, "eventos/");
            onValue(query, (snapshot) => {
                const data = snapshot.val();
                let totalPlanejados = 0;
                let totalEncerrados = 0;
                let totalDoacoes = 0;
                let totalVoluntarios = 0;

                if (data) {
                    const novosUsuarios = Object.keys(data)
                    .map(key => ({
                        id: key,
                        ...data[key]
                    }))
                    .filter((evento: { nome: any; status: any; data: any; }) => 
                        (filtroNome === "" || evento.nome.toLowerCase().includes(filtroNome.toLowerCase())) && 
                        (filtroStatus === "" || evento.status === filtroStatus) && 
                        (filtroDataInicial === "" || evento.data.split('/').reverse().join('-') >= filtroDataInicial.split('/').reverse().join('-')) && 
                        (filtroDataFinal === "" || evento.data.split('/').reverse().join('-') <= filtroDataFinal.split('/').reverse().join('-')))
                    .sort((a, b) => {
                        const [dia, mes, ano] = a.data.split('/');
                        const [dia2, mes2, ano2] = b.data.split('/');
                        const dataA = new Date(`${mes}/${dia}/${ano}`);
                        const dataB = new Date(`${mes2}/${dia2}/${ano2}`);

                        return dataB.getTime() - dataA.getTime();
                    });

                    novosUsuarios.forEach((eventoKey) => {
                        if (eventoKey.status == "Planejado") {
                            totalPlanejados += 1;
                        }

                        if (eventoKey.status == "Encerrado") {
                            totalEncerrados += 1;
                        }

                        if (eventoKey.doacoes) {
                            totalDoacoes += Object.keys(eventoKey.doacoes).length;
                        }

                        if (eventoKey.voluntarios) {
                            totalVoluntarios += Object.keys(eventoKey.voluntarios).length;
                        }
                    });

                    setDados(novosUsuarios);
                    setPlanejados(totalPlanejados);
                    setEncerrados(totalEncerrados);
                    setDoacoes(totalDoacoes);
                    setVoluntarios(totalVoluntarios);
                } else {
                    setDados([]);
                }
            });
        }, [filtroNome, filtroStatus, filtroDataInicial, filtroDataFinal]);

        return (
            <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"} rounded={5}>
                {dados.length !== 0 ? dados.map((item: any, index: any) => (
                    <Pressable key={index} onPress={() => navigation.navigate("Detalhes do Evento - AMEM", { evento: item })}>
                        {({
                            isHovered
                        }) => {
                            return <Box bg={isHovered ? "coolGray.100" : null} rounded={isHovered ? 5 : 0} key={index} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py="2" pl="4" pr={5}>
                                <HStack space={[2, 3]} justifyContent="space-between" alignItems={"center"}>
                                    <VStack>
                                        <Text bold color={item.status == "Planejado" ? "#1C3D8C" : item.status == "Encerrado" ? "#16A34A" : null}>
                                            {item.nome}
                                        </Text>
                                        <Text>
                                            {item.data}
                                        </Text>
                                    </VStack>
                                    <Spacer />
                                    <Icon as={MaterialIcons} name="navigate-next" size={5} color={"#bebebe"} />
                                </HStack>
                            </Box>
                        }}
                    </Pressable>
                )) : <Text py="2" px="4">Não há eventos.</Text>}
            </Box>
        );
    };

    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Text textAlign={"left"} bold fontSize={"3xl"}>Controle de Eventos</Text>
                    <Divider mt={2} mb={4}/>
                    {userPermission == "editor" || userPermission == "administrador" ? 
                        <Box flexDirection={"row"}>
                            <Button onPress={() => navigation.navigate("Cadastrar Evento - AMEM")} leftIcon={<Icon as={MaterialIcons} name="add" />} size={"sm"} backgroundColor={"#16A34A"} _hover={{backgroundColor: "green.700"}}>Cadastrar Evento</Button>
                        </Box>
                    : null }
                </Box>
                <HStack justifyContent="center" mb={25}>
                    <Pressable onPress={() => setFiltroStatus("Planejado")} flex={1}>
                    {({
                        isHovered
                    }) => {
                        return (
                            <Box bg={isHovered ? "coolGray.100" : "white"} py={25} mr={2} borderWidth={1} borderColor={"#D4D4D4"} rounded={5} alignItems={"center"}>
                            <Text bold fontSize={"3xl"}>{planejados}</Text>
                            <Text bold textAlign={"center"} fontSize={{base: "10", md: "14"}} color={"#1C3D8C"}>planejado(s)</Text>
                        </Box>
                    );
                }}
                    </Pressable>
                    <Pressable onPress={() => setFiltroStatus("Encerrado")} flex={1}>
                        {({
                            isHovered
                        }) => {
                            return (
                                <Box bg={isHovered ? "coolGray.100" : "white"} py={25} mr={2} borderWidth={1} borderColor={"#D4D4D4"} rounded={5} alignItems={"center"}>
                                    <Text bold fontSize={"3xl"}>{encerrados}</Text>
                                    <Text bold textAlign={"center"} fontSize={{base: "10", md: "14"}} color={"#16A34A"}>encerrado(s)</Text>
                                </Box>
                            );
                        }}
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Todas as Doações - AMEM")} flex={1}>
                        {({
                            isHovered
                        }) => {
                            return (
                                <Box bg={isHovered ? "coolGray.100" : "white"} py={25} mr={2} borderWidth={1} borderColor={"#D4D4D4"} rounded={5} alignItems={"center"}>
                                    <Text bold fontSize={"3xl"}>{doacoes}</Text>
                                    <Text textAlign={"center"} fontSize={{base: "10", md: "14"}}>doação(ões)</Text>
                                </Box>
                            );
                        }}
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Todos os Voluntários - AMEM")} flex={1}>
                        {({
                            isHovered
                        }) => {
                            return (
                                <Box bg={isHovered ? "coolGray.100" : "white"} py={25} borderWidth={1} borderColor={"#D4D4D4"} rounded={5} alignItems={"center"}>
                                    <Text bold fontSize={"3xl"}>{voluntarios}</Text>
                                    <Text textAlign={"center"} fontSize={{base: "10", md: "14"}}>voluntário(s)</Text>
                                </Box>
                            );
                        }}
                    </Pressable>
                </HStack>
                <Text textAlign={"left"} bold fontSize={"xl"} mb={25}>Lista de Eventos</Text>
                <Box flexDir={"row"} mb={2}>
                    <Input flex={2} mr={2} backgroundColor={"white"} InputRightElement={<Icon as={MaterialIcons} name="search" color={"#bebebe"} mr={2} />} value={filtroNome} onChangeText={(text) => setFiltroNome(text)} placeholder="Filtrar pelo nome..." size="md"/>
                    <Select dropdownIcon={<Icon as={MaterialIcons} name="keyboard-arrow-down" color={"#bebebe"} mr={2} />} flex={1} mr={2} backgroundColor={"white"} size={"md"} selectedValue={filtroStatus} placeholder="Filtrar pelo tipo..." onValueChange={(itemValue) => setFiltroStatus(itemValue)}>
                        <Select.Item label="Todos" value="" />
                        <Select.Item label="Planejado" value="Planejado" />
                        <Select.Item label="Encerrado" value="Encerrado" />
                    </Select>
                    <Input flex={1} mr={2} backgroundColor={"white"} InputRightElement={<Icon as={MaterialIcons} name="date-range" color={"#bebebe"} mr={2} />} value={filtroDataInicial} onChangeText={(text) => setFiltroDataInicial(text)} placeholder="Data inicial..." size="md"/>
                    <Input flex={1} mr={2} backgroundColor={"white"} InputRightElement={<Icon as={MaterialIcons} name="date-range" color={"#bebebe"} mr={2} />} value={filtroDataFinal} onChangeText={(text) => setFiltroDataFinal(text)} placeholder="Data final..." size="md"/>
                    <Tooltip label="Limpar filtros" openDelay={500}>
                        <Button onPress={limparFiltros} leftIcon={<Icon as={MaterialIcons} name="restart-alt" />} size={"sm"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} />
                    </Tooltip>
                </Box>
                {exibirEventos()}
            </Box>
        </ScrollView>
    );
};

export default ControleEventos;