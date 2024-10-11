#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const os = require('os');
const { Command } = require('commander');
const program = new Command();

program
  .version('1.0.6')
  .description('CLI tool to compress images in the current directory and replace the original files or save to a custom directory')
  .option('-q, --quality <number>', 'Set static image quality', 80)
  .option('-c, --colors <number>', 'Set gif image maximum number of palette entries, including transparency, between 2 and 256', 128)
  .option('-o, --output-dir <directory>', 'Specify a custom output directory');

program.parse(process.argv);

const options = program.opts();

const ImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.gif'];

// 获取当前目录中的所有图片文件
const getImages = (directory) => {
  return fs.readdirSync(directory).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ImageExtensions.includes(ext);
  });
};

// 确保输出目录存在
const ensureOutputDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// 处理文件替换或输出到指定目录
const handleOutput = (tempPath, originalPath, outputDir) => {
  if (outputDir) {
    ensureOutputDirectory(outputDir);
    const outputFilePath = path.join(outputDir, path.basename(originalPath));
    fs.renameSync(tempPath, outputFilePath); // 将临时文件保存到输出目录
    console.log(`Compressed and saved to: ${outputFilePath}`);
  } else {
    fs.renameSync(tempPath, originalPath); // 替换原文件
    console.log(`Compressed and replaced: ${originalPath}`);
  }
};

// 根据文件扩展名压缩图片并处理输出
const compressImage = async (filePath, { quality, colors, outputDir }) => {
  const ext = path.extname(filePath).toLowerCase();
  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
  
  try {
    if (ext === '.gif') {
      await sharp(filePath, { animated: true })
        .gif({ colors: parseInt(colors) })
        .toFile(tempFilePath);
      handleOutput(tempFilePath, filePath, outputDir);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(filePath)
        .jpeg({ quality: parseInt(quality) })
        .toFile(tempFilePath);
      handleOutput(tempFilePath, filePath, outputDir);
    } else if (ext === '.png') {
      await sharp(filePath)
        .png({ compressionLevel: 9 })
        .toFile(tempFilePath);
      handleOutput(tempFilePath, filePath, outputDir);
    } else if (ext === '.webp') {
      await sharp(filePath)
        .webp({ quality: parseInt(quality) })
        .toFile(tempFilePath);
      handleOutput(tempFilePath, filePath, outputDir);
    } else if (ext === '.bmp') {
      await sharp(filePath)
        .bmp()
        .toFile(tempFilePath);
      handleOutput(tempFilePath, filePath, outputDir);
    } else if (ext === '.tiff') {
      await sharp(filePath)
        .tiff({ quality: parseInt(quality) })
        .toFile(tempFilePath);
      handleOutput(tempFilePath, filePath, outputDir);
    }
  } catch (error) {
    console.error(`Failed to compress ${filePath}:`, error);
  }
};

const main = () => {
  const images = getImages(process.cwd());
  if (images.length === 0) {
    console.log('No images found in the current directory.');
    return;
  }
  
  images.forEach((image) => {
    const filePath = path.join(process.cwd(), image);
    compressImage(filePath, options);
  });
};

main();