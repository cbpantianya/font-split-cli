const fs = require('fs');
const process = require('process');

const defaultConfig = {
    // Option
    template: {
        type: 'remote',
        path: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap',
    },
    // Option
    'font-style': {
        family: 'Noto Sans SC',
        style: 'normal',
        weight: '400',
        display: 'swap',
    },
    // Must
    'target-font': {
        path: '',
    },
};

function configDecoder(filePath) {
    try {
        var configRaw = fs.readFileSync(filePath, 'utf-8');
    } catch {
        console.error(`[ERROR]Config file ${filePath} is not found`);
        process.exit(1);
    }

    try {
        var config = JSON.parse(configRaw);
    } catch {
        console.error('[ERROR]Invalid config file');
        console.error("Please check your config file's format");
        process.exit(1);
    }

    if (!config.template) {
        config.template = defaultConfig.template;
    } else {
        if (!config.template.type) {
            config.template.type = defaultConfig.template.type;
        }
        if (!config.template.path) {
            config.template.path = defaultConfig.template.path;
        }
    }

    if (!config['font-style']) {
        config['font-style'] = defaultConfig['font-style'];
    } else {
        if (!config['font-style'].family) {
            config['font-style'].family = defaultConfig['font-style'].family;
        }
        if (!config['font-style'].style) {
            config['font-style'].style = defaultConfig['font-style'].style;
        }
        if (!config['font-style'].weight) {
            config['font-style'].weight = defaultConfig['font-style'].weight;
        }
        if (!config['font-style'].display) {
            config['font-style'].display = defaultConfig['font-style'].display;
        }
    }

    if (!config['target-font']) {
        config['target-font'] = defaultConfig['target-font'];
    } else {
        if (!config['target-font'].path) {
            console.error('[ERROR]Please set the target font path');
            console.error(
                'More information:https://github.com/cbpantianya/font-split-cli'
            );
            process.exit(1);
        }
    }
    return config;
}

function argsDecoder() {
    let argsConfig = {};

    process.argv.forEach((val, index) => {
        if (val === '-h' || val === '--help') {
            console.log('Usage: font-split-cli [options]');
            process.exit(0);
        }
        if (val === '-v' || val === '--version') {
            console.log('0.0.1b');
            process.exit(0);
        } else if (val === '-c' || val === '--config') {
            // check
            if (!process.argv[index + 1]) {
                console.warn('[WARN]Use config.json in root directory');
                argsConfig.configFile = './config.json';
            } else {
                argsConfig.configFile = process.argv[index + 1];
            }
        }
    });
    return argsConfig;
}

module.exports.configDecoder = configDecoder;
module.exports.argsDecoder = argsDecoder;
