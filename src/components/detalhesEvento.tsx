import React, { useEffect, useState } from "react";
import { AlertDialog, Box, Button, Divider, FormControl, HStack, Icon, Input, Pressable, ScrollView, Select, Spacer, Text, TextArea, Tooltip, useToast, VStack, WarningOutlineIcon } from "native-base";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onValue, ref, remove, update } from "firebase/database";
import { auth, db } from "../services/firebaseConfig";
import { MaterialIcons } from '@expo/vector-icons';
import showToast from "../util/showToast";
import errorTranslate from "../util/errorTranslate";
import useUserPermission from "../util/getPermission";

const DetalhesEvento = ({ route }: { route: any }) => {
    const { evento } = route.params;
    const userPermission = useUserPermission();
    const [nome, setNome] = useState(evento.nome);
    const [data, setData] = useState(evento.data);
    const [local, setLocal] = useState(evento.local);
    const [investimento, setInvestimento] = useState(evento.investimento);
    const [observacoes, setObservacoes] = useState(evento.observacoes);
    const [erros, setErros] = useState({});
    const navigation = useNavigation<any>();
    const [dadosDoacoes, setDoacoes] = useState<any>([]);
    const [dadosVoluntarios, setVoluntarios] = useState<any>([]);
    const [filtroDoacao, setFiltroDoacao] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroVoluntario, setFiltroVoluntario] = useState("");
    const toast = useToast();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isOpen2, setIsOpen2] = React.useState(false);
    const cancelRef = React.useRef(null);
    const cancelRef2 = React.useRef(null);

    const limparFiltrosDoacao = () => {
        setFiltroDoacao("");
        setFiltroTipo("");
    };

    const limparFiltrosVoluntario = () => {
        setFiltroVoluntario("");
    };

    useEffect(() => {
        const queryDoacoes = ref(db, "eventos/" + evento.id + "/doacoes/");

        onValue(queryDoacoes, (snapshot) => {
            const dataDoacoes = snapshot.val();

            if (dataDoacoes) {
                const novosUsuarios = Object.keys(dataDoacoes)
                
                .map(key => ({
                    id: key,
                    ...dataDoacoes[key]
                })).filter((doacao: { organizacao: any; material: any; tipo: any; }) => 
                    (filtroDoacao === "" || (doacao.organizacao.toLowerCase().includes(filtroDoacao.toLowerCase())) || doacao.material.toLowerCase().includes(filtroDoacao.toLowerCase())) && 
                    (filtroTipo === "" || doacao.tipo === filtroTipo)
                );
                setDoacoes(novosUsuarios);
            } else {
                setDoacoes([]);
            }
        });
    }, [filtroDoacao, filtroTipo]);

    useEffect(() => {
        const queryVoluntarios = ref(db, "eventos/" + evento.id + "/voluntarios/");

        onValue(queryVoluntarios, (snapshot) => {
            const dataVoluntarios = snapshot.val();

            if (dataVoluntarios) {
                const novosVoluntarios = Object.keys(dataVoluntarios)
                
                .map(key => ({
                    id: key,
                    ...dataVoluntarios[key]
                })).filter((voluntario: { nome: any; }) => 
                    (filtroVoluntario === "" || voluntario.nome.toLowerCase().includes(filtroVoluntario.toLowerCase())));
                setVoluntarios(novosVoluntarios);
            } else {
                setVoluntarios([]);
            }
        });
    }, [filtroVoluntario]);

    // Remove o registro do banco de dados.
    const excluirEvento = () => {
        remove(ref(db, 'eventos/' + evento.id))
        .then(() => {
            showToast(toast, "#404040", "O evento foi excluído com sucesso!");
            navigation.navigate("Controle de Eventos - AMEM");
        })
        .catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error));
        });
    };

    // Valida os campos do formulário através de expressões regulares.
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
            editarEvento();
        }
    };

    // Adiciona o registro no banco de dados.
    const editarEvento = () => {
        update(ref(db, 'eventos/' + evento.id), {
            nome: nome,
            data: data,
            local: local,
            investimento: investimento,
            observacoes: observacoes,
            status: "Planejado"
        }).then(() => {
            showToast(toast, "#404040", "O evento foi editado com sucesso!");
            navigation.navigate("Controle de Eventos - AMEM" as never);
        }).catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error));
        });
    };

    // Muda o status do evento no banco de dados.
    const encerrarEvento = () => {
        if(evento.status != "Encerrado"){
            update(ref(db, 'eventos/' + evento.id), {
                status: "Encerrado"
            }).then(() => {
                showToast(toast, "#404040", "O evento foi encerrado com sucesso!");
                navigation.navigate("Controle de Eventos - AMEM" as never);
            }).catch((error) => {
                showToast(toast, "#E11D48", errorTranslate(error));
            });
        } else {
            setIsOpen2(!isOpen2);
        }        
    };

    // Muda o status do evento no banco de dados.
    const ativarEvento = () => {
        update(ref(db, 'eventos/' + evento.id), {
            status: "Planejado"
        }).then(() => {
            showToast(toast, "#404040", "O evento foi redefinido como planejado!");
            navigation.navigate("Controle de Eventos - AMEM" as never);
        }).catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error));
        });      
    };

    return(
        <ScrollView contentContainerStyle={{width:'100%'}}>
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Pressable style={styles.box3} onPress={() => navigation.navigate("Controle de Eventos - AMEM")}>
                        <Icon as={MaterialIcons} name="navigate-before" size={25} color={"#818181"} />
                        <Text textAlign={"left"} bold fontSize={"3xl"}>Detalhes do Evento</Text>
                    </Pressable>
                </Box>
                <Box style={styles.box2}>
                    <FormControl isRequired isInvalid={'nome' in erros}>
                        <FormControl.Label>Nome:</FormControl.Label>
                        <Input value={nome} placeholder="Ex.: Ação de Graças" onChangeText={novoNome => setNome(novoNome)} backgroundColor={"white"} size={"lg"} />
                        {'nome' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.nome}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'data' in erros}>
                        <FormControl.Label>Data:</FormControl.Label>
                        <Input value={data} placeholder="Ex.: 02/08/1972" onChangeText={novaData => setData(novaData)} backgroundColor={"white"} size={"lg"}/>
                        {'data' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.data}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'local' in erros}>
                        <FormControl.Label>Local:</FormControl.Label>
                        <Input value={local} placeholder="Ex.: Capela São José" onChangeText={novoLocal => setLocal(novoLocal)} backgroundColor={"white"} size={"lg"}/>
                        {'local' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.local}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isRequired isInvalid={'investimento' in erros}>
                        <FormControl.Label>Investimento:</FormControl.Label>
                        <Input value={investimento} placeholder="Ex.: 1.080,00" onChangeText={novoInvestimento => setInvestimento(novoInvestimento)} backgroundColor={"white"} size={"lg"}/>
                        {'investimento' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.investimento}</FormControl.ErrorMessage>: ''
                        }
                    </FormControl>
                    <FormControl isInvalid={'observacoes' in erros}>
                        <FormControl.Label>Observações:</FormControl.Label>
                        <TextArea value={observacoes} onChangeText={novaObservacao => setObservacoes(novaObservacao)} backgroundColor={"white"} w="100%" h={100} autoCompleteType={undefined} />
                        {'observacoes' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.observacoes}</FormControl.ErrorMessage> : ''
                        }
                    </FormControl>
                    {userPermission == "editor" && evento.status != "Encerrado" || userPermission == "administrador" ? 
                    <Box flexDirection={"row"} mt={25}>
                        {userPermission == "administrador" ? 
                        <Tooltip label="Excluir" openDelay={500}>
                            <Button onPress={() => setIsOpen(!isOpen)} marginRight={2} leftIcon={<Icon as={MaterialIcons} name="delete"/>} size={"sm"} backgroundColor={"#E11D48"} _hover={{backgroundColor: "#BE123C"}}>Excluir</Button>
                        </Tooltip>
                        : null }
                        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={() => setIsOpen(false)}>
                            <AlertDialog.Content>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header>Excluir Evento</AlertDialog.Header>
                            <AlertDialog.Body>
                                Você tem certeza que deseja excluir o evento? Esta ação não poderá ser revertida.
                            </AlertDialog.Body>
                            <AlertDialog.Footer>
                                <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="coolGray" onPress={() => setIsOpen(false)} ref={cancelRef}>
                                    Cancelar
                                </Button>
                                <Button colorScheme="danger" onPress={excluirEvento}>
                                    Excluir
                                </Button>
                                </Button.Group>
                            </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog>
                        <Tooltip label="Salvar" openDelay={500}>
                            <Button onPress={validarEvento} marginRight={2} leftIcon={<Icon as={MaterialIcons} name="save" />} size={"sm"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}}>Salvar</Button>
                        </Tooltip>
                        <Tooltip label="Encerrar" openDelay={500}>
                            <Button onPress={encerrarEvento} marginRight={2} leftIcon={<Icon as={MaterialIcons} name="done" />} size={"sm"} backgroundColor={"#16A34A"} _hover={{backgroundColor: "green.700"}}>Encerrar</Button>
                        </Tooltip>
                        <AlertDialog leastDestructiveRef={cancelRef2} isOpen={isOpen2} onClose={() => setIsOpen2(false)}>
                            <AlertDialog.Content>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header>Planejar Evento</AlertDialog.Header>
                            <AlertDialog.Body>
                                Este evento está definido como encerrado. Você deseja defini-lo como planejado novamente?
                            </AlertDialog.Body>
                            <AlertDialog.Footer>
                                <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="coolGray" onPress={() => setIsOpen2(false)} ref={cancelRef2}>
                                    Cancelar
                                </Button>
                                <Button backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} onPress={ativarEvento}>
                                    Definir
                                </Button>
                                </Button.Group>
                            </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog>
                    </Box> : null}
                </Box>
                <Box style={styles.box1}>
                    <Text textAlign={"left"} bold fontSize={"xl"}>Doações</Text>
                    <Divider mt={2} mb={4}/>
                    {userPermission == "editor" && evento.status != "Encerrado" || userPermission == "administrador" ? 
                        <Button onPress={() => navigation.navigate("Registrar Doação - AMEM", { evento: evento })} leftIcon={<Icon as={MaterialIcons} name="add" />} size={"sm"} backgroundColor={"#16A34A"} _hover={{backgroundColor: "green.700"}}>Registrar Doação</Button>
                    : null }
                </Box>
                <Box flexDir={"row"} mb={2}>
                    <Input flex={2} mr={2} backgroundColor={"white"} InputRightElement={<Icon as={MaterialIcons} name="search" color={"#bebebe"} mr={2} />} value={filtroDoacao} onChangeText={(text) => setFiltroDoacao(text)} placeholder="Filtrar pelo material/organização..." size="md"/>
                    <Select dropdownIcon={<Icon as={MaterialIcons} name="keyboard-arrow-down" color={"#bebebe"} mr={2} />} flex={1} mr={2} backgroundColor={"white"} size={"md"} selectedValue={filtroTipo} placeholder="Filtrar pelo tipo..." onValueChange={(itemValue) => setFiltroTipo(itemValue)}>
                        <Select.Item label="Todos" value="" />
                        <Select.Item label="Efetuada" value="efetuada" />
                        <Select.Item label="Recebida" value="recebida" />
                    </Select>
                    <Tooltip label="Limpar filtros" openDelay={500}>
                        <Button onPress={limparFiltrosDoacao} leftIcon={<Icon as={MaterialIcons} name="restart-alt" />} size={"sm"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} />
                    </Tooltip>
                </Box>
                <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"} rounded={5} marginBottom={25}>
                    {dadosDoacoes.length !== 0 ? dadosDoacoes.map((item: any, index: any) => (
                        <Pressable key={index} onPress={() => navigation.navigate("Detalhes da Doação - AMEM", { evento: evento, doacao: item })}>
                            {({
                                isHovered
                            }) => {
                                return (
                                    <Box bg={isHovered ? "coolGray.100" : null} rounded={isHovered ? 5 : 0} key={index} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py="2" pl="4" pr={5}>
                                        <HStack space={[2, 3]} justifyContent="space-between" alignItems={"center"}>
                                            <VStack>
                                                <Text bold>
                                                    {item.organizacao}
                                                </Text>
                                                <Text> 
                                                    {item.quantidade} {item.unidade} {item.material}.
                                                </Text>
                                            </VStack>
                                            <Spacer />
                                            {item.tipo == "efetuada" ? <Icon as={<MaterialIcons name={"arrow-circle-right"} />} size={5} color="#E11D48" /> : <Icon as={<MaterialIcons name={"arrow-circle-left"} />} size={5} color="#16A34A" />}
                                        </HStack>
                                    </Box>
                                );
                            }}
                        </Pressable>
                    )) : <Text py="2" px="4">Não há doações.</Text>}
                </Box>
                <Box style={styles.box1}>
                    <Text textAlign={"left"} bold fontSize={"xl"}>Voluntários</Text>
                    <Divider mt={2} mb={4}/>
                    {userPermission == "editor" && evento.status != "Encerrado" || userPermission == "administrador" ? 
                        <Button onPress={() => navigation.navigate("Registrar Voluntário - AMEM", { evento: evento })} leftIcon={<Icon as={MaterialIcons} name="add" />} size={"sm"} backgroundColor={"#16A34A"} _hover={{backgroundColor: "green.700"}}>Registrar Voluntário</Button>
                    : null }
                </Box>
                <Box flexDir={"row"} mb={2}>
                    <Input flex={2} mr={2} backgroundColor={"white"} InputRightElement={<Icon as={MaterialIcons} name="search" color={"#bebebe"} mr={2} />} value={filtroVoluntario} onChangeText={(text) => setFiltroVoluntario(text)} placeholder="Filtrar pelo nome..." size="md"/>
                    <Tooltip label="Limpar filtros" openDelay={500}>
                        <Button onPress={limparFiltrosVoluntario} leftIcon={<Icon as={MaterialIcons} name="restart-alt" />} size={"sm"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} />
                    </Tooltip>
                </Box>
                <Box borderWidth={1} borderColor={"#D4D4D4"} backgroundColor={"#fff"} rounded={5}>
                    {dadosVoluntarios.length !== 0 ? dadosVoluntarios.map((item: any, index: any) => (
                        <Pressable key={index} onPress={() => navigation.navigate("Detalhes do Voluntário - AMEM", { evento: evento, voluntario: item })}>
                            {({
                                isHovered
                            }) => {
                                return (
                                    <Box bg={isHovered ? "coolGray.100" : null} rounded={isHovered ? 5 : 0} key={index} borderBottomWidth={1} borderBottomColor={"#D4D4D4"} py="2" pl="4" pr={5}>
                                        <HStack space={[2, 3]} justifyContent="space-between" alignItems={"center"}>
                                            <VStack>
                                                <Text bold>
                                                    {item.nome}
                                                </Text>
                                                <Text >
                                                    {item.horas} hora(s).
                                                </Text>
                                            </VStack>
                                            <Spacer />
                                            <Icon as={<MaterialIcons name={"timer"} />} size={5} color="#bebebe" />
                                        </HStack>
                                    </Box>
                                );
                            }}
                        </Pressable>
                    )) : <Text py="2" px="4">Não há voluntários.</Text>}
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
        flexWrap: "wrap",
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

export default DetalhesEvento;