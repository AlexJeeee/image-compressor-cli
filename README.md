# image-compressor-cli
a image compressor cli based on [sharp](https://www.npmjs.com/package/sharp), it will compress images and replace them

## install
```bash
npm install -g image-compressor-cli
```
## Usage
To define quality
```bash
image-compressor-cli --quality 70
```
or all set by default
```bash
image-compressor-cli
```

## supported extensions

| supported extensions  | notes  | 
| :----------- |:------: |
| jpg      | lossy compression |
| jpeg       | lossy compression |
| png       | lossless compression |
| webp       | lossy compression |

p.s.
<br />
WebP is generally smaller and higher quality than JPEG and PNG formats, so pay attention to the selection of compression parameters when compressing to prevent image distortion caused by over-compression.