import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConfig";

const useUserPermission = () => {
    const [userPermission, setUserPermission] = useState("");

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            setUserPermission("");
            return;
        }

        const queryUser = ref(db, "usuarios/" + uid + "/permissao");

        const unsubscribe = onValue(queryUser, (snapshot) => {
            const permissao = snapshot.val();
            setUserPermission(permissao !== null && permissao !== undefined ? permissao : "");
        });

        return () => unsubscribe();
    }, []);

    return userPermission;
};

export default useUserPermission;