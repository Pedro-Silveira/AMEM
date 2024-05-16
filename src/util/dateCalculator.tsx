export default function dateCalculator(data: any) {
    const [dia, mes, ano] = data.split('/');
    const dataFormatada = `${mes}/${dia}/${ano}`;
    var dataEvento = new Date(dataFormatada).getTime();
    var dias = Math.round((dataEvento - new Date().getTime()) / (1000 * 3600 * 24));

    if (dias < 30 && dias >= 0) {
        return "Falta(m) " + dias + " dia(s) para o evento!";
    }

    return new Intl.DateTimeFormat("pt-BR").format(dataEvento);
};