import { Box, Icon, ScrollView, Text } from "native-base";
import { FontAwesome } from '@expo/vector-icons';
import React from "react";

export default function ConsultarEvento(){
    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box margin={25} flexDirection={"row"} alignItems={"center"}>
                <Icon mr={1} color="#000" as={FontAwesome} name="home" />
                <Text>Painel de Controle</Text>
            </Box>
            <Box padding={50}>
                <Text textAlign={"left"} bold fontSize={"3xl"}>Painel de Controle</Text>
            </Box>
        </ScrollView>
    );
}