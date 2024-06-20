import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Box, Button, Divider, HStack, Icon, Input, Pressable, ScrollView, Select, Skeleton, Text, Tooltip, VStack } from "native-base";
import { db } from "../services/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import getUserPermission from "../util/getPermission";

const ControleEventos = () => {
    // Fixas
    const userPermission = getUserPermission();
    const navigation = useNavigation<any>();

    // Variáveis
    const [carregando, setCarregando] = useState(true);
    const [dados, setDados] = useState<any>([]);
    const [planejados, setPlanejados] = useState<any>([0]);
    const [encerrados, setEncerrados] = useState<any>([0]);
    const [doacoes, setDoacoes] = useState<any>([0]);
    const [voluntarios, setVoluntarios] = useState<any>([0]);

    // Gets & Sets
    const [filtroNome, setFiltroNome] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("Planejado");
    const [filtroDataInicial, setFiltroDataInicial] = useState("");
    const [filtroDataFinal, setFiltroDataFinal] = useState("");

    // Formata a data conforme o usuário digita.
    const formatarData = (valor: any, filtro: any) => {
        const novaData = valor.replace(/\D/g, "");

        if (novaData.length <= 8) {
            const dataFormatada = novaData.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");

            if ( filtro == "inicial") {
                setFiltroDataInicial(dataFormatada);
            } else {
                setFiltroDataFinal(dataFormatada);
            }
            
        } else {
            if ( filtro == "inicial") {
                setFiltroDataInicial(valor);
            } else {
                setFiltroDataFinal(valor);
            }
        }
    };

    // Limpa os campos de filtro.
    const limparFiltros = () => {
        setFiltroNome("");
        setFiltroStatus("Planejado");
        setFiltroDataInicial("");
        setFiltroDataFinal("");
    };

    // Busca todos os eventos no banco de dados.
    const exibirEventos = () => {
        useEffect(() => {
            const query = ref(db, "eventos/");

            onValue(query, (snapshot) => {
                const dados = snapshot.val();
                let totalPlanejados = 0;
                let totalEncerrados = 0;
                let totalDoacoes = 0;
                let totalVoluntarios = 0;

                if (dados) {
                    const resultadoDados = Object.keys(dados)
                    .map(key => ({
                        id: key,
                        ...dados[key]
                    }))
                    .filter((evento: { nome: any; status: any; dataInicial: any; dataFinal: any; }) => 
                        (filtroNome === "" || evento.nome.toLowerCase().includes(filtroNome.toLowerCase())) && 
                        (filtroStatus === "" || evento.status === filtroStatus) && 
                        (filtroDataInicial === "" || evento.dataInicial.split('/').reverse().join('-') >= filtroDataInicial.split('/').reverse().join('-')) && 
                        (filtroDataFinal === "" || evento.dataFinal.split('/').reverse().join('-') <= filtroDataFinal.split('/').reverse().join('-')))
                    .sort((a, b) => {
                        const [dia, mes, ano] = a.dataInicial.split('/');
                        const [dia2, mes2, ano2] = b.dataInicial.split('/');
                        const dataA = new Date(`${mes}/${dia}/${ano}`);
                        const dataB = new Date(`${mes2}/${dia2}/${ano2}`);

                        return dataA.getTime() - dataB.getTime();
                    });

                    resultadoDados.forEach((eventoKey) => {
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

                    setDados(resultadoDados);
                    setPlanejados(totalPlanejados);
                    setEncerrados(totalEncerrados);
                    setDoacoes(totalDoacoes);
                    setVoluntarios(totalVoluntarios);
                } else {
                    setDados([]);
                }

                setCarregando(false);
            });
        }, [filtroNome, filtroStatus, filtroDataInicial, filtroDataFinal]);

        if (carregando) {
            return (<Skeleton.Text lines={2} p={4} />);
        }

        return (
            dados.length !== 0 ? dados.map((item: any, index: any) => (
                <Pressable key={index} onPress={() => navigation.navigate("Detalhes do Evento - AMEM", { evento: item })}>
                    {({
                        isHovered
                    }) => {
                        return (
                            <Box key={index} bg={isHovered ? "coolGray.100" : null} rounded={isHovered ? 5 : 0} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py={2} pl={4} pr={5}>
                                <HStack space={[2, 3]} justifyContent={"space-between"} alignItems={"center"}>
                                    <VStack>
                                        <Text bold color={item.status == "Planejado" ? "#1C3D8C" : item.status == "Encerrado" ? "#16A34A" : null}>
                                            {item.nome}
                                        </Text>
                                        <Text>
                                            {item.dataInicial} - {item.dataFinal}
                                        </Text>
                                    </VStack>
                                    <Icon as={MaterialIcons} name="navigate-next" size={5} color={"#bebebe"} />
                                </HStack>
                            </Box>
                        );
                    }}
                </Pressable>
            )) : <Text py={2} px={4}>Não há eventos.</Text>
        );
    };

    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Text bold fontSize={"3xl"} textAlign={"left"}>Controle de Eventos</Text>
                </Box>
                <HStack justifyContent="center" mb={25}>
                    <Pressable onPress={() => setFiltroStatus("Planejado")} flex={1}>
                        {({
                            isHovered
                        }) => {
                            return (
                                <Box bg={isHovered ? "coolGray.100" : "white"} py={25} mr={2} borderWidth={1} borderColor={"#D4D4D4"} rounded={5} alignItems={"center"}>
                                    <Text bold fontSize={"3xl"}>{planejados}</Text>
                                    <Text bold fontSize={{base: "10", md: "14"}} color={"#1C3D8C"} textAlign={"center"}>planejado(s)</Text>
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
                                    <Text bold fontSize={{base: "10", md: "14"}} color={"#16A34A"} textAlign={"center"}>encerrado(s)</Text>
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
                                    <Text fontSize={{base: "10", md: "14"}} textAlign={"center"}>doação(ões)</Text>
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
                                    <Text fontSize={{base: "10", md: "14"}} textAlign={"center"}>voluntário(s)</Text>
                                </Box>
                            );
                        }}
                    </Pressable>
                </HStack>
                <Text textAlign={"left"} bold fontSize={"xl"}>Lista de Eventos</Text>
                <Divider mt={2}/>
                {userPermission == "editor" || userPermission == "administrador" ? 
                    <Box flexDirection={"row"} mt={4} >
                        <Button onPress={() => navigation.navigate("Cadastrar Evento - AMEM")} leftIcon={<Icon as={MaterialIcons} name="add" />} size={"sm"} backgroundColor={"#16A34A"} _hover={{backgroundColor: "green.700"}}>Cadastrar Evento</Button>
                    </Box>
                : userPermission ? null : <Skeleton rounded={5} mt={4} /> }
                <Box flexDir={{base: "column", md: "row"}} mt={25} mb={2}>
                    <Box flexDir={"row"} flex={1} mb={{base: 2, md: 0}}>
                        <Input value={filtroNome} onChangeText={(texto) => setFiltroNome(texto)} flex={2} InputRightElement={<Icon as={MaterialIcons} name="search" color={"#bebebe"} mr={2} />} size="md" placeholder="Filtrar pelo nome..." backgroundColor={"white"} mr={2} />
                        <Select selectedValue={filtroStatus} onValueChange={(item) => setFiltroStatus(item)} flex={1} dropdownIcon={<Icon as={MaterialIcons} name="keyboard-arrow-down" color={"#bebebe"} mr={2} />} size={"md"} placeholder="Filtrar pelo tipo..." backgroundColor={"white"} mr={{base: 0, md: 2}} >
                            <Select.Item label="Todos" value="" />
                            <Select.Item label="Planejado" value="Planejado" />
                            <Select.Item label="Encerrado" value="Encerrado" />
                        </Select>
                    </Box>
                    <Box flexDir={"row"} flex={1}>
                        <Input value={filtroDataInicial} onChangeText={(texto) => formatarData(texto, "inicial")} flex={1} InputRightElement={<Icon as={MaterialIcons} name="date-range" color={"#bebebe"} mr={2} />} size="md" placeholder="Data inicial..." backgroundColor={"white"} mr={2} />
                        <Input value={filtroDataFinal} onChangeText={(texto) => formatarData(texto, "final")} flex={1} InputRightElement={<Icon as={MaterialIcons} name="date-range" color={"#bebebe"} mr={2} />} size="md" placeholder="Data final..." backgroundColor={"white"} mr={2} />
                        <Tooltip label="Limpar filtros" openDelay={500}>
                            <Button onPress={limparFiltros} leftIcon={<Icon as={MaterialIcons} name="restart-alt" />} size={"sm"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} />
                        </Tooltip>
                    </Box>
                </Box>
                <Box backgroundColor={"#fff"} borderWidth={1} borderColor={"#D4D4D4"} rounded={5}>
                    {exibirEventos()}
                </Box>
            </Box>
        </ScrollView>
    );
};

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

export default ControleEventos;