/** The colours of the cookbook, in one place rather than inline in each component. */
export const colors = {
    recipeShadow: "0 0 5px 0",
    menuBackground: "rgb(221,255,208)",
    menuSection: "rgb(113,201,76)",
    menuItem: "rgb(162,225,136)",
    saveButton: "rgb(1,121,1)",
    divider: "darkgrey",
}

/** How the frontend is laid out for a user whose settings could not be read. */
export const DEFAULT_USER_CONFIG = {menuAnchor: "right", recipeItemColor: "rgb(255,229,103)"}

/** Soft backgrounds and their matching dark text, one per category without a picture on the phone list. */
export const CATEGORY_TINTS = [
    {background: "#FAECE7", text: "#712B13"},
    {background: "#E1F5EE", text: "#085041"},
    {background: "#EEEDFE", text: "#3C3489"},
    {background: "#FAEEDA", text: "#633806"},
    {background: "#FBEAF0", text: "#72243E"},
    {background: "#E6F1FB", text: "#0C447C"},
    {background: "#EAF3DE", text: "#27500A"},
];

/** The same category always gets the same tint. */
export const categoryTint = (name) => {
    let hash = 0;
    for (const character of name) hash = (hash * 31 + character.codePointAt(0)) | 0;
    return CATEGORY_TINTS[Math.abs(hash) % CATEGORY_TINTS.length];
};
