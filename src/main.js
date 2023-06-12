'use strict'
 /**
  *  Debug messaging system
  *     - started on June 12th, 2023
  * 
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


