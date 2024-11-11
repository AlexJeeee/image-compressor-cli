# image-compressor-cli
A batch image compressor cli based on [tinify](https://www.npmjs.com/package/tinify) and [sharp](https://www.npmjs.com/package/sharp), it will compress images and **replace them** by default.

## install
```bash
npm install -g image-compressor-cli
```
## Usage

### Set your tinify api key
go to [tinify](https://tinify.com/dashboard/api) and get your api key

Execute with follow command to set your api key,
```bash
image-compressor-cli config -k <your-tinify-api-key>
```  
and you can use`image-compressor-cli config --show` to view your current api key.  
Then you can use the following commands to compress images  
  
Currently, the images compressed by Tinify **(jpg, jpeg, png, webp)** are not supported custom quality, so you can only use the default quality.

### To define static images(bmp, tiff, gif) quality
```bash
image-compressor-cli --quality 80
```

### To define gif images quality (2 - 256)
```bash
image-compressor-cli --colors 128
```

### To define a specific output directory rather than replacing images
```bash
image-compressor-cli --output-dir ./output
```

### All set by default
```bash
image-compressor-cli
```

## Options:
```
  -V, --version                 output the version number
  -q, --quality <number>        Set Sharp static image quality (default: 80)
  -c, --colors <number>         Set gif image maximum number of palette entries, including transparency, between 2 and
                                256 (default: 128)
  -o, --output-dir <directory>  Specify a custom output directory
  -h, --help                    display help for command

Commands:
  config [options]              API key configuration management
  help [command]                display help for command
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
  
  1. Please **TEST** before large scale compression
2. **WebP** is generally smaller and higher quality than JPEG and PNG formats, so pay attention to the selection of compression parameters when compressing to prevent image distortion caused by over-compression.
