import React from "react";
import { Box, Button, Checkbox, Input, ScrollView, Text, TextArea } from "native-base";

export default function CadastrarEvento(){
    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box padding={50}>
                <Text textAlign={"center"} bold fontSize={"3xl"}>Cadastrar Evento</Text>
                <Text textAlign={"center"} fontSize={"xl"} marginBottom={50}>Por gentileza, preencha os campos abaixo para cadastrar um novo evento.</Text>
                <Text alignSelf={"flex-start"} marginBottom={1}>Nome do Evento:</Text>
                <Input marginBottom={2} _hover={{borderColor: "#bebebe"}} focusOutlineColor={"#bebebe"} backgroundColor={"white"} size={"xl"} placeholder="Ex.: Ação de Graças" w="100%" />
                <Text alignSelf={"flex-start"} marginBottom={1}>Data do Evento:</Text>
                <Input _hover={{borderColor: "#bebebe"}} focusOutlineColor={"#bebebe"} marginBottom={2} backgroundColor={"white"} size={"xl"} placeholder="Ex.: 02/08/1972" w="100%" />
                <Text alignSelf={"flex-start"} marginBottom={1}>Local do Evento:</Text>
                <Input _hover={{borderColor: "#bebebe"}} focusOutlineColor={"#bebebe"} marginBottom={2} backgroundColor={"white"} size={"xl"} placeholder="Ex.: Capela São José" w="100%" />
                <Text alignSelf={"flex-start"} marginBottom={1}>Investimento Inicial:</Text>
                <Input _hover={{borderColor: "#bebebe"}} focusOutlineColor={"#bebebe"} keyboardType="number-pad" marginBottom={2} backgroundColor={"white"} size={"xl"} placeholder="Ex.: R$ 1.080,00" w="100%" />
                <Text alignSelf={"flex-start"} marginBottom={1}>Setores Envolvidos:</Text>
                <Checkbox.Group flexDirection={"row"} flexWrap={"wrap"} marginBottom={2} accessibilityLabel="choose values">
                    <Checkbox _checked={{bgColor: "#1C3D8C", borderColor:"#1C3D8C"}} value="one" mr={4}>Comercial</Checkbox>
                    <Checkbox _checked={{bgColor: "#1C3D8C", borderColor:"#1C3D8C"}} value="two" mr={4}>Financeiro</Checkbox>
                    <Checkbox _checked={{bgColor: "#1C3D8C", borderColor:"#1C3D8C"}} value="three" mr={4}>Reitoria</Checkbox>
                    <Checkbox _checked={{bgColor: "#1C3D8C", borderColor:"#1C3D8C"}} value="four" mr={4}>Secretaria</Checkbox>
                </Checkbox.Group>
                <Text alignSelf={"flex-start"} marginBottom={1}>Observações:</Text>
                <TextArea _hover={{borderColor: "#bebebe"}} focusOutlineColor={"#bebebe"} marginBottom={25} backgroundColor={"white"} w="100%" h={100} autoCompleteType={undefined} />
                <Box flexDirection={"row"}>
                    <Button size={"lg"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} flex={1} marginRight={1} onPress={() => console.log("hello world")}>Cadastrar</Button>
                    <Button size={"lg"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} flex={1} marginRight={1} onPress={() => console.log("hello world")}>Limpar</Button>
                </Box>
            </Box>
        </ScrollView>
    );
}