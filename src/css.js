const fetch = require('node-fetch');

/**
 *
 * @param {string} css the text of the css
 * @returns {string} the unicodeRange of the font
 */
function unicodeDecoder(css) {
    let unicodeRange = css.match(/unicode-range:.*;/g).map((item, index) => {
        let unicodes = [];
        item.slice(14, -1)
            .replace(/\s*/g, '')
            .split(',')
            .forEach((item) => {
                if (item.includes('-')) {
                    let [start, end] = item.split('-');
                    start = parseInt(start.replace('U+', ''), 16);
                    end = parseInt(end.replace('U+', ''), 16);
                    for (let i = start; i <= end; i++) {
                        unicodes.push('U+' + i.toString(16).toLowerCase());
                    }
                } else {
                    unicodes.push(item);
                }
            });

        return {
            index: index,
            unicodes: unicodes,
        };
    });

    return unicodeRange;
}

/**
 *
 * @param {string} url the template url
 */
async function templateCSSFetch(url) {
    return fetch(url, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0',
        },
    })
        .then((res) => res.text())
        .catch((err) => {
            throw new Error(err);
        });
}

function unicodeMerge(unicodeArray) {
    let unicodeRangeStr = '';
    for (let i = 0; i < unicodeArray.length; i++) {
        // merge
        if (i + 1 < unicodeArray.length) {
            let start = parseInt(unicodeArray[i].replace('U+', ''), 16);
            let next = parseInt(unicodeArray[i + 1].replace('U+', ''), 16);
            if (next - start === 1) {
                while (
                    i + 1 < unicodeArray.length &&
                    parseInt(unicodeArray[i].replace('U+', ''), 16)+1 ===
                        parseInt(unicodeArray[i + 1].replace('U+', ''), 16)
                ) {
                    i++;
                }
                unicodeRangeStr += `U+${start
                    .toString(16)
                    .toLowerCase()}-${unicodeArray[i].replace('U+', '')},`;
            }else{
                unicodeRangeStr += `${unicodeArray[i]},`;
            }
        }else{
            unicodeRangeStr += `${unicodeArray[i]},`;
        }
    }
    // remove last ','
    if(unicodeRangeStr.endsWith(',')){
        unicodeRangeStr = unicodeRangeStr.slice(0,-1);
    }
    return unicodeRangeStr
}

module.exports.unicodeDecoder = unicodeDecoder;
module.exports.templateCSSFetch = templateCSSFetch;
module.exports.unicodeMerge = unicodeMerge;
