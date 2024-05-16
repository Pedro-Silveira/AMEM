import React, { useEffect, useState } from "react";
import { Box, HStack, Icon, Pressable, ScrollView, Spacer, Text, VStack } from "native-base";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onValue, ref } from "firebase/database";
import { db } from "../services/firebaseConfig";
import { MaterialIcons } from '@expo/vector-icons';

const ListaDoacoes = () => {
    const navigation = useNavigation<any>();
    const [dadosDoacoes, setDoacoes] = useState<any>([]);

    useEffect(() => {
        const queryDoacoes = ref(db, "eventos/");

        onValue(queryDoacoes, (snapshot) => {
            const dataDoacoes = snapshot.val();

            if (dataDoacoes) {
                let todasDoacoes: any[] = [];

                Object.keys(dataDoacoes).forEach((eventoKey) => {
                    const evento = dataDoacoes[eventoKey];
                    
                    if (evento.doacoes) {
                        const doacoesEvento = Object.keys(evento.doacoes).map((doacaoKey) => ({
                            idEvento: eventoKey,
                            idDoacao: doacaoKey,
                            ...evento.doacoes[doacaoKey]
                        }));
                        todasDoacoes = [...todasDoacoes, ...doacoesEvento];
                    }
                });

                setDoacoes(todasDoacoes);
            } else {
                setDoacoes([]);
            }
        });
    }, []);

    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Pressable style={styles.box3} onPress={() => navigation.navigate("Controle de Eventos - AMEM")}>
                        <Icon as={MaterialIcons} name="navigate-before" size={25} color={"#818181"} />
                        <Text textAlign={"left"} bold fontSize={"3xl"}>Lista de Doações</Text>
                    </Pressable>
                </Box>
                <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"} rounded={5} marginBottom={25}>
                    {dadosDoacoes.length !== 0 ? dadosDoacoes.map((item: any, index: any) => (
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
                                                    {item.organizacao}
                                                </Text>
                                                <Text> 
                                                    {item.quantidade} {item.unidade} {item.material}.
                                                </Text>
                                            </VStack>
                                            <Spacer />
                                            {item.tipo == "efetuada" ? <Icon as={<MaterialIcons name={"arrow-circle-right"} />} size={5} color="#E11D48" /> : <Icon as={<MaterialIcons name={"arrow-circle-left"} />} size={5} color="#16A34A" />}
                                        </HStack>
                                    </Box>
                                );
                            }}
                        </Pressable>
                    )) : <Text py="2" px="4">Não há doações.</Text>}
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

export default ListaDoacoes;