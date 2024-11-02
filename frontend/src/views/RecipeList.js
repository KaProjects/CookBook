import React from "react"
import {Card, CardContent, List, ListItemButton, ListItemText, Typography} from "@mui/material"
import {useNavigate} from "react-router"
import {useData} from "../fetch"
import Loader from "../components/Loader"
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import ContentPasteOffIcon from '@mui/icons-material/ContentPasteOff';

export default function RecipeList(props) {

    const navigate = useNavigate()

    const showRecipe = (recipeId) => () => {
        props.setSelectedRecipe(recipeId)
        navigate('/recipe')
    }

    const {data, loaded, error} = useData("/list/" + props.user + "/category/recipe"
        + (props.categoryFilter !== null ? "?category=" + props.categoryFilter : "")
        + (props.ingredientFilter !== null ? "?ingredient=" + props.ingredientFilter : ""))

    return (
        <>
            {!loaded &&
                <Loader error={error}/>
            }
            {loaded &&
                <List sx={{maxWidth: 500, margin: "-3px auto 0px auto"}}>
                    {data.categories.map((category, index) => (
                        <Card sx={{marginTop: "1px"}}
                              variant="outlined"
                              key={index} >
                            <CardContent sx={{marginBottom: "-20px", marginTop: "-5px"}}>
                                <Typography sx={{ color: 'text.secondary', fontSize: 20, fontFamily: "Monaco", fontWeight: "normal"}}
                                            align={"center"}>
                                    {category.name}
                                </Typography>
                                <List sx={{paddingRight: "8px", display: "block"}}>
                                    {category.recipes.map((recipe, index) => (
                                        <ListItemButton style={{margin: "0px 2px 4px 4px", width: "100%", boxShadow: "0 0 5px 0", backgroundColor: "#FFE567"}}
                                                        key={index}
                                                        onClick={showRecipe(recipe.id)}>
                                            <ListItemText primary={recipe.name} primaryTypographyProps={{fontFamily: "Monaco", fontWeight: "normal"}}/>
                                            {!recipe.hasImage && <NoPhotographyIcon/>}
                                            {!recipe.hasSteps && <ContentPasteOffIcon/>}
                                        </ListItemButton>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    ))}
                </List>
            }
        </>
    )
}