const utils = require('../lib/utils');

function genShortUrlId(longUrl) {
    return utils.genMd5(longUrl);
}

module.exports = {
    genShortUrlId
};