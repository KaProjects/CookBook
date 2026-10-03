import React, {useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import {Divider, List, ListItem, ListItemIcon, Typography} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DiamondIcon from "@mui/icons-material/Diamond";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import Loader from "../components/Loader";
import {useData} from "../fetch";
import {paths} from "../services/api";
import {useAppState} from "../state/appState";

/** Required ingredients first, then the optional ones, each group in its stored order. */
export const orderIngredients = (ingredients) =>
    [...ingredients.filter((ingredient) => !ingredient.optional), ...ingredients.filter((ingredient) => ingredient.optional)];

/** One recipe, laid out to read while cooking, and the page the PDF export downloads. */
export default function Recipe() {
    const {id} = useParams();
    const {setPdfTarget} = useAppState();
    const {data: recipe, loaded, error} = useData(paths.recipe(id));
    const pdfRef = useRef(null);

    // The main bar's download button exports this page while it is shown, and nothing after.
    useEffect(() => {
        if (!recipe) return undefined;
        setPdfTarget({ref: pdfRef, name: recipe.name});
        return () => setPdfTarget(null);
    }, [recipe, setPdfTarget]);

    if (!loaded) return <Loader error={error}/>;

    return (
        <article ref={pdfRef} style={{maxWidth: "600px", margin: "0 auto"}}>
            <Typography variant="h4" component="h2" align="center" style={{margin: "5px auto 10px"}}>
                {recipe.name}
            </Typography>
            <Divider style={{margin: "5px 15px 10px"}}/>
            <Typography variant="h5" component="h3" style={{marginLeft: "20px"}}>
                {recipe.category}
            </Typography>

            <Divider style={{color: "grey", margin: "0 15px"}}>Ingredients</Divider>
            <List dense aria-label="Ingredients">
                {orderIngredients(recipe.ingredients).map((ingredient, index) => (
                    <ListItem key={index} component="div" style={{minHeight: "25px"}}>
                        <ListItemIcon style={{marginLeft: "10px"}}>
                            {ingredient.optional
                                ? <NotListedLocationIcon titleAccess="optional" style={{height: "18px"}}/>
                                : <DiamondIcon titleAccess="required" style={{height: "15px"}}/>}
                        </ListItemIcon>
                        <Typography style={{marginLeft: "-10px"}}>{ingredient.name}</Typography>
                        {ingredient.quantity &&
                            <Typography style={{marginLeft: "10px"}}>({ingredient.quantity})</Typography>}
                    </ListItem>
                ))}
            </List>

            <Divider style={{color: "grey", margin: "0 15px"}}>Steps</Divider>
            <List aria-label="Steps">
                {recipe.steps.map((step) => (
                    <ListItem key={step.number} component="div">
                        <ListItemIcon style={{margin: "0 0 auto 5px"}}>
                            {step.number}
                            {step.optional
                                ? <NotListedLocationIcon titleAccess="optional"/>
                                : <AutoFixHighIcon titleAccess="required"/>}
                        </ListItemIcon>
                        <Typography style={{marginLeft: "-5px", whiteSpace: "pre-line"}}>{step.text}</Typography>
                    </ListItem>
                ))}
            </List>

            <Divider style={{margin: "0 15px"}}/>
            {recipe.image && <img src={recipe.image} style={{width: "100%"}} alt={recipe.name}/>}
        </article>
    );
}
