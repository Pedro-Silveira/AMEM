// Retorna uma notificação para os eventos cuja data esteja entre 30 dias ou menos.
export default function dateCalculator(data: any) {
    const [dia, mes, ano] = data.split('/');
    const dataEvento = new Date(ano, mes - 1, dia).getTime();
    const hoje = new Date().getTime();
    const dias = Math.round((dataEvento - hoje) / (1000 * 3600 * 24));

    if (dias < 30 && dias >= 0) {
        return "Falta(m) " + dias + " dia(s) para o evento!";
    } else if (dias < 0) {
        return "O evento não foi encerrado!";
    }
    return "";
};
