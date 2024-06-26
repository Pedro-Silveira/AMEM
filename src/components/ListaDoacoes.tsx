import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Box, Button, HStack, Icon, Input, Pressable, ScrollView, Select, Skeleton, Text, Tooltip, VStack } from "native-base";
import { onValue, ref } from "firebase/database";
import { db } from "../services/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';

const ListaDoacoes = () => {
    // Fixas
    const navigation = useNavigation<any>();

    // Variáveis
    const [carregando, setCarregando] = useState(true);
    const [dadosDoacoes, setDoacoes] = useState<any>([]);
    
    // Gets & Sets
    const [filtroNome, setFiltroNome] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    
    // Limpa os campos de filtro.
    const limparFiltros = () => {
        setFiltroNome("");
        setFiltroTipo("");
    };

    // Busca todas as doações no banco de dados.
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
                        })).filter((doacao: { organizacao: any; material: any; tipo: any; }) => 
                            (filtroNome === "" || (doacao.organizacao.toLowerCase().includes(filtroNome.toLowerCase())) || doacao.material.toLowerCase().includes(filtroNome.toLowerCase())) && 
                            (filtroTipo === "" || doacao.tipo === filtroTipo)
                        )
                        
                        todasDoacoes = [...todasDoacoes, ...doacoesEvento];
                    }
                });

                setDoacoes(todasDoacoes.reverse());
            } else {
                setDoacoes([]);
            }

            setCarregando(false);
        });
    }, [filtroNome, filtroTipo]);

    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Pressable style={styles.box3} onPress={() => navigation.navigate("Controle de Eventos - AMEM")}>
                        <Icon as={MaterialIcons} name="navigate-before" size={25} color={"#818181"} />
                        <Text textAlign={"left"} bold fontSize={"3xl"}>Todas as Doações</Text>
                    </Pressable>
                </Box>
                <Box flexDir={"row"} mb={2}>
                    <Input flex={2} mr={2} backgroundColor={"white"} InputRightElement={<Icon as={MaterialIcons} name="search" color={"#bebebe"} mr={2} />} value={filtroNome} onChangeText={(text) => setFiltroNome(text)} placeholder="Filtrar pelo material/organização..." size="md"/>
                    <Select dropdownIcon={<Icon as={MaterialIcons} name="keyboard-arrow-down" color={"#bebebe"} mr={2} />} flex={1} mr={2} backgroundColor={"white"} size={"md"} selectedValue={filtroTipo} placeholder="Filtrar pelo tipo..." onValueChange={(itemValue) => setFiltroTipo(itemValue)}>
                        <Select.Item label="Todos" value="" />
                        <Select.Item label="Efetuada" value="efetuada" />
                        <Select.Item label="Recebida" value="recebida" />
                    </Select>
                    <Tooltip label="Limpar filtros" openDelay={500}>
                        <Button onPress={limparFiltros} leftIcon={<Icon as={MaterialIcons} name="restart-alt" />} size={"sm"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} />
                    </Tooltip>
                </Box>
                <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"} rounded={5} marginBottom={25}>
                    {dadosDoacoes.length !== 0 ? dadosDoacoes.map((item: any, index: any) => (
                        <Pressable>
                            {({
                                isHovered
                            }) => {
                                return (
                                    <Box bg={isHovered ? "coolGray.100" : null} rounded={isHovered ? 5 : 0} key={index} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py="2" pl="4" pr={5}>
                                        <HStack space={[2, 3]} justifyContent="space-between" alignItems={"center"}>
                                            <VStack>
                                                <Text bold>{item.quantidade} {item.unidade} de {item.material}</Text>
                                                <Text>por {item.organizacao}.</Text>
                                            </VStack>
                                            {item.tipo == "efetuada" ? <Icon as={<MaterialIcons name={"arrow-circle-right"} />} size={5} color="#E11D48" /> : <Icon as={<MaterialIcons name={"arrow-circle-left"} />} size={5} color="#16A34A" />}
                                        </HStack>
                                    </Box>
                                );
                            }}
                        </Pressable>
                    )) : carregando ? <Skeleton.Text lines={2} p={4} /> : <Text py={2} px={4}>Não há doações.</Text>}
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

export default ListaDoacoes;