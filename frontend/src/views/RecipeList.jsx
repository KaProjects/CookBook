import React from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Box, Card, CardActionArea, Chip, Typography} from "@mui/material";
import {alpha} from "@mui/material/styles";
import ContentPasteOffIcon from "@mui/icons-material/ContentPasteOff";
import CategoryPager from "../components/CategoryPager";
import Loader from "../components/Loader";
import {useWideScreen} from "../hooks/useWideScreen";
import {useData} from "../fetch";
import {imageUrl, paths} from "../services/api";
import {useAppState} from "../state/appState";

const headingStyle = {display: "flex", alignItems: "baseline", pb: 0.75, mb: 2, borderBottom: "2px solid", borderColor: "text.primary"};
const gridStyle = {display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 2};
const pictureStyle = {display: "block", width: "100%", height: 132};
const countLabel = (count) => count + (count === 1 ? " recipe" : " recipes");

/**
 * The user's recipes by category, filtered by the ingredient in the address. On a wide screen every
 * category is a grid of recipe cards - a picture, or the recipe's initial on a soft tint of the
 * user's colour, over its name - and the category in the address filters the list too; on a phone
 * it picks the one category shown, among all of them, so the others are a swipe away.
 */
export default function RecipeList() {
    const {user, userConfig} = useAppState();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const wide = useWideScreen();
    const {data, loaded, error} = useData(paths.recipes(user, {
        category: wide ? searchParams.get("category") : null,
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

    if (!wide) return <CategoryPager categories={data.categories}/>;

    return (
        <Box component="main" sx={{maxWidth: 1200, mx: "auto", px: 4, py: 3}}>
            {data.categories.map((category) => (
                <Box key={category.name} component="section" aria-label={category.name} sx={{mb: 4}}>
                    <Box sx={headingStyle}>
                        <Typography component="h2" sx={{fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "primary.main"}}>
                            {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ml: "auto"}}>{countLabel(category.recipes.length)}</Typography>
                    </Box>
                    <Box sx={gridStyle}>
                        {category.recipes.map((recipe) => (
                            <Card key={recipe.id} variant="outlined" sx={{borderRadius: 2}}>
                                <CardActionArea onClick={() => navigate(`/recipe/${encodeURIComponent(recipe.id)}`)} sx={{height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "flex-start"}}>
                                    <Box sx={{position: "relative"}}>
                                        {recipe.hasImage
                                            ? <Box component="img" src={imageUrl(recipe.id, {thumbnail: true})} alt=""
                                                   sx={{...pictureStyle, objectFit: "cover"}}/>
                                            : <Box aria-hidden sx={{...pictureStyle, display: "flex", alignItems: "center", justifyContent: "center",
                                                                   bgcolor: alpha(userConfig.recipeItemColor, 0.3), color: "text.secondary",
                                                                   fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 40}}>
                                                {recipe.name.charAt(0).toUpperCase()}
                                            </Box>}
                                        {!recipe.hasSteps &&
                                            <Chip icon={<ContentPasteOffIcon/>} label="No steps yet" size="small" color="warning"
                                                  sx={{position: "absolute", left: 8, bottom: 8, fontWeight: 500, boxShadow: 1}}/>}
                                    </Box>
                                    <Box sx={{px: 1.5, py: 1.25}}>
                                        <Typography sx={{fontWeight: 500, lineHeight: 1.3}}>{recipe.name}</Typography>
                                    </Box>
                                </CardActionArea>
                            </Card>
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
