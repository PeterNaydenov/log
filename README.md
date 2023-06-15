# Log ( @peter.naydenov/log )

Log message system with customizable log-function and controllable message activity levels. 

## Why?
You need a messages during debug process but you don't want to see them in production. Log system has single point of setting it as active or not active and how verbose should be. 

Another option is to modify your log-function to send messages to your external logging solution.

Take a look on `Alternative Ideas` section for other ideas how to use it.



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



## Activity levels

Default activity levels works like that:
- Setup a log-level by setting a property `level` in option object during '**createLog**' function call. If it's not defined, log-level will be 1000. Idea behind log-level is to minimize the amount of messages by setting smaller log-level. If you want to ignore all messages, set log-level to 0;
- If **message** has a `level` property, it will be used as message level. If not, default message level will be used. Default message level is 1;
- If message level is higher then log-level, message will be ignored. If message level is equal or lower then log-level, message will be processed;

You have the power to build your own activity levels. Here is how:

```js
const
      msg = 'My message' // Some message
    , msgDefault = ['basic','warning', 'all' ] // Define default message level
    , log = createLog (
                          { 
                                level: 'basic'                    // Setup a log-level
                              , defaultMessageLevel: msgDefault   // Setup default message level if not defined
                          }
                        , ({ message, level, logLevel }) => { // Custom log-function
                                  if ( level.includes(logLevel) ) {   // Test if log-level is included in message level
                                            return message
                                      }   
                                  return null
                            }) 
    ;
 let 
         res1 = log ({ message: msg, level: [ 'basic', 'warning', 'all'] })
      ,  res2 = log ({ message: msg, level: [ 'warning', 'all'] }) // Log-level is not included in message level, so the message will be ignored. Will return null
      ,  res3 = log ({ message: msg }) // Message level is not set and will get default message level
      ;
// res1 -> 'My message'
// res2 -> null
// res3 -> 'My message'
```

# Alternative Ideas

Library `log` is prety abstract, so we can use it in different ways. Here are some ideas:
 - Wrap code for execute it only for specific user role;
```js
let
      a = 'not changes'
    , user = { role: 'guest' }
    ;
const roleSpecific = createLog (
                                  { level : user.role },
                                  ({ level, logLevel, fn }) => {
                                          if ( level.includes(logLevel)  ) {   // execute user role specific code..
                                                  return fn()
                                              }
                                    return null
                              });

roleSpecific ({ level: [ 'admin', 'owner'], fn: () => a = 'admin changed' }) // We don't need a message property here...
// ->  a = 'not changes'
roleSpecific ({ level: [ 'guest'], fn: () => a = 'guest changed' })
// -> a = 'guest changed'
```



## Credits
'@peter.naydenov/log' was created and supported by Peter Naydenov.



## License
'@peter.naydenov/log' is released under the MIT License.