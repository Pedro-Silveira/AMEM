import React, { useEffect, useState, useRef } from "react";
import { StyleSheet } from "react-native";
import { Box, Button, Checkbox, FormControl, HStack, Icon, Input, Modal, Pressable, ScrollView, Skeleton, Text, TextArea, Tooltip, useClipboard, useToast, VStack, WarningOutlineIcon } from "native-base";
import { db } from "../services/firebaseConfig";
import { ref, push, onValue } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import showToast from "../util/showToast";
import errorTranslate from "../util/errorTranslate";
import sendMail from "../util/sendMail";
import showLoading from "../util/showLoading";

const CadastrarEvento = () => {
    // Fixas
    const navigation = useNavigation<any>();
    const toast = useToast();
    const { onCopy } = useClipboard();

    // Variáveis
    const [carregando, setCarregando] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [erros, setErros] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);

    // Gets & Sets
    const [nome, setNome] = useState('');
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [local, setLocal] = useState('');
    const [investimento, setInvestimento] = useState('');
    const [usuarios, setUsuarios] =  useState<string[]>([]);
    const [observacoes, setObservacoes] = useState('');
    const [filtroUsuario, setFiltroUsuario] = useState("");

    // Refs
    const nomeRef = useRef(null);
    const dataInicialRef = useRef(null);
    const dataFinalRef = useRef(null);
    const localRef = useRef(null);
    const investimentoRef = useRef(null);
    const observacoesRef = useRef(null);

    // Muda o foco do formulário ao pressionar enter.
    const mudarRef = (evento: any, proximaRef: any) => {
        if (evento.nativeEvent.key === "Enter") {
            if (proximaRef) {
                proximaRef.current.focus();
            } else {
                validarEvento();
            }
        }
    };

    // Formata a data conforme o usuário digita.
    const formatarData = (valor: any, tipo: any) => {
        const novaData = valor.replace(/\D/g, "");

        if (novaData.length <= 8) {
            const dataFormatada = novaData.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");

            if (tipo == 'I') {
                setDataInicial(dataFormatada);
            } else {
                setDataFinal(dataFormatada);
            }
            
        } else {
            if (tipo == 'I') {
                setDataInicial(valor);
            } else {
                setDataFinal(valor);
            }
        }
    };

    // Formata o investimento conforme o usuário digita.
    const formatarInvestimento = (valor: any) => {
        const novoInvestimento = valor.replace(/[^\d]/g, "");
        const numeroInvestimento = parseInt(novoInvestimento, 10) / 100 || 0;

        setInvestimento(numeroInvestimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    };

    // Adiciona usuários na lista ao marcar o checkbox.
    const listaCheckbox = (id: string) => {
        if (usuarios.includes(id)) {
            setUsuarios(usuarios.filter(item => item !== id));
        } else {
            setUsuarios([...usuarios, id]);
        }
    };

    // Limpa os campos de filtro.
    const limparFiltros = () => {
        setFiltroUsuario("");
    };

    // Limpa os campos do formulário.
    const limpar = () => {
        setNome('');
        setDataInicial('');
        setDataFinal('');
        setLocal('');
        setInvestimento('');
        setObservacoes('');
        setErros({});
    };

    // Busca todos os usuários no banco de dados.
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
                    })).filter((usuario: { nome: any; email: any; }) => 
                        (filtroUsuario === "" || (usuario.nome.toLowerCase().includes(filtroUsuario.toLowerCase())) || usuario.email.toLowerCase().includes(filtroUsuario.toLowerCase()))
                    ).sort((a, b) => {
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

                setCarregando(false);
            });
        }, [filtroUsuario]);

        if (carregando) {
            return (<Skeleton.Text lines={2} p={4} />);
        }
    
        return (
            dados.length !== 0 ? dados.map((item: { nome: any; email: any; }, index: any) => (
                <Box key={index} style={styles.boxUsuario}>
                    <HStack style={styles.hstackUsuario} paddingX={3} paddingY={2}>
                        <VStack>
                            <Text bold>{item.nome}</Text>
                            <Text>{item.email}</Text>
                        </VStack>
                        <Checkbox value={item.email} onChange={() => listaCheckbox(item.email)} _checked={{ bgColor: "#1C3D8C" }} />
                    </HStack>
                </Box>
            )) : <Text py={2} px={4}>Não há usuários.</Text>
        );
    };

    // Valida o evento com base em expressões regulares.
    const validarEvento = () => {
        const nomeRegex = new RegExp(/^[^\s].*$/);
        const dataRegex = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);
        const investimentoRegex = new RegExp(/^R\$\s(?:0|[0-9]\d{0,2}(?:\.\d{3})*(?:,\d{1,2})?|,\d{1,2})$/);
        let erros = 0;

        setErros({});

        if (!nomeRegex.test(nome)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                nome: 'O nome inserido é inválido.',
            }));

            erros++;
        }

        if (!dataRegex.test(dataInicial)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                dataInicial: 'A data precisa seguir o formato dd/mm/aaaa.',
            }));

            erros++;
        }

        if (!dataRegex.test(dataFinal)){
            setErros(errosAnteriores => ({
                ...errosAnteriores,
                dataFinal: 'A data precisa seguir o formato dd/mm/aaaa.',
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
            setShowModal(true);
        }
    };

    // Adiciona o registro no banco de dados.
    const adicionarEvento = (tipo: any) => {
        setUploading(true);

        push(ref(db, 'eventos/'), {
            nome: nome,
            dataInicial: dataInicial,
            dataFinal: dataFinal,
            local: local,
            investimento: investimento,
            observacoes: observacoes,
            status: "Planejado"
        }).then(() => {
            tipo == 'E' ?
                sendMail(usuarios, "Novo Evento: " + nome, "Olá, Prezado(s)! \n\nA pastoral universitária informa que o evento " + nome + " está sendo planejado para ocorrer entre os dias " + dataInicial + " e " + dataFinal + ". Sendo assim, solicitamos a provisão dos seguintes recursos:\n\nLocal do evento: " + local + "\nInvestimento Inicial: " + investimento + "\nObservações: " + observacoes + "\n\nAguardo retorno!")
            : null;

            showToast(toast, "#404040", "O evento foi cadastrado com sucesso!");
            navigation.navigate("Controle de Eventos - AMEM");
        }).catch((error) => {
            showToast(toast, "#E11D48", errorTranslate(error));
        }).finally(() => {
            setUploading(false);
        });
    };

    return (
        <ScrollView contentContainerStyle={{width:'100%'}}>
            {showLoading(uploading, () => setUploading(false))}
            <Box style={styles.boxCentral}>
                <Box style={styles.box1}>
                    <Pressable style={styles.box2} onPress={() => navigation.navigate("Controle de Eventos - AMEM")}>
                        <Icon as={MaterialIcons} name="navigate-before" size={25} color={"#818181"} />
                        <Text bold fontSize={"3xl"} textAlign={"left"}>Cadastrar Evento</Text>
                    </Pressable>
                    <Text fontSize={"lg"} textAlign={"left"}>Preencha os campos abaixo para cadastrar um novo evento.</Text>
                </Box>
                <Box style={styles.box1}>
                    <FormControl isRequired isInvalid={'nome' in erros}>
                        <FormControl.Label>Nome:</FormControl.Label>
                        <Input autoFocus ref={nomeRef} value={nome} placeholder="Ex.: Ação de Graças" size={"lg"} backgroundColor={"white"} onChangeText={novoNome => setNome(novoNome)} onKeyPress={(tecla) => mudarRef(tecla, dataInicialRef)} />
                        {'nome' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.nome}</FormControl.ErrorMessage>
                        : null }
                    </FormControl>
                    <FormControl isRequired isInvalid={'dataInicial' in erros}>
                        <FormControl.Label>Data Inicial:</FormControl.Label>
                        <Input ref={dataInicialRef} value={dataInicial} placeholder="Ex.: 02/08/1972" size={"lg"} backgroundColor={"white"} onChangeText={novaDataInicial => formatarData(novaDataInicial, 'I')} onKeyPress={(tecla) => mudarRef(tecla, dataFinalRef)} />
                        {'dataInicial' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.dataInicial}</FormControl.ErrorMessage>
                        : null }
                    </FormControl>
                    <FormControl isRequired isInvalid={'dataFinal' in erros}>
                        <FormControl.Label>Data Final:</FormControl.Label>
                        <Input ref={dataFinalRef} value={dataFinal} placeholder="Ex.: 09/07/2024" size={"lg"} backgroundColor={"white"} onChangeText={novaDataFinal => formatarData(novaDataFinal, 'F')} onKeyPress={(tecla) => mudarRef(tecla, localRef)} />
                        {'dataFinal' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.dataFinal}</FormControl.ErrorMessage>
                        : null }
                    </FormControl>
                    <FormControl isRequired isInvalid={'local' in erros}>
                        <FormControl.Label>Local:</FormControl.Label>
                        <Input ref={localRef} value={local} placeholder="Ex.: Capela São José" size={"lg"} backgroundColor={"white"} onChangeText={novoLocal => setLocal(novoLocal)} onKeyPress={(tecla) => mudarRef(tecla, investimentoRef)} />
                        {'local' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.local}</FormControl.ErrorMessage>
                        : null }
                    </FormControl>
                    <FormControl isRequired isInvalid={'investimento' in erros}>
                        <FormControl.Label>Investimento:</FormControl.Label>
                        <Input ref={investimentoRef} value={investimento} placeholder="Ex.: 1.080,00" size={"lg"} backgroundColor={"white"} onChangeText={novoInvestimento => formatarInvestimento(novoInvestimento)} onKeyPress={(tecla) => mudarRef(tecla, observacoesRef)} />
                        {'investimento' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.investimento}</FormControl.ErrorMessage>
                        : null}
                    </FormControl>
                    <FormControl isInvalid={'observacoes' in erros}>
                        <FormControl.Label>Observações:</FormControl.Label>
                        <TextArea ref={observacoesRef} value={observacoes} w={"100%"} h={100} backgroundColor={"white"} autoCompleteType={undefined} onChangeText={novaObservacao => setObservacoes(novaObservacao)} onKeyPress={(tecla) => mudarRef(tecla, null)} />
                        {'observacoes' in erros ?
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{erros.observacoes}</FormControl.ErrorMessage>
                        : null}
                    </FormControl>
                    <FormControl isInvalid={'usuarios' in erros}>
                        <FormControl.Label>Encaminhar para:</FormControl.Label>
                        <Box flexDir={"row"} mb={2}>
                            <Input value={filtroUsuario} onChangeText={(text) => setFiltroUsuario(text)} InputRightElement={<Icon as={MaterialIcons} name="search" color={"#bebebe"} mr={2} />} flex={2} size={"md"} placeholder={"Filtrar pelo nome/e-mail..."} mr={2} backgroundColor={"white"} />
                            <Tooltip label="Limpar filtros" openDelay={500}>
                                <Button onPress={limparFiltros} leftIcon={<Icon as={MaterialIcons} name="restart-alt" />} size={"sm"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} />
                            </Tooltip>
                        </Box>
                        <Box backgroundColor={"#fff"} borderWidth={1} borderColor={"#D4D4D4"} rounded={5}>
                            {buscarUsuarios()}
                        </Box>
                    </FormControl>
                </Box>
                <Box flexDirection={"row"}>
                    <Button size={"lg"} backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} flex={1} marginRight={1} onPress={validarEvento}>Cadastrar</Button>
                    <Button size={"lg"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} flex={1} marginLeft={1} onPress={limpar}>Limpar</Button>
                </Box>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Enviar e-mail?</Modal.Header>
                        <Modal.Body>
                            <Text mb={3}>Envie um e-mail para os usuários envolvidos ou apenas cadastre o evento.</Text>
                            <Box flexDir={"row"} mb={2}>
                                <Input flex={1} size={"sm"} mr={2} isDisabled value={usuarios.toString()} />
                                <Tooltip label="Copiar" openDelay={500}>
                                    <Button onPress={() => onCopy(usuarios.toString())} leftIcon={<Icon as={MaterialIcons} name="content-copy" />} size={"sm"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} />
                                </Tooltip>
                            </Box>
                            <Box flexDir={"row"} mb={2}>
                                <Input flex={1} size={"sm"} mr={2} isDisabled value={"Novo Evento: " + nome} />
                                <Tooltip label="Copiar" openDelay={500}>
                                    <Button onPress={() => onCopy("Novo Evento: " + nome)} leftIcon={<Icon as={MaterialIcons} name="content-copy" />} size={"sm"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} />
                                </Tooltip>
                            </Box>
                            <Box flexDir={"row"} mb={3}>
                                <TextArea flex={1} size={"sm"} mr={2} isDisabled value={"Olá, Prezado(s)! \n\nA pastoral universitária informa que o evento " + nome + " está sendo planejado para ocorrer entre os dias " + dataInicial + " e " + dataFinal + ". Sendo assim, solicitamos a provisão dos seguintes recursos:\n\nLocal do evento: " + local + "\nInvestimento Inicial: " + investimento + "\nObservações: " + observacoes + "\n\nAguardo retorno!"} autoCompleteType={undefined} />
                                <Tooltip label="Copiar" openDelay={500}>
                                    <Button onPress={() => onCopy("Olá, Prezado(s)! \n\nA pastoral universitária informa que o evento " + nome + " está sendo planejado para ocorrer entre os dias " + dataInicial + " e " + dataFinal + ". Sendo assim, solicitamos a provisão dos seguintes recursos:\n\nLocal do evento: " + local + "\nInvestimento Inicial: " + investimento + "\nObservações: " + observacoes + "\n\nAguardo retorno!")} leftIcon={<Icon as={MaterialIcons} name="content-copy" />} size={"sm"} backgroundColor={"#bebebe"} _hover={{backgroundColor: "#A6A6A6"}} />
                                </Tooltip>
                            </Box>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button backgroundColor={"#16A34A"} _hover={{backgroundColor: "green.700"}} onPress={() => {adicionarEvento('E')}}>Enviar E-mail</Button>
                                <Button backgroundColor={"#1C3D8C"} _hover={{backgroundColor: "#043878"}} onPress={() => {adicionarEvento('C')}}>Cadastrar</Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </Box>
        </ScrollView>
    );
};

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
    },
    boxUsuario: {
        borderBottomWidth: 1,
        borderBottomColor: "#D4D4D4",
        paddingVertical: 2,
        paddingLeft: 4,
        paddingRight: 5
    },
    hstackUsuario: {
        justifyContent: "space-between",
        alignItems: "center"
    }
});

export default CadastrarEvento;
