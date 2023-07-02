const moment = require('moment');

const getTimestamp = () => {
    return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
}

module.exports = {
    getTimestamp
}