```text
  _____           _     ____        _ _ _
 |  ___|__  _ __ | |_  / ___| _ __ | (_) |_
 | |_ / _ \| '_ \| __| \___ \| '_ \| | | __|
 |  _| (_) | | | | |_   ___) | |_) | | | |_
 |_|  \___/|_| |_|\__| |____/| .__/|_|_|\__|
                             |_|
```

Subset a single font file according to the provided Unicode Range

⚠️This tools is still in development

## Features

1. Analyze the css file from remote(local will support later)
2. Subset the font file according to the css file
3. Compress the font file to woff2 format
4. Generate the css file with the subsetted font file(cusomized url will support later)

## Requirements

[fonttools](https://github.com/fonttools/fonttools)(Python)

## Install

```bash
npm install -g font-split
```

## Usage

Do NOT specify the template that with more than 1 font-weight.

This tool only tests on Google fonts.

example:

```bash
font-split --font "./font.otf" --family "SourceHans" --weight 400 --template "https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap" 
```

## Todo:

1. Support local css file
2. merge Unicode Range
3. Read config from file
4. Remove duplicate Unicode Range
5. Optimize user interaction
6. cusomized url
7. Env check
8. Merge css file
9. ...

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.Please follow the [AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.uyo6cb12dt6w)
