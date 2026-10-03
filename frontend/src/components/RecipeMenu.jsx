import React, {useState} from "react";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import {Collapse, List, ListItemButton, ListItemText} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import Loader from "./Loader";
import {useData} from "../fetch";
import {paths} from "../services/api";
import {useAppState} from "../state/appState";
import {colors} from "../theme/colors";

const sectionStyle = {margin: "0 2px 4px 4px", width: "100%", boxShadow: "0 0 8px 0", backgroundColor: colors.menuSection};
const itemStyle = {margin: "0 0 2px 4px", width: "100%", boxShadow: "0 0 4px 0", backgroundColor: colors.menuItem};

/** One collapsible list of filters - the ingredients, or the categories. */
const Section = ({title, values, open, onToggle, onPick}) => (
    <>
        <ListItemButton style={sectionStyle} onClick={onToggle} aria-expanded={open}>
            <ListItemText primary={title}/>
            {open ? <ExpandLess/> : <ExpandMore/>}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List disablePadding aria-label={title}>
                {values.map((value) => (
                    <ListItemButton key={value} style={itemStyle} onClick={() => onPick(value)}>
                        <ListItemText primary={value}/>
                    </ListItemButton>
                ))}
            </List>
        </Collapse>
    </>
);

Section.propTypes = {
    title: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onPick: PropTypes.func.isRequired,
};

/**
 * The filters of the user's recipes, by ingredient or by category. It is read each time the
 * drawer opens, so a recipe saved since shows up in it.
 */
export default function RecipeMenu({open, onClose}) {
    const {user} = useAppState();
    const navigate = useNavigate();
    const {data, loaded, error} = useData(paths.menu(user), open);
    const [shown, setShown] = useState("ingredients");

    const pick = (filter) => (value) => {
        onClose();
        navigate("/?" + new URLSearchParams({[filter]: value}).toString());
    };
    const toggle = (section) => () => setShown(shown === section ? null : section);

    if (!loaded) return <Loader error={error}/>;

    return (
        <List style={{paddingRight: "8px"}}>
            <Section title="Ingredients" values={data.ingredients} open={shown === "ingredients"}
                     onToggle={toggle("ingredients")} onPick={pick("ingredient")}/>
            <Section title="Categories" values={data.categories} open={shown === "categories"}
                     onToggle={toggle("categories")} onPick={pick("category")}/>
        </List>
    );
}

RecipeMenu.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
