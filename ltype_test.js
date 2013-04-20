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
            return LTYPE_LAST_OUTPUT;
        } catch ( e ) {
            if ( e.message == "Type Mismatch" ) {
                return LTYPE_LAST_OUTPUT;
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

    var ltypeTestExpectValue = ltestUnit;
    var ltypeTestExpectError = ltestUnit;
    // ltestSetFilterFunction( 'ONLY_CRITICAL');

    function ltest() {
        LTYPE_TEST_MODE = true;
        ltestBegin('basic');

        // peq_test();
        //

        t0();
        function t0() {
            ltestSetUnitExecute( null );

            // NO1
            // if null was passed to lcompile, throw error.
            ltypeTestExpectError( "ILLEGAL_COMPILE_NULL", function () {
                return lcompile( null );
            },{ 
                "type": "ERROR",
                "value": "Illegal Argument (malformed parameter object) : null"
            });

            // NO2
            // if lcompile gets any object other than array , throw error.
            ltypeTestExpectError( "ILLEGAL_COMPILE_NUM", function () {
                return lcompile( 1 );
            },{ 
                "type": "ERROR",
                "value": "Illegal Argument (malformed parameter object) : 1"
            });

            // NO3
            ltypeTestExpectError( "ILLEGAL_COMPILE_STR", function () {
                return lcompile( "a" );
            },{ 
                "type": "ERROR",
                "value": "Illegal Argument (malformed parameter object) : \"a\""
            });

            // NO4
            ltypeTestExpectError( "ILLEGAL_COMPILE_NO_LTYPEOF", function () {
                return lcompile([
                    {LNAME:"test", /* LTYPEOF:'any', */  },
                ]);
            },{ 
                type:'ERROR',
                value:'Illegal Argument (found an object which has no LTYPEOF) : [{"LNAME":"test"}]', 
            });

            // NO5
            ltypeTestExpectError( "ILLEGAL_COMPILE_NO_LNAME", function () {
                return lcompile([
                    {/*LNAME:"test",*/ LTYPEOF:'any',  },
                ]);
            },{ 
                type:'ERROR',
                value:'Illegal Argument (found an object which has no LNAME) : [{"LTYPEOF":"any"}]', 
            });

            // throw new Error( "Illegal Argument(found an object which has no LNAME)" + JSON.stringify( ltypes_arr ) );
            // throw new Error( "Illegal Argument(found an object which has no LTYPEOF)" + JSON.stringify( ltypes_arr ) );
        }

        // t01() ;
        function t01() {
            ltestSetUnitExecute( ltestUnitExecute2 );
            ltypeTestExpectValue( "UNDEFINED_FIELD01",  function () { 
                var lcast = lcompile([]); 
                return lcast("undefined",undefined );
            },{
            });
            ltypeTestExpectValue( "UNDEFINED_FIELD02",  function () { 
                var lcast = lcompile([]); 
                return lcast("any",undefined );
            },{
            });

            ltypeTestExpectValue( "UNDEFINED FIELD2",  function () { 
                lcast = lcompile([ 
                    {
                        LNAME:"LNumber",   
                        LTYPEOF:'object',  
                        LIS :['LNumber', ],  
                        LFIELDS: { 
                            num:"number||undefined", 
                        }, 
                    }, 
                ]);
                return lcast("*LNumber",{});
            },{
            });
            var lcast;
            ltypeTestExpectValue( "UNDEFINED FIELD3",  function () { 
                lcast = lcompile([ 
                    {
                        LNAME:"LNumber",   
                        LTYPEOF:'object',  
                        LIS :['LNumber', ],  
                        LFIELDS: { 
                            num:"number||undefined", 
                        }, 
                    }, 
                ]);
                return lcast("*LNumber",{});
            },{
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
                    {LNAME:"LNumber",   LTYPEOF:'object',  LIS :['LNumber', ],  LFIELDS: { num:"number", }, }, 
                    {LNAME:"LSub"   ,   LTYPEOF:'object',  LIS :['LSub',], }, 
                    {LNAME:"LAnother",  LTYPEOF:'object',  LIS :['LAnother'],  }, 
                    {LNAME:"LEnum1",    LTYPEOF:'any',     LEQU:[1,"2",true,null], }, 
                    {LNAME:"LEnum2",    LTYPEOF:'object',  LEQU:[{hello:1,world:2},{hello:3,world:4}] },
                    {LNAME:"LPat1",     LTYPEOF:'string',  LPAT:[ "^[a-z]+$" ] } ,
                    {LNAME:"LName",     LTYPEOF:'object',    LIS :['LName',         ],  LFIELDS: { name:"string", }, }, 
                    {LNAME:"LValue",    LTYPEOF:'object',    LIS :['LName','LValue' ],  LFIELDS: { value:"string", }, }, 
                ]);
                return 'NO_ERROR';
            },{
                type:'NORMAL',
                value:'NO_ERROR',
            });

            ltestSetUnitExecute( ltestUnitExecute2 );

            // NO6
            // the definition requires number and the field is missing.
            ltypeTestExpectError( "BASICTEST_01_MISSING_PROPERTY", function () {
                return lcast( "*LNumber", { nun:"1" } );
            }, 
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script '*LNumber' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type '*LNumber' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "Field Mismatch",
                                                "reason": "fields of the object 'param' are not fullfilled with the type 'LNumber' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "Object Type Mismatch",
                                                        "reason": "the script 'number' with the value of 'param.num' was evaluated as false / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "Object Type Mismatch",
                                                                "reason": "the type 'number' with the value of 'param.num' was evaluated as false / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "Primitive Type Mismatch",
                                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param.num' is a primitive type 'undefined' value"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            // NO07
            // the definition requires number / the object offers number.
            ltypeTestExpectValue( "BASICTEST_02_PROPER_TYPE_DEF_AND_COMPATIBLE_OBJECT_WITH_ENABLED_FIELD_CHECK_1",  function () {
                return lcast("*LNumber" ,{ num:1 });
            }, 
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "fields of the object 'param' are fullfilled with the type 'LNumber' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the script 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param.num' is a primitive type 'number' value"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "field checking is disabled"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no type restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no value restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no pattern restriction"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LNumber' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [],
                                                "after": [
                                                    "LNumber"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );
            
            // NO8
            // the definition requires number / the object offers string => expecting error.
            ltypeTestExpectError( "BASICTEST_03_INCOMPATIBLE_OBJECT_EXPECT_NUMBER_BUT_STRING", function () {
                return lcast( "*LNumber", { num:"1" } );
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script '*LNumber' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type '*LNumber' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "Field Mismatch",
                                                "reason": "fields of the object 'param' are not fullfilled with the type 'LNumber' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "Object Type Mismatch",
                                                        "reason": "the script 'number' with the value of 'param.num' was evaluated as false / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "Object Type Mismatch",
                                                                "reason": "the type 'number' with the value of 'param.num' was evaluated as false / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "Primitive Type Mismatch",
                                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param.num' is a primitive type 'string' value"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]                               
            );

            // NO9
            // the definition requires number / the object offers object.
            ltypeTestExpectError( "BASICTEST_04_EXPECT_NUMBER_BUT_FOUND_AN_OBJECT", function () {
                return lcast( "*LNumber" ,{ num: ( lcast( "*LNumber" ,{num:1} ) ) });
            },
                [ 
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "fields of the object 'param' are fullfilled with the type 'LNumber' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the script 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param.num' is a primitive type 'number' value"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "field checking is disabled"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no type restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no value restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no pattern restriction"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LNumber' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [],
                                                "after": [
                                                    "LNumber"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script '*LNumber' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type '*LNumber' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "Field Mismatch",
                                                "reason": "fields of the object 'param' are not fullfilled with the type 'LNumber' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "Object Type Mismatch",
                                                        "reason": "the script 'number' with the value of 'param.num' was evaluated as false / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "Object Type Mismatch",
                                                                "reason": "the type 'number' with the value of 'param.num' was evaluated as false / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "Primitive Type Mismatch",
                                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param.num' is a primitive type 'object' value"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ] 
            );

            // NO10
            // type check : when it is compatible :
            ltypeTestExpectValue( "BASICTEST_05_CAST_CORRECT",  function () {
                return lcast( "LNumber", lcast("*LNumber", {num:1}) );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "fields of the object 'param' are fullfilled with the type 'LNumber' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the script 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param.num' is a primitive type 'number' value"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "field checking is disabled"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no type restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no value restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no pattern restriction"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LNumber' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [],
                                                "after": [
                                                    "LNumber"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has type requirement [LNumber] and the value has type [LNumber]"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ] 
            );

            // NO11
            // type check : when it is NOT compatible :
            ltypeTestExpectError( "BASICTEST_05_CAST_INCORRECT", function () {
                return lcast("LSub", lcast("*LNumber", {num:1}) );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "fields of the object 'param' are fullfilled with the type 'LNumber' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the script 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param.num' is a primitive type 'number' value"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "field checking is disabled"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no type restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no value restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no pattern restriction"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LNumber' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [],
                                                "after": [
                                                    "LNumber"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script 'LSub' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type 'LSub' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "Type Information Mismatch",
                                                "reason": "the type 'LSub' has type requirement [LSub] and the value has type [LNumber]"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ] 
            );

            // equality check : LEnum1 requires 1,"2",true,null
            ltypeTestExpectValue( "ENUM_TEST_CORRECT_1", function () { 
                return lcast( "LEnum1",1 )
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'LEnum1' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'LEnum1' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' requires a primitive type 'any' and the value of 'param' is a primitive type 'number' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' has no type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'param' is equivalent with one of objects in LEQU defintion"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "ENUM_TEST_CORRECT_2",  function () { 
                return lcast( "LEnum1","2" )
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'LEnum1' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'LEnum1' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' requires a primitive type 'any' and the value of 'param' is a primitive type 'string' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' has no type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'param' is equivalent with one of objects in LEQU defintion"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "ENUM_TEST_CORRECT_3_TRUE",  function () {
                return lcast("LEnum1",true )
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'LEnum1' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'LEnum1' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' requires a primitive type 'any' and the value of 'param' is a primitive type 'boolean' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' has no type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'param' is equivalent with one of objects in LEQU defintion"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "ENUM_TEST_CORRECT_4_NULL", function () {
                return lcast("LEnum1",null )
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'LEnum1' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'LEnum1' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' requires a primitive type 'any' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' has no type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'param' is equivalent with one of objects in LEQU defintion"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectError( "ENUM_TEST_INCORRECT_1_NUM5", function () { 
                return lcast( "LEnum1", 5 )
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script 'LEnum1' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type 'LEnum1' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' requires a primitive type 'any' and the value of 'param' is a primitive type 'number' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' has no type restriction"
                                            },
                                            {
                                                "type": "Value Unmatched",
                                                "reason": "the value of 'param' should be one of $leqValues but actually $objectValue",
                                                "leqValues": [
                                                    1,
                                                    "2",
                                                    true,
                                                    null
                                                ],
                                                "objectValue": 5
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectError( "ENUM_TEST_INCORRECT_2_STR1", function () { 
                return lcast( "LEnum1", "1" )
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script 'LEnum1' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type 'LEnum1' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' requires a primitive type 'any' and the value of 'param' is a primitive type 'string' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' has no type restriction"
                                            },
                                            {
                                                "type": "Value Unmatched",
                                                "reason": "the value of 'param' should be one of $leqValues but actually $objectValue",
                                                "leqValues": [
                                                    1,
                                                    "2",
                                                    true,
                                                    null
                                                ],
                                                "objectValue": "1"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );
            ltypeTestExpectError( "ENUM_TEST_INCORRECT_2_NUM2", function () { 
                return lcast( "LEnum1",2 )
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script 'LEnum1' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type 'LEnum1' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' requires a primitive type 'any' and the value of 'param' is a primitive type 'number' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' has no type restriction"
                                            },
                                            {
                                                "type": "Value Unmatched",
                                                "reason": "the value of 'param' should be one of $leqValues but actually $objectValue",
                                                "leqValues": [
                                                    1,
                                                    "2",
                                                    true,
                                                    null
                                                ],
                                                "objectValue": 2
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectError( "ENUM_TEST_INCORRECT_3_FALSE1", function () { 
                return lcast("LEnum1",false )
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script 'LEnum1' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type 'LEnum1' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' requires a primitive type 'any' and the value of 'param' is a primitive type 'boolean' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum1' has no type restriction"
                                            },
                                            {
                                                "type": "Value Unmatched",
                                                "reason": "the value of 'param' should be one of $leqValues but actually $objectValue",
                                                "leqValues": [
                                                    1,
                                                    "2",
                                                    true,
                                                    null
                                                ],
                                                "objectValue": false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            // pattern check test1
            ltypeTestExpectValue( "PATTERN_TEST_1_CORRECT",  function () { 
                return lcast( "LPat1", 'abc'  )
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'LPat1' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'LPat1' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LPat1' requires a primitive type 'string' and the value of 'param' is a primitive type 'string' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LPat1' has no type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LPat1' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'$lpatValues matched specified value $objectValue",
                                                "lpatValues": [
                                                    "^[a-z]+$"
                                                ],
                                                "objectValue": "abc"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            // pattern check test2
            ltypeTestExpectError( "PATTERN_TEST_2_INCORRECT", function () { 
                return lcast( "LPat1", 'ABC'  )
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script 'LPat1' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type 'LPat1' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LPat1' requires a primitive type 'string' and the value of 'param' is a primitive type 'string' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LPat1' has no type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LPat1' has no value restriction"
                                            },
                                            {
                                                "type": "Pattern Unmatched",
                                                "reason": "the value of 'param' should be one of $lpatValues but actually $objectValue",
                                                "lpatValues": [
                                                    "^[a-z]+$"
                                                ],
                                                "objectValue": "ABC"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );


            ltypeTestExpectValue( "EQU_OBJECT_TEST_01_CORRECT",  function () {
                return lcast("LEnum2", {hello:1,world:2} );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'LEnum2' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'LEnum2' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum2' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum2' has no type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'param' is equivalent with one of objects in LEQU defintion"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum2' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "EQU_OBJECT_TEST_02_CORRECT",  function () {
                return lcast("LEnum2", {hello:3,world:4} );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'LEnum2' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'LEnum2' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum2' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum2' has no type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'param' is equivalent with one of objects in LEQU defintion"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum2' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectError( "EQU_OBJECT_TEST_03_INCORRECT", function () {
                return lcast("LEnum2", {hello:2,world:4} );
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script 'LEnum2' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type 'LEnum2' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum2' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum2' has no type restriction"
                                            },
                                            {
                                                "type": "Value Unmatched",
                                                "reason": "the value of 'param' should be one of $leqValues but actually $objectValue",
                                                "leqValues": [
                                                    {
                                                        "hello": 1,
                                                        "world": 2
                                                    },
                                                    {
                                                        "hello": 3,
                                                        "world": 4
                                                    }
                                                ],
                                                "objectValue": {
                                                    "hello": 2,
                                                    "world": 4
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectError( "EQU_OBJECT_TEST_04_INCORRECT", function () {
                return lcast("LEnum2", {hello:4,world:5} );
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script 'LEnum2' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type 'LEnum2' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum2' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LEnum2' has no type restriction"
                                            },
                                            {
                                                "type": "Value Unmatched",
                                                "reason": "the value of 'param' should be one of $leqValues but actually $objectValue",
                                                "leqValues": [
                                                    {
                                                        "hello": 1,
                                                        "world": 2
                                                    },
                                                    {
                                                        "hello": 3,
                                                        "world": 4
                                                    }
                                                ],
                                                "objectValue": {
                                                    "hello": 4,
                                                    "world": 5
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );


            ltypeTestExpectError( "OPERATION_TEST_01_AND_CORRECT", function () {
                return lcast( "LNumber", lcast("*LNumber&&*LSub", {num:1} ) );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script '*LNumber&&*LSub' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "fields of the object 'param' are fullfilled with the type 'LNumber' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the script 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param.num' is a primitive type 'number' value"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "field checking is disabled"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no type restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no value restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no pattern restriction"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LNumber' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [],
                                                "after": [
                                                    "LNumber"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no pattern restriction"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LSub' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no field"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LSub' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [
                                                    "LNumber"
                                                ],
                                                "after": [
                                                    "LNumber",
                                                    "LSub"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has type requirement [LNumber] and the value has type [LNumber,LSub]"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ] 
            );


            ltypeTestExpectValue( "OPERATION_TEST_02_AND_CORRECT_02",  function () {
                return lcast( "LSub", lcast( "*LNumber&&*LSub",{ num:1 } ) );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script '*LNumber&&*LSub' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "fields of the object 'param' are fullfilled with the type 'LNumber' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the script 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param.num' is a primitive type 'number' value"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "field checking is disabled"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no type restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no value restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no pattern restriction"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LNumber' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [],
                                                "after": [
                                                    "LNumber"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no pattern restriction"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LSub' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no field"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LSub' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [
                                                    "LNumber"
                                                ],
                                                "after": [
                                                    "LNumber",
                                                    "LSub"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'LSub' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'LSub' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has type requirement [LSub] and the value has type [LNumber,LSub]"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ] 
            );

            ltypeTestExpectError( "OPERATION_TEST_03_AND_INCORRECT_01", function () {
                return lcast( "LAnother",lcast( "*LNumber&&*LSub", { num:1 } )  );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script '*LNumber&&*LSub' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "fields of the object 'param' are fullfilled with the type 'LNumber' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the script 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param.num' is a primitive type 'number' value"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "field checking is disabled"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no type restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no value restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no pattern restriction"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LNumber' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [],
                                                "after": [
                                                    "LNumber"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no pattern restriction"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LSub' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no field"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LSub' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [
                                                    "LNumber"
                                                ],
                                                "after": [
                                                    "LNumber",
                                                    "LSub"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script 'LAnother' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type 'LAnother' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LAnother' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "Type Information Mismatch",
                                                "reason": "the type 'LAnother' has type requirement [LAnother] and the value has type [LNumber,LSub]"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectError( "OPERATION_TEST_03_AND_INCORRECT_02_FOUND_UNDEFINED_TYPE", function () {
                return lcast( "LUndefined", lcast( "*LNumber&&*LSub", { num:1 } ) );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script '*LNumber&&*LSub' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "fields of the object 'param' are fullfilled with the type 'LNumber' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the script 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param.num' is a primitive type 'number' value"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "field checking is disabled"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no type restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no value restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no pattern restriction"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LNumber' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [],
                                                "after": [
                                                    "LNumber"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no pattern restriction"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LSub' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no field"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LSub' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [
                                                    "LNumber"
                                                ],
                                                "after": [
                                                    "LNumber",
                                                    "LSub"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LSub' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script 'LUndefined' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type 'LUndefined' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "Undefined Type",
                                                "reason": "the specified type 'LUndefined' is not defined"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            // cast plain object to LNumber , then it is expected to throw error.
            ltypeTestExpectError( "OPERATOR_TEST_OR00_BASICAGAIN", function () {
                return lcast( "*LNumber", { num:1 } );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "fields of the object 'param' are fullfilled with the type 'LNumber' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the script 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param.num' is a primitive type 'number' value"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "field checking is disabled"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no type restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no value restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no pattern restriction"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LNumber' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [],
                                                "after": [
                                                    "LNumber"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            // operator test or(||)
            ltypeTestExpectError( "OPERATOR_TEST_OR01", function () {
                return lcast( "null||LNumber",lcast( "*LNumber", { num:1 } ) );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "fields of the object 'param' are fullfilled with the type 'LNumber' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the script 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' with the value of 'param.num' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param.num' is a primitive type 'number' value"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "field checking is disabled"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no type restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no value restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'number' has no pattern restriction"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LNumber' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [],
                                                "after": [
                                                    "LNumber"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'null||LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type 'null' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'null' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'null' has no type restriction"
                                            },
                                            {
                                                "type": "Value Unmatched",
                                                "reason": "the value of 'param' should be one of $leqValues but actually $objectValue",
                                                "leqValues": [
                                                    null
                                                ],
                                                "objectValue": {
                                                    "num": 1,
                                                    "LTYPE": [
                                                        "LNumber"
                                                    ]
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the type 'LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has type requirement [LNumber] and the value has type [LNumber]"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LNumber' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectError( "OPERATOR_TEST_OR02", function () {
                return lcast( "null||LNumber", null );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'null||LNumber' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'null' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'null' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'null' has no type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'param' is equivalent with one of objects in LEQU defintion"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'null' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
                
            );
        }

        // // t2();
        function t2() {
            console.trace();
            var lcast = lcompile( [ { LNAME : "LObject", LTYPEOF:"object",LFIELDS:{ obj : "LSub", }, }, { LNAME:"LSub", LTYPEOF:"object", }, ] );
            ltypeTestExpectError( "", function () {
                return lcast( "*LObject", { obj:1 } );
            },{
                "status": "ERROR",
                "log": [
                    {
                        "type": "Property Type Mismatch",
                        "reason": "name='obj' typeScript='LSub' sublog=$sublog",
                        "sublog": [
                            {
                                "type": "Malformed Type Definition",
                                "reason": "type 'LSub' has no LTYPEOF property"
                            }
                        ]
                    }
                ]
            });
            ltypeTestExpectError( "", function () {
                return lcast( "LObject", { obj:"1" } );
            });
        }
    
        // t3();
        function t3() {
            var lcast = lcompile([
                {
                    LNAME : "LObject",
                    LTYPEOF : "object",
                    LFIELDS : {
                        num   : "number",
                        str   : "string",
                        bool  : "boolean",
                        obj1  : "LObject||null",
                        obj2  : "LEnum",
                    }
                },
                {
                    LNAME : "LEnum",
                    LTYPEOF : "string",
                    LEQU : [ "hello","world" ],
                },
            ]);
            ltypeTestExpectError( "TOTAL_TEST_03_01", function () {
                lcast("*LObject",{
                    num:1,
                    str:'',
                    bool:false,
                    obj1:lcast("*LObject",{
                        num:1,
                        str:'',
                        bool:false,
                        obj1:null,
                        obj2:"hello",
                    }),
                    obj2:"world",
                });
            },{
                "status": "NORMAL",
                "log": [
                    {
                        "type": "OK",
                        "reason": "the object is fullfilled with the type 'LObject' / see $sublog",
                        "sublog": [
                            {
                                "type": "OK",
                                "reason": "with 'num', the script 'number' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "fn('number') with 'num' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "'number' has no LIS type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'number' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'number' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "OK",
                                "reason": "with 'str', the script 'string' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "fn('string') with 'str' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "'string' has no LIS type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'string' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'string' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "OK",
                                "reason": "with 'bool', the script 'boolean' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "fn('boolean') with 'bool' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "'boolean' has no LIS type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'boolean' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'boolean' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "OK",
                                "reason": "with 'obj1', the script 'LObject||null' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "fn('LObject') with 'obj1' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "'LObject' has no LIS type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'LObject' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'LObject' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "OK",
                                "reason": "with 'obj2', the script 'LEnum' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "fn('LEnum') with 'obj2' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "'LEnum' has no LIS type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'obj2' is equivalent with one of objects in LEQU defintion"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'LEnum' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            ltypeTestExpectValue( "TOTAL_TEST_03_02",  function () {
                lcast("*LObject",{
                    num:1,
                    str:'',
                    bool:false,
                    obj1:lcast("*LObject",{
                        num:1,
                        str:'',
                        bool:false,
                        obj1:null,
                        obj2:"hello",
                    }),
                    obj2:"world",
                });
            },{
                "status": "NORMAL",
                "log": [
                    {
                        "type": "OK",
                        "reason": "the object is fullfilled with the type 'LObject' / see $sublog",
                        "sublog": [
                            {
                                "type": "OK",
                                "reason": "with 'num', the script 'number' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "fn('number') with 'num' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "'number' has no LIS type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'number' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'number' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "OK",
                                "reason": "with 'str', the script 'string' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "fn('string') with 'str' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "'string' has no LIS type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'string' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'string' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "OK",
                                "reason": "with 'bool', the script 'boolean' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "fn('boolean') with 'bool' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "'boolean' has no LIS type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'boolean' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'boolean' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "OK",
                                "reason": "with 'obj1', the script 'LObject||null' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "fn('LObject') with 'obj1' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "'LObject' has no LIS type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'LObject' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'LObject' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "OK",
                                "reason": "with 'obj2', the script 'LEnum' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "fn('LEnum') with 'obj2' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "'LEnum' has no LIS type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'obj2' is equivalent with one of objects in LEQU defintion"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "'LEnum' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
        }

        t4();
        function t4() {
            ltestSetUnitExecute( ltestUnitExecute2 );
            var lcast = lcompile([
                {
                    LNAME : "LEnum",
                    LTYPEOF : "string",
                    LEQU : [ "hello","world" ],
                },
            ]);
            ltypeTestExpectValue( "ARRAY_TEST_04_01",  function () {
                lcast( "string[][]" ,[
                      ["1","2","3"],
                      ["4","5","6"],
                ] );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'string[][]' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'string[][]' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'string[]' with the value of 'param[0]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][0]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][0]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][1]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][1]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][2]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][2]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'string[]' with the value of 'param[1]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[1][0]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][0]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[1][1]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][1]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[1][2]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][2]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "ARRAY_TEST_04_02_INCORRECT",  function () {
                lcast("string[][]", [
                      ["1","2",3],
                      ["4","5","6"],
                ] );
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script 'string[][]' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type 'string[][]' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "Object Type Mismatch",
                                                "reason": "the type 'string[]' with the value of 'param[0]' was evaluated as false / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][0]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][0]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][1]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][1]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "Object Type Mismatch",
                                                        "reason": "the type 'string' with the value of 'param[0][2]' was evaluated as false / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "Primitive Type Mismatch",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][2]' is a primitive type 'number' value"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'string[]' with the value of 'param[1]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[1][0]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][0]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[1][1]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][1]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[1][2]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][2]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
                
            );

            ltypeTestExpectValue( "ARRAY_TEST_04_03_CORRECT",  function () {
                lcast( "array of number",[ 1,2,3 ] );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'array of number' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the script 'number' with the value of 'param[0]' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'number' with the value of 'param[0]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param[0]' is a primitive type 'number' value"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "field checking is disabled"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'number' has no type restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'number' has no value restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'number' has no pattern restriction"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the script 'number' with the value of 'param[1]' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'number' with the value of 'param[1]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param[1]' is a primitive type 'number' value"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "field checking is disabled"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'number' has no type restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'number' has no value restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'number' has no pattern restriction"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the script 'number' with the value of 'param[2]' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'number' with the value of 'param[2]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param[2]' is a primitive type 'number' value"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "field checking is disabled"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'number' has no type restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'number' has no value restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'number' has no pattern restriction"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );
            ltypeTestExpectValue( "ARRAY_TEST_04_04_INCORRECT",  function () {
                lcast( "array of string", [ '1',2,'3' ] );
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script 'array of string' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the script 'string' with the value of 'param[0]' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'string' with the value of 'param[0]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0]' is a primitive type 'string' value"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "field checking is disabled"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no type restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no value restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no pattern restriction"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the script 'string' with the value of 'param[1]' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "Object Type Mismatch",
                                                "reason": "the type 'string' with the value of 'param[1]' was evaluated as false / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "Primitive Type Mismatch",
                                                        "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1]' is a primitive type 'number' value"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the script 'string' with the value of 'param[2]' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'string' with the value of 'param[2]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[2]' is a primitive type 'string' value"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "field checking is disabled"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no type restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no value restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no pattern restriction"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );
            ltypeTestExpectValue( "ARRAY_TEST_04_05_CORRECT",  function () {
                lcast( "array of array of string", [ 
                      ['1','2','3' ],
                      ['4','5','6' ],
                ] );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'array of array of string' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the script 'array of string' with the value of 'param[0]' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param[0][0]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][0]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][0]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param[0][1]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][1]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][1]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param[0][2]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][2]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][2]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the script 'array of string' with the value of 'param[1]' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param[1][0]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[1][0]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][0]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param[1][1]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[1][1]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][1]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param[1][2]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[1][2]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][2]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
                
            );
            ltypeTestExpectValue( "ARRAY_TEST_04_06_INCORRECT",  function () {
                lcast( "array of array of string", [ 
                      ['1','2','3' ],
                      ['4', 5 ,'6' ],
                ]);
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script 'array of array of string' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the script 'array of string' with the value of 'param[0]' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param[0][0]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][0]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][0]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param[0][1]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][1]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][1]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param[0][2]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][2]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][2]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the script 'array of string' with the value of 'param[1]' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param[1][0]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[1][0]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][0]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "Object Type Mismatch",
                                                "reason": "the script 'string' with the value of 'param[1][1]' was evaluated as false / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "Object Type Mismatch",
                                                        "reason": "the type 'string' with the value of 'param[1][1]' was evaluated as false / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "Primitive Type Mismatch",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][1]' is a primitive type 'number' value"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param[1][2]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[1][2]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][2]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "ARRAY_TEST_04_07_CORRECT",  function () {
                lcast( "number[]||string[]", [ '1','2','3' ] );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'number[]||string[]' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type 'number[]' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "Object Type Mismatch",
                                                "reason": "the type 'number' with the value of 'param[0]' was evaluated as false / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "Primitive Type Mismatch",
                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param[0]' is a primitive type 'string' value"
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "Object Type Mismatch",
                                                "reason": "the type 'number' with the value of 'param[1]' was evaluated as false / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "Primitive Type Mismatch",
                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param[1]' is a primitive type 'string' value"
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "Object Type Mismatch",
                                                "reason": "the type 'number' with the value of 'param[2]' was evaluated as false / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "Primitive Type Mismatch",
                                                        "reason": "the type 'number' requires a primitive type 'number' and the value of 'param[2]' is a primitive type 'string' value"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the type 'string[]' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'string' with the value of 'param[0]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0]' is a primitive type 'string' value"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "field checking is disabled"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no type restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no value restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no pattern restriction"
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'string' with the value of 'param[1]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1]' is a primitive type 'string' value"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "field checking is disabled"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no type restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no value restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no pattern restriction"
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'string' with the value of 'param[2]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[2]' is a primitive type 'string' value"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "field checking is disabled"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no type restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no value restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' has no pattern restriction"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "ARRAY_TEST_04_08_CORRECT",  function () {
                lcast( "array of array of string||number", [ 
                      ['1','2','3' ],
                      ['4', 5 ,'6' ],
                ] );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'array of array of string||number' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the script 'array of string||number' with the value of 'param[0]' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string||number' with the value of 'param[0][0]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][0]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][0]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string||number' with the value of 'param[0][1]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][1]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][1]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string||number' with the value of 'param[0][2]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[0][2]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[0][2]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the script 'array of string||number' with the value of 'param[1]' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string||number' with the value of 'param[1][0]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[1][0]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][0]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string||number' with the value of 'param[1][1]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "Object Type Mismatch",
                                                        "reason": "the type 'string' with the value of 'param[1][1]' was evaluated as false / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "Primitive Type Mismatch",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][1]' is a primitive type 'number' value"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'number' with the value of 'param[1][1]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' requires a primitive type 'number' and the value of 'param[1][1]' is a primitive type 'number' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'number' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string||number' with the value of 'param[1][2]' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param[1][2]' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param[1][2]' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );
        }

        // inline definition 
        t5_0();
        function t5_0() {
            ltestSetUnitExecute( ltestUnitExecute2 );
            var lcast = lcompile([
                {
                    LNAME : "LObject",
                    LTYPEOF : "object",
                    LFIELDS : {
                        hello:'string',
                    },
                },
            ]); 
            
            ltypeTestExpectValue( "BASICTEST_AGAIN_1_CORRECT",  function () { 
                lcast( 'LObject', { hello:"hello world" } ); // NORMAL
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'LObject' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'LObject' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' has no type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "BASICTEST_AGAIN_2_CORRECT",  function () { 
                lcast( '*LObject', { hello:"hello world" } ); //NORMAL
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script '*LObject' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type '*LObject' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "fields of the object 'param' are fullfilled with the type 'LObject' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the script 'string' with the value of 'param.hello' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' with the value of 'param.hello' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'string' requires a primitive type 'string' and the value of 'param.hello' is a primitive type 'string' value"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "field checking is disabled"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'string' has no type restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'string' has no value restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'string' has no pattern restriction"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "Successfully add the value 'LObject' to the Run Time Type Information object of the current value. See $before and $after.",
                                                "before": [],
                                                "after": [
                                                    "LObject"
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "runtime type information checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "BASICTEST_AGAIN_3_INCORRECT",  function () { 
                lcast( '*LObject', { hello:4649 } ); // ERROR
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script '*LObject' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type '*LObject' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "Field Mismatch",
                                                "reason": "fields of the object 'param' are not fullfilled with the type 'LObject' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "Object Type Mismatch",
                                                        "reason": "the script 'string' with the value of 'param.hello' was evaluated as false / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "Object Type Mismatch",
                                                                "reason": "the type 'string' with the value of 'param.hello' was evaluated as false / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "Primitive Type Mismatch",
                                                                        "reason": "the type 'string' requires a primitive type 'string' and the value of 'param.hello' is a primitive type 'number' value"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "BASICTEST_AGAIN_4_INCORRECT",  function () { 
                lcast( '*LObject', { hello:null } ); // ERROR
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script '*LObject' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type '*LObject' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "Field Mismatch",
                                                "reason": "fields of the object 'param' are not fullfilled with the type 'LObject' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "Object Type Mismatch",
                                                        "reason": "the script 'string' with the value of 'param.hello' was evaluated as false / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "Object Type Mismatch",
                                                                "reason": "the type 'string' with the value of 'param.hello' was evaluated as false / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "Primitive Type Mismatch",
                                                                        "reason": "the type 'string' requires a primitive type 'string' and the value of 'param.hello' is a primitive type 'object' value"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );
        }

        t5();
        function t5() {
            ltestSetUnitExecute( ltestUnitExecute2 );
            ltypeTestExpectValue( "INLINE_DEFINITION_2_CORRECT",  function () { 
                var lcast = lcompile([]); 
                lcast({
                    LNAME:"Test",
                    LTYPEOF:"string",
                }, "hello" );
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the type 'Test' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'Test' requires a primitive type 'string' and the value of 'param' is a primitive type 'string' value"
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the type 'Test' has no field"
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "Successfully add the value 'Test' to the Run Time Type Information object of the current value. See $before and $after.",
                                        "before": [],
                                        "after": []
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "runtime type information checking is disabled"
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the type 'Test' has no value restriction"
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the type 'Test' has no pattern restriction"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "INLINE_DEFINITION_3",  function () { 
                var lcast = lcompile([]); 
                lcast({
                    LNAME:"Test",
                    LTYPEOF:"number",
                },"hello" );
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the type 'Test' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Primitive Type Mismatch",
                                        "reason": "the type 'Test' requires a primitive type 'number' and the value of 'param' is a primitive type 'string' value"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "INLINE_DEFINITION_4_RECURSIVE_LEVEL_1_CORRECT",  function () { 
                var lcast = lcompile([]); 
                lcast({
                    LNAME:"Test",
                    LTYPEOF:"object",
                    LFIELDS : {
                        hello : 'string',
                        world : 'string',
                    }
                },{ 
                    hello : "HELLO!",
                    world : "WORLD!",
                });
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the type '*Test' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'Test' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "fields of the object 'param' are fullfilled with the type 'Test' / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param.hello' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param.hello' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param.hello' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param.world' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param.world' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param.world' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "Successfully add the value 'Test' to the Run Time Type Information object of the current value. See $before and $after.",
                                        "before": [],
                                        "after": [
                                            "Test"
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "runtime type information checking is disabled"
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the type 'Test' has no value restriction"
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the type 'Test' has no pattern restriction"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "INLINE_DEFINITION_5_RECURSIVE_LEVEL_2_CORRECT",  function () { 
                var lcast = lcompile([]); 
                lcast({
                    LNAME:"Test",
                    LTYPEOF:"object",
                    LFIELDS : {
                        hello : 'string',
                        world : 'string',
                        recursive : {
                            LNAME:"Test.TYP1",
                            LTYPEOF:"object",
                            LFIELDS : {
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
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the type '*Test' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'Test' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "fields of the object 'param' are fullfilled with the type 'Test' / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param.hello' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param.hello' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param.hello' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the script 'string' with the value of 'param.world' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'string' with the value of 'param.world' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param.world' is a primitive type 'string' value"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "field checking is disabled"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no type restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no value restriction"
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' has no pattern restriction"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type '*Test.TYP1' with the value of 'param.recursive' was evaluated as true / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'Test.TYP1' requires a primitive type 'object' and the value of 'param.recursive' is a primitive type 'object' value"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "fields of the object 'param.recursive' are fullfilled with the type 'Test.TYP1' / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the script 'string' with the value of 'param.recursive.foo' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'string' with the value of 'param.recursive.foo' was evaluated as true / see $sublog",
                                                                        "sublog": [
                                                                            {
                                                                                "type": "OK",
                                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param.recursive.foo' is a primitive type 'string' value"
                                                                            },
                                                                            {
                                                                                "type": "OK",
                                                                                "reason": "field checking is disabled"
                                                                            },
                                                                            {
                                                                                "type": "OK",
                                                                                "reason": "the type 'string' has no type restriction"
                                                                            },
                                                                            {
                                                                                "type": "OK",
                                                                                "reason": "the type 'string' has no value restriction"
                                                                            },
                                                                            {
                                                                                "type": "OK",
                                                                                "reason": "the type 'string' has no pattern restriction"
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "type": "OK",
                                                                "reason": "the script 'string' with the value of 'param.recursive.bar' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'string' with the value of 'param.recursive.bar' was evaluated as true / see $sublog",
                                                                        "sublog": [
                                                                            {
                                                                                "type": "OK",
                                                                                "reason": "the type 'string' requires a primitive type 'string' and the value of 'param.recursive.bar' is a primitive type 'string' value"
                                                                            },
                                                                            {
                                                                                "type": "OK",
                                                                                "reason": "field checking is disabled"
                                                                            },
                                                                            {
                                                                                "type": "OK",
                                                                                "reason": "the type 'string' has no type restriction"
                                                                            },
                                                                            {
                                                                                "type": "OK",
                                                                                "reason": "the type 'string' has no value restriction"
                                                                            },
                                                                            {
                                                                                "type": "OK",
                                                                                "reason": "the type 'string' has no pattern restriction"
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "Successfully add the value 'Test.TYP1' to the Run Time Type Information object of the current value. See $before and $after.",
                                                        "before": [],
                                                        "after": [
                                                            "Test.TYP1"
                                                        ]
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "runtime type information checking is disabled"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'Test.TYP1' has no value restriction"
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the type 'Test.TYP1' has no pattern restriction"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "Successfully add the value 'Test' to the Run Time Type Information object of the current value. See $before and $after.",
                                        "before": [],
                                        "after": [
                                            "Test"
                                        ]
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "runtime type information checking is disabled"
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the type 'Test' has no value restriction"
                                    },
                                    {
                                        "type": "OK",
                                        "reason": "the type 'Test' has no pattern restriction"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "UNDEFINED_FIELD01_CORRECT",  function () { 
                var lcast = lcompile([
                    {
                        LNAME : "LObject",
                        LTYPEOF : "object",
                        LFIELDS : {
                            objfield : {
                                LNAME : '$ObjectField',
                                LTYPEOF : 'object',
                                LFIELDS : {
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
            },
                [
                    {
                        "status": "NORMAL",
                        "log": [
                            {
                                "type": "OK",
                                "reason": "the script 'LObject' with the value of 'param' was evaluated as true / see $sublog",
                                "sublog": [
                                    {
                                        "type": "OK",
                                        "reason": "the type 'LObject' with the value of 'param' was evaluated as true / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "field checking is disabled"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' has no type restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' has no value restriction"
                                            },
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' has no pattern restriction"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

            ltypeTestExpectValue( "UNDEFINED_FIELD02_INCORRECT",  function () { 
                var lcast = lcompile([
                    {
                        LNAME : "LObject",
                        LTYPEOF : "object",
                        LFIELDS : {
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
            },
                [
                    {
                        "status": "ERROR",
                        "log": [
                            {
                                "type": "Object Type Mismatch",
                                "reason": "the script '*LObject' with the value of 'param' was evaluated as false / see $sublog",
                                "sublog": [
                                    {
                                        "type": "Object Type Mismatch",
                                        "reason": "the type '*LObject' with the value of 'param' was evaluated as false / see $sublog",
                                        "sublog": [
                                            {
                                                "type": "OK",
                                                "reason": "the type 'LObject' requires a primitive type 'object' and the value of 'param' is a primitive type 'object' value"
                                            },
                                            {
                                                "type": "Field Mismatch",
                                                "reason": "fields of the object 'param' are not fullfilled with the type 'LObject' / see $sublog",
                                                "sublog": [
                                                    {
                                                        "type": "Object Type Mismatch",
                                                        "reason": "the type 'anonymous type' with the value of 'param.objfield' was evaluated as false / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "Malformed Type Definition",
                                                                "reason": "the type 'anonymous type' has no LTYPEOF property"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "OK",
                                                        "reason": "the script 'string' with the value of 'param.strfield' was evaluated as true / see $sublog",
                                                        "sublog": [
                                                            {
                                                                "type": "OK",
                                                                "reason": "the type 'string' with the value of 'param.strfield' was evaluated as true / see $sublog",
                                                                "sublog": [
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'string' requires a primitive type 'string' and the value of 'param.strfield' is a primitive type 'string' value"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "field checking is disabled"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'string' has no type restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'string' has no value restriction"
                                                                    },
                                                                    {
                                                                        "type": "OK",
                                                                        "reason": "the type 'string' has no pattern restriction"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            );

        }

        ltestEnd();
    }
    ltest();
    
