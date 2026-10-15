import React, {useCallback, useLayoutEffect, useState} from "react";
import PropTypes from "prop-types";

/**
 * The recipe as the PDF export prints it: a page of a printed cookbook rather than a screenshot of
 * the app. It is always rendered out of sight, at the printable width of an A4 page with the
 * margins the export adds (190 mm), and styled with plain inline styles so it looks the same
 * whatever the screen around it.
 */
export const PRINT_WIDTH = 718;

/**
 * How tall a PDF page is on this page: the export cuts the rendered page into slices of the
 * printable height of A4 (277 mm), at the same scale that fits 190 mm into PRINT_WIDTH.
 */
export const PRINT_PAGE_HEIGHT = PRINT_WIDTH * 277 / 190;

/**
 * How far to push down a block that starts at top and is height tall so that no page cut runs
 * through it: to the top of the next page when it would cross one, unless it is taller than a page.
 */
export const shiftToNextPage = (top, height, pageHeight = PRINT_PAGE_HEIGHT) => {
    if (height > pageHeight) return 0;
    const nextCut = (Math.floor(top / pageHeight) + 1) * pageHeight;
    return top + height > nextCut ? nextCut - top : 0;
};

const ink = "#1f1f1c";
const muted = "#6b6a64";
const rule = "#e2dfd6";
const accent = "#185FA5";

const page = {
    width: PRINT_WIDTH, boxSizing: "border-box", padding: "28px 36px 20px", background: "#ffffff", color: ink,
    fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif", fontSize: 14, lineHeight: 1.5,
};
const kicker = {margin: 0, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: accent};
const title = {margin: "6px 0 0", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 34, fontWeight: 400, lineHeight: 1.2};
const meta = {margin: "8px 0 0", fontSize: 13, color: muted};
const heading = {margin: "26px 0 8px", paddingBottom: 6, borderBottom: `2px solid ${ink}`, fontSize: 13,
    letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500};
const subheading = {margin: "14px 0 4px", fontSize: 12, color: muted};
const list = {listStyle: "none", margin: 0, padding: 0};
const ingredientRow = {display: "flex", alignItems: "baseline", gap: 16, padding: "5px 0", borderBottom: `1px solid ${rule}`};
const stepRow = {display: "flex", gap: 14, padding: "7px 0", breakInside: "avoid"};
const number = {flex: "none", width: 24, height: 24, borderRadius: "50%", fontSize: 12, display: "flex",
    alignItems: "center", justifyContent: "center"};
const tag = {display: "inline-block", marginLeft: 8, padding: "0 6px", fontSize: 11, lineHeight: "17px",
    color: "#854F0B", border: "1px solid #EF9F27", borderRadius: 4};
const picture = {display: "block", width: "auto", height: "auto", maxWidth: "100%", maxHeight: 380, marginLeft: "auto", marginRight: "auto", marginTop: 26, borderRadius: 10};
const footer = {marginTop: 26, paddingTop: 8, borderTop: `1px solid ${rule}`, fontSize: 11, color: muted, textAlign: "right"};

const Ingredient = ({ingredient}) => (
    <li style={{...ingredientRow, color: ingredient.optional ? muted : ink}}>
        <span>{ingredient.name}</span>
        {ingredient.quantity && <span style={{marginLeft: "auto", color: muted, whiteSpace: "nowrap"}}>{ingredient.quantity}</span>}
    </li>
);

Ingredient.propTypes = {
    ingredient: PropTypes.shape({name: PropTypes.string.isRequired, quantity: PropTypes.string, optional: PropTypes.bool}).isRequired,
};

const count = (amount, one, many) => amount + " " + (amount === 1 ? one : many);

export default function PrintableRecipe({recipe, cook, pageRef}) {
    const [pictureShift, setPictureShift] = useState(0);
    const [pictureElement, setPictureElement] = useState(null);

    const placePicture = useCallback(() => {
        if (!pictureElement || !pageRef.current) return;
        const top = pictureElement.getBoundingClientRect().top - pageRef.current.getBoundingClientRect().top - pictureShift;
        const shift = shiftToNextPage(top, pictureElement.getBoundingClientRect().height);
        if (Math.abs(shift - pictureShift) > 0.5) setPictureShift(shift);
    }, [pictureElement, pageRef, pictureShift]);

    useLayoutEffect(placePicture, [placePicture, recipe]);

    const required = recipe.ingredients.filter((ingredient) => !ingredient.optional);
    const optional = recipe.ingredients.filter((ingredient) => ingredient.optional);

    return (
        <article ref={pageRef} style={page}>
            <p style={kicker}>{recipe.category}</p>
            <h1 style={title}>{recipe.name}</h1>
            <p style={meta}>
                {count(recipe.ingredients.length, "ingredient", "ingredients")} · {count(recipe.steps.length, "step", "steps")}
            </p>

            <h2 style={heading}>Ingredients</h2>
            {recipe.ingredients.length === 0 && <p style={{color: muted, margin: 0}}>No ingredients.</p>}
            <ul style={list}>
                {required.map((ingredient, index) => <Ingredient key={index} ingredient={ingredient}/>)}
            </ul>
            {optional.length > 0 &&
                <>
                    <p style={subheading}>Optional</p>
                    <ul style={list}>
                        {optional.map((ingredient, index) => <Ingredient key={index} ingredient={ingredient}/>)}
                    </ul>
                </>}

            <h2 style={heading}>Steps</h2>
            {recipe.steps.length === 0 && <p style={{color: muted, margin: 0}}>No steps.</p>}
            <ol style={list}>
                {recipe.steps.map((step) => (
                    <li key={step.number} style={stepRow}>
                        <span style={{...number, ...(step.optional
                            ? {border: `1px solid ${rule}`, color: muted}
                            : {background: accent, color: "#ffffff"})}}>{step.number}</span>
                        <span style={{whiteSpace: "pre-line"}}>
                            {step.text}
                            {step.optional && <span style={tag}>optional</span>}
                        </span>
                    </li>
                ))}
            </ol>

            {recipe.image && <img ref={setPictureElement} src={recipe.image} alt={recipe.name} onLoad={placePicture}
                                    style={{...picture, marginTop: picture.marginTop + pictureShift}}/>}

            <div style={footer}>{cook}'s CookBook</div>
        </article>
    );
}

PrintableRecipe.propTypes = {
    recipe: PropTypes.shape({
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        image: PropTypes.string,
        ingredients: PropTypes.array.isRequired,
        steps: PropTypes.array.isRequired,
    }).isRequired,
    cook: PropTypes.string.isRequired,
    pageRef: PropTypes.object.isRequired,
};
