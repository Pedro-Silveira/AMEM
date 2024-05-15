import React, { useEffect, useState } from "react";
import { Box, HamburgerIcon, Icon, Menu, Pressable, Image, Divider, Popover } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from "../services/firebaseConfig";
import { onValue, ref } from "firebase/database";

const Navbar = () => {
    const navigation = useNavigation();
    const [dados, setDados] = useState<any>([]);

        useEffect(() => {
            const query = ref(db, "eventos/");
            onValue(query, (snapshot) => {
                const data = snapshot.val();

                if (data) {
                    const hoje = new Date();
                    hoje.setDate(hoje.getDate() + 30); // Subtrai 30 dias da data atual

                    const eventosFiltrados = Object.keys(data)
                        .map(key => ({
                            id: key,
                            ...data[key]
                        }))
                        .filter(evento => {
                            const parts = evento.data.split('/'); // Dividindo a data em partes (dia, mês, ano)
                            const eventoDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])); // Criando um objeto de data com as partes divididas
                    
                            return eventoDate <= hoje && evento.status == "Planejado"; // Verificando se o evento ocorre dentro do intervalo de 30 dias
                        });

                    setDados(eventosFiltrados);
                } else {
                    setDados([]);
                }
            });
        }, []);
    
    return(
        <Box backgroundColor={"#1C3D8C"} justifyContent="space-between" alignItems={"center"} padding={6} flexDirection={"row"} w="100%">
            <Box flexDirection={"row"} alignItems={"center"}>
                <Menu trigger={triggerProps => {
                    return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                        <HamburgerIcon size={5} color="white" />
                    </Pressable>;
                }}>
                    <Menu.Group title={"Olá, " + auth.currentUser?.displayName + "!"}>
                        <Divider my="2" w="100%" />
                        <Menu.Item onPress={() => navigation.navigate("Painel de Controle - AMEM" as never)}>Painel de Controle</Menu.Item>
                        <Menu.Item onPress={() => navigation.navigate("Novo Usuário - AMEM" as never)}>Novo Usuário</Menu.Item>
                        <Divider my="2" w="100%" />
                        <Menu.Item onPress={() => auth.signOut()}>Sair</Menu.Item>
                    </Menu.Group>
                </Menu>
                <Pressable onPress={() => navigation.navigate("Painel de Controle - AMEM" as never)}>
                    <Image height={30} width={75} marginLeft={5} resizeMode={"contain"} source={require("./../media/AMEM.png")} alt="AMEM" />
                </Pressable>
            </Box>
            <Popover trigger={triggerProps => {
                return <Pressable {...triggerProps} colorScheme="danger">
                    <Icon as={<MaterialIcons name={"notifications"} />} size={6} color={dados.length > 0 ? "#F7C300" : "#bebebe"} />
                </Pressable>;
            }}>
                <Popover.Content accessibilityLabel="Delete Customerd" w="56">
                    <Popover.Arrow />
                    <Popover.CloseButton />
                    <Popover.Header>Delete Customer</Popover.Header>
                    <Popover.Body>
                        This will remove all data relating to Alex. This action cannot be
                        reversed. Deleted data can not be recovered.
                    </Popover.Body>
                </Popover.Content>
            </Popover> 
        </Box>
    );
};

export default Navbar;