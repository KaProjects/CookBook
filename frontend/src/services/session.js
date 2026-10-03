const USER = "user"

/**
 * The user picked on this tab. There is no authentication: the cookbook only remembers whose
 * recipes the tab is showing, for as long as the tab is open.
 */
export const loadUser = () => {
    try {
        return sessionStorage.getItem(USER)
    } catch {
        return null
    }
}

export const saveUser = (user) => {
    try {
        if (user === null) sessionStorage.removeItem(USER)
        else sessionStorage.setItem(USER, user)
    } catch {
        // storage can be unavailable, in a private window say; the choice then lasts until reload
    }
}
