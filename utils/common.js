module.exports = {
    /**
     * 数组去重
     * @param {Array} array 
     */
    uniq(array) {
        const set = new Set(array);
        return [...set];
    }
}