const execSync = require('child_process').execSync;
const fs = require('fs');
const process = require('process');
const css = require('./css');
const crypto = require('crypto');

/**
 *
 * @param {string} filePath the path of the font file
 * @returns {Array} the cmap of the font
 */
function getCMAP(filePath) {
    console.log('Generate CMAP... ');
    let cmd = `ttx -t cmap -o "cmap.xml" "${filePath}"`;
    try {
        execSync(cmd);
    } catch {
        console.log('[Error]Look the details above');
        process.exit(1);
    }

    // read file
    let cmapRaw = fs.readFileSync('cmap.xml', 'utf-8');
    let cmap = cmapRaw.match(/<map code=".*" name=".*"\/>/g).map((item) => {
        return item.split(`"`)[1].replace('0x', 'U+');
    });
    console.log('OK');
    fs.rmSync('cmap.xml');
    return cmap;
}

/**
 *
 * @param {Array} unicodes
 * @param {Array} cmap
 * @returns {Array} the unicodes that the font support
 */
function match(unicodes, cmap) {
    return unicodes.map((item) => {
        let support_unicodes = [];
        item.unicodes.forEach((unicode) => {
            if (cmap.includes(unicode)) {
                support_unicodes.push(unicode);
            }
        });
        return {
            index: item.index,
            unicodes: support_unicodes,
        };
    });
}

/**
 *
 * @param {Array} unicodes
 * @param {string} taegetFont
 */
function generateWoff2(unicodes, taegetFont, family, weight, style, display) {
    if (fs.existsSync('outputs')) {
        //clean
        fs.rmSync('outputs', { recursive: true });
    }

    fs.mkdirSync(`outputs`);

    let cssOutput = '';
    unicodes.forEach((item) => {
        let filename = crypto
            .createHash('md5')
            .update(item.unicodes.join(''))
            .digest('hex');
        console.log(`Generate ${filename}.woff2... `);

        // create dir
        let cmd = `fonttools subset --unicodes="${item.unicodes.join(
            ','
        )}" --output-file="./outputs/${filename}.ttf" ${taegetFont}`;
        execSync(cmd);
        // compress
        cmd = `fonttools ttLib.woff2 compress ./outputs/${filename}.ttf --output-file=./outputs/${filename}.woff2`;
        execSync(cmd);
        // delete TTF
        fs.rmSync(`./outputs/${filename}.ttf`);

        let unicodeRangeStr = css.unicodeMerge(item.unicodes);

        // generate css
        cssOutput += `@font-face {font-family: '${family}';font-style: ${style};font-weight: ${weight};font-display: ${display};src: url('${filename}.woff2') format('woff2');unicode-range: ${unicodeRangeStr};}`;
    });

    fs.writeFileSync('./outputs/font.css', cssOutput);

    console.log('Done');
}

module.exports.cmap = getCMAP;
module.exports.match = match;
module.exports.generateTTF = generateWoff2;
