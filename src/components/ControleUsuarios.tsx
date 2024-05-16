import React, { useEffect, useState } from "react";
import { Box, Button, HStack, Icon, Input, Pressable, ScrollView, Select, Spacer, Text, Tooltip, VStack } from "native-base";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onValue, ref } from "firebase/database";
import { db } from "../services/firebaseConfig";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const controleUsuarios = () => {
    const navigation = useNavigation<any>();
    const [dados, setDados] = useState<any>([]);
    const [filtroUsuario, setFiltroUsuario] = useState("");

    const limparFiltros = () => {
        setFiltroUsuario("");
    };

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
                );

                setDados(novosUsuarios);
            } else {
                setDados([]);
            }
        });
    }, [filtroUsuario]);

    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Text textAlign={"left"} bold fontSize={"3xl"}>Controle de Usuários</Text>
                    <Box flexDirection={"row"}>
                        <Button onPress={() => navigation.navigate("Cadastrar Usuário - AMEM")} leftIcon={<Icon as={MaterialIcons} name="add" />} size={"sm"} backgroundColor={"#16A34A"} _hover={{backgroundColor: "green.700"}}>Cadastrar Usuário</Button>
                    </Box>
                </Box>
                <Box flexDir={"row"} mb={2}>
                    <Input flex={2} mr={2} backgroundColor={"white"} InputRightElement={<Icon as={MaterialIcons} name="search" color={"#bebebe"} mr={2} />} value={filtroUsuario} onChangeText={(text) => setFiltroUsuario(text)} placeholder="Filtrar pelo nome/e-mail..." size="md"/>
                    <Tooltip label="Limpar filtros" openDelay={500}>
                        <Button onPress={limparFiltros} leftIcon={<Icon as={MaterialIcons} name="restart-alt" />} h={35} size={"sm"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} />
                    </Tooltip>
                </Box>
                <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"} rounded={5} marginBottom={25}>
                    {dados.length !== 0 ? dados.map((item: any, index: any) => (
                        <Pressable key={index} onPress={() => navigation.navigate("Detalhes do Usuário - AMEM", { usuario: item })}>
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
                                            <Text>
                                                {item.email}
                                            </Text>
                                            </VStack>
                                            <Spacer />
                                            {item.permissao == "administrador" ? <Icon as={<FontAwesome5 name={"user-tie"} />} size={5} color="#bebebe" /> : item.permissao == "editor" ? <Icon as={<FontAwesome5 name={"user-edit"} />} size={5} color="#bebebe" /> : <Icon as={<FontAwesome5 name={"user"} />} size={5} color="#bebebe" />}
                                        </HStack>
                                    </Box>
                                );
                            }}
                        </Pressable>
                    )) : <Text py="2" px="4">Não há usuários.</Text>}
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

export default controleUsuarios;