import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Box, Button, HStack, Icon, Input, Pressable, ScrollView, Skeleton, Text, Tooltip, VStack } from "native-base";
import { onValue, ref } from "firebase/database";
import { db } from "../services/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';

const ListaVoluntarios = () => {
    // Fixas
    const navigation = useNavigation<any>();

    // Variáveis
    const [carregando, setCarregando] = useState(true);
    const [dadosVoluntarios, setVoluntarios] = useState<any>([]);

    // Gets & Sets
    const [filtroNome, setFiltroNome] = useState("");

    // Limpa os campos de filtro.
    const limparFiltros = () => {
        setFiltroNome("");
    };

    // Busca todos os voluntários no banco de dados.
    useEffect(() => {
        const queryVoluntarios = ref(db, "eventos/");

        onValue(queryVoluntarios, (snapshot) => {
            const dataVoluntarios = snapshot.val();

            if (dataVoluntarios) {
                let todosVoluntarios: any[] = [];

                Object.keys(dataVoluntarios).forEach((eventoKey) => {
                    const evento = dataVoluntarios[eventoKey];
                    
                    if (evento.voluntarios) {
                        const voluntariosEvento = Object.keys(evento.voluntarios).map((voluntarioKey) => ({
                            idEvento: eventoKey,
                            idVoluntario: voluntarioKey,
                            ...evento.voluntarios[voluntarioKey]
                        })).filter((voluntario: { nome: any; }) => 
                            (filtroNome === "" || voluntario.nome.toLowerCase().includes(filtroNome.toLowerCase()))
                        );

                        todosVoluntarios = [...todosVoluntarios, ...voluntariosEvento];
                    }
                });

                setVoluntarios(todosVoluntarios.reverse());
            } else {
                setVoluntarios([]);
            }

            setCarregando(false);
        });
    }, [filtroNome]);

    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Pressable style={styles.box3} onPress={() => navigation.navigate("Controle de Eventos - AMEM")}>
                        <Icon as={MaterialIcons} name="navigate-before" size={25} color={"#818181"} />
                        <Text textAlign={"left"} bold fontSize={"3xl"}>Todos os Voluntários</Text>
                    </Pressable>
                </Box>
                <Box flexDir={"row"} mb={2}>
                    <Input flex={2} mr={2} backgroundColor={"white"} InputRightElement={<Icon as={MaterialIcons} name="search" color={"#bebebe"} mr={2} />} value={filtroNome} onChangeText={(text) => setFiltroNome(text)} placeholder="Filtrar pelo nome..." size="md"/>
                    <Tooltip label="Limpar filtros" openDelay={500}>
                        <Button onPress={limparFiltros} leftIcon={<Icon as={MaterialIcons} name="restart-alt" />} size={"sm"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} />
                    </Tooltip>
                </Box>
                <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"} rounded={5}>
                    {dadosVoluntarios.length !== 0 ? dadosVoluntarios.map((item: any, index: any) => (
                        <Pressable>
                            {({
                                isHovered
                            }) => {
                                return (
                                    <Box bg={isHovered ? "coolGray.100" : null} rounded={isHovered ? 5 : 0} key={index} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py="2" pl="4" pr={5}>
                                        <HStack space={[2, 3]} justifyContent="space-between" alignItems={"center"}>
                                            <VStack>
                                                <Text bold>{item.nome}</Text>
                                                <Text>{item.horas} hora(s).</Text>
                                            </VStack>
                                            <Icon as={<MaterialIcons name={"timer"} />} size={5} color="#bebebe" />
                                        </HStack>
                                    </Box>
                                );
                            }}
                        </Pressable>
                    )) : carregando ? <Skeleton.Text lines={2} p={4} /> : <Text py={2} px={4}>Não há voluntários.</Text>}
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
        flexDirection: "row",
        flexWrap: "wrap",
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

export default ListaVoluntarios;