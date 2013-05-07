    /*
    * *** THIS OVERLOAD DEFAULT FUNCTION ***
    */
    var ltestUnitExecute2 = function( func ) {
        if ( ! LTYPE_TEST_MODE ) {
            throw new Error("LTYPE_TEST_MODE is off");
        }
        if ( LTYPE_TEST_MODE ) {
            LTYPE_LAST_OUTPUT = [];
        }
        try {
            func();
            return {
                type : 'NORMAL',
                value : LTYPE_LAST_OUTPUT,
            };
        } catch ( e ) {
            if ( e.message == "Type Mismatch" ) {
                return {
                    type : 'ERROR',
                    value : LTYPE_LAST_OUTPUT,
                };
            } else {
                return {
                    type:'SYSTEM ERROR',
                    value : e.message,
                    stack : e.stack,
                };
            }
        }
    }

    // ltestSetIgnoreAll(true);
    // .lexe();
    var __ltypeTestExpectNormal = function( output ) {
        // expecting 'NORMAL'
        if ( output.type =='NORMAL' ) {
            return true;
        } else if ( output.type =='ERROR' ) {
            return false;
        } else {
            throw 'unknown value at ltestUnit()'+ JSON.stringify( output );
        }
    };
    var __ltypeTestExpectError = function( output ) {
        // expecting 'ERROR'
        if ( output.type =='NORMAL' ) {
            return false;
        } else if ( output.type =='ERROR' ) {
            return true;
        } else {
            throw 'unknown value at ltestUnit()' + JSON.stringify( output );
        }
    };

    var ltypeTestAuto = function( name, func ) {
        // delegating to ltestUnit();
        if ( 0<=name.indexOf( "[NORMAL]" ) ) {
            return ltestUnit( name, func, __ltypeTestExpectNormal );
        } else if ( 0<=name.indexOf( "[ERROR]" ) ) {
            return ltestUnit( name, func, __ltypeTestExpectError );
        } else {
            throw '"'+name + '" does not contain valid token.';
        }
    };

    var ltypeTestExpectValue = function( name, func ) {
        // delegating to ltestUnit();
        return ltestUnit( name, func, __ltypeTestExpectNormal );
    };
    var ltypeTestExpectError = function( name, func ) {
        // delegating to ltestUnit().
        return ltestUnit( name, func, __ltypeTestExpectError );
    };
    // ltestSetFilterFunction( 'ONLY_CRITICAL');


    function ltest() {
        LTYPE_TEST_MODE = true;
        ltestBegin('TEST');

        // peq_test();
        //

        t00();
        function t00() {
            ltestSetUnitExecute( null );

            ltypeTestExpectValue( "ILLEGAL_COMPILE_NO_PARAM[NORMAL] (if no argument/undefined was passed to lcompile, it treats as an empty array.)", function () {
                var lcast = lcompile(); 
                return 'ok';
            });

            ltypeTestExpectError( "ILLEGAL_COMPILE_NULL[ERROR] (lcompile() throws an exception if the argument was null.)", function () {
                return lcompile( null );
            });

            ltypeTestExpectError( "ILLEGAL_COMPILE_NUM[ERROR] (lcompile throws an exception if lcompile gets any value other than an array.)", function () {
                return lcompile( 1 );
            });

            ltypeTestExpectError( "ILLEGAL_COMPILE_STR[ERROR] (lcompile throws an exception if lcompile gets any value other than an array.)", function () {
                return lcompile( "hello" );
            });

            ltypeTestAuto( "ILLEGAL_COMPILE_NO_LTYPEOF[NORMAL] (lcompile throws an exception if any of typedef-object contains no LTYPEOF property.)", function () {
                return lcompile([
                    {NAME:"test", /* LTYPEOF:'any', */  },
                ]);
            });
            ltypeTestExpectError( "ILLEGAL_COMPILE_NO_NAME[ERROR] (lcompile throws an exception if any of typeof-object contains no NAME property.)", function () {
                return lcompile([
                    {/*NAME:"test",*/ LTYPEOF:'any',  },
                ]);
            });

        }


        t01() ;
        function t01() {
            // [ "undefined" , "boolean" , "number" , "string" , "function", "object" ]
            // + "null", "array"
            ltestSetUnitExecute( ltestUnitExecute2 );
            var lcast = lcompile(); 

            // 
            ltypeTestAuto( "BASICTYPE_ANY_WITH_UNDEFINED           [ERROR]",   function () { return lcast( "any"       , undefined     ) } );
            ltypeTestAuto( "BASICTYPE_ANY_WITH_BOOLEAN_TRUE        [NORMAL]",  function () { return lcast( "any"       , true          ) } );
            ltypeTestAuto( "BASICTYPE_ANY_WITH_BOOLEAN_FALSE       [NORMAL]",  function () { return lcast( "any"       , false         ) } );
            ltypeTestAuto( "BASICTYPE_ANY_WITH_NUMBER_1            [NORMAL]",  function () { return lcast( "any"       , 1             ) } );
            ltypeTestAuto( "BASICTYPE_ANY_WITH_NUMBER_E            [NORMAL]",  function () { return lcast( "any"       , 1.0e10        ) } );
            ltypeTestAuto( "BASICTYPE_ANY_WITH_NUMBER_NaN          [NORMAL]",  function () { return lcast( "any"       , NaN           ) } );
            ltypeTestAuto( "BASICTYPE_ANY_WITH_STRING              [NORMAL]",  function () { return lcast( "any"       , 'hello'       ) } );
            ltypeTestAuto( "BASICTYPE_ANY_WITH_FUNCTION            [NORMAL]",  function () { return lcast( "any"       , function() {} ) } );
            ltypeTestAuto( "BASICTYPE_ANY_WITH_OBJECT              [NORMAL]",  function () { return lcast( "any"       , {}            ) } );
            ltypeTestAuto( "BASICTYPE_ANY_WITH_NULL                [NORMAL]",  function () { return lcast( "any"       , null          ) } );
            ltypeTestAuto( "BASICTYPE_ANY_WITH_ARRAY               [NORMAL]",  function () { return lcast( "any"       , []            ) } );

            ltypeTestAuto( "BASICTYPE_NULL_WITH_UNDEFINED          [ERROR]",   function () { return lcast( "null"      , undefined     ) } );
            ltypeTestAuto( "BASICTYPE_NULL_WITH_BOOLEAN_TRUE       [ERROR]",   function () { return lcast( "null"      , true          ) } );
            ltypeTestAuto( "BASICTYPE_NULL_WITH_BOOLEAN_FALSE      [ERROR]",   function () { return lcast( "null"      , false         ) } );
            ltypeTestAuto( "BASICTYPE_NULL_WITH_NUMBER_1           [ERROR]",   function () { return lcast( "null"      , 1             ) } );
            ltypeTestAuto( "BASICTYPE_NULL_WITH_NUMBER_E           [ERROR]",   function () { return lcast( "null"      , 1.0e10        ) } );
            ltypeTestAuto( "BASICTYPE_NULL_WITH_NUMBER_NaN         [ERROR]",   function () { return lcast( "null"      , NaN           ) } );
            ltypeTestAuto( "BASICTYPE_NULL_WITH_STRING             [ERROR]",   function () { return lcast( "null"      , 'hello'       ) } );
            ltypeTestAuto( "BASICTYPE_NULL_WITH_FUNCTION           [ERROR]",   function () { return lcast( "null"      , function() {} ) } );
            ltypeTestAuto( "BASICTYPE_NULL_WITH_OBJECT             [ERROR]",   function () { return lcast( "null"      , {}            ) } );
            ltypeTestAuto( "BASICTYPE_NULL_WITH_NULL               [NORMAL]",  function () { return lcast( "null"      , null          ) } );
            ltypeTestAuto( "BASICTYPE_NULL_WITH_ARRAY              [ERROR]",   function () { return lcast( "null"      , []            ) } );

            ltypeTestAuto( "BASICTYPE_ARRAY_WITH_UNDEFINED         [ERROR]",   function () { return lcast( "array"     , undefined     ) } );
            ltypeTestAuto( "BASICTYPE_ARRAY_WITH_BOOLEAN_TRUE      [ERROR]",   function () { return lcast( "array"     , true          ) } );
            ltypeTestAuto( "BASICTYPE_ARRAY_WITH_BOOLEAN_FALSE     [ERROR]",   function () { return lcast( "array"     , false         ) } );
            ltypeTestAuto( "BASICTYPE_ARRAY_WITH_NUMBER_1          [ERROR]",   function () { return lcast( "array"     , 1             ) } );
            ltypeTestAuto( "BASICTYPE_ARRAY_WITH_NUMBER_E          [ERROR]",   function () { return lcast( "array"     , 1.0e10        ) } );
            ltypeTestAuto( "BASICTYPE_ARRAY_WITH_NUMBER_NaN        [ERROR]",   function () { return lcast( "array"     , NaN           ) } );
            ltypeTestAuto( "BASICTYPE_ARRAY_WITH_STRING            [ERROR]",   function () { return lcast( "array"     , 'hello'       ) } );
            ltypeTestAuto( "BASICTYPE_ARRAY_WITH_FUNCTION          [ERROR]",   function () { return lcast( "array"     , function() {} ) } );
            ltypeTestAuto( "BASICTYPE_ARRAY_WITH_OBJECT            [ERROR]",   function () { return lcast( "array"     , {}            ) } );
            ltypeTestAuto( "BASICTYPE_ARRAY_WITH_NULL              [ERROR]",   function () { return lcast( "array"     , null          ) } );
            ltypeTestAuto( "BASICTYPE_ARRAY_WITH_ARRAY             [NORMAL]",  function () { return lcast( "array"     , []            ) } );

            ltypeTestAuto( "BASICTYPE_UNDEFINED_WITH_UNDEFINED     [NORMAL]",  function () { return lcast( "undefined" , undefined     ) } );
            ltypeTestAuto( "BASICTYPE_UNDEFINED_WITH_BOOLEAN_TRUE  [ERROR]",   function () { return lcast( "undefined" , true          ) } );
            ltypeTestAuto( "BASICTYPE_UNDEFINED_WITH_BOOLEAN_FALSE [ERROR]",   function () { return lcast( "undefined" , false         ) } );
            ltypeTestAuto( "BASICTYPE_UNDEFINED_WITH_NUMBER_1      [ERROR]",   function () { return lcast( "undefined" ,  1            ) } );
            ltypeTestAuto( "BASICTYPE_UNDEFINED_WITH_NUMBER_E      [ERROR]",   function () { return lcast( "undefined" , 1.0e10        ) } );
            ltypeTestAuto( "BASICTYPE_UNDEFINED_WITH_NUMBER_NaN    [ERROR]",   function () { return lcast( "undefined" , NaN           ) } );
            ltypeTestAuto( "BASICTYPE_UNDEFINED_WITH_STRING        [ERROR]",   function () { return lcast( "undefined" , 'hello'       ) } );
            ltypeTestAuto( "BASICTYPE_UNDEFINED_WITH_FUNCTION      [ERROR]",   function () { return lcast( "undefined" , function() {} ) } );
            ltypeTestAuto( "BASICTYPE_UNDEFINED_WITH_OBJECT        [ERROR]",   function () { return lcast( "undefined" , {}            ) } );
            ltypeTestAuto( "BASICTYPE_UNDEFINED_WITH_NULL          [ERROR]",   function () { return lcast( "undefined" , null          ) } );
            ltypeTestAuto( "BASICTYPE_UNDEFINED_WITH_ARRAY         [ERROR]",   function () { return lcast( "undefined" , []            ) } );

            ltypeTestAuto( "BASICTYPE_FUNCTION_WITH_UNDEFINED      [ERROR]",   function () { return lcast( "function"  , undefined     ) } );
            ltypeTestAuto( "BASICTYPE_FUNCTION_WITH_BOOLEAN_TRUE   [ERROR]",   function () { return lcast( "function"  , true          ) } );
            ltypeTestAuto( "BASICTYPE_FUNCTION_WITH_BOOLEAN_FALSE  [ERROR]",   function () { return lcast( "function"  , false         ) } );
            ltypeTestAuto( "BASICTYPE_FUNCTION_WITH_NUMBER_1       [ERROR]",   function () { return lcast( "function"  ,  1            ) } );
            ltypeTestAuto( "BASICTYPE_FUNCTION_WITH_NUMBER_E       [ERROR]",   function () { return lcast( "function"  , 1.0e10        ) } );
            ltypeTestAuto( "BASICTYPE_FUNCTION_WITH_NUMBER_NaN     [ERROR]",   function () { return lcast( "function"  , NaN           ) } );
            ltypeTestAuto( "BASICTYPE_FUNCTION_WITH_STRING         [ERROR]",   function () { return lcast( "function"  , 'hello'       ) } );
            ltypeTestAuto( "BASICTYPE_FUNCTION_WITH_FUNCTION       [NORMAL]",  function () { return lcast( "function"  , function() {} ) } );
            ltypeTestAuto( "BASICTYPE_FUNCTION_WITH_OBJECT         [ERROR]",   function () { return lcast( "function"  , {}            ) } );
            ltypeTestAuto( "BASICTYPE_FUNCTION_WITH_NULL           [ERROR]",   function () { return lcast( "function"  , null          ) } );
            ltypeTestAuto( "BASICTYPE_FUNCTION_WITH_ARRAY          [ERROR]",   function () { return lcast( "function"  , []            ) } );

            ltypeTestAuto( "BASICTYPE_OBJECT_WITH_UNDEFINED        [ERROR]",   function () { return lcast( "object"    , undefined     ) } );
            ltypeTestAuto( "BASICTYPE_OBJECT_WITH_BOOLEAN_TRUE     [ERROR]",   function () { return lcast( "object"    , true          ) } );
            ltypeTestAuto( "BASICTYPE_OBJECT_WITH_BOOLEAN_FALSE    [ERROR]",   function () { return lcast( "object"    , false         ) } );
            ltypeTestAuto( "BASICTYPE_OBJECT_WITH_NUMBER_1         [ERROR]",   function () { return lcast( "object"    , 1             ) } );
            ltypeTestAuto( "BASICTYPE_OBJECT_WITH_NUMBER_E         [ERROR]",   function () { return lcast( "object"    , 1.0e10        ) } );
            ltypeTestAuto( "BASICTYPE_OBJECT_WITH_NUMBER_NaN       [ERROR]",   function () { return lcast( "object"    , NaN           ) } );
            ltypeTestAuto( "BASICTYPE_OBJECT_WITH_STRING           [ERROR]",   function () { return lcast( "object"    , 'hello'       ) } );
            ltypeTestAuto( "BASICTYPE_OBJECT_WITH_FUNCTION         [ERROR]",   function () { return lcast( "object"    , function() {} ) } );
            ltypeTestAuto( "BASICTYPE_OBJECT_WITH_OBJECT           [NORMAL]",  function () { return lcast( "object"    , {}            ) } );
            ltypeTestAuto( "BASICTYPE_OBJECT_WITH_NULL             [ERROR]",   function () { return lcast( "object"    , null          ) } );
            ltypeTestAuto( "BASICTYPE_OBJECT_WITH_ARRAY            [ERROR]",   function () { return lcast( "object"    , []            ) } );

            ltypeTestAuto( "BASICTYPE_BOOLEAN_WITH_UNDEFINED       [ERROR]",   function () { return lcast( "boolean"   , undefined     ) } );
            ltypeTestAuto( "BASICTYPE_BOOLEAN_WITH_BOOLEAN_TRUE    [NORMAL]",  function () { return lcast( "boolean"   , true          ) } );
            ltypeTestAuto( "BASICTYPE_BOOLEAN_WITH_BOOLEAN_FALSE   [NORMAL]",  function () { return lcast( "boolean"   , false         ) } );
            ltypeTestAuto( "BASICTYPE_BOOLEAN_WITH_NUMBER_1        [ERROR]",   function () { return lcast( "boolean"   , 1             ) } );
            ltypeTestAuto( "BASICTYPE_BOOLEAN_WITH_NUMBER_E        [ERROR]",   function () { return lcast( "boolean"   , 1.0e10        ) } );
            ltypeTestAuto( "BASICTYPE_BOOLEAN_WITH_NUMBER_NaN      [ERROR]",   function () { return lcast( "boolean"   , NaN           ) } );
            ltypeTestAuto( "BASICTYPE_BOOLEAN_WITH_STRING          [ERROR]",   function () { return lcast( "boolean"   , 'hello'       ) } );
            ltypeTestAuto( "BASICTYPE_BOOLEAN_WITH_FUNCTION        [ERROR]",   function () { return lcast( "boolean"   , function() {} ) } );
            ltypeTestAuto( "BASICTYPE_BOOLEAN_WITH_OBJECT          [ERROR]",   function () { return lcast( "boolean"   , {}            ) } );
            ltypeTestAuto( "BASICTYPE_BOOLEAN_WITH_NULL            [ERROR]",   function () { return lcast( "boolean"   , null          ) } );
            ltypeTestAuto( "BASICTYPE_BOOLEAN_WITH_ARRAY           [ERROR]",   function () { return lcast( "boolean"   , []            ) } );

            ltypeTestAuto( "BASICTYPE_STRING_WITH_UNDEFINED        [ERROR]",   function () { return lcast( "string"    , undefined     ) } );
            ltypeTestAuto( "BASICTYPE_STRING_WITH_BOOLEAN_TRUE     [ERROR]",   function () { return lcast( "string"    , true          ) } );
            ltypeTestAuto( "BASICTYPE_STRING_WITH_BOOLEAN_FALSE    [ERROR]",   function () { return lcast( "string"    , false         ) } );
            ltypeTestAuto( "BASICTYPE_STRING_WITH_NUMBER_1         [ERROR]",   function () { return lcast( "string"    , 1             ) } );
            ltypeTestAuto( "BASICTYPE_STRING_WITH_NUMBER_E         [ERROR]",   function () { return lcast( "string"    , 1.0e10        ) } );
            ltypeTestAuto( "BASICTYPE_STRING_WITH_NUMBER_NaN       [ERROR]",   function () { return lcast( "string"    , NaN           ) } );
            ltypeTestAuto( "BASICTYPE_STRING_WITH_STRING           [NORMAL]",  function () { return lcast( "string"    , 'hello'       ) } );
            ltypeTestAuto( "BASICTYPE_STRING_WITH_FUNCTION         [ERROR]",   function () { return lcast( "string"    , function() {} ) } );
            ltypeTestAuto( "BASICTYPE_STRING_WITH_OBJECT           [ERROR]",   function () { return lcast( "string"    , {}            ) } );
            ltypeTestAuto( "BASICTYPE_STRING_WITH_NULL             [ERROR]",   function () { return lcast( "string"    , null          ) } );
            ltypeTestAuto( "BASICTYPE_STRING_WITH_ARRAY            [ERROR]",   function () { return lcast( "string"    , []            ) } );

            ltypeTestAuto( "BASICTYPE_NUMBER_WITH_UNDEFINED        [ERROR]",   function () { return lcast( "number"    , undefined     ) } );
            ltypeTestAuto( "BASICTYPE_NUMBER_WITH_BOOLEAN_TRUE     [ERROR]",   function () { return lcast( "number"    , true          ) } );
            ltypeTestAuto( "BASICTYPE_NUMBER_WITH_BOOLEAN_FALSE    [ERROR]",   function () { return lcast( "number"    , false         ) } );
            ltypeTestAuto( "BASICTYPE_NUMBER_WITH_NUMBER_1         [NORMAL]",  function () { return lcast( "number"    , 1             ) } );
            ltypeTestAuto( "BASICTYPE_NUMBER_WITH_NUMBER_E         [NORMAL]",  function () { return lcast( "number"    , 1.0e10        ) } );
            ltypeTestAuto( "BASICTYPE_NUMBER_WITH_NUMBER_NaN       [NORMAL]",  function () { return lcast( "number"    , NaN           ) } );
            ltypeTestAuto( "BASICTYPE_NUMBER_WITH_STRING           [ERROR]",   function () { return lcast( "number"    , 'hello'       ) } );
            ltypeTestAuto( "BASICTYPE_NUMBER_WITH_FUNCTION         [ERROR]",   function () { return lcast( "number"    , function() {} ) } );
            ltypeTestAuto( "BASICTYPE_NUMBER_WITH_OBJECT           [ERROR]",   function () { return lcast( "number"    , {}            ) } );
            ltypeTestAuto( "BASICTYPE_NUMBER_WITH_NULL             [ERROR]",   function () { return lcast( "number"    , null          ) } );
            ltypeTestAuto( "BASICTYPE_NUMBER_WITH_ARRAY            [ERROR]",   function () { return lcast( "number"    , []            ) } );


            // 
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_UNDEFINED           [ERROR]",   function () { return lcast( { LTYPEOF:"any"       }  ,undefined     ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_BOOLEAN_TRUE        [NORMAL]",  function () { return lcast( { LTYPEOF:"any"       }  ,true          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_BOOLEAN_FALSE       [NORMAL]",  function () { return lcast( { LTYPEOF:"any"       }  ,false         ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_NUMBER_1            [NORMAL]",  function () { return lcast( { LTYPEOF:"any"       }  ,1             ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_NUMBER_E            [NORMAL]",  function () { return lcast( { LTYPEOF:"any"       }  ,1.0e10        ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_NUMBER_NaN          [NORMAL]",  function () { return lcast( { LTYPEOF:"any"       }  ,NaN           ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_STRING              [NORMAL]",  function () { return lcast( { LTYPEOF:"any"       }  ,'hello'       ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_FUNCTION            [NORMAL]",  function () { return lcast( { LTYPEOF:"any"       }  ,function() {} ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_OBJECT              [NORMAL]",  function () { return lcast( { LTYPEOF:"any"       }  ,{}            ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_NULL                [NORMAL]",  function () { return lcast( { LTYPEOF:"any"       }  ,null          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_ARRAY               [NORMAL]",  function () { return lcast( { LTYPEOF:"any"       }  ,[]            ) } );

            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NULL_WITH_UNDEFINED          [ERROR]",   function () { return lcast( { LTYPEOF:"null"      }  ,undefined     ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NULL_WITH_BOOLEAN_TRUE       [ERROR]",   function () { return lcast( { LTYPEOF:"null"      }  ,true          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NULL_WITH_BOOLEAN_FALSE      [ERROR]",   function () { return lcast( { LTYPEOF:"null"      }  ,false         ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NULL_WITH_NUMBER_1           [ERROR]",   function () { return lcast( { LTYPEOF:"null"      }  ,1             ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NULL_WITH_NUMBER_E           [ERROR]",   function () { return lcast( { LTYPEOF:"null"      }  ,1.0e10        ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NULL_WITH_NUMBER_NaN         [ERROR]",   function () { return lcast( { LTYPEOF:"null"      }  ,NaN           ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NULL_WITH_STRING             [ERROR]",   function () { return lcast( { LTYPEOF:"null"      }  ,'hello'       ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NULL_WITH_FUNCTION           [ERROR]",   function () { return lcast( { LTYPEOF:"null"      }  ,function() {} ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NULL_WITH_OBJECT             [ERROR]",   function () { return lcast( { LTYPEOF:"null"      }  ,{}            ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NULL_WITH_NULL               [NORMAL]",  function () { return lcast( { LTYPEOF:"null"      }  ,null          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NULL_WITH_ARRAY              [ERROR]",   function () { return lcast( { LTYPEOF:"null"      }  ,[]            ) } );

            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ARRAY_WITH_UNDEFINED         [ERROR]",   function () { return lcast( { LTYPEOF:"array"     }  ,undefined     ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ARRAY_WITH_BOOLEAN_TRUE      [ERROR]",   function () { return lcast( { LTYPEOF:"array"     }  ,true          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ARRAY_WITH_BOOLEAN_FALSE     [ERROR]",   function () { return lcast( { LTYPEOF:"array"     }  ,false         ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ARRAY_WITH_NUMBER_1          [ERROR]",   function () { return lcast( { LTYPEOF:"array"     }  ,1             ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ARRAY_WITH_NUMBER_E          [ERROR]",   function () { return lcast( { LTYPEOF:"array"     }  ,1.0e10        ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ARRAY_WITH_NUMBER_NaN        [ERROR]",   function () { return lcast( { LTYPEOF:"array"     }  ,NaN           ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ARRAY_WITH_STRING            [ERROR]",   function () { return lcast( { LTYPEOF:"array"     }  ,'hello'       ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ARRAY_WITH_FUNCTION          [ERROR]",   function () { return lcast( { LTYPEOF:"array"     }  ,function() {} ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ARRAY_WITH_OBJECT            [ERROR]",   function () { return lcast( { LTYPEOF:"array"     }  ,{}            ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ARRAY_WITH_NULL              [ERROR]",   function () { return lcast( { LTYPEOF:"array"     }  ,null          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_ARRAY_WITH_ARRAY             [NORMAL]",  function () { return lcast( { LTYPEOF:"array"     }  ,[]            ) } );

            ltypeTestAuto( "TYPEDEF_OBJECT_OF_UNDEFINED_WITH_UNDEFINED     [NORMAL]",  function () { return lcast( { LTYPEOF:"undefined" }  ,undefined     ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_UNDEFINED_WITH_BOOLEAN_TRUE  [ERROR]",   function () { return lcast( { LTYPEOF:"undefined" }  ,true          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_UNDEFINED_WITH_BOOLEAN_FALSE [ERROR]",   function () { return lcast( { LTYPEOF:"undefined" }  ,false         ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_UNDEFINED_WITH_NUMBER_1      [ERROR]",   function () { return lcast( { LTYPEOF:"undefined" }  , 1            ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_UNDEFINED_WITH_NUMBER_E      [ERROR]",   function () { return lcast( { LTYPEOF:"undefined" }  ,1.0e10        ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_UNDEFINED_WITH_NUMBER_NaN    [ERROR]",   function () { return lcast( { LTYPEOF:"undefined" }  ,NaN           ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_UNDEFINED_WITH_STRING        [ERROR]",   function () { return lcast( { LTYPEOF:"undefined" }  ,'hello'       ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_UNDEFINED_WITH_FUNCTION      [ERROR]",   function () { return lcast( { LTYPEOF:"undefined" }  ,function() {} ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_UNDEFINED_WITH_OBJECT        [ERROR]",   function () { return lcast( { LTYPEOF:"undefined" }  ,{}            ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_UNDEFINED_WITH_NULL          [ERROR]",   function () { return lcast( { LTYPEOF:"undefined" }  ,null          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_UNDEFINED_WITH_ARRAY         [ERROR]",   function () { return lcast( { LTYPEOF:"undefined" }  ,[]            ) } );

            ltypeTestAuto( "TYPEDEF_OBJECT_OF_FUNCTION_WITH_UNDEFINED      [ERROR]",   function () { return lcast( { LTYPEOF:"function"  }  ,undefined     ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_FUNCTION_WITH_BOOLEAN_TRUE   [ERROR]",   function () { return lcast( { LTYPEOF:"function"  }  ,true          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_FUNCTION_WITH_BOOLEAN_FALSE  [ERROR]",   function () { return lcast( { LTYPEOF:"function"  }  ,false         ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_FUNCTION_WITH_NUMBER_1       [ERROR]",   function () { return lcast( { LTYPEOF:"function"  }  , 1            ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_FUNCTION_WITH_NUMBER_E       [ERROR]",   function () { return lcast( { LTYPEOF:"function"  }  ,1.0e10        ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_FUNCTION_WITH_NUMBER_NaN     [ERROR]",   function () { return lcast( { LTYPEOF:"function"  }  ,NaN           ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_FUNCTION_WITH_STRING         [ERROR]",   function () { return lcast( { LTYPEOF:"function"  }  ,'hello'       ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_FUNCTION_WITH_FUNCTION       [NORMAL]",  function () { return lcast( { LTYPEOF:"function"  }  ,function() {} ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_FUNCTION_WITH_OBJECT         [ERROR]",   function () { return lcast( { LTYPEOF:"function"  }  ,{}            ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_FUNCTION_WITH_NULL           [ERROR]",   function () { return lcast( { LTYPEOF:"function"  }  ,null          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_FUNCTION_WITH_ARRAY          [ERROR]",   function () { return lcast( { LTYPEOF:"function"  }  ,[]            ) } );

            ltypeTestAuto( "TYPEDEF_OBJECT_OF_OBJECT_WITH_UNDEFINED        [ERROR]",   function () { return lcast( { LTYPEOF:"object"    }  ,undefined     ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_OBJECT_WITH_BOOLEAN_TRUE     [ERROR]",   function () { return lcast( { LTYPEOF:"object"    }  ,true          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_OBJECT_WITH_BOOLEAN_FALSE    [ERROR]",   function () { return lcast( { LTYPEOF:"object"    }  ,false         ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_OBJECT_WITH_NUMBER_1         [ERROR]",   function () { return lcast( { LTYPEOF:"object"    }  ,1             ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_OBJECT_WITH_NUMBER_E         [ERROR]",   function () { return lcast( { LTYPEOF:"object"    }  ,1.0e10        ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_OBJECT_WITH_NUMBER_NaN       [ERROR]",   function () { return lcast( { LTYPEOF:"object"    }  ,NaN           ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_OBJECT_WITH_STRING           [ERROR]",   function () { return lcast( { LTYPEOF:"object"    }  ,'hello'       ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_OBJECT_WITH_FUNCTION         [ERROR]",   function () { return lcast( { LTYPEOF:"object"    }  ,function() {} ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_OBJECT_WITH_OBJECT           [NORMAL]",  function () { return lcast( { LTYPEOF:"object"    }  ,{}            ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_OBJECT_WITH_NULL             [ERROR]",   function () { return lcast( { LTYPEOF:"object"    }  ,null          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_OBJECT_WITH_ARRAY            [ERROR]",   function () { return lcast( { LTYPEOF:"object"    }  ,[]            ) } );

            ltypeTestAuto( "TYPEDEF_OBJECT_OF_BOOLEAN_WITH_UNDEFINED       [ERROR]",   function () { return lcast( { LTYPEOF:"boolean"   }  ,undefined     ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_BOOLEAN_WITH_BOOLEAN_TRUE    [NORMAL]",  function () { return lcast( { LTYPEOF:"boolean"   }  ,true          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_BOOLEAN_WITH_BOOLEAN_FALSE   [NORMAL]",  function () { return lcast( { LTYPEOF:"boolean"   }  ,false         ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_BOOLEAN_WITH_NUMBER_1        [ERROR]",   function () { return lcast( { LTYPEOF:"boolean"   }  ,1             ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_BOOLEAN_WITH_NUMBER_E        [ERROR]",   function () { return lcast( { LTYPEOF:"boolean"   }  ,1.0e10        ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_BOOLEAN_WITH_NUMBER_NaN      [ERROR]",   function () { return lcast( { LTYPEOF:"boolean"   }  ,NaN           ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_BOOLEAN_WITH_STRING          [ERROR]",   function () { return lcast( { LTYPEOF:"boolean"   }  ,'hello'       ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_BOOLEAN_WITH_FUNCTION        [ERROR]",   function () { return lcast( { LTYPEOF:"boolean"   }  ,function() {} ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_BOOLEAN_WITH_OBJECT          [ERROR]",   function () { return lcast( { LTYPEOF:"boolean"   }  ,{}            ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_BOOLEAN_WITH_NULL            [ERROR]",   function () { return lcast( { LTYPEOF:"boolean"   }  ,null          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_BOOLEAN_WITH_ARRAY           [ERROR]",   function () { return lcast( { LTYPEOF:"boolean"   }  ,[]            ) } );

            ltypeTestAuto( "TYPEDEF_OBJECT_OF_STRING_WITH_UNDEFINED        [ERROR]",   function () { return lcast( { LTYPEOF:"string"    }  ,undefined     ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_STRING_WITH_BOOLEAN_TRUE     [ERROR]",   function () { return lcast( { LTYPEOF:"string"    }  ,true          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_STRING_WITH_BOOLEAN_FALSE    [ERROR]",   function () { return lcast( { LTYPEOF:"string"    }  ,false         ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_STRING_WITH_NUMBER_1         [ERROR]",   function () { return lcast( { LTYPEOF:"string"    }  ,1             ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_STRING_WITH_NUMBER_E         [ERROR]",   function () { return lcast( { LTYPEOF:"string"    }  ,1.0e10        ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_STRING_WITH_NUMBER_NaN       [ERROR]",   function () { return lcast( { LTYPEOF:"string"    }  ,NaN           ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_STRING_WITH_STRING           [NORMAL]",  function () { return lcast( { LTYPEOF:"string"    }  ,'hello'       ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_STRING_WITH_FUNCTION         [ERROR]",   function () { return lcast( { LTYPEOF:"string"    }  ,function() {} ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_STRING_WITH_OBJECT           [ERROR]",   function () { return lcast( { LTYPEOF:"string"    }  ,{}            ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_STRING_WITH_NULL             [ERROR]",   function () { return lcast( { LTYPEOF:"string"    }  ,null          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_STRING_WITH_ARRAY            [ERROR]",   function () { return lcast( { LTYPEOF:"string"    }  ,[]            ) } );

            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NUMBER_WITH_UNDEFINED        [ERROR]",   function () { return lcast( { LTYPEOF:"number"    }  ,undefined     ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NUMBER_WITH_BOOLEAN_TRUE     [ERROR]",   function () { return lcast( { LTYPEOF:"number"    }  ,true          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NUMBER_WITH_BOOLEAN_FALSE    [ERROR]",   function () { return lcast( { LTYPEOF:"number"    }  ,false         ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NUMBER_WITH_NUMBER_1         [NORMAL]",  function () { return lcast( { LTYPEOF:"number"    }  ,1             ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NUMBER_WITH_NUMBER_E         [NORMAL]",  function () { return lcast( { LTYPEOF:"number"    }  ,1.0e10        ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NUMBER_WITH_NUMBER_NaN       [NORMAL]",  function () { return lcast( { LTYPEOF:"number"    }  ,NaN           ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NUMBER_WITH_STRING           [ERROR]",   function () { return lcast( { LTYPEOF:"number"    }  ,'hello'       ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NUMBER_WITH_FUNCTION         [ERROR]",   function () { return lcast( { LTYPEOF:"number"    }  ,function() {} ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NUMBER_WITH_OBJECT           [ERROR]",   function () { return lcast( { LTYPEOF:"number"    }  ,{}            ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NUMBER_WITH_NULL             [ERROR]",   function () { return lcast( { LTYPEOF:"number"    }  ,null          ) } );
            ltypeTestAuto( "TYPEDEF_OBJECT_OF_NUMBER_WITH_ARRAY            [ERROR]",   function () { return lcast( { LTYPEOF:"number"    }  ,[]            ) } );

        }

        tpat();
        function tpat() {
            ltestSetUnitExecute( ltestUnitExecute2 );
            var lcast;
            ltypeTestAuto( "REGEXP_TEST00 [NORMAL]",  function () { 
                lcast = lcompile([
                    {
                        NAME : 'LPatternTest', // Specify its ID string as a property 'NAME'
                        LTYPEOF: 'any',
                        REGEXP : [ '^[a-z]*$', '^[0-9]\\.[0-9][0-9]$' ],
                    }
                ]);
            });
            ltypeTestAuto( "REGEXP_TEST01 [NORMAL]",  function () { 
                lcast( 'LPatternTest', 'abc' ); // [OK]
            });
            ltypeTestAuto( "REGEXP_TEST02 [ERROR]",  function () { 
                lcast( 'LPatternTest', 'ABC' ); // [FAIL]
            });
            ltypeTestAuto( "REGEXP_TEST02 [NORMAL]",  function () { 
                lcast( 'LPatternTest', '3.14' ); // [OK]
            });
            ltypeTestAuto( "REGEXP_TEST03 [NORMAL]",  function () { 
                lcast( 'LPatternTest', '1.41' ); // [OK]
            });
            ltypeTestAuto( "REGEXP_TEST04 [ERROR]",  function () { 
                lcast( 'LPatternTest', '2.718281828' ); // [FAIL]
            });
        }

        t02();
        function t02() {
            ltestSetUnitExecute( ltestUnitExecute2 );
            ltypeTestAuto( "LIS_DEFAULT_TO_NAME_01 [NORMAL] (LIS defaults to NAME. Test the case when LIS is *an empty array*. Check if embeding procedure is working correctly,too.)",  function () { 
                var lcast = lcompile([ { NAME:"LHello",   LTYPEOF:'object',  LIS :[] } ] );
                return lcast( "*LHello", lcast("LHello", {} ) );
            });

            ltypeTestAuto( "LIS_DEFAULT_TO_NAME_02 [NORMAL] (LIS defaults to NAME. Test the case when its *LIS property already contains NAME*. Check if the embeding procedure is working correctly,too.)",  function () { 
                var lcast = lcompile([ { NAME:"LHello",   LTYPEOF:'object',  LIS :[ "LHello" ] } ] );
                return lcast( "*LHello", lcast("LHello", {} ) );
            });




            // var lcast = lcompile(); 
            // ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_UNDEFINED    [ERROR]",   function () { return lcast( { LTYPEOF:"any" }, undefined     ) } );
            // ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_BOOLEAN_TRUE [NORMAL]",  function () { return lcast( { LTYPEOF:"any" }, true          ) } );
            // ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_BOOLEAN_FALSE[NORMAL]",  function () { return lcast( { LTYPEOF:"any" }, false         ) } );
            // ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_NUMBER_1     [NORMAL]",  function () { return lcast( { LTYPEOF:"any" },  1            ) } );
            // ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_NUMBER_E     [NORMAL]",  function () { return lcast( { LTYPEOF:"any" }, 1.0e10        ) } );
            // ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_NUMBER_NaN   [NORMAL]",  function () { return lcast( { LTYPEOF:"any" }, NaN           ) } );
            // ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_STRING       [NORMAL]",  function () { return lcast( { LTYPEOF:"any" }, 'hello'       ) } );
            // ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_FUNCTION     [NORMAL]",  function () { return lcast( { LTYPEOF:"any" }, function() {} ) } );
            // ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_OBJECT       [NORMAL]",  function () { return lcast( { LTYPEOF:"any" }, {}            ) } );
            // ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_NULL         [NORMAL]",  function () { return lcast( { LTYPEOF:"any" }, null          ) } );
            // ltypeTestAuto( "TYPEDEF_OBJECT_OF_ANY_WITH_ARRAY        [NORMAL]",  function () { return lcast( { LTYPEOF:"any" }, []            ) } );

            // ltypeTestExpectError( "UNDEFINED FIELD2",  function () { 
            //     var lcast = lcompile([ 
            //         {
            //             NAME:"LNumber",   
            //             LTYPEOF:'object',  
            //             LIS :['LNumber', ],  
            //             FIELDS: { 
            //                 num:"number||undefined", 
            //             }, 
            //         }, 
            //     ]);
            //     return lcast("*LNumber",{});
            // });

            // var lcast;
            // ltypeTestExpectValue( "UNDEFINED FIELD3",  function () { 
            //     var lcast = lcompile([ 
            //         {
            //             NAME:"LNumber",   
            //             LTYPEOF:'object',  
            //             LIS :['LNumber', ],  
            //             FIELDS: { 
            //                 num:"number||undefined", 
            //             }, 
            //         }, 
            //     ]);
            //     return lcast("*LNumber",{});
            // });
        }


        tbasic();
        function tbasic() {
            ltestSetUnitExecute( null );
            var lcast;

            // NO5
            // if lcompile gets object, return ltype's interface object.
            ltypeTestExpectValue( "COMPILE_NORMAL",  function () { 
                lcast = lcompile();
                return 'NO_ERROR';
            });

            ltestSetUnitExecute( ltestUnitExecute2 );

            ltypeTestExpectValue( "PRIMITIVETEST_01_OBJECT", function () {
                return lcast( "object", {} );
            });

            ltypeTestExpectError( "PRIMITIVETEST_02_OBJECT_WITH_NULL", function () {
                return lcast( "object", null );
            });

            ltypeTestExpectValue( "PRIMITIVETEST_03_NULL", function () {
                return lcast( "null", null );
            });

            ltypeTestExpectError( "PRIMITIVETEST_04_NULL_WITH_OBJECT", function () {
                return lcast( "null", {} );
            });

            ltypeTestExpectValue( "PRIMITIVETEST_05_ANY", function () {
                return lcast( "any", 'hello' );
            });

            ltypeTestExpectError( "PRIMITIVETEST_06_ANY_WITH_UNDEFINED", function () {
                return lcast( "any", undefined );
            });

            ltypeTestExpectError( "PRIMITIVETEST_06_ANY_WITH_UNDEFINED2", function () {
                return lcast( "any", lcast.UNDEFINED_PROPERTY );
            });

            ltypeTestExpectValue( "PRIMITIVETEST_07_ARRAY", function () {
                return lcast( "array", [] );
            });

            ltypeTestExpectError( "PRIMITIVETEST_07_ARRAY_WITH_NULL", function () {
                return lcast( "array", null );
            });
        }
        
        t1();
        function t1() {
            ltestSetUnitExecute( null );
            var lcast;
            // NO5
            // if lcompile gets object, return ltype's interface object.
            ltypeTestExpectValue( "COMPILE_NORMAL",  function () { 
                lcast = lcompile([ 
                    {NAME:"LNumber",   LTYPEOF:'object',  LIS :['LNumber', ],  FIELDS: { num:"number", }, }, 
                    {NAME:"LSub"   ,   LTYPEOF:'object',  LIS :['LSub',], }, 
                    {NAME:"LAnother",  LTYPEOF:'object',  LIS :['LAnother'],  }, 
                    {NAME:"LEnum1",    LTYPEOF:'any',     ONEOF:[1,"2",true,null], }, 
                    {NAME:"LEnum2",    LTYPEOF:'object',  ONEOF:[{hello:1,world:2},{hello:3,world:4}] },
                    {NAME:"LPat1",     LTYPEOF:'string',  REGEXP:[ "^[a-z]+$" ] } ,
                    {NAME:"LName",     LTYPEOF:'object',    LIS :['LName',         ],  FIELDS: { name:"string", }, }, 
                    {NAME:"LValue",    LTYPEOF:'object',    LIS :['LName','LValue' ],  FIELDS: { value:"string", }, }, 
                ]);
                return 'NO_ERROR';
            });

            ltestSetUnitExecute( ltestUnitExecute2 );

            // NO6
            // the definition requires number and the field is missing.
            ltypeTestExpectError( "BASICTEST_01_MISSING_PROPERTY", function () {
                return lcast( "LNumber", { NUM:"1" } );
            });

            // NO07
            // the definition requires number / the object offers number.
            ltypeTestExpectValue( "BASICTEST_02_PROPER_TYPE_DEF_AND_COMPATIBLE_OBJECT_WITH_ENABLED_FIELD_CHECK_1",  function () {
                return lcast("LNumber" ,{ num:1 });
            });
            
            // NO8
            // the definition requires number / the object offers string => expecting error.
            ltypeTestExpectError( "BASICTEST_03_INCOMPATIBLE_OBJECT_EXPECT_NUMBER_BUT_STRING", function () {
                return lcast( "LNumber", { num:"1" } );
            });

            // NO9
            // the definition requires number / the object offers object.
            ltypeTestExpectError( "BASICTEST_04_EXPECT_NUMBER_BUT_FOUND_AN_OBJECT", function () {
                return lcast( "*LNumber" ,{ num: ( lcast( "LNumber" ,{num:1} ) ) });
            });

            // NO10
            // type check : when it is compatible :
            ltypeTestExpectValue( "BASICTEST_05_CAST_CORRECT",  function () {
                return lcast( "*LNumber", lcast("LNumber", {num:1}) );
            });

            // NO11
            // type check : when it is NOT compatible :
            ltypeTestExpectError( "BASICTEST_05_CAST_INCORRECT", function () {
                return lcast("*LSub", lcast("LNumber", {num:1}) );
            });

            // equality check : LEnum1 requires 1,"2",true,null
            ltypeTestExpectValue( "ENUM_TEST_CORRECT_1", function () { 
                return lcast( "LEnum1",1 )
            });

            ltypeTestExpectValue( "ENUM_TEST_CORRECT_2",  function () { 
                return lcast( "LEnum1","2" )
            });

            ltypeTestExpectValue( "ENUM_TEST_CORRECT_3_TRUE",  function () {
                return lcast("LEnum1",true )
            });

            ltypeTestExpectValue( "ENUM_TEST_CORRECT_4_NULL", function () {
                return lcast("LEnum1",null )
            });

            ltypeTestExpectError( "ENUM_TEST_INCORRECT_1_NUM5", function () { 
                return lcast( "LEnum1", 5 )
            });

            ltypeTestExpectError( "ENUM_TEST_INCORRECT_2_STR1", function () { 
                return lcast( "LEnum1", "1" )
            });
            ltypeTestExpectError( "ENUM_TEST_INCORRECT_2_NUM2", function () { 
                return lcast( "LEnum1",2 )
            });

            ltypeTestExpectError( "ENUM_TEST_INCORRECT_3_FALSE1", function () { 
                return lcast("LEnum1",false )
            });

            // pattern check test1
            ltypeTestExpectValue( "PATTERN_TEST_1_CORRECT",  function () { 
                return lcast( "LPat1", 'abc'  )
            });

            // pattern check test2
            ltypeTestExpectError( "PATTERN_TEST_2_INCORRECT", function () { 
                return lcast( "LPat1", 'ABC'  )
            });


            ltypeTestExpectValue( "EQU_OBJECT_TEST_01_CORRECT",  function () {
                return lcast("LEnum2", {hello:1,world:2} );
            });

            ltypeTestExpectValue( "EQU_OBJECT_TEST_02_CORRECT",  function () {
                return lcast("LEnum2", {hello:3,world:4} );
            });

            ltypeTestExpectError( "EQU_OBJECT_TEST_03_INCORRECT", function () {
                return lcast("LEnum2", {hello:2,world:4} );
            });

            ltypeTestExpectError( "EQU_OBJECT_TEST_04_INCORRECT", function () {
                return lcast("LEnum2", {hello:4,world:5} );
            });


            ltypeTestExpectValue( "OPERATION_TEST_01_AND_CORRECT", function () {
                return lcast( "*LNumber", lcast("LNumber&&LSub", {num:1} ) );
            });


            ltypeTestExpectValue( "OPERATION_TEST_02_AND_CORRECT_02",  function () {
                return lcast( "*LSub", lcast( "LNumber&&LSub",{ num:1 } ) );
            });

            ltypeTestExpectError( "OPERATION_TEST_03_AND_INCORRECT_01", function () {
                return lcast( "*LAnother",lcast( "LNumber&&LSub", { num:1 } )  );
            });

            ltypeTestExpectError( "OPERATION_TEST_03_AND_INCORRECT_02_FOUND_UNDEFINED_TYPE", function () {
                return lcast( "*LUndefined", lcast( "LNumber&&LSub", { num:1 } ) );
            });

            // cast plain object to LNumber. it is expected to throw an error.
            ltypeTestExpectError( "OPERATOR_TEST_OR00_BASICAGAIN", function () {
                return lcast( "*LNumber", { num:1 } );
            });

            // operator test or(||)
            ltypeTestExpectValue( "OPERATOR_TEST_OR01", function () {
                return lcast( "null||*LNumber",lcast( "LNumber", { num:1 } ) );
            });

            ltypeTestExpectValue( "OPERATOR_TEST_OR02", function () {
                return lcast( "null||*LNumber", null );
            });
        }

        // // t2();
        function t2() {
            var lcast = lcompile( [ { NAME : "LObject", LTYPEOF:"object",FIELDS:{ obj : "LSub", }, }, { NAME:"LSub", LTYPEOF:"object", }, ] );
            ltypeTestExpectError( "", function () {
                return lcast( "LObject", { obj:1 } );
            });
            ltypeTestExpectError( "", function () {
                return lcast( "LObject", { obj:"1" } );
            });
        }
    
        // t3();
        function t3() {
            var lcast = lcompile([
                {
                    NAME : "LObject",
                    LTYPEOF : "object",
                    FIELDS : {
                        num   : "number",
                        str   : "string",
                        bool  : "boolean",
                        obj1  : "LObject||null",
                        obj2  : "LEnum",
                    }
                },
                {
                    NAME : "LEnum",
                    LTYPEOF : "string",
                    ONEOF : [ "hello","world" ],
                },
            ]);

            ltypeTestExpectError( "TOTAL_TEST_03_01", function () {
                lcast("LObject",{
                    num:1,
                    str:'',
                    bool:false,
                    obj1:lcast("LObject",{
                        num:1,
                        str:'',
                        bool:false,
                        obj1:null,
                        obj2:"hello",
                    }),
                    obj2:"world",
                });
            });

            ltypeTestExpectValue( "TOTAL_TEST_03_02",  function () {
                lcast("LObject",{
                    num:1,
                    str:'',
                    bool:false,
                    obj1:lcast("LObject",{
                        num:1,
                        str:'',
                        bool:false,
                        obj1:null,
                        obj2:"hello",
                    }),
                    obj2:"world",
                });
            });
        }

        t4();
        function t4() {
            ltestSetUnitExecute( ltestUnitExecute2 );
            var lcast = lcompile([
                {
                    NAME : "LEnum",
                    LTYPEOF : "string",
                    ONEOF : [ "hello","world" ],
                },
            ]);

            ltypeTestExpectValue( "ARRAY_TEST_04_01",  function () {
                lcast( "string[][]" ,[
                      ["1","2","3"],
                      ["4","5","6"],
                ] );
            });

            ltypeTestExpectError( "ARRAY_TEST_04_02_INCORRECT",  function () {
                lcast("string[][]", [
                      ["1","2",3 ],
                      ["4","5","6"],
                ] );
            });

            ltypeTestExpectValue( "ARRAY_TEST_04_03_CORRECT",  function () {
                lcast( "array of number",[ 1,2,3 ] );
            });

            ltypeTestExpectError( "ARRAY_TEST_04_04_INCORRECT",  function () {
                lcast( "array of string", [ '1',2,'3' ] );
            });

            ltypeTestExpectValue( "ARRAY_TEST_04_05_CORRECT",  function () {
                lcast( "array of array of string", [ 
                      ['1','2','3' ],
                      ['4','5','6' ],
                ] );
            });

            ltypeTestExpectError( "ARRAY_TEST_04_06_INCORRECT",  function () {
                lcast( "array of array of string", [ 
                      ['1','2','3' ],
                      ['4', 5 ,'6' ],
                ]);
            });

            ltypeTestExpectValue( "ARRAY_TEST_04_07_CORRECT",  function () {
                lcast( "number[]||string[]", [ '1','2','3' ] );
            });

            ltypeTestExpectValue( "ARRAY_TEST_04_08_CORRECT",  function () {
                lcast( "array of array of string||number", [ 
                      ['1','2','3' ],
                      ['4', 5 ,'6' ],
                ] );
            });
        }

        // inline definition 
        t5_0();
        function t5_0() {
            ltestSetUnitExecute( ltestUnitExecute2 );
            var lcast = lcompile([
                {
                    NAME : "LObject",
                    LTYPEOF : "object",
                    FIELDS : {
                        hello:'string',
                    },
                },
            ]); 
            
            ltypeTestExpectValue( "BASICTEST_AGAIN_1_CORRECT",  function () { 
                lcast( 'LObject', { hello:"hello world" } ); // NORMAL
            });

            ltypeTestExpectValue( "BASICTEST_AGAIN_2_CORRECT",  function () { 
                lcast( 'LObject', { hello:"hello world" } ); //NORMAL
            });

            ltypeTestExpectError( "BASICTEST_AGAIN_3_INCORRECT",  function () { 
                lcast( 'LObject', { hello:4649 } ); // ERROR
            });

            ltypeTestExpectError( "BASICTEST_AGAIN_4_INCORRECT",  function () { 
                lcast( 'LObject', { hello:null } ); // ERROR
            });
        }

        t5();
        function t5() {
            ltestSetUnitExecute( ltestUnitExecute2 );
            ltypeTestExpectValue( "INLINE_DEFINITION_2_CORRECT",  function () { 
                var lcast = lcompile([]); 
                lcast({
                    NAME:"Test",
                    LTYPEOF:"string",
                }, "hello" );
            });

            ltypeTestExpectError( "INLINE_DEFINITION_3_INCORRECT",  function () { 
                var lcast = lcompile([]); 
                lcast({
                    NAME:"Test",
                    LTYPEOF:"number",
                },"hello" );
            });

            ltypeTestExpectValue( "INLINE_DEFINITION_4_RECURSIVE_LEVEL_1_CORRECT",  function () { 
                var lcast = lcompile([]); 
                lcast({
                    NAME:"Test",
                    LTYPEOF:"object",
                    FIELDS : {
                        hello : 'string',
                        world : 'string',
                    }
                },{ 
                    hello : "HELLO!",
                    world : "WORLD!",
                });
            });

            ltypeTestExpectValue( "INLINE_DEFINITION_5_RECURSIVE_LEVEL_2_CORRECT",  function () { 
                var lcast = lcompile([]); 
                lcast({
                    NAME:"Test",
                    LTYPEOF:"object",
                    FIELDS : {
                        hello : 'string',
                        world : 'string',
                        recursive : {
                            NAME:"Test.TYP1",
                            LTYPEOF:"object",
                            FIELDS : {
                                foo : 'string',
                                bar : 'string',
                            }
                        },
                    }
                },{ 
                    hello : "HELLO!",
                    world : "WORLD!",
                    recursive : {
                        foo : "FOO!",
                        bar : "BAR!",
                    }
                });
            });

            ltypeTestExpectValue( "UNDEFINED_FIELD01_CORRECT",  function () { 
                var lcast = lcompile([
                    {
                        NAME : "LObject",
                        LTYPEOF : "object",
                        FIELDS : {
                            objfield : {
                                NAME : '$ObjectField',
                                LTYPEOF : 'object',
                                FIELDS : {
                                    foo:'string',
                                    bar:'number',
                                },
                            },
                            strfield : 'string',

                        },
                    },
                ]); 
                lcast('LObject',{ 
                    objfield : {
                        foo:"hello",
                        bar:100,
                    },
                    strfield : "HELLO!",
                });
            });

            ltypeTestExpectError( "UNDEFINED_FIELD02_INCORRECT",  function () { 
                var lcast = lcompile([
                    {
                        NAME : "LObject",
                        LTYPEOF : "object",
                        FIELDS : {
                            objfield: {
                                foo:'string',
                                bar:'number',
                            },
                            strfield : 'string',

                        },
                    },
                ]); 
                lcast('*LObject',{ 
                    objfield : {
                        foo:"hello",
                        bar:"NUM100",
                    },
                    strfield : "HELLO!",
                });
            });
        }
        t6();
        function t6() {
            ltestSetUnitExecute( ltestUnitExecute2 );

            ltypeTestAuto( "LEXTENDS_TEST_01 [NORMAL]",  function () { 
                var lcast = lcompile([
                    {
                        NAME : "LString",
                        EXTENDS : "string",
                    },
                ]); 
                lcast('LString', 'HELLO' );
            });

            ltypeTestAuto( "LEXTENDS_TEST_02 [ERROR]",  function () { 
                var lcast = lcompile([
                    {
                        NAME : "LString",
                        EXTENDS : "string",
                    },
                ]); 
                lcast('LString', 100 );
            });

            ltypeTestAuto( "LEXTENDS_TEST_03 [NORMAL]",  function () { 
                var lcast = lcompile([
                    {
                        NAME : "LString",
                        EXTENDS : "string||null",
                    },
                ]); 
                lcast('LString', 'HELLO' );
                lcast('LString', null );
            });
            ltypeTestAuto( "LEXTENDS_TEST_04 [ERROR]",  function () { 
                var lcast = lcompile([
                    {
                        NAME : "LString",
                        EXTENDS : "string||null",
                    },
                ]); 
                lcast('LString', 1234 );
            });
            
        }

        t07();
        function t07(){
            var lcast;
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_TEST_00 [NORMAL]",  function () { 
                lcast = lcompile([
                    {
                        NAME : "LNumbers",
                        EXTENDS : "object",
                        FIELDS : {
                            number1 : "number",
                            number2 : "number",
                        },
                    },
                    {
                        NAME : "LStrings",
                        EXTENDS : "object",
                        FIELDS : {
                            string1 : "string",
                            string2 : "string",
                        },
                    },
                    {
                        NAME : "LMulti1",
                        EXTENDS : "object&&LNumbers&&LStrings",
                    },
                    {
                        NAME : "LMulti2",
                        EXTENDS : "object&&(LNumbers||LStrings)",
                    },
                    {
                        NAME : "LMulti3",
                        EXTENDS : "object&& ! ( LNumbers && LStrings) ",
                    },
                    {
                        NAME : "LMulti4",
                        EXTENDS : "object&& ! LNumbers && ! LStrings",
                    },
                ]); 
            })
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_TEST_11 [NORMAL]",  function () { 
                lcast('LMulti1', { 
                    number1 : 1,
                    number2 : 2,
                    string1 : "1",
                    string2 : "2",
                });
            });
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_TEST_12 [ERROR]",  function () { 
                lcast('LMulti1', { 
                    number1 : 1,
                    number2 : 2,
                    string1 : "1",
                    // string2 : "2",
                });
            });
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_TEST_13 [ERROR]",  function () { 
                lcast('LMulti1', { 
                    // number1 : 1,
                    number2 : 2,
                    string1 : "1",
                    string2 : "2",
                });
            });
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_TEST_14 [ERROR]",  function () { 
                lcast('LMulti1', { 
                    number1 : 1,
                    // number2 : 2,
                    // string1 : "1",
                    string2 : "2",
                });
            });

            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_TEST_21 [NORMAL]",  function () { 
                lcast('LMulti2', { 
                    number1 : 1,
                    number2 : 2,
                    string1 : "1",
                    string2 : "2",
                });
            });
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_TEST_22 [NORMAL]",  function () { 
                lcast('LMulti2', { 
                    number1 : 1,
                    number2 : 2,
                    string1 : "1",
                    // string2 : "2",
                });
            });
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_TEST_23 [NORMAL]",  function () { 
                lcast('LMulti2', { 
                    // number1 : 1,
                    number2 : 2,
                    string1 : "1",
                    string2 : "2",
                });
            });
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_TEST_24 [ERROR]",  function () { 
                lcast('LMulti2', { 
                    number1 : 1,
                    // number2 : 2,
                    // string1 : "1",
                    string2 : "2",
                });
            });

            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_WITH_NOT_TEST_31 [ERROR]",  function () { 
                lcast('LMulti3', { 
                    number1 : 1,
                    number2 : 2,
                    string1 : "1",
                    string2 : "2",
                });
            });
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_WITH_NOT_TEST_32 [NORMAL]",  function () { 
                lcast('LMulti3', { 
                    number1 : 1,
                    number2 : 2,
                    string1 : "1",
                    // string2 : "2",
                });
            });
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_WITH_NOT_TEST_33 [NORMAL]",  function () { 
                lcast('LMulti3', { 
                    // number1 : 1,
                    number2 : 2,
                    string1 : "1",
                    string2 : "2",
                });
            });
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_WITH_NOT_TEST_34 [NORMAL]",  function () { 
                lcast('LMulti3', { 
                    number1 : 1,
                    // number2 : 2,
                    // string1 : "1",
                    string2 : "2",
                });
            });

            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_WITH_NOT_TEST_41 [ERROR]",  function () { 
                lcast('LMulti4', { 
                    number1 : 1,
                    number2 : 2,
                    string1 : "1",
                    string2 : "2",
                });
            });
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_WITH_NOT_TEST_42 [ERROR]",  function () { 
                lcast('LMulti4', { 
                    number1 : 1,
                    number2 : 2,
                    string1 : "1",
                    // string2 : "2",
                });
            });
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_WITH_NOT_TEST_43 [ERROR]",  function () { 
                lcast('LMulti4', { 
                    // number1 : 1,
                    number2 : 2,
                    string1 : "1",
                    string2 : "2",
                });
            });
            ltypeTestAuto( "LEXTENDS_MULTI_INHERITANCE_WITH_NOT_TEST_44 [NORMAL]",  function () { 
                lcast('LMulti4', { 
                    number1 : 1,
                    // number2 : 2,
                    // string1 : "1",
                    string2 : "2",
                });
            });


        }
        t08();
        function t08(){
            var lcast;
            ltypeTestAuto( "UNDEFINED_CLASS_TEST_00 [NORMAL]",  function () { 
                lcast = lcompile([
                    {
                        NAME : "LNumbers",
                        EXTENDS : "object",
                        FIELDS : {
                            number1 : "number",
                            number2 : "number",
                        },
                    },
                    {
                        NAME : "LStrings",
                        EXTENDS : "object",
                        FIELDS : {
                            string1 : "string",
                            string2 : "string",
                        },
                    },
                ]); 
            })
            ltypeTestAuto( "UNDEFINED_CLASS_TEST_01 [ERROR]",  function () { 
                lcast('LUndefined', { 
                    number1 : 1,
                    // number2 : 2,
                    // string1 : "1",
                    string2 : "2",
                });
            });
        }

        t09();
        function t09(){
            ltypeTestAuto( "FIELD_CHECKING_WITH_NULL_TEST_01 [ERROR]",  function () { 
                var lcast = lcompile();
                lcast({
                    FIELDS : {
                        number1 : "number",
                        number2 : "number",
                    },
                }, null );
            });
        }

        t10();
        function t10(){
            ltypeTestAuto( "ONEOF_TEST_01 [NORMAL]",  function () { 
                var lcast = lcompile();
                lcast( { ONEOF : [ 1,2,3 ] }, 1 );
            });
            ltypeTestAuto( "ONEOF_TEST_02 [NORMAL]",  function () { 
                var lcast = lcompile();
                lcast( { ONEOF : [ 1,2,3 ] }, 2 );
            });
            ltypeTestAuto( "ONEOF_TEST_03 [NORMAL]",  function () { 
                var lcast = lcompile();
                lcast( { ONEOF : [ 1,2,3 ] }, 3 );
            });
            ltypeTestAuto( "ONEOF_TEST_04 [ERROR]",  function () { 
                var lcast = lcompile();
                lcast( { ONEOF : [ 1,2,3 ] }, 4 );
            });
            ltypeTestAuto( "ONEOF_TEST_05 [NORMAL]",  function () { 
                var lcast = lcompile();
                lcast( { ONEOF : [ NaN ] }, NaN );
            });
            ltypeTestAuto( "ONEOF_TEST_06 [ERROR]",  function () { 
                var lcast = lcompile();
                lcast( { ONEOF : [ NaN ] }, 'NaN' );
            });
            ltypeTestAuto( "ONEOF_TEST_07 [NORMAL]",  function () { 
                var lcast = lcompile();
                lcast( { ONEOF : [ Infinity ] }, Infinity );
            });
            ltypeTestAuto( "ONEOF_TEST_08 [ERROR]",  function () { 
                var lcast = lcompile();
                lcast( { ONEOF : [ Infinity ] }, 'Infinity' );
            });
            ltypeTestAuto( "ONEOF_TEST_09 [NORMAL]",  function () { 
                var lcast = lcompile();
                lcast( { ONEOF : [ -Infinity ] }, -Infinity );
            });
            ltypeTestAuto( "ONEOF_TEST_10 [ERROR]",  function () { 
                var lcast = lcompile();
                lcast( { ONEOF : [ -Infinity ] }, '-Infinity' );
            });
            ltypeTestAuto( "ONEOF_TEST_11 [NORMAL]",  function () { 
                var lcast = lcompile();
                lcast( { ONEOF : [ {a:1,b:2,c:3,d:4} ] }, {a:1,b:2,c:3,d:4} );
            });
            ltypeTestAuto( "ONEOF_TEST_12 [ERROR]",  function () { 
                var lcast = lcompile();
                lcast( { ONEOF : [ {a:1,b:2,c:3,d:4} ] }, {a:2,b:2,c:3,d:4} );
            });
        }
        t11();
        function t11(){
            ltypeTestAuto( "NONEOF_TEST_01 [ERROR]",  function () { 
                var lcast = lcompile();
                lcast( { NONEOF : [ 1,2,3 ] }, 1 );
            });
            ltypeTestAuto( "NONEOF_TEST_02 [ERROR]",  function () { 
                var lcast = lcompile();
                lcast( { NONEOF : [ 1,2,3 ] }, 2 );
            });
            ltypeTestAuto( "NONEOF_TEST_03 [ERROR]",  function () { 
                var lcast = lcompile();
                lcast( { NONEOF : [ 1,2,3 ] }, 3 );
            });
            ltypeTestAuto( "NONEOF_TEST_04 [NORMAL]",  function () { 
                var lcast = lcompile();
                lcast( { NONEOF : [ 1,2,3 ] }, 4 );
            });
            ltypeTestAuto( "NONEOF_TEST_05 [ERROR]",  function () { 
                var lcast = lcompile();
                lcast( { NONEOF : [ NaN ] }, NaN );
            });
            ltypeTestAuto( "NONEOF_TEST_06 [NORMAL]",  function () { 
                var lcast = lcompile();
                lcast( { NONEOF : [ NaN ] }, 'NaN' );
            });
            ltypeTestAuto( "NONEOF_TEST_07 [ERROR]",  function () { 
                var lcast = lcompile();
                lcast( { NONEOF : [ Infinity ] }, Infinity );
            });
            ltypeTestAuto( "NONEOF_TEST_08 [NORMAL]",  function () { 
                var lcast = lcompile();
                lcast( { NONEOF : [ Infinity ] }, 'Infinity' );
            });
            ltypeTestAuto( "NONEOF_TEST_09 [ERROR]",  function () { 
                var lcast = lcompile();
                lcast( { NONEOF : [ -Infinity ] }, -Infinity );
            });
            ltypeTestAuto( "NONEOF_TEST_10 [NORMAL]",  function () { 
                var lcast = lcompile();
                lcast( { NONEOF : [ -Infinity ] }, '-Infinity' );
            });
            ltypeTestAuto( "NONEOF_TEST_11 [ERROR]",  function () { 
                var lcast = lcompile();
                lcast( { NONEOF : [ {a:1,b:2,c:3,d:4} ] }, {a:1,b:2,c:3,d:4} );
            });
            ltypeTestAuto( "NONEOF_TEST_12 [NORMAL]",  function () { 
                var lcast = lcompile();
                lcast( { NONEOF : [ {a:1,b:2,c:3,d:4} ] }, {a:2,b:2,c:3,d:4} );
            });
        }

        ltestEnd();
    }
    // ltest();
    
