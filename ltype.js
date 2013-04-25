/*
* LTYPE - Very Simple Non-Prototype-Based Type Management System
* Author : ats.creativity@gmail.com 
* Date : Mar/2013
* Licence : BSD licence
*/
    var __lconsole_of_dummy = {
        trace:function(){},
        log:function(){},
        warn:function(){},
        error:function(){},
        group:function(){},
        groupEnd:function(){},
    };
    function __lconsole() {
        if ( content != null && content.console != null ) {
            var console = content.console;
            if ( console.group == undefined ) {
                console.group = console.log;
            }
            if ( console.groupEnd == undefined ) {
                console.groupEnd = function() {
                };
            }
            return console;
        } else {
            return __lconsole_of_dummy;
        }
    }

    // function eq( o1, o2 ) {
    //     var result = _eq(o1,o2);
    //     console.log( "eq(o1=",o1, ", o2=",o2, ")=", result );
    //     return result;
    // }

    function eq( o1, o2 ) {
        if ( o1===o2 ) {
            return true;
        } else if ( o1==null || o2 == null ) {
            return false;
        } else if ( (typeof o1) ==  'object' && (typeof o2) == 'object' ) {
            var p1=[];
            var p2=[];
            // var p1=Object.keys(o1);
            // var p2=Object.keys(o2);
            for ( var i in o1 ) {
                if ( i != 'LTYPE' && i != 'LWHEN' ) {
                    p1.push( i );
                }
            }
            for ( var i in o2 ) {
                if ( i != 'LTYPE' && i != 'LWHEN' ) {
                    p2.push( i );
                }
            }
            if ( p1.length != p2.length ) {
                return false;
            } else {
                p1 = p1.sort();
                p2 = p2.sort();
                var len = p1.length;
                for ( var i=0; i<len; i++ ) {
                    if ( p1[i]!=p2[i] ) { return false }
                    if ( ! eq(o1[p1[i]],o2[p2[i]]) ) { return false }
                }
                return true;
            }
        } else {
            return false;
        }
    }

    function _lisArray(object){
        //return object==null ? false : object.constructor.name == "Array";
        // return object==null ? false : ( object.constructor == Array ? true : ( object.length != undefined && object.slice != undefined ) );
        return (
            ( typeof object=='object' ) && 
            ( object!=null ) && 
            ( object.constructor == Array || ( object.length != undefined && object.slice != undefined ) )
        );
    }

    function _lisObject(object){
        return object==null ? false : (typeof object)=='object';
    }

    function _lclone(object){ 
        if ( typeof object == 'object' ) {
            return JSON.parse( JSON.stringify( object ) );
        } else {
            return object;
        }
    }

    // eq( {a:"hello",b:"world"}, {b:"world", a:"hello" } )
    function _lmerge() {
        for ( var i=0; i<arguments.length; i++ ) {
            var o = arguments[i];
            for ( var i in o ) {
                this[i] = o[i];
            }
        }
        return this;
    }
    function _liskeyword( p ) {
        return p=='LNAME' || p=='LTYPEOF' || p=='LEQU' || p=='LIS'|| p=='LPAT' || p=='LFIELDS' ||p == 'LWHEN' || p =='LTYPE' || p == 'toString';
    }

    var _LError = {
        toString : function(){
            return JSON.stringify( this, function(k,v) {
                if ( k !='toString' ) {
                    return v;
                }
            });
        },
    };

    function ltypeBasic() {
        return [
            {LNAME:'any',       LTYPEOF:'any',       },
            // {LNAME:'null',      LTYPEOF:'object',    LEQU:[null] },
            {LNAME:'null',      LTYPEOF:'null',      },
            {LNAME:'array',     LTYPEOF:'array',     },
            {LNAME:'undefined', LTYPEOF:'undefined'  },
            {LNAME:'function',  LTYPEOF:'function'   },
            {LNAME:'object',    LTYPEOF:'object',    },
            {LNAME:'boolean',   LTYPEOF:'boolean',   },
            {LNAME:'string',    LTYPEOF:'string',    },
            {LNAME:'number',    LTYPEOF:'number',    },
        ];
    }

    var LTYPE_TEST_MODE = false;
    var LTYPE_LAST_OUTPUT = null;
    function lcompile( _ltypes_arr ) {
        if ( arguments.length == 0 ) {
            _ltypes_arr = [];
        }
        if ( ! _lisArray( _ltypes_arr ) ) {
            throw new Error( "Illegal Argument (malformed parameter object) : " + JSON.stringify( _ltypes_arr ) );
        }
        if ( _ltypes_arr == null || ( typeof _ltypes_arr != 'object' ) || _ltypes_arr.length == undefined ) {
            throw new Error( "Illegal Argument (malformed parameter object) : " + JSON.stringify( _ltypes_arr ) );
        }
        var ltypes_arr = ltypeBasic().concat( _ltypes_arr );
        var map_ltypes = {};
        for ( var i=0; i<ltypes_arr.length; i++ ) {
            if ( ltypes_arr[i].LNAME == undefined ) {
                throw new Error( "Illegal Argument (found an object which has no LNAME) : " + JSON.stringify( _ltypes_arr ) );
            }
            if ( ltypes_arr[i].LTYPEOF == undefined ) {
                throw new Error( "Illegal Argument (found an object which has no LTYPEOF) : " + JSON.stringify( _ltypes_arr ) );
            }
            map_ltypes[ ltypes_arr[i].LNAME ] = ltypes_arr[i];
        }

        var lcast = function lcast( type, object, name ) {
            // __lconsole().trace();
            if ( name == undefined ) {
                name = 'param';
            }
            var llog = [];
            var lresult = _lcast( map_ltypes, llog, /*boolean*/ true, /*string||object*/ type , name, /*object*/ object );
            var status  = { 
                result : lresult ? 'NORMAL' : 'ERROR',
                log : llog,
            };
            lcast.status = status;
            if ( LTYPE_TEST_MODE ) {
                LTYPE_LAST_OUTPUT.push( status );
            }
            // for ( var i=0; i<lcast.__ondone.length; i++ ) {
            //     lcast.__ondone[i]( status );
            // }
            if ( ! lresult ) {
                // __lconsole().error( "Type Mismatch", new Error().stack.split("\n"), type, JSON.stringify( llog,undefined, 4 ) );
                // throw { __proto__:_LError, message:"Type Mismatch",stack:new Error().stack.split("\n"), object:object, type:type, log:llog }
                throw { __proto__:_LError, message:"Type Mismatch",stack:new Error().stack, object:object, type:type, log:llog }
            }
            return object;
        };
        // lcast.__ondone = [];
        return lcast;
    }
    
    function _larrmerge() {
        var result=[];
        for ( var pidx=0; pidx<arguments.length; pidx++ ) {
            var arr = arguments[pidx];
            for ( var aidx=0; aidx<arr.length; aidx++ ) {
                var found = false;
                for ( var ridx=0; ridx<result.length; ridx++ ) {
                    if ( result[ridx] == arr[aidx] ) {
                        found = true;
                        break;
                    }
                }
                if ( ! found ) {
                    result.push( arr[aidx] );
                }
            }
        }
        return result;
    }

    function _lstackToString( stack ) {
        if ( stack === undefined ) {
            __lconsole().trace();
        }
        if ( 0<stack.length ) {
            return "[" + stack.join( "][" ) + "]";
        } else {
            return "";
        }
    }

    function _ldimToStr(dim) {
        var s = "";
        for ( var i=0; i<dim; i++ ) {
            s+="[]";
        }
        return s;
    }

    function _llogNotifyStatus( msgid, result, scriptType, scriptString, targetName, sublog ) {
        if ( result ) {
            return ( { type:"OK",                   reason : scriptType + " '" + scriptString + "' with the value of '"+targetName+"' was evaluated as true / see $sublog", /* msgid:msgid,*/ sublog:sublog } );
        } else { 
            return ( { type:"Object Type Mismatch", reason : scriptType + " '" + scriptString + "' with the value of '"+targetName+"' was evaluated as false / see $sublog",/* msgid:msgid,*/ sublog:sublog } );
        }
    }

    function _llogNotifyPrimitive( result, objectName2, objectValue, argTypeObject ) {
        var objectPrimitiveType = typeof objectValue;
        if ( result ) {
            return ( { type:"OK",                      reason : 
                "the type '"+argTypeObject.LNAME+"' requires a primitive type '" + argTypeObject.LTYPEOF + "' and the value of '" + objectName2 + "' is a primitive type '" + objectPrimitiveType +"' value" } );
        } else {
            return ( { type:"Primitive Type Mismatch", reason : 
                "the type '"+argTypeObject.LNAME+"' requires a primitive type '" + argTypeObject.LTYPEOF + "' and the value of '" + objectName2 + "' is a primitive type '" + objectPrimitiveType +"' value" } );
        }
    }

    /*
    * a wildcard class name 'any' matches every type but undefined. 
    * a wildcard class name 'array' matches array object. 
    */
    function _lasCheckPrimitive( argTypeObject, objectValue ) {
        var objectPrimitiveType = typeof objectValue;
        var ltypeof = argTypeObject.LTYPEOF;
        return ( 
               ( ltypeof==='any'    && objectPrimitiveType!=='undefined' ) || 
               ( ltypeof==='null'   && objectPrimitiveType==='object' && ( objectValue === null ) ) ||
               ( ltypeof==='object' && objectPrimitiveType==='object' && ( objectValue !== null ) && ! _lisArray( objectValue ) ) ||
               ( ltypeof==='array'  && objectPrimitiveType==='object' && ( objectValue !== null ) &&   _lisArray( objectValue ) ) ||
               ( ltypeof!=='object' && argTypeObject.LTYPEOF=== objectPrimitiveType )
        );
    }

    /*
    * _ltypeof
    *     check RTTI object
    */
    function _ltypeof( objectValue ) {
        return objectValue == null ? null : ( objectValue.LTYPE == undefined ? null : objectValue.LTYPE );
    }

    /**
    * _lembed()
    *     This embeds RTTI information to an object.
    */

    function _lembed( object, typeStringList ) {
        if ( ! LTYPE_TEST_MODE ) {
            object.LWHEN = new Error().stack.split("\n").slice(2);
        }
        object.LTYPE = _larrmerge( object.LTYPE == undefined ? [] : object.LTYPE, typeStringList );
        // object.toString = function() {
        //     return "[object " + this.LTYPE.join(",") +"]\n" + this.LWHEN;
        // };
        return object;
    }


    function _lcast( ltypes, llog, /*boolean*/ doembedRTTI, /*string||object*/ typedef, objectName, /*object*/ objectValue ) {
        if ( typedef == undefined ) {
            llog.push( { type:'Illegal Argument Error', reason: "typedef was '" + typedef + "'" } );
            return false;
        } else if ( typeof typedef  == 'string' ) {
            return _lcast_typedefString( ltypes, llog, doembedRTTI, typedef, objectName, /*object*/ objectValue, [] );
        } else if ( typeof typedef == 'object' ) {
            // return _lcast_typedefObject( ltypes, llog,       doembedRTTI, objectName, typedef, /*object*/ objectValue, [] );
            return _lcast_typedefObject( ltypes, llog, false, doembedRTTI, typedef, objectName,  objectValue,  0, [] );
            // return _ltypefield( ltypes, llog, doembedRTTI, typedef, objectName, objectValue );
        } else {
            llog.push( { type:'Illegal Argument Error', reason: "typedef was '" + typedef + "'" } );
            return false;
        }
    }


    /*
    * _lcast_typedefString
    */
    function _lcast_typedefString( ltypes, llog, /*boolean*/doembedRTTI, /*string*/ typedefString, objectName, /*object||undefined*/ objectValue, arrayIndexStack1 ) {
        var objectName1 = objectName+_lstackToString(arrayIndexStack1);
        if ( ( (typeof typedefString) == 'string' ) && typedefString.startsWith( "array of " ) ) {
            var sublog = [];
            var result = _lcast_array_typedefString(ltypes, sublog, doembedRTTI, typedefString, objectName, objectName1, objectValue, arrayIndexStack1 );
            llog.push( _llogNotifyStatus( 'L100',result, 'the script', typedefString, objectName1, sublog ) );
            return result;
        } else {
            var sublog = [];
            var result = _lcast_eval_typedefString(ltypes, sublog, doembedRTTI, objectName1, objectValue, typedefString );
            llog.push( _llogNotifyStatus( 'L101', result, 'the script', typedefString, objectName1, sublog ) );
            return result;
        }
    }

    function _lcast_array_typedefString( ltypes, sublog, /*boolean*/doembedRTTI, /*string*/ typedefString, objectName, objectName1,/*object||undefined*/ objectValue, arrayIndexStack1 ) {
        if ( objectValue ==null || (! _lisArray( objectValue ) ) ) {
            sublog.push( { type:"Not Array", reason : "'"+objectName1+"' is not an array" } );
            return false;
        }
        arrayIndexStack1.push(null);
        var arrIdxPos = arrayIndexStack1.length-1;
        var result = true;
        for ( var i=0; i<objectValue.length; i++ ) {
            arrayIndexStack1[arrIdxPos] = i;
            if ( ! _lcast_typedefString( ltypes, sublog, doembedRTTI, typedefString.substring(9), objectName, objectValue[i], arrayIndexStack1 ) ) {
                result = false;
                // break;
            }
        }
        arrayIndexStack1.pop();
        return result;
    }

    var _lregexp1 = /([\*]*)([_$a-zA-Z0-9\xA0-\uFFFF]+)((\[\])*)/g;
    function _lcast_eval_typedefString( ltypes, sublog, doembedRTTI, objectName1, objectValue, typedefString ) {
        var typeValueScript = typedefString.replace( _lregexp1, function(s0,prefix, identifier, array) {
            return "fn('"+prefix+"','" + identifier +"',"+(array.length /2)+")";
        });
        function fn( prefix, argTypeName, arrayDim ) {
            // __lconsole().log( "fn()",prefix, argTypeName, arrayDim );
            var doFastTypeCheck = ( 0<=prefix.indexOf("*" ) );
            return _lcast_eval_typedefID( ltypes, sublog, doembedRTTI, doFastTypeCheck, argTypeName, objectName1, objectValue, arrayDim, [] );
        }
        var result = eval( typeValueScript );
        return result;
    }

    function _lcast_eval_typedefID( ltypes, sublog, doembedRTTI, doFastTypeCheck, /*string*/ argTypeName, objectName1, objectValue, arrayIndexStack2Max, arrayIndexStack2 ) {
        // __lconsole().log( "argTypeName",argTypeName );
        var objectName2 = objectName1 +_lstackToString(arrayIndexStack2);
        if ( 0<arrayIndexStack2Max ) {
            if ( objectValue.length === undefined ) {
                sublog.push( { type:"Not Array", reason : "'"+objectName2+"' is not array"  } );
                return false;
            } else {
                var result=true; 
                var subsublog = [];
                for ( var i=0; i<objectValue.length; i++ ) {
                    arrayIndexStack2.push(i);
                    if ( ! _lcast_eval_typedefID( ltypes, subsublog, doembedRTTI, doFastTypeCheck, argTypeName, objectName1, objectValue[i], arrayIndexStack2Max-1, arrayIndexStack2) ) {
                        result = false;
                    }
                    arrayIndexStack2.pop();
                }
                sublog.push( _llogNotifyStatus( 'L200',result, 'the type', argTypeName+_ldimToStr(arrayIndexStack2Max), objectName2, subsublog ) );
                return result;
            }
        } else {
            // var subsublog = [];
            // var result = _lcast_typedefObject( ltypes, subsublog, doFastTypeCheck, doembedRTTI, argTypeName, objectName2, objectValue );
            // sublog.push( _llogNotifyStatus( 'L202',result, 'the type', _lcast_restore_prefix( doFastTypeCheck)+ argTypeName+_ldimToStr(arrayIndexStack2Max), objectName2, subsublog ) );
            // return result;
            return _lcast_typedefObject( ltypes, sublog, doFastTypeCheck, doembedRTTI, argTypeName, objectName2, objectValue, arrayIndexStack2Max, arrayIndexStack2 );
        }
    }

    function _lcast_restore_prefix( doFastTypeCheck, argTypeObject ) {
        // __lconsole().log( argTypeObject.LTYPEOF );
        if ( argTypeObject != null && argTypeObject.LTYPEOF != undefined && argTypeObject.LTYPEOF=='object' ) {
         // return doFastTypeCheck ? "*" : "";
            return doFastTypeCheck ? "*" : "";
        } else {
            return "";
        }
    }

    function _lcast_typedefObject( ltypes, sublog, doFastTypeCheck, doembedRTTI, /*string||object*/ argType, objectName2, objectValue, arrayIndexStack2Max, arrayIndexStack2 ) {
        var subsublog = [];
        var result /*:boolean||null*/=null;
        
        var argTypeObject=null;
        var argTypeName = null;
        // var argTypeObject = ltypes[ argType ];
        if ( argType == null ) { 
            // __lconsole().log( "NO0 ");
            subsublog.push( { type:'Illegal Argument Error', reason: "typedefString was '" + argType + "'" } );
            argTypeName = argType;
            argTypeObject = null;
            result = false;
        } else if ( typeof argType == 'string' ) { 
            // __lconsole().log( "NO1 ");
            argTypeName = argType;
            argTypeObject = ltypes[ argType ];
            if ( argTypeObject == undefined ) {
                subsublog.push( { type:'Undefined Type', reason:"the specified type '"+argType+"' is not defined" } );
                result = false;
            }
        } else if ( typeof argType == 'object' ) {
            // __lconsole().log( "NO3 ");
            argTypeObject = argType;
            if ( argTypeObject.LNAME != null ) {
                argTypeName = argTypeObject.LNAME;
            } else {
                argTypeName = 'anonymous type';
            }
        } else {
            argTypeName = argType;
            argTypeObject = null;
            subsublog.push( { type:'Illegal Argument Error', reason: "typedefString was '" + argType + "'" } );
            // __lconsole().log( "NO4 ");
            result = false;
        }
        if ( result === null ) {
            result = _ltypeobject_fn3( ltypes, subsublog, doFastTypeCheck, doembedRTTI, /*string||object*/ argTypeName, argTypeObject, objectName2, objectValue,arrayIndexStack2Max, arrayIndexStack2 );
        }
        sublog.push( _llogNotifyStatus( 'L300',result, 'the type', _lcast_restore_prefix( doFastTypeCheck,argTypeObject )+ argTypeName+_ldimToStr(arrayIndexStack2Max), objectName2, subsublog ) );
        return result;
    }

    function _ltypeobject_fn3( ltypes, sublog, doFastTypeCheck, doembedRTTI, /*string*/ argTypeName, /*object*/argTypeObject, objectName2, objectValue, arrayIndexStack2Max, arrayIndexStack2 ) {
        if ( argTypeObject === undefined ) {
            sublog.push( { type:"Undefined Type", reason : "the type '"+ argTypeName+ "' is not defined" } );
            return false;
        } else if (argTypeObject.LTYPEOF==undefined ) {
            sublog.push( { type:"Malformed Type Definition", reason : "the type '"+ argTypeName + "' has no LTYPEOF property" } );
            return false;
        } else {

            if ( doFastTypeCheck ) {
                var grandResult = (function() {
                    // if ( ! doFastTypeCheck ) {
                    //     sublog.push( { type:"OK", reason:"Run Time Type Information checking was not performed because Fast Run Time Type Checking is disabled." } );
                    //     return true;
                    // }

                    // // CONDITION1 (OLD 2013/4/24)
                    // if (argTypeObject.LIS == undefined ) {
                    //     sublog.push( { type:"OK", reason : "the type '" + argTypeName+ "' has no type restriction" } );
                    //     return true;
                    // } 
                    // var typeLIS = argTypeObject.LIS;

                    // CONDITION1 (NEW)
                    var typeLIS = [];
                    if ( argTypeObject.LIS != undefined  ){
                        typeLIS = typeLIS.concat( argTypeObject.LIS );
                    }
                    if ( argTypeObject.LNAME != undefined ) {
                        var found = false;
                        for ( var i=0; i<typeLIS.length; i++ ) {
                            if ( typeLIS[i] == argTypeObject.LNAME ) {
                                found=true;
                                break;
                            }
                        }
                        if ( ! found ) {
                            typeLIS.unshift( argTypeObject.LNAME );
                        }
                    }
                    
                    // CONDITION 2
                    var objectLIS /*string[]*/ = _ltypeof( objectValue );
                    if ( objectLIS == null ) {
                        sublog.push( { type:"Unqualified Object", reason : "RTTI checking was performed. the type '" + argTypeName + "' has type restriction ["+ typeLIS.join(",") + "] but the value has no RTTI information", objectValue:objectValue } );
                        return false;
                    } 

                    // CONDITION 3 (LOOP)

                    // (AND operation)
                    var outerFound = true;
                    for ( var aidx=0; aidx<typeLIS.length; aidx++ ) {
                        var atype = typeLIS[aidx];
                        // (OR operation)
                        var found=false;
                        for ( var oidx=0; oidx<objectLIS.length; oidx++ ) {
                            if (objectLIS[oidx]===atype ) {
                                found=true;
                                break;
                            }
                        }
                        if ( ! found  ) {
                            outerFound = false;
                            break;
                        }
                    }

                    if ( outerFound ) {
                        sublog.push( { type:"OK",                        reason : "RTTI checking was performed. the type '" + argTypeName + "' has type requirement ["+ typeLIS.join(",")  + "] and the value has type [" + objectLIS.join(",") +"]" } );
                    } else {
                        sublog.push( { type:"Type Information Mismatch", reason : "RTTI checking was performed. the type '" + argTypeName + "' has type requirement ["+ typeLIS.join(",")  + "] and the value has type [" + objectLIS.join(",") +"]" } );
                    }
                    return outerFound;
                })();
                return grandResult;
            } else {
                var grandResult = (function() {
                    var result = _lasCheckPrimitive( argTypeObject, objectValue );
                    sublog.push( _llogNotifyPrimitive( result, objectName2, objectValue, argTypeObject ) );
                    return result;
                })() && (function() {
                    // return  _ltypefield( ltypes, sublog, /*boolean*/ doembedRTTI, /*string||object*/ argTypeName, objectName2, objectValue );
                    // if ( doFastTypeCheck ) {
                    //     sublog.push( { type:"OK", reason:"Field type checking was not performed because Fast Run Time Type Checking is enabled." } );
                    //     return true;
                    // }

                    if ( argTypeObject.LFIELDS == undefined  ) {
                        sublog.push( { type:"OK", reason:"the type '" + argTypeName + "' has no field" } );
                        return true;
                    }

                    var lsubsublog = [];
                    var result = true;
                    for ( var fieldName in argTypeObject.LFIELDS ) {
                        if ( _liskeyword( fieldName ) ) {
                            continue;
                        }
                        var argSubType /* object||string */ = argTypeObject.LFIELDS[ fieldName ];
                        var objectValue2 /* any||undefined */ = objectValue[ fieldName ];
                        // if ( ! _lcast( ltypes, lsubsublog, doembedRTTI, fieldName, typedefString, objectValue2 ) ) {
                        //     result = false;
                        // } else {
                        // }
                        // if ( ! _lcast_typedefObject( ltypes, lsubsublog, doFastTypeCheck, doembedRTTI, argSubType, objectName2+"."+fieldName, objectValue2, arrayIndexStack2Max, arrayIndexStack2 ) ) {
                        //     result = false;
                        // } else {
                        // }
                        if ( ! _lcast( ltypes, lsubsublog, doembedRTTI, argSubType, objectName2+"."+fieldName, /*object*/ objectValue2 ) ) {
                            result = false;
                        }
                    }

                    // sublog.push( _llogNotifyStatus( 'L300',result, 'the type', argTypeName, objectName2, lsubsublog ) );
                    if ( result ) {
                        sublog.push( { type:"OK",             reason: "the fields of the object '"+objectName2+"' are fullfilled with the type '"    +argTypeName+ "' / see $sublog", sublog:lsubsublog, } );
                    } else {
                        sublog.push( { type:"Field Mismatch", reason: "the fields of the object '"+objectName2+"' are not fullfilled with the type '"+argTypeName+ "' / see $sublog", sublog:lsubsublog, } );
                    }

                    return result;
                })() && (function() {
                    // if ( doFastTypeCheck ) {
                    //     sublog.push( { type:"OK", reason:"equality checking was not performed because Fast Run Time Type Checking is enabled." } );
                    //     return true;
                    // }
                    // sublog.push( { type:"Log", reason :  [] } );
                    var leqValues = argTypeObject.LEQU;
                    if ( leqValues == undefined ) {
                        sublog.push( { type:"OK", reason : "the type '"+argTypeName+ "' has no value restriction" } );
                        return true;
                    } else {
                        // sublog.push( { type:"Log", reason :  [] } );
                        for ( var i=0; i<leqValues.length; i++ ) {
                            if ( eq( leqValues[i], objectValue ) ) {
                                sublog.push( { type:"OK", reason : "'" + objectName2+ "' is equivalent with one of objects in LEQU defintion" } );
                                return true;
                            }
                        }
                        sublog.push( { type:"Value Unmatched", reason : "the value of '" + objectName2 + "' should be one of $leqValues but actually $objectValue", leqValues:_lclone(leqValues), objectValue:_lclone(objectValue) } );
                        return false;
                    }
                })() && (function() {
                    // if ( doFastTypeCheck ) {
                    //     sublog.push( { type:"OK", reason:"pattern match was not performed because Fast Run Time Type Checking is enabled." } );
                    //     return true;
                    // }
                    // sublog.push( { type:"Log", reason : [] } );
                    var lpatValues = argTypeObject.LPAT;
                    if ( lpatValues == undefined ) {
                        // sublog.push( { type:"Log", reason :[] } );
                        sublog.push( { type:"OK", reason : "the type '" + argTypeName+ "' has no pattern restriction" } );
                        return true;
                    } else {
                        // sublog.push( { type:"Log", reason : [] } );
                        for ( var i=0; i<lpatValues.length; i++ ) {
                            if ( new RegExp( lpatValues[i] ,'g' ).test( objectValue ) ) {
                                sublog.push( { type:"OK", reason : "'$lpatValues matched specified value $objectValue", lpatValues:_lclone(lpatValues), objectValue:_lclone(objectValue) } );
                                return true;
                            }
                            // sublog.push( { type:"Log", reason : [] } );
                        }
                        sublog.push( { type:"Pattern Unmatched", reason : "the value of '"+ objectName2 +"' should be one of $lpatValues but actually $objectValue", lpatValues:_lclone(lpatValues), objectValue:_lclone(objectValue) } );
                        return false;
                    }
                })();

                function embedRTTI() {
                    if ( doembedRTTI && (! doFastTypeCheck ) && argTypeObject.LNAME != null ) {
                        if ( objectValue == null || typeof objectValue!='object' ) {
                            sublog.push( { type:"OK", reason: "unable to add the value '"+argTypeName+"' to the Run Time Type Information object of the current value so ignored. typeof(" + objectValue + ")=='" + (typeof objectValue) + "'" } );
                            return;
                        }
                        var before=[],after=[];
                        if ( objectValue.LTYPE != undefined ) {
                            before =  before.concat( objectValue.LTYPE );
                        }
                        _lembed( objectValue, [ argTypeObject.LNAME ] );
                        if ( objectValue.LTYPE != undefined ) {
                            after  = after.concat( objectValue.LTYPE );
                        }
                        sublog.push( { type:"OK", reason: "successfully add the value '"+argTypeName+"' to the Run Time Type Information object of the current value. See $before and $after.", before:before,after:after  } );
                    }
                }
                if ( grandResult ) {
                    embedRTTI();
                }
                return grandResult;
            }
        }
    }

