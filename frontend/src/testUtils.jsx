import {render} from "@testing-library/react";
import {MemoryRouter, Route, Routes, useLocation} from "react-router-dom";
import {AppStateProvider} from "./state/appState";
import {DEFAULT_USER_CONFIG} from "./theme/colors";
import {ROUTER_FUTURE} from "./router";

/** Everything the shared state holds, so a test only has to name what it cares about. */
export const DEFAULT_APP_STATE = {
    user: "Stanley",
    userConfig: DEFAULT_USER_CONFIG,
    selectUser: () => {},
    pdfTarget: null,
    setPdfTarget: () => {},
};

/** Shows where the app has navigated to, as "path?query". */
export const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location">{location.pathname + location.search}</div>;
};

/**
 * Renders a page at an address, with the shared state it reads.
 *
 * @param element the page
 * @param options.path the route the page is mounted on, such as "/recipe/:id"
 * @param options.at the address to open
 * @param options.state overrides of the shared state
 */
export const renderPage = (element, {path = "/", at = path, state = {}} = {}) =>
    render(
        <AppStateProvider value={{...DEFAULT_APP_STATE, ...state}}>
            <MemoryRouter initialEntries={[at]} future={ROUTER_FUTURE}>
                <Routes>
                    <Route path={path} element={element}/>
                    <Route path="*" element={null}/>
                </Routes>
                <LocationDisplay/>
            </MemoryRouter>
        </AppStateProvider>
    );
