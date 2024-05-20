import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Box, Button, Divider, HStack, Icon, Input, Pressable, ScrollView, Skeleton, Text, Tooltip, VStack } from "native-base";
import { onValue, ref } from "firebase/database";
import { db } from "../services/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome6 } from '@expo/vector-icons';

const ControleUsuarios = () => {
    // Fixas
    const navigation = useNavigation<any>();

    // Variáveis
    const [carregando, setCarregando] = useState(true);
    const [dados, setDados] = useState<any>([]);

    // Gets & Sets
    const [filtroUsuario, setFiltroUsuario] = useState("");

    // Limpa os campos de filtro.
    const limparFiltros = () => {
        setFiltroUsuario("");
    };

    // Busca os usuários no banco de dados.
    useEffect(() => {
        const query = ref(db, "usuarios/");
        
        onValue(query, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const novosUsuarios = Object.keys(data)
                .map(key => ({
                    id: key,
                    ...data[key]
                }))
                .filter((usuario: { nome: any; email: any; }) => 
                    (filtroUsuario === "" || (usuario.nome.toLowerCase().includes(filtroUsuario.toLowerCase())) || usuario.email.toLowerCase().includes(filtroUsuario.toLowerCase()))
                ).sort((a, b) => {
                    const nomeA = a.nome.toUpperCase();
                    const nomeB = b.nome.toUpperCase();

                    if (nomeA < nomeB) {
                        return -1;
                    }

                    if (nomeA > nomeB) {
                        return 1;
                    }

                    return 0;
                });

                setDados(novosUsuarios);
            } else {
                setDados([]);
            }

            setCarregando(false);
        });
    }, [filtroUsuario]);

    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Text bold fontSize={"3xl"} textAlign={"left"}>Controle de Usuários</Text>
                    <Divider mt={2} mb={4}/>
                    <Box flexDirection={"row"}>
                        <Button onPress={() => navigation.navigate("Cadastrar Usuário - AMEM")} leftIcon={<Icon as={MaterialIcons} name="add" />} size={"sm"} backgroundColor={"#16A34A"} _hover={{backgroundColor: "green.700"}}>Cadastrar Usuário</Button>
                    </Box>
                </Box>
                <Box flexDir={"row"} mb={2}>
                <Input value={filtroUsuario} onChangeText={(text) => setFiltroUsuario(text)} InputRightElement={<Icon as={MaterialIcons} name="search" color={"#bebebe"} mr={2} />} flex={2} size={"md"} placeholder={"Filtrar pelo nome/e-mail..."} mr={2} backgroundColor={"white"} />
                    <Tooltip label="Limpar filtros" openDelay={500}>
                        <Button onPress={limparFiltros} leftIcon={<Icon as={MaterialIcons} name="restart-alt" />} size={"sm"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} />
                    </Tooltip>
                </Box>
                <Box backgroundColor={"#fff"} borderWidth={1} borderColor={"#D4D4D4"} rounded={5} marginBottom={25}>
                    {dados.length !== 0 ? dados.map((item: any, index: any) => (
                        <Pressable key={index} onPress={() => navigation.navigate("Detalhes do Usuário - AMEM", { usuario: item })}>
                            {({
                                isHovered
                            }) => {
                                return (
                                    <Box key={index} bg={isHovered ? "coolGray.100" : null} rounded={isHovered ? 5 : 0} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py={2} pl={4} pr={5}>
                                        <HStack space={[2, 3]} justifyContent={"space-between"} alignItems={"center"}>
                                            <VStack>
                                            <Text bold>{item.nome}</Text>
                                            <Text>{item.email}</Text>
                                            </VStack>
                                            {item.permissao == "administrador" ? <Icon as={<FontAwesome6 name={"user-tie"} />} size={5} color="#bebebe" /> : item.permissao == "editor" ? <Icon as={<FontAwesome6 name={"user-pen"} />} size={5} color="#bebebe" /> : <Icon as={<FontAwesome6 name={"user"} />} size={5} color="#bebebe" />}
                                        </HStack>
                                    </Box>
                                );
                            }}
                        </Pressable>
                    )) : carregando ? <Skeleton.Text lines={2} p={4} /> : <Text py={2} px={4}>Não há usuários.</Text> }
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

export default ControleUsuarios;