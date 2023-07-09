import React from 'react'
import {IconButton, List, ListItem, ListItemIcon, Typography} from "@material-ui/core"
import DiamondIcon from '@mui/icons-material/Diamond'
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import EditIcon from "@mui/icons-material/Edit"
import {Divider, Stack} from "@mui/material"
import {useData} from "../fetch"
import Loader from "../components/Loader"
import {Link} from "react-router-dom"


export default function Recipe(props) {

    const {data, loaded, error} = useData("/recipe/" + props.selectedRecipeId)

    function compareIngredients(i1, i2) {
        return (i2.optional ? 0 : 1) - (i1.optional ? 0 : 1)
    }

    return (
        <>
            {!loaded &&
                <Loader error={error}/>
            }
            {loaded &&
                <div style={{maxWidth: "600px", marginRight: "auto", marginLeft: "auto"}}>

                    <Stack direction="row" spacing={2}>
                        <Typography variant="h3" component="h3"
                                    style={{marginLeft: "15px", marginBottom: "10px"}}
                        >
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

                    <Divider variant="fullWidth" component="div" style={{margin: "5px 0 10px 15px", width: "95%"}}/>

                    <Typography variant="h5" component="h5"
                                style={{marginLeft: "20px"}}
                    >
                        {data.category}
                    </Typography>

                    <Divider variant="fullWidth" component="div"
                             style={{color: "grey", marginLeft: "15px", width: "95%"}}>
                        Ingredients
                    </Divider>

                    <List dense>
                        {data.ingredients.slice().sort(compareIngredients).map((ingredient, index) =>
                            <ListItem component="div" key={index} style={{height: "25px"}}>
                                <ListItemIcon style={{marginLeft: "10px"}}>
                                    {ingredient.optional
                                        ? <NotListedLocationIcon style={{height: "18px"}}/>
                                        : <DiamondIcon style={{height: "15px"}}/>
                                    }
                                </ListItemIcon>
                                <Typography style={{marginLeft: "-10px"}}>
                                    {ingredient.name}
                                </Typography>
                                <Typography style={{marginLeft: "10px"}}>
                                    ({ingredient.quantity})
                                </Typography>
                            </ListItem>
                        )}
                    </List>

                    <Divider variant="fullWidth" component="div"
                             style={{color: "grey", marginLeft: "15px", width: "95%"}}>
                        Steps
                    </Divider>

                    <List>
                        {data.steps.sort((a,b) => a.number - b.number).map((step, index) =>
                            <ListItem component="div" key={index}>
                                <ListItemIcon style={{margin: "0 0 auto 5px"}}>
                                    {step.number}
                                    {!step.optional && <AutoFixHighIcon/>}
                                    {step.optional && <NotListedLocationIcon/>}
                                </ListItemIcon>
                                <Typography style={{marginLeft: "-5px"}}>
                                    {step.text}
                                </Typography>
                            </ListItem>
                        )}
                    </List>

                    <Divider variant="fullWidth" component="div" style={{marginLeft: "15px", width: "95%"}}/>

                    <img src={data.image} style={{width: "100%"}} alt="recipe"/>

                </div>
            }
        </>
    )
}