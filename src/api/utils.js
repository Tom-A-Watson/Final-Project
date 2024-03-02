class Utils
{
    /**
     * Checks whether string is empty
     * @param {string} str
     * @returns {boolean}
     */
    isEmpty(str)
    {
        return typeof str === "string" && str.length === 0;
    }
}

export { Utils }