import React from "react";
import {Link as RouterLink} from "react-router-dom";
import {Link, Typography} from "@mui/material";

export default function PageNotFound() {
    return (
        <main style={{textAlign: "center", marginTop: "20vh"}}>
            <Typography variant="h4" component="h2">404 Page not found</Typography>
            <Link component={RouterLink} to="/">Back to the recipes</Link>
        </main>
    );
}
