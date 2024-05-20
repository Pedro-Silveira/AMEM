import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { auth, db } from "../services/firebaseConfig";

// Consulta no banco e retorna a permissão do usuário autenticado.
const getUserPermission = () => {
    const [permissaoUsuario, setPermissaoUsuario] = useState("");

    useEffect(() => {
        const queryUsuario = ref(db, "usuarios/" + auth.currentUser?.uid + "/permissao");

        onValue(queryUsuario, (snapshot) => {
            const permissao = snapshot.val();

            setPermissaoUsuario(permissao);
        });
    }, []);

    return permissaoUsuario;
};

export default getUserPermission;