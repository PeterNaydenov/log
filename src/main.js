'use strict'
 /**
  *  Debug messaging system
  *     - started on June 12th, 2023
  * 
  */





/**
 * @typedef LogOptions
 * @type {object}
 * @property {number|string[]} [defaultMessageLevel] - Default message level or array of possible values
 * @property {string} [message] - Message to log
 * @property {string} [type] - Optional. Type of the message: 'error', 'warning', or 'log'
 * @property {number} [level] - Optional. Activity level of this specific message. Default is 1.
 */



/**
 * Default log function. Uses console.log().
 *
 * @param {Object} params - The parameters for logging.
 * @param {string} params.message - The message to log.
 * @param {number} params.level - The level of the message.
 * @param {string} params.type - The type of the message ('warn', 'error', or other).
 * @param {number} params.logLevel - The log level that determines if the message should be logged.
 * @returns {string|null} The formatted log message, or null if the message is not logged.
 */
function cl ({ message, level, type, logLevel }) {
// *** Default log method -> log in console.
        if ( logLevel === 0   )   return null   // logLevel '0' in this function means "stay silent"; 
        if ( logLevel < level )   return null   // Compare logLevel with message level.
        const m =  `[Debug]: ${message}`;
        switch ( type ) {
                case 'warn' :
                                console.warn ( m )
                                break
                case 'error' : 
                                console.error ( m )
                                break
                default    :
                                console.log ( m )
            }
        return m
} // cl func.






/**
 * Create a log function
 * @param {Record<string, unknown>|LogOptions} [options={}] - Options. 
 * @param {function} [logFunction=cl] - Custom log function if needed. Default is to log in the console(console.log).
 * @returns {function} A function that excepts a log-object and returns the result of logFunction.
 */
function createLog ( options={}, logFunction=cl ) {
return function log ({ message, type, level, ...rest}) {
        const 
                  defaultOptions = { level:1000, type: 'log', defaultMessageLevel: 1 }
                , { level:logLevel, type: logType, defaultMessageLevel } = Object.assign ({}, defaultOptions, options )
                ;

        if ( !type  )   type = logType
        if ( !level )   level = defaultMessageLevel

        return logFunction ({
                          message
                        , type
                        , level
                        , logLevel
                        , ...rest
                })
}} // log func.



export default createLog


