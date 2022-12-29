const execSync = require('child_process').execSync;
const fs = require('fs');

/**
 *
 * @param {string} filePath the path of the font file
 * @returns {Array} the cmap of the font
 */
function getCMAP(filePath) {
    console.log('Generate CMAP... ');
    let cmd = `ttx -t cmap -o "cmap.xml" "${filePath}"`;
    execSync(cmd).toString();

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
function generateWoff2(unicodes, taegetFont, family,weight) {
    if (!fs.existsSync('outputs')) {
        fs.mkdirSync(`outputs`);
    }

    let cssOutput = '';
    unicodes.forEach((item) => {
        // create dir
        let cmd = `fonttools subset --unicodes="${item.unicodes.join(
            ','
        )}" --output-file="./outputs/font-${item.index}.ttf" ${taegetFont}`;
        execSync(cmd);
        // compress
        cmd = `fonttools ttLib.woff2 compress ./outputs/font-${item.index}.ttf --output-file=./outputs/font-${item.index}.woff2`;
        execSync(cmd);
        // delete TTF
        fs.rmSync(`./outputs/font-${item.index}.ttf`);
        // generate css
        cssOutput += `@font-face {
            font-family: '${family}';
            font-style: normal;
            font-weight: ${weight};
            font-display: swap;
            src: url('./font-${item.index}.woff2') format('woff2');
            unicode-range: ${item.unicodes.join(', ')}
        }
        `;
    });

    fs.writeFileSync('./outputs/font.css', cssOutput);

    console.log('Done');
}

module.exports.cmap = getCMAP;
module.exports.match = match;
module.exports.generateTTF = generateWoff2;
