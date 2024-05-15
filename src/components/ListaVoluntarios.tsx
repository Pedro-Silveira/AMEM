import React, { useEffect, useState } from "react";
import { Box, HStack, Icon, Pressable, ScrollView, Spacer, Text, VStack } from "native-base";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onValue, ref } from "firebase/database";
import { db } from "../services/firebaseConfig";
import { MaterialIcons } from '@expo/vector-icons';

const ListaVoluntarios = () => {
    const navigation = useNavigation<any>();
    const [dadosVoluntarios, setVoluntarios] = useState<any>([]);

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
                        }));
                        todosVoluntarios = [...todosVoluntarios, ...voluntariosEvento];
                    }
                });

                setVoluntarios(todosVoluntarios);
            } else {
                setVoluntarios([]);
            }
        });
    }, []);

    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Pressable style={styles.box3} onPress={() => navigation.navigate("Painel de Controle - AMEM")}>
                        <Icon as={MaterialIcons} name="navigate-before" size={25} color={"#818181"} />
                        <Text textAlign={"left"} bold fontSize={"3xl"}>Lista de Voluntários</Text>
                    </Pressable>
                </Box>
                <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"} rounded={5}>
                    {dadosVoluntarios.length !== 0 ? dadosVoluntarios.map((item: any, index: any) => (
                        <Pressable>
                            {({
                                isHovered,
                                isPressed
                            }) => {
                                return (
                                    <Box bg={isPressed || isHovered ? "coolGray.100" : ""} rounded={isPressed || isHovered ? 5 : 0} key={index} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py="2" pl="4" pr={5}>
                                        <HStack space={[2, 3]} justifyContent="space-between" alignItems={"center"}>
                                            <VStack>
                                                <Text bold>
                                                    {item.nome}
                                                </Text>
                                                <Text >
                                                    {item.horas} hora(s).
                                                </Text>
                                            </VStack>
                                            <Spacer />
                                            <Icon as={<MaterialIcons name={"timer"} />} size={5} color="#bebebe" />
                                        </HStack>
                                    </Box>
                                );
                            }}
                        </Pressable>
                    )) : <Text py="2" px="4">Não há voluntários.</Text>}
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