import React from 'react'
import {Divider, IconButton, List, ListItem, ListItemIcon, Typography} from "@material-ui/core"
import DiamondIcon from '@mui/icons-material/Diamond'
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import EditIcon from "@mui/icons-material/Edit"
import {Stack} from "@mui/material"
import {useData} from "../fetch"
import Loader from "../components/Loader"
import {Link} from "react-router-dom"


export default function Recipe(props) {

    const {data, loaded, error} = useData("/recipe/" + props.selectedRecipeId)

    return (
        <>
            {!loaded &&
                <Loader error={error}/>
            }
            {loaded && <div>
                <Stack direction="row" spacing={2}>
                    <Typography variant="h2" component="h2">
                        {data.name}
                    </Typography>
                    <Link to="/edit" underline="none" color="inherit">
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                        >
                            <EditIcon/>
                        </IconButton>
                    </Link>
                </Stack>


                <Typography variant="h5" component="h5">
                    category: {data.category}
                </Typography>

                <div/>
                <Divider variant="fullWidth" component="div"/>
                <div/>

                <List dense>
                    {data.ingredients.map((ingredient) =>
                        <div key={ingredient.id}>
                            {!ingredient.optional &&
                                <ListItem component="div">
                                    <ListItemIcon>
                                        <DiamondIcon/>
                                    </ListItemIcon>
                                    <Typography key={ingredient.name}>
                                        {ingredient.name} ({ingredient.quantity}{ingredient.unit})
                                    </Typography>
                                </ListItem>}
                        </div>
                    )}
                    {data.ingredients.map((ingredient) =>
                        <div key={ingredient.id}>
                            {ingredient.optional &&
                                <ListItem component="div">
                                    <ListItemIcon>
                                        <NotListedLocationIcon/>
                                    </ListItemIcon>
                                    <Typography key={ingredient.name}>
                                        {ingredient.name} ({ingredient.quantity}{ingredient.unit})
                                    </Typography>
                                </ListItem>}
                        </div>
                    )}
                </List>

                <div/>
                <Divider variant="fullWidth" component="div"/>
                <div/>

                <List dense>
                    {data.steps.map((step) =>
                        <ListItem component="div" key={step.number}>
                            <ListItemIcon>
                                {step.number}
                                {!step.optional && <AutoFixHighIcon/>}
                                {step.optional && <NotListedLocationIcon/>}
                            </ListItemIcon>
                            <Typography key={step.number}>
                                {step.text}
                            </Typography>
                        </ListItem>
                    )}
                </List>

                <div/>
                <Divider variant="fullWidth" component="div"/>
                <div/>

                <img src={data.image}/>

            </div>}
        </>
    )
}