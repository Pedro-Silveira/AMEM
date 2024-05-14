export default function calcularDias(data: any) {
    const [dia, mes, ano] = data.split('/');
    const dataFormatada = `${mes}/${dia}/${ano}`;
    var dataEvento = new Date(dataFormatada).getTime();
    var dias = Math.round((dataEvento - new Date().getTime()) / (1000 * 3600 * 24));

    if (dias < 30 && dias >= 0) {
        return new Intl.DateTimeFormat("pt-BR").format(dataEvento) + " - Falta(m) " + dias + " dia(s) para o evento!";
    }

    return new Intl.DateTimeFormat("pt-BR").format(dataEvento);
};