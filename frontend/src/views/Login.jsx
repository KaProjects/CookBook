import React, {useEffect} from "react";
import {Fab} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import Face4Icon from "@mui/icons-material/Face4";
import Loader from "../components/Loader";
import {useData} from "../fetch";
import {paths} from "../services/api";
import {useAppState} from "../state/appState";

/**
 * Picks whose cookbook to open. There is no password: the cookbook is shared on the home network
 * and only keeps everybody's recipes apart. With a single user there is nothing to pick.
 */
export default function Login() {
    const {selectUser} = useAppState();
    const {data: users, loaded, error} = useData(paths.users());

    useEffect(() => {
        if (users && users.length === 1) selectUser(users[0]);
    }, [users, selectUser]);

    if (!loaded) return <Loader error={error}/>;

    return (
        <main style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", minHeight: "100vh", flexWrap: "wrap"}}>
            {users.map((user) => (
                <Fab key={user} variant="extended" color="primary" onClick={() => selectUser(user)}>
                    {user.endsWith("a") ? <Face4Icon sx={{mr: 1}}/> : <FaceIcon sx={{mr: 1}}/>}
                    {user}
                </Fab>
            ))}
        </main>
    );
}
