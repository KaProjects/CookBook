import React, {useState} from "react";
import PropTypes from "prop-types";
import {Alert, Button, IconButton, Tooltip} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

/** The backend takes requests of up to 10 MB, and base64 makes a file a third larger. */
export const MAX_IMAGE_BYTES = 7 * 1024 * 1024;

/**
 * The recipe's picture: chosen from a file and kept as a data URL, which the backend turns into
 * a compressed JPEG when the recipe is saved.
 */
export default function ImageField({image, onChange}) {
    const [problem, setProblem] = useState(null);

    const choose = (event) => {
        const file = event.target.files[0];
        event.target.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setProblem(`${file.name} is not a picture.`);
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            setProblem(`${file.name} is too large - the limit is ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`);
            return;
        }
        setProblem(null);
        const reader = new FileReader();
        reader.onloadend = () => onChange(reader.result);
        reader.readAsDataURL(file);
    };

    if (image !== null) {
        return (
            <div style={{position: "relative", textAlign: "center"}}>
                <img src={image} alt="Recipe" style={{maxWidth: "400px", maxHeight: "200px"}}/>
                <Tooltip title="Remove picture">
                    <IconButton aria-label="Remove picture" onClick={() => onChange(null)}
                                style={{position: "absolute", right: "20px", top: 0}}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </div>
        );
    }
    return (
        <div style={{textAlign: "center"}}>
            <Button component="label" startIcon={<PhotoCameraIcon/>}>
                Add picture
                <input type="file" accept="image/*" hidden onChange={choose} aria-label="Recipe picture"/>
            </Button>
            {problem && <Alert severity="warning" onClose={() => setProblem(null)}>{problem}</Alert>}
        </div>
    );
}

ImageField.propTypes = {
    image: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};
