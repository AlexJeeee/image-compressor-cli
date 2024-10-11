# image-compressor-cli
A batch image compressor cli based on [sharp](https://www.npmjs.com/package/sharp), it will compress images and **replace them** by default.

## install
```bash
npm install -g image-compressor-cli
```
## Usage
Execute with command `image-compressor-cli` in image directory

To define static images quality
```bash
image-compressor-cli --quality 80
```

To define gif images quality (2 - 256)
```bash
image-compressor-cli --colors 128
```

To define a specific output directory rather than replacing images
```bash
image-compressor-cli --output-dir ./output
```

or all set by default
```bash
image-compressor-cli
```

## Options:
```
-V, --version                 output the version number
-q, --quality <number>        Set static image quality (default: 80)
-c, --colors <number>         Set gif image maximum number of palette entries, including transparency, between 2 and 256 (default: 128)
-o, --output-dir <directory>  Specify a custom output directory
-h, --help                    display help for command
```



## supported extensions

| supported extensions |                notes                | 
|:---------------------|:-----------------------------------:|
| jpg                  |          lossy compression          |
| jpeg                 |          lossy compression          |
| png                  |        lossless compression         |
| tiff                 |        lossless compression         |
| webp                 |          lossy compression          |
| gif                  |          lossy compression          |
| bmp                  | quality adjustment is not supported |

p.s.
<br />
1. Please **TEST** before large scale compression
2. **WebP** is generally smaller and higher quality than JPEG and PNG formats, so pay attention to the selection of compression parameters when compressing to prevent image distortion caused by over-compression.
