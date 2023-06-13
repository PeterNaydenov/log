# Log ( @peter.naydenov/log )

Log message system with customizable log-function and controllable message activity levels. 

## Why?
You need a messages during debug process but you don't want to see them in production. Log system has single point of setting it as active or not active and how verbose should be. 

Another option is to modify your log-function to send messages to your external logging solution.



## How to use it?
Simplest possible use case:
```js
const log = createLog ();  // Create a log function with all default settings
log ({message:'hello'})
// -> console message '[debug]: hello'  
// if you don't provide your log-function, there is a default function that will create and send a console message.

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

## Installation
Write into the console:
```
npm i @peter.naydenov/log
```

Import in your project
```js
import createLog from '@peter.naydenov/log'
```



## createLog ()
The function `createLog` will generate log function for you. You have defaults, so you can call `createLog` without parameters. Providing a parameters can customize your 'log' behaviour. Result of calling `createLog` is a function.

```js
import createLog from '@peter.naydenov/log'

const log = createLog ( options, logFunction )   // Create a log

/**
 *  options - object. If you need to provide logFunction but no options -> set it to empty object. {} 
 *  option properties:
 *   - level: Available to logFunction as 'logLevel'.
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
Activity levels - you can define different levels of message importance and use levels as filter factor.




## Credits
'@peter.naydenov/log' was created and supported by Peter Naydenov.



## License
'@peter.naydenov/log' is released under the MIT License.