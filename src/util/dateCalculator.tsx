export default function dateCalculator(data: any) {
    const [dia, mes, ano] = data.split('/');
    const dataOriginal = `${mes}/${dia}/${ano}`;
    var dataEvento = new Date(dataOriginal).getTime();
    var dias = Math.round((dataEvento - new Date().getTime()) / (1000 * 3600 * 24));

    if (dias < 30 && dias >= 0) {
        return "Falta(m) " + dias + " dia(s) para o evento!";
    } else if (dias < 0){
        return "O evento não foi encerrado!"
    }
};