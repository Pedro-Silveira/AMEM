export default function errorTranslate(erro: any){
    switch (erro) {
        case 'auth/email-already-in-use':
            return 'Já existe uma conta registrada com o endereço de e-mail inserido.';
        case 'auth/invalid-email':
            return 'O endereço de e-mail inserido é inválido.';
        case 'auth/missing-password':
            return 'Você não informou a senha.';
        case 'auth/invalid-credential':
            return 'As credenciais inseridas são inválidas.';
        case 'auth/weak-password':
            return 'A senha inserida é muito fraca.';
        case 'auth/operation-not-allowed':
            return 'Operação não permitida. Informe um administrador!';
        case 'auth/user-disabled':
            return 'Esta conta de usuário foi desativada por um administrador.';
        case 'auth/user-not-found':
            return 'Não há um usuário registrado com as credenciais informadas.';
        case 'auth/wrong-password':
            return 'A senha informada é incorreta.';
        case 'auth/too-many-requests':
            return 'Houveram muitas tentativas de login sem sucesso. Tente novamente mais tarde.';
        case 'auth/invalid-display-name':
            return 'O nome inserido é inválido.';
        case 'auth/network-request-failed':
            return 'Falha na requisição de rede. Verifique sua conexão com a Internet.';
        case 'PERMISSION_DENIED':
            return 'Você não tem permissão para realizar esta operação.';
        case 'DISCONNECTED':
            return 'Você está desconectado. Verifique sua conexão com a Internet.';
        case 'OVER_QUOTA':
            return 'O banco de dados atingiu a cota máxima permitida. Informe um administrador!';
        default:
            return 'Ocorreu um erro. Por favor, tente novamente.';
    };
};