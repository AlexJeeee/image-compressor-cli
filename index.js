#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const os = require('os'); // 用于获取临时目录
const { Command } = require('commander');
const { execFile } = require('child_process'); // 用于调用 gifsicle 二进制文件
const program = new Command();

program
  .version('1.0.4')
  .description('CLI tool to compress images in the current directory and replace the original files')
  .option('-q, --quality <number>', 'Set image quality for JPEG, WebP, PNG, BMP, TIFF (default: 80)', 80)
  .option('--lossy <number>', 'Set the lossy compression level for GIFs (default: 0, meaning lossless)', 0); // 添加 --lossy 参数

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

// 将临时文件替换原始文件
const replaceOriginalFile = (tempPath, originalPath) => {
  fs.renameSync(tempPath, originalPath); // 将临时文件重命名为原文件名（覆盖原文件）
};

// 使用 gifsicle 压缩 GIF 动画
const compressGif = async (filePath, lossy) => {
  const { default: gifsiclePath } = await import('gifsicle'); // 动态加载 gifsicle 的默认导出
  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath)); // 临时文件路径
  return new Promise((resolve, reject) => {
    const args = [
      '--optimize=3', // 最大优化级别
      '--colors', '128', // 可以自定义颜色数量
      '--output', tempFilePath,
      filePath,
    ];
    
    // 如果用户指定了 lossy 参数，添加它
    if (lossy > 0) {
      args.push(`--lossy=${lossy}`);
    }
    
    execFile(gifsiclePath, args, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error compressing GIF: ${stderr}`);
        reject(error);
      } else {
        replaceOriginalFile(tempFilePath, filePath); // 压缩成功后替换原文件
        console.log(`Compressed and replaced GIF: ${filePath}`);
        resolve();
      }
    });
  });
};

// 根据文件扩展名压缩图片并替换原图
const compressImage = async (filePath, { quality, lossy }) => {
  const ext = path.extname(filePath).toLowerCase();
  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath)); // 临时文件路径
  
  try {
    if (ext === '.gif') {
      // 使用 gifsicle 压缩 GIF
      await compressGif(filePath, lossy);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(filePath)
        .jpeg({ quality: parseInt(quality) })
        .toFile(tempFilePath); // 保存到临时文件
      replaceOriginalFile(tempFilePath, filePath); // 替换原文件
      console.log(`Compressed and replaced: ${filePath}`);
    } else if (ext === '.png') {
      await sharp(filePath)
        .png({ compressionLevel: 9 }) // PNG 无损压缩
        .toFile(tempFilePath);
      replaceOriginalFile(tempFilePath, filePath); // 替换原文件
      console.log(`Compressed and replaced: ${filePath}`);
    } else if (ext === '.webp') {
      await sharp(filePath)
        .webp({ quality: parseInt(quality) })
        .toFile(tempFilePath);
      replaceOriginalFile(tempFilePath, filePath); // 替换原文件
      console.log(`Compressed and replaced: ${filePath}`);
    } else if (ext === '.bmp') {
      await sharp(filePath)
        .bmp() // BMP 格式不支持质量调整，因此直接保存
        .toFile(tempFilePath);
      replaceOriginalFile(tempFilePath, filePath); // 替换原文件
      console.log(`Compressed and replaced: ${filePath}`);
    } else if (ext === '.tiff') {
      await sharp(filePath)
        .tiff({ quality: parseInt(quality) }) // TIFF 支持质量调整
        .toFile(tempFilePath);
      replaceOriginalFile(tempFilePath, filePath); // 替换原文件
      console.log(`Compressed and replaced: ${filePath}`);
    }
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
    compressImage(filePath, options); // 传递 lossy 参数
  });
};

main();