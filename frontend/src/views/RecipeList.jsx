import React from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Card, CardContent, List, ListItemButton, ListItemText, Tooltip, Typography} from "@mui/material";
import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
import ContentPasteOffIcon from "@mui/icons-material/ContentPasteOff";
import Loader from "../components/Loader";
import {useData} from "../fetch";
import {paths} from "../services/api";
import {useAppState} from "../state/appState";
import {colors} from "../theme/colors";

/** The user's recipes by category, filtered by the category or ingredient in the address. */
export default function RecipeList() {
    const {user, userConfig} = useAppState();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {data, loaded, error} = useData(paths.recipes(user, {
        category: searchParams.get("category"),
        ingredient: searchParams.get("ingredient"),
    }));

    if (!loaded) return <Loader error={error}/>;

    if (data.categories.length === 0) {
        return (
            <Typography align="center" style={{marginTop: "20vh"}} color="text.secondary">
                No recipes yet - add one with the + button.
            </Typography>
        );
    }

    return (
        <main style={{maxWidth: 500, margin: "0 auto"}}>
            {data.categories.map((category) => (
                <Card key={category.name} variant="outlined" component="section" aria-label={category.name}>
                    <CardContent>
                        <Typography component="h2" align="center" sx={{color: "text.secondary", fontSize: 20, fontFamily: "Monaco"}}>
                            {category.name}
                        </Typography>
                        <List>
                            {category.recipes.map((recipe) => (
                                <ListItemButton key={recipe.id}
                                                onClick={() => navigate(`/recipe/${encodeURIComponent(recipe.id)}`)}
                                                style={{margin: "0 2px 4px 4px", boxShadow: colors.recipeShadow, backgroundColor: userConfig.recipeItemColor}}>
                                    <ListItemText primary={recipe.name} slotProps={{primary: {fontFamily: "Monaco"}}}/>
                                    {!recipe.hasImage &&
                                        <Tooltip title="No picture"><NoPhotographyIcon aria-label="No picture"/></Tooltip>}
                                    {!recipe.hasSteps &&
                                        <Tooltip title="No steps"><ContentPasteOffIcon aria-label="No steps"/></Tooltip>}
                                </ListItemButton>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            ))}
        </main>
    );
}
