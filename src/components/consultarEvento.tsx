import { Box, Checkbox, HStack, Icon, ScrollView, Spacer, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { FontAwesome } from '@expo/vector-icons';

const buscarUsuarios = () => {
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
        <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"}>
            {dados.map((item: any, index: any) => (
                <Box key={index} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py="2" pl="4" pr={5}>
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
                        <Icon as={<FontAwesome name={"angle-right"} />} size={5} color="#bebebe" />
                    </HStack>
                </Box>
            ))}
        </Box>
    );
};

function calcularDias(data: any){
    var dataEvento = new Date(data).getTime();
    var dias = Math.round((dataEvento - new Date().getTime()) / (1000 * 3600 * 24));
    var dataFormatada = new Intl.DateTimeFormat("pt-BR").format(dataEvento);

    if (dias < 30 && dias >= 0) {
        return dataFormatada + " - Falta(m) " + dias + " dia(s) para o evento!";
    }

    return dataFormatada;
};

export default function ConsultarEvento(){
    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box padding={50} flex={1}>
                <Text textAlign={"left"} bold fontSize={"3xl"} mb={25}>Painel de Controle</Text>
                {buscarUsuarios()}
            </Box>
        </ScrollView>
    );
}