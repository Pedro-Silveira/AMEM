import { Box } from "native-base";

// Exibe um toast na tela com os dados recebidos.
export default function showToast(toast: any, bgColor: any, msg: any){
    toast.show({
        render: () => {
            return <Box padding={2} mb={3} rounded="sm" _text={{color: "#fff"}} bg={bgColor}>{msg}</Box>;
        }
    });
}