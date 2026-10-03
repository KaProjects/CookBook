import React, {useEffect} from "react";
import {Navigate, useParams} from "react-router-dom";
import {useAppState} from "../state/appState";

/** /login/Name opens Name's cookbook directly - a link to bookmark per person. */
export default function LoginShortcut() {
    const {user} = useParams();
    const {selectUser} = useAppState();

    useEffect(() => {
        selectUser(user);
    }, [user, selectUser]);

    return <Navigate to="/" replace/>;
}
