////////////////////////////////////////////////////////////////////////////////////////////////////
/*
* LTEST - A Very Simple Test Framework
* Author : ats.creativity@gmail.com
* Licence : BSD licence
*/

    var _ltest_index= 0;
    var _ltest_values=[];
    var _ltest_name =null;
    function ltestClear() { 
        _ltest_index =0;
        _ltest_values.splice(0,_ltest_values.length);
    };
    function ltestBegin(name) { 
        _ltest_name = name;
        console.group( "TEST(" + name +")" );
        ltestClear() 
    };
    function ltestEnd()   { 
        console.groupEnd( "TEST(" + name +")" );
        console.log( "REPORT >> " );
        var foundError = false;
        for ( var i=0;i<_ltest_values.length; i++ ){
            console.log( _ltest_values[i].name );
            if ( _ltest_values[i].status != 'EQU' ) {
                foundError = true;
            }
            if ( _ltest_filter_func( _ltest_values[i].status ) ) {
                console.log( "func", _ltest_values[i].func );
                console.log( "status", _ltest_values[i].status );
                // console.log( "expected", JSON.stringify( _ltest_values[i].expected,undefined, 4 ) );
                console.log( "output",   JSON.stringify( _ltest_values[i].output,undefined, 4 ) );
            }
        }
        console.log( "<<REPORT " );
        if( foundError ) {
            throw "Failed : see console.";
        } else {
            throw "**** THE TEST WAS SUCCESSFULLY EXECUTED! **** ";
        }
    }
    var _ltest_filter_func = _ltest_filter_func_default;
    function _ltest_filter_func_default(status) {
        return status != 'EQU';
    }
    function _ltest_filter_func_only_critical(status) {
        return status == 'NEQ_TOTALLY_BAD';
    }
    function ltestSetFilterFunction( func ) {
        if ( func == null ) { 
            _ltest_filter_func = _ltest_filter_func_default;
        } else if ( func =='ONLY_CRITICAL' ) {
            _ltest_filter_func = _ltest_filter_func_only_critical;
        } else {
            _ltest_filter_func = func;
        }
    }
    var _ltest_unit_name = "";
    var _ltest_current_unit_id = "";
    function ltestUnitBegin(name){
        _ltest_unit_name = name == undefined ? "" : name;
        var id = "TEST("+_ltest_name+")("+ _ltest_unit_name + ")" + (++_ltest_index);
        _ltest_current_unit_id = id;
        console.group(id);
        return id;
    }
    function ltestUnitEnd() {
        console.groupEnd();
    }
    function ltestUnitCurrentID() {
        return _ltest_current_unit_id;
    }

    function ltestUnitCheck( func, output, expected ) {
        var f =undefined;
        // console.log( func );
        // console.log( JSON.stringify( output,f,4) );
        if ( expected == null ) {
            // console.log( ( output ) );
                    _ltest_values.push( { name : ltestUnitCurrentID(), func:func, status: "NEQ", expected : '_undefined_', output : output } );
        } else {
            if ( ( typeof expected ) =='function' ) {
                var status = expected( output );
                _ltest_values.push( { name : ltestUnitCurrentID(), func:func, status: status, expected : 'function', output : output } );
            } else {
                if ( eq( output, expected ) ) {
                    _ltest_values.push( { name : ltestUnitCurrentID(), func:func, status: "EQU", expected : expected, output : output } );
                } else {
                    if ( output.type == expected.type ) {
                        _ltest_values.push( { name : ltestUnitCurrentID(), func:func, status: "NEQ", expected : expected, output : output } );
                    } else {
                        _ltest_values.push( { name : ltestUnitCurrentID(), func:func, status: "NEQ_TOTALLY_BAD", expected : expected, output : output } );
                    }
                }
            }
        }
    }

    var _ltestUnitExecute = ltestUnitExecuteDefault;
    function ltestUnitExecuteDefault( func ) {
        var output;
        try{
            var o = func();
            output = {
                type : 'NORMAL',
                value : o,
            };
        } catch(e){
            output = {
                type : "ERROR",
                value:e.message,
            };
        } 
        return output;
    }
    /**
     * function ltestSetUnitExecute() : void
     * set null to default
     */
    function ltestSetUnitExecute( func ) {
        if ( func == null ) {
            _ltestUnitExecute = ltestUnitExecuteDefault;
        } else {
            _ltestUnitExecute = func
        }
    }

    function _testUnit( name, func, expected ) {
        ltestUnitBegin(name);
        var output = _ltestUnitExecute(func);
        ltestUnitCheck( func, output, expected );
        ltestUnitEnd();
    }
    var _ltest_ignoreAll = false;
    function ltestUnit( name, func, expected ) {
        if ( _ltest_ignoreAll ) {
            return {
                lexe : function(){
                    return _testUnit(name, func, expected );
                },
            };
        } else {
            return _testUnit( name, func, expected );
        }
    }

    function ltestSetIgnoreAll( ignoreAll ) {
        _ltest_ignoreAll = ignoreAll;
    }

