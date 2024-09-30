#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const os = require('os'); // 用于获取临时目录
const { Command } = require('commander');
const program = new Command();

program
  .version('1.0.0')
  .description('CLI tool to compress images in the current directory and replace the original files')
  .option('-q, --quality <number>', 'Set image quality (default: 80)', 80);

program.parse(process.argv);

const options = program.opts();

const ImageExtensions = ['.jpg', '.jpeg', '.png', '.webp']

// 获取当前目录中的所有图片文件
const getImages = (directory) => {
  return fs.readdirSync(directory).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ImageExtensions.includes(ext); // 添加对 WebP 的支持
  });
};

// 将临时文件替换原始文件
const replaceOriginalFile = (tempPath, originalPath) => {
  fs.renameSync(tempPath, originalPath); // 将临时文件重命名为原文件名（覆盖原文件）
};

// 根据文件扩展名压缩图片并替换原图
const compressImage = async (filePath, quality) => {
  const ext = path.extname(filePath).toLowerCase();
  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath)); // 临时文件路径
  
  try {
    // 根据扩展名设置压缩格式和参数
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(filePath)
        .jpeg({ quality: parseInt(quality) })
        .toFile(tempFilePath); // 保存到临时文件
    } else if (ext === '.png') {
      await sharp(filePath)
        .png({ quality: parseInt(quality), compressionLevel: 9 })
        .toFile(tempFilePath); // 保存到临时文件
    } else if (ext === '.webp') {
      await sharp(filePath)
        .webp({ quality: parseInt(quality) })
        .toFile(tempFilePath); // 保存到临时文件
    }
    
    // 压缩成功后用临时文件替换原文件
    replaceOriginalFile(tempFilePath, filePath);
    
    console.log(`Compressed and replaced: ${filePath}`);
  } catch (error) {
    console.error(`Failed to compress ${filePath}:`, error);
  }
};

const main = () => {
  const images = getImages(process.cwd()); // 获取当前目录的所有图片
  if (images.length === 0) {
    console.log('No images found in the current directory.');
    return;
  }
  
  images.forEach((image) => {
    const filePath = path.join(process.cwd(), image);
    compressImage(filePath, options.quality);
  });
};

main();