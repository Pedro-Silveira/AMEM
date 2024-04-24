import React from "react";
import { Box, HamburgerIcon, Icon, Menu, Pressable, Text } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function Navbar(){
    const navigation = useNavigation();
    
    return(
        <Box backgroundColor={"#1C3D8C"} justifyContent="space-between" alignItems={"center"} padding={6} flexDirection={"row"} w="100%">
            <Box flexDirection={"row"} alignItems={"center"}>
                <Menu trigger={triggerProps => {return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                            <HamburgerIcon size={5} color="white" />
                        </Pressable>;
                    }}>
                        <Menu.Item onPress={() => navigation.navigate("AMEM" as never)}><Icon color="#000" as={FontAwesome} name="home" /> Painel de Controle</Menu.Item>
                        <Menu.Item onPress={() => navigation.navigate("Novo Evento - AMEM" as never)}><Icon color="#000" as={FontAwesome} name="gear" /> Configurações</Menu.Item>
                    </Menu>
                <Text bold fontSize="lg" marginLeft={5} color={"white"}>AMEM</Text>
            </Box>
            <Icon as={<MaterialIcons name={"notifications"} />} size={6} color="#bebebe" />
        </Box>
    );
}