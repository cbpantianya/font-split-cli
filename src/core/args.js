/**
 *
 * @returns {key-value} the arguments
 */
function args() {
    // eslint-disable-next-line no-undef
    var args = process.argv.slice(2);
    var result = {};
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (arg.indexOf('--') === 0) {
            var argName = arg.slice(2);
            result[argName] = args[i + 1];
            i++;
        }
    }
    return analyse(result);
}

/**
 *
 * @param {key-value} args
 * @returns {key-value} the arguments
 */
function analyse(args) {
    if (!args['font'] || !args['template'] || !args['family'] || !args['weight']) {
        console.error(
            'invalid args, go to https://github.com/cbpantianya/font-split-cli for more information'
        );
        // eslint-disable-next-line no-undef
        process.exit(1);
    }

    return {
        font: args['font'],
        template: args['template'],
        family: args['family'],
        weight: args['weight'],
    };
}

module.exports.args = args;
