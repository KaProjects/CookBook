import {useEffect, useState} from "react";
import axios from "axios";
import {properties} from "./properties";

/**
 * Fetches a backend path, optionally only once it is wanted.
 *
 * What came back is remembered together with the path it came back for, and is only reported as
 * an answer to that same path: anything else is still loading. A view reads its parameters from
 * the address, which changes during a render, so a recipe page that moved on to another recipe
 * would otherwise show the previous one for a frame. A slow answer that arrives after the path has
 * moved on is discarded rather than shown.
 *
 * @param path the path under the backend prefix, such as "/recipe/42"
 * @param enabled false to hold the request back, as for a menu that is not open
 */
export const useData = (path, enabled = true) => {

    const [fetched, setFetched] = useState({path: null, data: null, error: null});

    useEffect(() => {
        if (!enabled || path === null) return;

        let awaited = true;

        axios.get(properties.backend + path)
            .then((response) => {
                if (awaited) setFetched({path, data: response.data, error: null})
            })
            .catch((error) => {
                console.error(error)
                if (awaited) setFetched({path, data: null, error})
            });

        return () => {awaited = false};
    }, [path, enabled]);

    const answersThisPath = fetched.path === path;

    return {
        data: answersThisPath ? fetched.data : null,
        loaded: answersThisPath && fetched.error === null && fetched.data !== null,
        error: answersThisPath ? fetched.error : null,
    };
};
