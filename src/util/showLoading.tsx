import React from "react";
import { AlertDialog, Spinner } from "native-base";

// Exibe um spinner enquanto os dados carregam.
export default function showLoading(uploading: any, close: any){
    return (
        <AlertDialog leastDestructiveRef={React.useRef(null)} isOpen={uploading} onClose={close}>
            <AlertDialog.Content background={"transparent"} shadow={"none"}>
                <Spinner size="lg" />
            </AlertDialog.Content>
        </AlertDialog>
    );
}