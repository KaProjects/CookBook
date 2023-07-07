import PropTypes from "prop-types"
import {useData} from "../fetch"
import Loader from "./Loader"
import React from "react"
import FaceIcon from '@mui/icons-material/Face'
import {Fab} from "@mui/material"
import {Face4} from "@mui/icons-material";


export default function Login({setUser}) {

    const {data, loaded, error} = useData("/user")

    const handleSelectUser = (user) => () => {
        setUser(user)
    }

    return (
        <>
            {!loaded &&
                <Loader error={error}/>
            }
            {loaded && <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>

                {data.map((user) =>
                    <Fab variant="extended" color="primary" aria-label="add" onClick={handleSelectUser(user)}>
                        {user.endsWith("a") ? <Face4 sx={{mr: 1}}/> : <FaceIcon sx={{mr: 1}}/>}
                        {user}
                    </Fab>
                )}

            </div>}
        </>
    )
}
Login.propTypes = {
    setUser: PropTypes.func.isRequired
}