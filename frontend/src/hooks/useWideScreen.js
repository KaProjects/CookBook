import {useMediaQuery, useTheme} from "@mui/material";

/**
 * Whether the screen is wide enough for the desktop layout: MUI's "sm" breakpoint, 600px. Below
 * it, the phone layout is used. Read from the default theme, as the app sets no theme of its own.
 */
export const useWideScreen = () => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up("sm"));
};
