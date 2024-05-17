import React, { useEffect, useState, useRef } from "react";
import { StyleSheet } from "react-native";
import { Box, Button, Checkbox, FormControl, HStack, Icon, Input, Pressable, ScrollView, Spacer, Text, TextArea, Tooltip, useToast, VStack, WarningOutlineIcon } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { db } from "../services/firebaseConfig";
import { ref, push, onValue } from "firebase/database";
import showToast from "../util/showToast";
import { MaterialIcons } from '@expo/vector-icons';
import errorTranslate from "../util/errorTranslate";
import sendMail from "../util/sendMail";

const styles = StyleSheet.create({
    boxCentral: {
        padding: 50
    },
    box1: {
        marginBottom: 25
    },
    box2: {
        flexDirection: "row",
        alignItems: "center"
    }
});

const CadastrarEvento = () => {
    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [local, setLocal] = useState('');
    const [investimento, setInvestimento] = useState('');
    const [usuarios, setUsuarios] =  useState<string[]>([]);
    const [observacoes, setObservacoes] = useState('');
    const [filtroUsuario, setFiltroUsuario] = useState("");
    const [erros, setErros] = useState({});
    const navigation = useNavigation();
    const toast = useToast();

    const nomeRef = useRef(null);
    const dataRef = useRef(null);
    const localRef = useRef(null);
    const investimentoRef = useRef(null);
    const observacoesRef = useRef(null);

    const handleKeyPress = (event: any, nextRef: any) => {
        if (event.nativeEvent.key === 'Enter') {
            if (nextRef) {
                nextRef.current.focus();
            } else {
                validarEvento();
            }
        }
    };

    const limparFiltros = () => {
        setFiltroUsuario("");
    };

    const listaCheckbox = (id: string) => {
        if (usuarios.includes(id)) {
            setUsuarios(usuarios.filter(item => item !== id));
        } else {
            setUsuarios([...usuarios, id]);
        }
    };

    const limpar = () => {
        setNome('');
        setData('');
        setLocal('');
        setInvestimento('');
        setObservacoes('');
        setErros({});
    };

    const buscarUsuarios = () => {
        const [dados, setDados] = useState<any>([]);
    
        useEffect(() => {
            const query = ref(db, "usuarios/");

            onValue(query, (snapshot) => {
                const data = snapshot.val();

                if (data) {
                    const novosUsuarios = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }))
                    .filter((usuario: { nome: any; email: any; }) => 
                        (filtroUsuario === "" || (usuario.nome.toLowerCase().includes(filtroUsuario.toLowerCase())) || usuario.email.toLowerCase().includes(filtroUsuario.toLowerCase()))
                    )
                    .sort((a, b) => {
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
            });
        }, [filtroUsuario]);
    
        return (
            <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"} rounded={5}>
                {dados.length !== 0 ? dados.map((item: { nome: any; email: any; }, index: any) => (
                    <Box key={index} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py="2" pl="4" pr={5}>
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
                            <Checkbox onChange={() => listaCheckbox(item.email)} _checked={{ bgColor: "#1C3D8C", borderColor: "#1C3D8C" }} value={item.email} />
                        </HStack>
                    </Box>
                )) : <Text py="2" px="4">Não há usuários.</Text>}
            </Box>
        );
    };

    const validarEvento = () => {
        const nomeRegex = new RegExp(/^[^\s].*$/);
        const dataRegex = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);
        const investimentoRegex = new RegExp(/^(?:0|[1-9]\d{0,2}(?:\.\d{3})*(?:,\d{1,2})?|,\d{1,2})$/);
        let erros = 0;

        setErros({});

        if (!nomeRegex.test(nome)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                nome: 'O nome inserido é inválido.',
            }));

            erros++;
        }

        if (!dataRegex.test(data)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                data: 'A data precisa seguir o formato dd/mm/aaaa.',
            }));

            erros++;
        }

        if (!nomeRegex.test(local)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                local: 'O nome do local inserido é inválido.',
            }));

            erros++;
        }

        if (!investimentoRegex.test(investimento)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                investimento: 'O valor precisa seguir o padrão do real brasileiro, assim como 1.234,56.',
            }));

            erros++;
        }

        if ( erros == 0 ) {
            adicionarEvento();
        }
    };

    const adicionarEvento = () => {
        push(ref(db, 'eventos/'), {
            nome: nome,
            data: data,
            local: local,
            investimento: investimento,
            observacoes: observacoes,
            status: "Planejado"
        }).then(() => {
            sendMail(usuarios, "Novo Evento: " + nome, "Olá, Prezado(s)! \n\nA pastoral universitária informa que o evento " + nome + " está sendo planejado para ocorrer no dia " + data + ". Sendo assim, solicitamos a provisão dos seguintes recursos:\n\nLocal do evento: " + local + "\nInvestimento Inicial: " + investimento + "\nObservações: " + observacoes + "\n\nAguardo retorno!");
            showToast(toast, "#404040", "O evento foi cadastrado com sucesso!");
            navigation.navigate("Controle de Eventos - AMEM" as never);
        }).catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error));
        });
    };

    return (
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Pressable style={styles.box2} onPress={() => navigation.navigate("Controle de Eventos - AMEM" as never)}>
                        <Icon as={MaterialIcons} name="navigate-before" size={25} color={"#818181"} />
                        <Text textAlign={"left"} bold fontSize={"3xl"}>Cadastrar Evento</Text>
                    </Pressable>
                    <Text textAlign={"left"} fontSize={"lg"}>Preencha os campos abaixo para cadastrar um novo evento.</Text>
                </Box>
                <Box style={styles.box1}>
                    <FormControl isRequired isInvalid={'nome' in erros}>
                        <FormControl.Label>Nome:</FormControl.Label>
                        <Input 
                            ref={nomeRef}
                            value={nome} 
                            placeholder="Ex.: Ação de Graças" 
                            onChangeText={novoNome => setNome(novoNome)} 
                            backgroundColor={"white"} 
                            size={"lg"} 
                            onKeyPress={(e) => handleKeyPress(e, dataRef)}
                        />
                        {'nome' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.nome}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'data' in erros}>
                        <FormControl.Label>Data:</FormControl.Label>
                        <Input 
                            ref={dataRef}
                            value={data} 
                            placeholder="Ex.: 02/08/1972" 
                            onChangeText={novaData => setData(novaData)} 
                            backgroundColor={"white"} 
                            size={"lg"}
                            onKeyPress={(e) => handleKeyPress(e, localRef)}
                        />
                        {'data' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.data}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'local' in erros}>
                        <FormControl.Label>Local:</FormControl.Label>
                        <Input 
                            ref={localRef}
                            value={local} 
                            placeholder="Ex.: Capela São José" 
                            onChangeText={novoLocal => setLocal(novoLocal)} 
                            backgroundColor={"white"} 
                            size={"lg"}
                            onKeyPress={(e) => handleKeyPress(e, investimentoRef)}
                        />
                        {'local' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.local}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'investimento' in erros}>
                        <FormControl.Label>Investimento:</FormControl.Label>
                        <Input 
                            ref={investimentoRef}
                            value={investimento} 
                            placeholder="Ex.: 1.080,00" 
                            onChangeText={novoInvestimento => setInvestimento(novoInvestimento)} 
                            backgroundColor={"white"} 
                            size={"lg"}
                            onKeyPress={(e) => handleKeyPress(e, observacoesRef)}
                        />
                        {'investimento' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.investimento}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isInvalid={'observacoes' in erros}>
                        <FormControl.Label>Observações:</FormControl.Label>
                        <TextArea 
                            ref={observacoesRef}
                            value={observacoes} 
                            onChangeText={novaObservacao => setObservacoes(novaObservacao)} 
                            backgroundColor={"white"} 
                            w="100%" 
                            h={100} 
                            autoCompleteType={undefined}
                        />
                        {'observacoes' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.observacoes}</FormControl.ErrorMessage> : ''
                        }
                    </FormControl>
                    <FormControl isInvalid={'usuarios' in erros}>
                        <FormControl.Label>Encaminhar para:</FormControl.Label>
                        <Box flexDir={"row"} mb={2}>
                            <Input flex={2} mr={2} backgroundColor={"white"} InputRightElement={<Icon as={MaterialIcons} name="search" color={"#bebebe"} mr={2} />} value={filtroUsuario} onChangeText={(text) => setFiltroUsuario(text)} placeholder="Filtrar pelo nome/e-mail..." size="md"/>
                            <Tooltip label="Limpar filtros" openDelay={500}>
                                <Button onPress={limparFiltros} leftIcon={<Icon as={MaterialIcons} name="restart-alt" />} size={"sm"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} />
                            </Tooltip>
                        </Box>
                        {buscarUsuarios()}
                    </FormControl>
                </Box>
                <Box flexDirection={"row"}>
                    <Button size={"lg"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} flex={1} marginRight={1} onPress={validarEvento}>Cadastrar</Button>
                    <Button size={"lg"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} flex={1} marginLeft={1} onPress={limpar}>Limpar</Button>
                </Box>
            </Box>
        </ScrollView>
    );
};

export default CadastrarEvento;
