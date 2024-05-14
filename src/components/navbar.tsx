import React from "react";
import { Box, HamburgerIcon, Icon, Menu, Pressable, Image, Divider } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from "../services/firebaseConfig";

export default function Navbar(){
    const navigation = useNavigation();
    
    return(
        <Box backgroundColor={"#1C3D8C"} justifyContent="space-between" alignItems={"center"} padding={6} flexDirection={"row"} w="100%">
            <Box flexDirection={"row"} alignItems={"center"}>
                <Menu trigger={triggerProps => {
                    return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                        <HamburgerIcon size={5} color="white" />
                    </Pressable>;
                }}>
                    <Menu.Group title={"Olá, " + auth.currentUser?.displayName + "!"}>
                        <Menu.Item onPress={() => navigation.navigate("Painel de Controle - AMEM" as never)}> Painel de Controle</Menu.Item>
                        <Divider my="2" w="100%" />
                        <Menu.Item onPress={() => navigation.navigate("Cadastrar Evento - AMEM" as never)}>Cadastrar Evento</Menu.Item>
                        <Menu.Item onPress={() => navigation.navigate("Novo Usuário - AMEM" as never)}>Novo Usuário</Menu.Item>
                        <Divider my="2" w="100%" />
                        <Menu.Item onPress={() => auth.signOut()}>Sair</Menu.Item>
                    </Menu.Group>
                </Menu>
                <Pressable onPress={() => navigation.navigate("Painel de Controle - AMEM" as never)}>
                    <Image height={30} width={75} marginLeft={5} resizeMode={"contain"} source={require("./../media/AMEM.png")} alt="AMEM" />
                </Pressable>
            </Box>
            <Pressable>
                <Icon as={<MaterialIcons name={"notifications"} />} size={6} color={"#bebebe"} />
            </Pressable>
        </Box>
    );
}