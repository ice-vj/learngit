/**
 * Created by LJ on 11/22/15.
 */

var log4js = require('log4js');
var config = require('config');
var _ = require('lodash');

log4js.configure({
    appenders: [
        {
            type: 'console',
            category: 'console'
        },
        {
            type: 'dateFile',
            filename: 'logs/scaffold.log',
            pattern: '_yyyy-MM-dd',
            alwaysIncludePattern: false,
            category: 'dateFileLog'
        }
    ],
    replaceConsole: true,
    levels: {
        dateFileLog: 'info'
    }
});

var dateFileLog = log4js.getLogger(_.isEqual(config.get('app.env'), 'dev') ? 'console' : 'dateFileLog');


exports.logger = dateFileLog;



