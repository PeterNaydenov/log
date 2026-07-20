export type LogLevel = number | string | string[];
export type CreateLogOptions = {
    /**
     * - Threshold for log calls. Calls whose
     * `level` is higher than this are ignored. Use `0` for silent mode.
     */
    level?: LogLevel;
    /**
     * - Default message type. One of `"log"`,
     * `"warn"`, or `"error"`. Can be overridden per call.
     */
    type?: string;
    /**
     * - Level applied when a call
     * does not provide its own `level`.
     */
    defaultMessageLevel?: LogLevel;
};
export type LogInput = {
    /**
     * - The message text (required).
     */
    message: string;
    /**
     * - Per-call type override; falls back to the
     * `type` from `createLog` options.
     */
    type?: string;
    /**
     * - Per-call level; falls back to
     * `defaultMessageLevel` from `createLog` options.
     */
    level?: LogLevel;
    /**
     * - Any additional properties are forwarded to
     * the log function as-is.
     */
    extra?: any;
};
export type LogPayload = {
    /**
     * - The message text (required).
     */
    message: string;
    /**
     * - Per-call type override; falls back to the
     * `type` from `createLog` options.
     */
    type?: string;
    /**
     * - Per-call level; falls back to
     * `defaultMessageLevel` from `createLog` options.
     */
    level?: LogLevel;
    /**
     * - The threshold from `createLog` options.
     */
    logLevel: LogLevel;
    /**
     * - Any additional properties are forwarded to
     * the log function as-is.
     */
    extra?: any;
};
export type LogFunction = (payload: LogPayload) => any;
/**
 * Create a log function with default options and an optional custom handler.
 *
 * @param {CreateLogOptions} [options={}] - Defaults applied to every log call.
 * @param {LogFunction} [logFunction] - Custom handler invoked for each call.
 *   Its return value is propagated back to the caller of the returned function.
 * @returns {function(LogInput): *} A function that accepts a per-call
 *   {@link LogInput} and returns the result of `logFunction`.
 */
declare function createLog(options?: CreateLogOptions, logFunction?: LogFunction): Function;
export default createLog;
