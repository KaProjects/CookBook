import React, {useEffect, useMemo, useReducer, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Button, Divider, TextField, Typography} from "@mui/material";
import Loader from "../components/Loader";
import AutoCompleteInput from "../components/AutoCompleteInput";
import IngredientRows from "../components/editor/IngredientRows";
import StepRows from "../components/editor/StepRows";
import ImageField from "../components/editor/ImageField";
import {useData} from "../fetch";
import {createRecipe, paths, updateRecipe} from "../services/api";
import {describeResponseError} from "../services/errors";
import {emptyForm, formFromRecipe, formReducer, formToRecipe, isValid, LIMITS, validateForm} from "../services/recipeForm";
import {useAppState} from "../state/appState";
import {colors} from "../theme/colors";

const sectionTitle = {margin: "20px 0 0 25px", fontWeight: "bold"};
const divider = {width: "91%", marginLeft: "25px", backgroundColor: colors.divider};

/**
 * Creates a recipe (/create) or edits one (/recipe/:id/edit). The form is loaded once, from the
 * recipe when there is one, and saving opens the recipe as stored.
 */
export default function RecipeEditor() {
    const {id} = useParams();
    const editing = id !== undefined;
    const {user} = useAppState();
    const navigate = useNavigate();

    const stored = useData(editing ? paths.recipe(id) : null, editing);
    const menu = useData(paths.menu(user));
    const [form, dispatch] = useReducer(formReducer, null, emptyForm);
    const [ready, setReady] = useState(!editing);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {
        if (stored.data) {
            dispatch({type: "reset", form: formFromRecipe(stored.data)});
            setReady(true);
        }
    }, [stored.data]);

    const errors = useMemo(() => validateForm(form), [form]);
    const valid = isValid(errors);

    const save = async () => {
        setSaving(true);
        setSaveError(null);
        try {
            const recipe = formToRecipe(form);
            const saved = editing ? await updateRecipe(id, recipe) : await createRecipe(user, recipe);
            navigate(`/recipe/${encodeURIComponent(saved.id)}`);
        } catch (error) {
            setSaveError(describeResponseError(error));
            setSaving(false);
        }
    };

    if (!ready) return <Loader error={stored.error}/>;

    const set = (field) => (value) => dispatch({type: "set", field, value});
    const options = menu.data ?? {categories: [], ingredients: []};

    return (
        <main style={{maxWidth: "600px", margin: "0 auto", paddingBottom: "50px"}}>
            <Typography variant="h5" component="h2" style={{margin: "15px 0 0 25px"}}>
                {editing ? "Edit recipe" : "New recipe"}
            </Typography>

            <TextField label="Name" variant="outlined" value={form.name} error={errors.name}
                       onChange={(event) => set("name")(event.target.value)}
                       slotProps={{htmlInput: {maxLength: LIMITS.name}}}
                       style={{margin: "15px 0 0 18px", width: "93%"}}/>

            <AutoCompleteInput value={form.category} onChange={set("category")} options={options.categories}
                               label="Category" maxLength={LIMITS.category}
                               style={{margin: "15px 0 0 25px", width: "91%"}}/>

            <Typography style={sectionTitle} component="h3">Ingredients</Typography>
            <Divider style={divider}/>
            <IngredientRows ingredients={form.ingredients} options={options.ingredients} dispatch={dispatch}/>

            <Typography style={sectionTitle} component="h3">Steps</Typography>
            <Divider style={divider}/>
            <StepRows steps={form.steps} errors={errors.steps} dispatch={dispatch}/>

            <Divider style={{...divider, margin: "10px 0 10px 25px"}}/>
            <ImageField image={form.image} onChange={set("image")}/>

            {saveError && <Alert severity="error" style={{margin: "10px 25px"}} onClose={() => setSaveError(null)}>{saveError}</Alert>}

            <div style={{display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px"}}>
                <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
                <Button variant="contained" disabled={!valid || saving} onClick={save}
                        style={valid && !saving ? {backgroundColor: colors.saveButton, color: "white"} : undefined}>
                    {editing ? "Save Recipe" : "Create Recipe"}
                </Button>
            </div>
        </main>
    );
}
