
import { expect } from 'chai'
import createLog from '../src/main.js'


describe ( 'Log library', () => {



it ( 'Log arguments: options and logFunction', () => {
        const
              msg = 'Here we are'
            , log = createLog (
                                { level:3 },   // Setup a logLevel value(s)
                                ({ message, level, logLevel }) => { 
                                            expect(message).to.be.equal(msg)
                                            expect ( logLevel ).to.be.equal ( 3 )
                                            expect ( level ).to.be.equal ( 1 )
                                    }
                            )
            ;

        log ({ 
                message: msg, 
                level : 1  // Setup level(s) for this specific message.
            })
}) // it log arguments



it ( 'Different instances of log with own settings', () => {
        const 
                  msg1 = 'First'
                , log1 = createLog ( {level:6},({ message, level, logLevel, type }) => {
                                            expect ( level ).to.be.equal ( 1 )      // Default level per message if it's not defined at all
                                            expect ( logLevel ).to.be.equal ( 6 )   // Changed by 'options' object 
                                            expect ( type ).to.be.equal ( 'log' )   // Type default value if it's not defined
                                            return `log1: ${message}`
                                        })
                , log2 = createLog ( { defaultMessageLevel: 2 },({ message, level, logLevel }) => {
                                            expect ( level ).to.be.equal ( 2 )        // Changed by 'options' object - property 'defaultMessageLevel'
                                            expect ( logLevel ).to.be.equal ( 1000 )  // Default 'logLevel' if it's not defined
                                            if ( level === 0 )   return 'x'
                                            return `log2: ${message}`
                                        })
                , log3 = createLog ( {level:0 }, ({ level, logLevel, message }) => {
                                            expect ( level ).to.be.equal ( 1 )
                                            if ( logLevel === 0 )   return 'x'
                                            return message
                                        })
                ;

        const
              res1 = log1 ({message:msg1})   // Nothing defined but the message   
            , res2 = log2 ({message: msg1})  // Message level is defined in 'options' during log2 creation.
            , res3 = log3 ({message: msg1, level:1 })   // Function log3 is closed during creation. Object 'options' contains (level:0)
            ;

        expect ( res1 ).to.be.equal ( `log1: ${msg1}`)
        expect ( res2 ).to.be.equal ( `log2: ${msg1}`)
        expect ( res3 ).to.be.equal ( 'x' )
}) // it different instances



it ( 'Extra log arguments', () => {
        const 
              msg = 'My message'
            , log = createLog ({}, ({extra}) => extra )  // Define log function just to see if parameter is here.
            ;
        const res = log ({ message:msg, extra: 'ole' });
        expect ( res ).to.be.equal ( 'ole' )
}) // it extra arguments



it ( 'Default logFunction', () => {
     const 
          msg = 'My message'
        , log = createLog ()   // Simplest method to create a log function
        ;

    let 
          res1 = log ({ message: msg })
        , res2 = log ({ message: msg, level: 1200 })   // Default logLevel is 1000, so message with level 1200 should be hidden
        ;
    expect ( res1 ).to.be.equal ( '[Debug]: My message' )
    expect ( res2 ).to.be.null
}) // it default logFunction



it ( 'Custom level system based on words', () => {
    const
            msg = 'My message'
          , msgDefault = ['basic','warning', 'all' ]
          , log = createLog (
                               { level: 'basic', defaultMessageLevel: msgDefault }
                             , ({ message, level, logLevel }) => {
                                        if ( level.includes(logLevel) ) {
                                                 return message
                                            }   
                                        return null
                                  }) 
          ;
    let 
         res1 = log ({ message: msg, level: [ 'basic', 'warning', 'all'] })
      ,  res2 = log ({ message: msg, level: [ 'warning', 'all'] })
      ,  res3 = log ({ message: msg })
      ;

    expect ( res1 ).to.be.equal ( msg )
    expect ( res2 ).to.be.null
    expect ( res3 ).to.be.equal ( msg )
}) // it Custom level system based on words



it ( 'Log as a wrapper for user role specific code', () => {
    let
           a = 'not changes'
         , user = { role: 'guest' }
         ;
    const
        roleSpecific = createLog (
                                  { 
                                        defaultMessageLevel: [ 'admin', 'owner', 'guest' ]
                                      , level : user.role 
                                    },
                                  ({ level, logLevel, fn }) => {
                                          if ( level.includes(logLevel)  ) {   // execute user role specific code..
                                                  return fn()
                                              }
                                    return null
                              })

    roleSpecific ({ level: [ 'admin', 'owner'], fn: () => a = 'admin changed' })
    expect ( a ).to.be.equal ( 'not changes' )

    roleSpecific ({ level: [ 'guest'], fn: () => a = 'guest changed' })
    expect ( a ).to.be.equal ( 'guest changed' )
    
    roleSpecific({ fn:() => a = 'general code'})
    expect ( a ).to.be.equal ( 'general code' )
}) // it Log as a wrapper for user role specific code

}) // describe


