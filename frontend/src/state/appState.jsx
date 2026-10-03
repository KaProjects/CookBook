import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import {useData} from "../fetch";
import {paths} from "../services/api";
import {loadUser, saveUser} from "../services/session";
import {DEFAULT_USER_CONFIG} from "../theme/colors";

const AppStateContext = createContext(null);

export const AppStateProvider = AppStateContext.Provider;

/**
 * The state the main bar and the views share: whose cookbook this is, how it is laid out for
 * them, and which recipe the PDF export would download.
 *
 * It is context rather than props because it is not passed in one direction: the recipe view
 * publishes what to export, and the main bar offers it. What the views show - which recipe, which
 * filter - lives in the address instead, so a reload, a bookmark or the back button keep it.
 */
export const useAppState = () => {
    const state = useContext(AppStateContext);
    if (state === null) {
        throw new Error("useAppState was called outside an AppStateProvider");
    }
    return state;
};

const AppState = ({children}) => {
    const [user, setUser] = useState(loadUser);
    const [pdfTarget, setPdfTarget] = useState(null);

    const selectUser = useCallback((value) => {
        saveUser(value);
        setUser(value);
    }, []);

    const config = useData(user === null ? null : paths.userConfig(user), user !== null);

    // A remembered user who no longer exists is forgotten, which shows the login again.
    useEffect(() => {
        if (config.error && config.error.response && config.error.response.status === 404) {
            selectUser(null);
        }
    }, [config.error, selectUser]);

    const value = useMemo(() => ({
        user,
        userConfig: config.data ?? DEFAULT_USER_CONFIG,
        selectUser,
        pdfTarget,
        setPdfTarget,
    }), [user, config.data, selectUser, pdfTarget]);

    return <AppStateProvider value={value}>{children}</AppStateProvider>;
};

AppState.propTypes = {
    children: PropTypes.node,
};

export default AppState;
