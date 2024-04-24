import React from "react";
import { Box, Link, Text, Image } from "native-base";

export default function Footer(){
    var ano = new Date().getFullYear();

    return(
        <Box backgroundColor="#000" padding={3} flexDirection="row" w="100%">
            <Text textAlign="left" flex="1" color="#fff">Universidade La Salle &copy; {ano}</Text>
            <Text textAlign="right" flex="1" color="#fff">Desenvolvido por <Link isUnderlined={false} isExternal _text={{color: "white"}} href="https://www.linkedin.com/in/pedroh-silveira/" _hover={{_text: {color: "#2867B2"}}}>Pedro Silveira <Image alignSelf={"center"} source={require("./../media/5296501_linkedin_network_linkedin logo_icon.png")} alt="LinkedIn" size={4} /></Link></Text>
        </Box>
    );
};