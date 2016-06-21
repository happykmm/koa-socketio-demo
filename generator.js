var fs  = require('fs');


var ctx = {
    name: "ctx",
    stat: thunkify(fs.stat),
};



function thunkify(fn){
    return function(){
        var args = new Array(arguments.length);
        var ctx = this;

        for(var i = 0; i < args.length; ++i) {
            args[i] = arguments[i];
        }

        return function(done){
            var called;

            args.push(function(){
                if (called) return;
                called = true;
                done.apply(this, arguments);
            });

            try {
                fn.apply(ctx, args);
            } catch (err) {
                done(err);
            }
        }
    }
};


function run(generator, callback) {
    if (typeof callback !== "function")
        callback = function() {};
    var g = generator();

    next();

    function next(err, data) {
        console.log(err, data);
        if (err) {
            callback(err, null);
            return;
        }
        
        var result = g.next(data);
        
        if (result.done) {
            callback(null, result.value);
            return;
        }
        
        if (typeof result.value === "function")
            result.value(next);
        else 
            next(null, result.value);
    }
}



function* gen() {
    //console.log("before yield");
    var a = yield ctx.stat(__dirname);
    var b = yield ctx.stat(__filename);
    var c = yield 1/0;
    return "Over!";
}


run(gen, (err, data) => {
    console.log(err, data);
});

