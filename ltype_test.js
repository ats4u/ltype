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
        ltestBegin('basic');

        // peq_test();
        //

        t0();
        function t0() {
            ltestSetUnitExecute( null );

            // NO0
            // if no argument was passed to lcompile, it treats as an empty array.
            ltypeTestExpectValue( "NO_PARAM", function () {
                var lcast = lcompile(); 
                return 'ok';
            });

            // NO1
            // if null was passed to lcompile, throw error.
            ltypeTestExpectError( "ILLEGAL_COMPILE_NULL", function () {
                return lcompile( null );
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
            });

            // NO4
            ltypeTestExpectError( "ILLEGAL_COMPILE_NO_LTYPEOF", function () {
                return lcompile([
                    {LNAME:"test", /* LTYPEOF:'any', */  },
                ]);
            });

            // NO5
            ltypeTestExpectError( "ILLEGAL_COMPILE_NO_LNAME", function () {
                return lcompile([
                    {/*LNAME:"test",*/ LTYPEOF:'any',  },
                ]);
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
            });
            ltypeTestExpectValue( "UNDEFINED_FIELD02",  function () {
                var lcast = lcompile([]); 
                return lcast("any",undefined );
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
            });

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
            });

            ltestSetUnitExecute( ltestUnitExecute2 );

            // NO6
            // the definition requires number and the field is missing.
            ltypeTestExpectError( "BASICTEST_01_MISSING_PROPERTY", function () {
                return lcast( "LNumber", { nun:"1" } );
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
            var lcast = lcompile( [ { LNAME : "LObject", LTYPEOF:"object",LFIELDS:{ obj : "LSub", }, }, { LNAME:"LSub", LTYPEOF:"object", }, ] );
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
                    LNAME : "LObject",
                    LTYPEOF : "object",
                    LFIELDS : {
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
                    LNAME:"Test",
                    LTYPEOF:"string",
                }, "hello" );
            });

            ltypeTestExpectError( "INLINE_DEFINITION_3_INCORRECT",  function () { 
                var lcast = lcompile([]); 
                lcast({
                    LNAME:"Test",
                    LTYPEOF:"number",
                },"hello" );
            });

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
            });

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
            });

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
            });

            ltypeTestExpectError( "UNDEFINED_FIELD02_INCORRECT",  function () { 
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
            });
        }

        ltestEnd();
    }
    // ltest();
    
