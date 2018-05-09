let driver = {};

module.exports = {
    init: db => driver = db,
    get: () => driver
}