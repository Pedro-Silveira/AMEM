import { Box, Button, HStack, Icon, Pressable, ScrollView, Spacer, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { db } from "../services/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

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

    const calcularDias = (data: any) => {
        const [dia, mes, ano] = data.split('/');
        const dataFormatada = `${mes}/${dia}/${ano}`;
        var dataEvento = new Date(dataFormatada).getTime();
        var dias = Math.round((dataEvento - new Date().getTime()) / (1000 * 3600 * 24));

        if (dias < 30 && dias >= 0) {
            return new Intl.DateTimeFormat("pt-BR").format(dataEvento) + " - Falta(m) " + dias + " dia(s) para o evento!";
        }

        return new Intl.DateTimeFormat("pt-BR").format(dataEvento);
    };

    const exibirEventos = () => {
        const [dados, setDados] = useState<any>([]);

        useEffect(() => {
            const query = ref(db, "eventos/");
            onValue(query, (snapshot) => {
                const data = snapshot.val();
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
                    setDados(novosUsuarios);
                } else {
                    setDados([]);
                }
            });
        }, []);

        return (
            <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"} rounded={5}>
                {dados.map((item: any, index: any) => (
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
                {exibirEventos()}
            </Box>
        </ScrollView>
    );
};

export default painelControle;