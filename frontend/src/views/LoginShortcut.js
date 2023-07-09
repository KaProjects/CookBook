import React, {useEffect} from "react"
import {useNavigate, useParams} from "react-router"
import {CircularProgress} from "@mui/material";


export default function LoginShortcut({setUser}) {
    const { user } = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        setUser(user)
        navigate("/")
    })

    return (
        <div style={{position: "absolute", top: "25%", left: "50%", transform: "translate(-50%, -50%)"}}>
            <CircularProgress/>
        </div>
    )
}