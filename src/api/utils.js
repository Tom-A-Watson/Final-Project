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
    console.log("Util::isUserLoggedIn = " + userLoggedIn)
    return req.session.user != null;
}

function logUserOut(req) {
    if (isUserLoggedIn(req))
    {
        req.session.user = null;
        return true;
    }

    return false;
}

export { isEmpty, isUserLoggedIn, logUserOut }