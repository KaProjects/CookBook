import React, {useRef} from "react";
import PropTypes from "prop-types";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {Avatar, Box, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Tooltip, Typography} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {imageUrl} from "../services/api";
import {useAppState} from "../state/appState";
import {categoryTint} from "../theme/colors";

/** A horizontal swipe at least this long, and clearly more sideways than up or down, changes category. */
const SWIPE_DISTANCE = 60;

const PAGER_HEIGHT = "52px";

/** The rows sit on one white, rounded card with room around it, like a phone's settings. */
const cardStyle = {
    m: 1.5, borderRadius: 3, overflow: "hidden", bgcolor: "background.paper",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
};

const rowStyle = {
    minHeight: 64, py: 1, px: 2,
    "&:not(:last-of-type)": {borderBottom: "1px solid", borderColor: "divider"},
};

const nameStyle = {fontSize: "1.05rem", fontWeight: 500};

const avatarStyle = {width: 44, height: 44, fontSize: "1.05rem", fontWeight: 500};

/**
 * A row's picture: the recipe's own thumbnail, or the initial when there is none. The thumbnails
 * are loaded lazily, so a long list only fetches the ones scrolled to.
 */
const RowPicture = ({pictureOf, name, background, color}) => (
    <ListItemAvatar sx={{minWidth: 60}}>
        <Avatar src={pictureOf === null ? undefined : imageUrl(pictureOf, {thumbnail: true})}
                slotProps={{img: {loading: "lazy", alt: ""}}}
                sx={{...avatarStyle, bgcolor: background, color}} aria-hidden>
            {name.trim().charAt(0).toUpperCase()}
        </Avatar>
    </ListItemAvatar>
);

RowPicture.propTypes = {
    pictureOf: PropTypes.number,
    name: PropTypes.string.isRequired,
    background: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
};

/** A category shows the picture of its first recipe that has one. */
const pictureOfCategory = (category) => category.recipes.find((recipe) => recipe.hasImage)?.id ?? null;

const pagerStyle = {
    position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    minHeight: PAGER_HEIGHT, px: 1, pb: "env(safe-area-inset-bottom)",
    bgcolor: "background.paper", borderTop: "1px solid", borderColor: "divider",
};

const countLabel = (count) => count + (count === 1 ? " recipe" : " recipes");

/**
 * The phone layout of the recipe list. Without a category in the address it lists the categories;
 * with one it shows that category's recipes, and a sideways swipe - or the arrows, for anyone who
 * cannot swipe - moves to the neighbouring category. The main bar shows the category's name.
 */
export default function CategoryPager({categories}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const selected = searchParams.get("category");
    const index = categories.findIndex((category) => category.name === selected);

    const addressOf = (category) => {
        const next = new URLSearchParams(searchParams);
        next.set("category", category);
        return "/?" + next.toString();
    };

    if (selected === null || index < 0) {
        return (
            <Box sx={cardStyle}>
                <List disablePadding aria-label="Categories">
                    {categories.map((category) => (
                        <ListItemButton key={category.name} sx={rowStyle} onClick={() => navigate(addressOf(category.name))}>
                            <RowPicture pictureOf={pictureOfCategory(category)} name={category.name}
                                        background={categoryTint(category.name).background} color={categoryTint(category.name).text}/>
                            <ListItemText primary={category.name} secondary={countLabel(category.recipes.length)}
                                          slotProps={{primary: {sx: nameStyle}}}/>
                            <ChevronRightIcon color="action" aria-hidden/>
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        );
    }

    // Swiping replaces the address, so the back button returns to the list of categories rather
    // than through every category swiped past. The direction travels with the navigation, so only
    // a swipe animates, and from the side it came from.
    return <CategoryPage key={categories[index].name} categories={categories} index={index}
                         slide={location.state?.slide ?? null}
                         onMove={(category, slide) => navigate(addressOf(category), {replace: true, state: {slide}})}/>;
}

CategoryPager.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        recipes: PropTypes.array.isRequired,
    })).isRequired,
};

function CategoryPage({categories, index, slide, onMove}) {
    const navigate = useNavigate();
    const {userConfig} = useAppState();
    const touch = useRef(null);
    const category = categories[index];
    const previous = categories[index - 1];
    const next = categories[index + 1];

    const move = (target, direction) => {
        if (target) onMove(target.name, direction);
    };

    const onTouchStart = (event) => {
        const point = event.touches[0];
        touch.current = {x: point.clientX, y: point.clientY};
    };
    const onTouchEnd = (event) => {
        if (touch.current === null) return;
        const point = event.changedTouches[0];
        const dx = point.clientX - touch.current.x;
        const dy = point.clientY - touch.current.y;
        touch.current = null;
        if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < 1.5 * Math.abs(dy)) return;
        if (dx < 0) move(next, "from-right");
        else move(previous, "from-left");
    };

    return (
        <>
            <Box component="section" aria-label={category.name} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
                 className={slide ? "slide-" + slide : undefined}
                 // Room below the last recipe for the pager, so it never covers one.
                 sx={{minHeight: "calc(100vh - 56px)", pb: `calc(${PAGER_HEIGHT} + env(safe-area-inset-bottom))`}}>
                <Box sx={cardStyle}>
                    <List disablePadding aria-label={"Recipes in " + category.name}>
                        {category.recipes.map((recipe) => (
                            <ListItemButton key={recipe.id} sx={rowStyle} onClick={() => navigate(`/recipe/${encodeURIComponent(recipe.id)}`)}>
                                <RowPicture pictureOf={recipe.hasImage ? recipe.id : null} name={recipe.name}
                                            background={userConfig.recipeItemColor} color="#3D3D3A"/>
                                <ListItemText primary={recipe.name} secondary={recipe.hasSteps ? null : "No steps yet"}
                                              slotProps={{primary: {sx: nameStyle}, secondary: {sx: {color: "warning.main"}}}}/>
                                <ChevronRightIcon color="action" aria-hidden/>
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Box>
            {/* Outside the section that slides in: a fixed bar inside a moving element moves with it.
                Fixed at the bottom of the screen, within reach of the thumb that swipes. */}
            <Box component="nav" aria-label="Category pages" sx={pagerStyle}>
                <Tooltip title={previous ? previous.name : ""}>
                    <span>
                        <IconButton disabled={!previous} onClick={() => move(previous, "from-left")}
                                    aria-label={previous ? "Previous category: " + previous.name : "No previous category"}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </span>
                </Tooltip>
                <Typography variant="body2" color="text.secondary">
                    {index + 1} / {categories.length} · {countLabel(category.recipes.length)}
                </Typography>
                <Tooltip title={next ? next.name : ""}>
                    <span>
                        <IconButton disabled={!next} onClick={() => move(next, "from-right")}
                                    aria-label={next ? "Next category: " + next.name : "No next category"}>
                            <ChevronRightIcon/>
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        </>
    );
}

CategoryPage.propTypes = {
    categories: CategoryPager.propTypes.categories,
    index: PropTypes.number.isRequired,
    slide: PropTypes.oneOf(["from-left", "from-right", null]),
    onMove: PropTypes.func.isRequired,
};
