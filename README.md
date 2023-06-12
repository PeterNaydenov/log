# Log ( @peter.naydenov/log )
*Documentation is under heavy development*
Log message system with controllable message activity levels.

Simplest possible use case:
```js
const log = createLog ();
log ({message:'hello'})
// -> console message '[debug]: hello'

// If we want to stop all messages to console, change a log definition
// was -> const log = createLog ();
// to -> const log = createLog ({level:0});
// log-level 0 definition will ignore all the messages provided to the log
```

Let's see a another example:

```js
const log = createLog ({level:2});
log ({message: 'Sweet'}, level:3 )
// log will ignore message 'sweet', because message level is lower then log-level. This definition of the log will show only level 1 and level 2 of the messages.
log ({message:'again'})
// Message 'again' will not be ignored because default message level is 1
```


## createLog ()
Activity levels are custom created per use case.
```js
import createLog from '@peter.naydenov/log'

const log = createLog ( options, logFunction )   // Create a log

/**
 *  option properties:
 *   - level: Available to logFunction as 'logLevel'
 *   - type: Overwrite default message type
 *   - deffaultMessageLevel: Overwrite default message level
 *   - all custom props are available in logFunction
 * 
 * 
 *  logFunction: 
 *   - a function that will be returned on calling a 'log' with a log-object
 *   - the logFunction could return a promise if it's needed 
 *  
 *  Note: options and logFunction are optional arguments.
 * 
 *  log is a function that expect a log-object
 *  log ( logObject ) -> will return the result of logFunction
 */

log ({ 
          message: 'Hello'  // (required) Provide a message
        // level : 2 // (optional) Activity level of this specific message. Deffault is 1.
        // type : 'error' // (optional). Type of the message: 'error', 'warning', or 'log'
    })

```
You need a messages during debug proccess but you don't want to see them in production. Log system has single point for setting it active or not active and how verbose should be. 

Library `log` can executes a function instead of sending information to the console. You should initialize it with the function otherwise `log` will use the default log method - sending the information to the console.

Levels of verbose - you can define different levels of message importance and use them as filter factor.