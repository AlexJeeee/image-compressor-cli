# image-compressor-cli
A image compressor cli based on [sharp](https://www.npmjs.com/package/sharp) and [gifsicle](https://www.npmjs.com/package/gifsicle), it will compress images and **replace them**

## install
```bash
npm install -g image-compressor-cli
```
## Usage
To define quality and gif lossy compression level
```bash
image-compressor-cli --quality 70 --lossy 50
```
or all set by default
```bash
image-compressor-cli
```

## Options:
```
-V, --version           output the version number
-q, --quality <number>  Set image quality for JPEG, WebP, PNG, BMP, TIFF (default: 80) (default: 80)
--lossy <number>        Set the lossy compression level for GIFs (default: 0, meaning lossless) (default: 0)
-h, --help              display help for command
```



## supported extensions

| supported extensions |                notes                | 
|:---------------------|:-----------------------------------:|
| jpg                  |          lossy compression          |
| jpeg                 |          lossy compression          |
| png                  |        lossless compression         |
| webp                 |          lossy compression          |
| gif                  |          lossy compression          |
| bmp                  | quality adjustment is not supported |

p.s.
<br />
1. Please **TEST** before large scale compression
2. **WebP** is generally smaller and higher quality than JPEG and PNG formats, so pay attention to the selection of compression parameters when compressing to prevent image distortion caused by over-compression.
