import {Alert, CircularProgress} from "@mui/material"
import React from "react"


export default function Loader(props) {

    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
            {props.error === null
                ? <CircularProgress/>
                : <Alert severity="error">{props.error.message}</Alert>}
        </div>
    )
}