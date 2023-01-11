const embedbuilder = require('./src/embed/embedbuilder');
const support = require('./src/support/support')

buttonList = {
    "embedbuilder": embedbuilder,
    "support": support
}

module.exports = { buttonList }