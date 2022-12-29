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

module.exports.unicodeDecoder = unicodeDecoder;
module.exports.templateCSSFetch = templateCSSFetch;
