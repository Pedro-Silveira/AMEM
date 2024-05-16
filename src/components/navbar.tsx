import React, { useEffect, useState } from "react";
import { Box, HamburgerIcon, Icon, Menu, Pressable, Image, Divider, Popover, Badge, Text } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from "../services/firebaseConfig";
import { onValue, ref } from "firebase/database";
import calcularDias from "../util/dateCalculator";
import useUserPermission from "../util/getPermission";

const Navbar = () => {
    const navigation = useNavigation();
    const [dados, setDados] = useState<any>([]);
    const userPermission = useUserPermission();

    useEffect(() => {
        const query = ref(db, "eventos/");
        
        onValue(query, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const hoje = new Date();
                
                hoje.setDate(hoje.getDate() + 30)

                const eventosFiltrados = Object.keys(data)
                .map(key => ({
                    id: key,
                    ...data[key]
                }))
                .filter(evento => {
                    const parts = evento.data.split('/');
                    const eventoDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
                
                    return eventoDate <= hoje && evento.status == "Planejado";
                })
                .sort((a, b) => {
                    const [dia, mes, ano] = a.data.split('/');
                    const [dia2, mes2, ano2] = b.data.split('/');
                    const dataA = new Date(`${mes}/${dia}/${ano}`);
                    const dataB = new Date(`${mes2}/${dia2}/${ano2}`);

                    return dataA.getTime() - dataB.getTime();
                });

                setDados(eventosFiltrados);
            } else {
                setDados([]);
            }
        });
    }, []);
    
    return(
        <Box backgroundColor={"#1C3D8C"} justifyContent="space-between" alignItems={"center"} paddingY={6} paddingX={9} flexDirection={"row"} w="100%">
            <Box flexDirection={"row"} alignItems={"center"}>
                <Menu trigger={triggerProps => {
                    return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                        <HamburgerIcon size={5} color="white" />
                    </Pressable>;
                }}>
                    <Menu.Group title={"Olá, " + auth.currentUser?.displayName + "!"}>
                        <Divider my="2" w="100%" />
                        <Menu.Item onPress={() => navigation.navigate("Controle de Eventos - AMEM" as never)}>Controle de Eventos</Menu.Item>
                        {userPermission == "administrador" ? 
                        <><Menu.Item onPress={() => navigation.navigate("Controle de Usuários - AMEM" as never)}>Controle de Usuários</Menu.Item><Divider my="2" w="100%" /></> : <Divider my="2" w="100%" />}
                        <Menu.Item onPress={() => auth.signOut()}>Sair</Menu.Item>
                    </Menu.Group>
                </Menu>
                <Pressable onPress={() => navigation.navigate("Controle de Eventos - AMEM" as never)}>
                    <Image height={30} width={75} marginLeft={6} resizeMode={"contain"} source={require("./../media/AMEM.png")} alt="AMEM" />
                </Pressable>
            </Box>
            <Popover trigger={triggerProps => {
                return <Pressable {...triggerProps} colorScheme="danger">
                    {dados.length != 0 ? <Badge colorScheme="danger" rounded="full" mb={-4} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end">{dados.length}</Badge> : ""}
                    <Icon as={<MaterialIcons name={"notifications"} />} size={6} color={dados.length > 0 ? "#F7C300" : "#bebebe"} />
                </Pressable>;
            }}>
                <Popover.Content accessibilityLabel="Delete Customerd" w="56">
                    <Popover.Arrow />
                    <Popover.CloseButton />
                    <Popover.Header>Notificações</Popover.Header>
                    <Popover.Body pb={0}>
                        {dados.length != 0 ? dados.map((item: any, index: any) => (
                            <Box>
                                <Box flexDir={"row"} alignItems={"center"}>
                                    <Badge colorScheme="danger" rounded="full" p={1} mr={2} variant="solid" />
                                    <Text bold>{item.nome}</Text>
                                </Box>
                                <Text mb={3}>{calcularDias(item.data)}</Text>
                                <Divider mb={3} />
                            </Box>
                        )) : <Text mb={3}>Não há notificações.</Text>}
                    </Popover.Body>
                </Popover.Content>
            </Popover> 
        </Box>
    );
};

export default Navbar;