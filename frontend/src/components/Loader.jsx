import React from "react";
import PropTypes from "prop-types";
import {Alert, CircularProgress} from "@mui/material";
import {describeResponseError} from "../services/errors";

/** A spinner while something loads, or what went wrong once it failed. */
export default function Loader({error = null}) {
    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh"}}>
            {error === null
                ? <CircularProgress/>
                : <Alert severity="error">{describeResponseError(error)}</Alert>}
        </div>
    );
}

Loader.propTypes = {
    error: PropTypes.object,
};
