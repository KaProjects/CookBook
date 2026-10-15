import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {useParams} from "react-router-dom";
import {Box, Chip, Tab, Tabs, Typography} from "@mui/material";
import Loader from "../components/Loader";
import PrintableRecipe from "../components/PrintableRecipe";
import {useData} from "../fetch";
import {paths} from "../services/api";
import {useAppState} from "../state/appState";
import {useWideScreen} from "../hooks/useWideScreen";

/** Required ingredients first, then the optional ones, each group in its stored order. */
export const orderIngredients = (ingredients) =>
    [...ingredients.filter((ingredient) => !ingredient.optional), ...ingredients.filter((ingredient) => ingredient.optional)];

/**
 * One recipe, laid out to read while cooking - a phone gets a layout of its own - and the page the
 * PDF export prints, which is rendered out of sight.
 */
export default function Recipe() {
    const {id} = useParams();
    const {user, setShownRecipe} = useAppState();
    const wide = useWideScreen();
    const {data: recipe, loaded, error} = useData(paths.recipe(id));
    const pdfRef = useRef(null);

    // The main bar names the recipe's category and exports this page while it is shown, and
    // nothing after.
    useEffect(() => {
        if (!recipe) return undefined;
        setShownRecipe({ref: pdfRef, name: recipe.name, category: recipe.category});
        return () => setShownRecipe(null);
    }, [recipe, setShownRecipe]);

    if (!loaded) return <Loader error={error}/>;

    return (
        <>
            {wide ? <RecipeArticle recipe={recipe}/> : <PhoneRecipe recipe={recipe}/>}
            <Box aria-hidden data-testid="pdf-page" sx={{position: "absolute", left: "-10000px", top: 0}}>
                <PrintableRecipe recipe={recipe} cook={user} pageRef={pdfRef}/>
            </Box>
        </>
    );
}

const recipeShape = PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string,
    ingredients: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.string,
        optional: PropTypes.bool,
    })).isRequired,
    steps: PropTypes.arrayOf(PropTypes.shape({
        number: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        optional: PropTypes.bool,
    })).isRequired,
});

const ingredientRow = {display: "flex", alignItems: "baseline", gap: 2, py: 1.25, borderBottom: "1px solid", borderColor: "divider"};

/** An ingredient: its name, and its quantity on the right when it has one. */
const IngredientRow = ({ingredient, inset}) => (
    <Box component="li" sx={{...ingredientRow, px: inset, color: ingredient.optional ? "text.secondary" : "text.primary"}}>
        <Typography component="span" sx={{fontSize: "1rem", color: "inherit"}}>{ingredient.name}</Typography>
        {ingredient.quantity &&
            <Typography component="span" sx={{ml: "auto", color: "text.secondary", whiteSpace: "nowrap"}}>
                {ingredient.quantity}
            </Typography>}
    </Box>
);

IngredientRow.propTypes = {
    ingredient: PropTypes.shape({name: PropTypes.string.isRequired, quantity: PropTypes.string, optional: PropTypes.bool}).isRequired,
    inset: PropTypes.number.isRequired,
};

/** A step: its number in a circle, filled unless the step is optional, which is tagged too. */
const StepRow = ({step, inset}) => (
    <Box component="li" sx={{display: "flex", gap: 1.5, px: inset, py: 1.25}}>
        <Box aria-hidden sx={{flex: "none", width: 26, height: 26, borderRadius: "50%", fontSize: 13,
                             display: "flex", alignItems: "center", justifyContent: "center",
                             ...(step.optional
                                 ? {border: "1px solid", borderColor: "divider", color: "text.secondary"}
                                 : {bgcolor: "primary.main", color: "primary.contrastText"})}}>
            {step.number}
        </Box>
        <Typography sx={{whiteSpace: "pre-line", lineHeight: 1.5}}>
            {step.text}
            {step.optional &&
                <Chip label="optional" size="small" color="warning" variant="outlined" sx={{ml: 1, height: 20}}/>}
        </Typography>
    </Box>
);

StepRow.propTypes = {
    step: PropTypes.shape({number: PropTypes.number.isRequired, text: PropTypes.string.isRequired, optional: PropTypes.bool}).isRequired,
    inset: PropTypes.number.isRequired,
};

const listStyle = {listStyle: "none", m: 0, p: 0};
const sectionHeading = {mt: 3.5, mb: 0.5, pb: 0.75, borderBottom: "2px solid", borderColor: "text.primary", fontSize: 13,
    fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase"};
const count = (amount, one, many) => amount + " " + (amount === 1 ? one : many);

/**
 * The wide layout, a page of a cookbook like the PDF: the category, the name and the ingredients
 * beside the picture, and the steps across the whole page below them.
 */
function RecipeArticle({recipe}) {
    const required = recipe.ingredients.filter((ingredient) => !ingredient.optional);
    const optional = recipe.ingredients.filter((ingredient) => ingredient.optional);
    const twoColumns = {...listStyle, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", columnGap: 4};

    return (
        <Box component="article" aria-label={recipe.name} sx={{maxWidth: 1000, mx: "auto", px: 4, py: 3}}>
            <Box sx={{display: "grid", gap: 5, alignItems: "start",
                      gridTemplateColumns: recipe.image ? {sm: "minmax(0, 1fr) 260px", md: "minmax(0, 1fr) 360px"} : "1fr"}}>
                <div>
                    <Typography sx={{fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "primary.main"}}>
                        {recipe.category}
                    </Typography>
                    <Typography variant="h3" component="h2" sx={{mt: 0.5, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "2.4rem"}}>
                        {recipe.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{mt: 1}}>
                        {count(recipe.ingredients.length, "ingredient", "ingredients")} · {count(recipe.steps.length, "step", "steps")}
                    </Typography>

                    <Typography component="h3" sx={sectionHeading}>Ingredients</Typography>
                    {recipe.ingredients.length === 0 && <Typography color="text.secondary" sx={{py: 1.5}}>No ingredients yet.</Typography>}
                    <Box component="ul" aria-label="Ingredients" sx={twoColumns}>
                        {required.map((ingredient, index) => <IngredientRow key={index} ingredient={ingredient} inset={0}/>)}
                    </Box>
                    {optional.length > 0 &&
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{pt: 2, pb: 0.5}}>Optional</Typography>
                            <Box component="ul" aria-label="Optional ingredients" sx={twoColumns}>
                                {optional.map((ingredient, index) => <IngredientRow key={index} ingredient={ingredient} inset={0}/>)}
                            </Box>
                        </>}
                </div>
                {recipe.image &&
                    <Box component="img" src={recipe.image} alt={recipe.name}
                         sx={{display: "block", width: "100%", height: "auto", maxHeight: 480, objectFit: "contain", borderRadius: 2}}/>}
            </Box>

            <Typography component="h3" sx={sectionHeading}>Steps</Typography>
            {recipe.steps.length === 0 && <Typography color="text.secondary" sx={{py: 1.5}}>No steps yet.</Typography>}
            <Box component="ol" aria-label="Steps" sx={listStyle}>
                {recipe.steps.map((step) => <StepRow key={step.number} step={step} inset={0}/>)}
            </Box>
        </Box>
    );
}

RecipeArticle.propTypes = {
    recipe: recipeShape.isRequired,
};

/**
 * The phone layout: the picture with the name over it, then the ingredients and the steps one tab
 * apart rather than one long scroll. A recipe without a picture shows its name as a heading.
 */
function PhoneRecipe({recipe}) {
    const [tab, setTab] = useState("ingredients");
    const required = recipe.ingredients.filter((ingredient) => !ingredient.optional);
    const optional = recipe.ingredients.filter((ingredient) => ingredient.optional);

    return (
        <Box component="article" aria-label={recipe.name} sx={{pb: 3}}>
            {recipe.image
                ? <Box data-testid="recipe-picture" sx={{position: "relative", height: 176, backgroundImage: `url(${recipe.image})`,
                            backgroundSize: "cover", backgroundPosition: "center"}}>
                    <Box sx={{position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", p: 2,
                              background: "linear-gradient(to top, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0) 60%)"}}>
                        <Typography variant="h5" component="h2" sx={{color: "#fff", fontWeight: 500}}>{recipe.name}</Typography>
                    </Box>
                </Box>
                : <Typography variant="h5" component="h2" sx={{px: 2, pt: 2, fontWeight: 500}}>{recipe.name}</Typography>}

            <Tabs value={tab} onChange={(event, value) => setTab(value)} variant="fullWidth"
                  sx={{mx: 2, mt: 1.5, mb: 1, borderBottom: "1px solid", borderColor: "divider"}}>
                <Tab value="ingredients" label={`Ingredients ${recipe.ingredients.length}`} id="tab-ingredients" aria-controls="panel-ingredients"/>
                <Tab value="steps" label={`Steps ${recipe.steps.length}`} id="tab-steps" aria-controls="panel-steps"/>
            </Tabs>

            {tab === "ingredients" &&
                <Box role="tabpanel" id="panel-ingredients" aria-labelledby="tab-ingredients">
                    {recipe.ingredients.length === 0 &&
                        <Typography color="text.secondary" sx={{px: 2, py: 2}}>No ingredients yet.</Typography>}
                    <Box component="ul" aria-label="Ingredients" sx={listStyle}>
                        {required.map((ingredient, index) => <IngredientRow key={index} ingredient={ingredient} inset={2}/>)}
                    </Box>
                    {optional.length > 0 &&
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{px: 2, pt: 2, pb: 0.5}}>Optional</Typography>
                            <Box component="ul" aria-label="Optional ingredients" sx={listStyle}>
                                {optional.map((ingredient, index) => <IngredientRow key={index} ingredient={ingredient} inset={2}/>)}
                            </Box>
                        </>}
                </Box>}

            {tab === "steps" &&
                <Box role="tabpanel" id="panel-steps" aria-labelledby="tab-steps">
                    {recipe.steps.length === 0 &&
                        <Typography color="text.secondary" sx={{px: 2, py: 2}}>No steps yet.</Typography>}
                    <Box component="ol" aria-label="Steps" sx={listStyle}>
                        {recipe.steps.map((step) => <StepRow key={step.number} step={step} inset={2}/>)}
                    </Box>
                </Box>}
        </Box>
    );
}

PhoneRecipe.propTypes = {
    recipe: recipeShape.isRequired,
};
