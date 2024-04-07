/**
 * Checks whether string is empty
 * @param {string} str
 * @returns {boolean}
 */
function isEmpty(str)
{
    return typeof str === "string" && str.length === 0;
}

function isUserLoggedIn(req) 
{
    let userLoggedIn = req.session.user != null;
    return req.session.user != null;
}

function isAdminUserLoggedIn(req) 
{
    return isUserLoggedIn(req) && req.session.user.isAdmin ;
}

function logUserOut(req) {
    if (isUserLoggedIn(req))
    {
        req.session.user = null;
        return true;
    }

    return false;
}

export { isEmpty, isUserLoggedIn, isAdminUserLoggedIn, logUserOut }