import { Box, ScrollView, Text } from "native-base";
import React from "react";

export default function ConsultarEvento({navigation}: any){
    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box padding={50} flex={1}>
                <Text textAlign={"left"} bold fontSize={"3xl"}>Painel de Controle</Text>
            </Box>
        </ScrollView>
    );
}