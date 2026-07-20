'use strict'
 /**
  *  Debug messaging system
  *     - started on June 12th, 2023
  *
  */





/**
 * A log level — either a number (lower = more verbose), a string, or an
 * array of strings for custom schemes (e.g. user roles).
 * @typedef {number|string|string[]} LogLevel
 */

/**
 * Options accepted by {@link createLog}.
 * @typedef {Object} CreateLogOptions
 * @property {LogLevel} [level=1000] - Threshold for log calls. Calls whose
 *   `level` is higher than this are ignored. Use `0` for silent mode.
 * @property {string} [type="log"] - Default message type. One of `"log"`,
 *   `"warn"`, or `"error"`. Can be overridden per call.
 * @property {LogLevel} [defaultMessageLevel=1] - Level applied when a call
 *   does not provide its own `level`.
 */

/**
 * Input passed by callers to the log function returned by `createLog`.
 * `logLevel` is added internally and should not be supplied by the caller.
 * @typedef {Object} LogInput
 * @property {string} message - The message text (required).
 * @property {string} [type] - Per-call type override; falls back to the
 *   `type` from `createLog` options.
 * @property {LogLevel} [level] - Per-call level; falls back to
 *   `defaultMessageLevel` from `createLog` options.
 * @property {*} [extra] - Any additional properties are forwarded to
 *   the log function as-is.
 */

/**
 * Payload passed to the log function on every call. Same shape as
 * {@link LogInput} but with `logLevel` injected by the wrapper.
 * @typedef {Object} LogPayload
 * @property {string} message - The message text (required).
 * @property {string} [type] - Per-call type override; falls back to the
 *   `type` from `createLog` options.
 * @property {LogLevel} [level] - Per-call level; falls back to
 *   `defaultMessageLevel` from `createLog` options.
 * @property {LogLevel} logLevel - The threshold from `createLog` options.
 * @property {*} [extra] - Any additional properties are forwarded to
 *   the log function as-is.
 */

/**
 * @callback LogFunction
 * @param {LogPayload} payload
 * @returns {*}
 */



/**
 * Default log function. Routes messages to the appropriate `console` method
 * based on `type`:
 *   - `"warn"`  → `console.warn`
 *   - `"error"` → `console.error`
 *   - anything else (default `"log"`) → `console.log`
 *
 * A message is ignored (returns `null`) when `logLevel === 0` (silent mode)
 * or when `logLevel < level` (message level exceeds threshold).
 *
 * @param {LogPayload} payload
 * @returns {string|null} The formatted `"[Debug]: <message>"` string, or `null` if ignored.
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
 * Create a log function with default options and an optional custom handler.
 *
 * @param {CreateLogOptions} [options={}] - Defaults applied to every log call.
 * @param {LogFunction} [logFunction] - Custom handler invoked for each call.
 *   Its return value is propagated back to the caller of the returned function.
 * @returns {function(LogInput): *} A function that accepts a per-call
 *   {@link LogInput} and returns the result of `logFunction`.
 */
function createLog ( options={}, logFunction=cl ) {
return function log ({ message, type, level, ...rest}) {
        const
                  defaultOptions = { level:1000, type: 'log', defaultMessageLevel: 1 }
                , { level:logLevel, type: logType, defaultMessageLevel } = Object.assign ({}, defaultOptions, options )
                ;

        if ( type == null  )   type = logType
        if ( level == null )   level = defaultMessageLevel

        return logFunction ({
                          message
                        , type
                        , level
                        , logLevel
                        , ...rest
                })
}} // log func.



export default createLog
