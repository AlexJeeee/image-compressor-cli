#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import { Command } from 'commander';
import tinify from 'tinify';
import sharp from 'sharp';
import ora from 'ora';
import Conf from 'conf';
const program = new Command();

const config = new Conf({
  projectName: 'image-compressor-cli',
  defaults: {
    apiKey: ''
  }
});

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
const handleOutput = (tempPath, originalPath, outputDir, spinner) => {
  if (outputDir) {
    ensureOutputDirectory(outputDir);
    const outputFilePath = path.join(outputDir, path.basename(originalPath));
    fs.renameSync(tempPath, outputFilePath); // 将临时文件保存到输出目录
    spinner.succeed(`Compressed and saved to: ${outputFilePath}`);
  } else {
    fs.renameSync(tempPath, originalPath); // 替换原文件
    spinner.succeed(`Compressed and replaced: ${originalPath}`);
  }
};

// 根据文件扩展名压缩图片并处理输出
const compressImage = async (originalPath, { quality, colors, outputDir }) => {
  const apiKey = config.get('apiKey');
  if (!apiKey) {
    console.error('No API key, please set it first using the following command:');
    console.error('image-compressor-cli config --key YOUR_API_KEY');
    process.exit(1);
  }

  tinify.key = apiKey;
  const ext = path.extname(originalPath).toLowerCase();
  const tempPath = path.join(os.tmpdir(), path.basename(originalPath));
  const spinner = ora(`compressing ${path.basename(originalPath)}`).start();

  try {
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      const source = tinify.fromFile(originalPath);
      await source.toFile(tempPath);
      handleOutput(tempPath, originalPath, outputDir, spinner);
    } else if (ext === '.gif') {
      await sharp(originalPath, { animated: true })
        .gif({ colors: parseInt(colors) })
        .toFile(tempPath);
      handleOutput(tempPath, originalPath, outputDir, spinner);
    } else if (ext === '.bmp') {
      await sharp(originalPath)
        .bmp()
        .toFile(tempPath);
      handleOutput(tempPath, originalPath, outputDir, spinner);
    } else if (ext === '.tiff') {
      await sharp(originalPath)
        .tiff({ quality: parseInt(quality) })
        .toFile(tempPath);
      handleOutput(tempPath, originalPath, outputDir, spinner);
    } else {
      spinner.fail(`unsupported file type: ${originalPath}`);
    }
  } catch (error) {
    spinner.fail(`compress ${originalPath} failed: ${error.message}`);
  }
};

const main = (options) => {
  const images = getImages(process.cwd());
  if (images.length === 0) {
    console.log('No images found in the current directory.');
    return;
  }
  
  images.forEach((image) => {
    const originalPath = path.join(process.cwd(), image);
    compressImage(originalPath, options);
  });
};

// main();


program
  .version('1.0.9')
  .description('CLI tool to compress images using TinyPNG API by default(jpg, jpeg, png, webp) and Sharp for other formats(bmp, tiff, gif)')
  .option('-q, --quality <number>', 'Set Sharp static image quality', 80)
  .option('-c, --colors <number>', 'Set gif image maximum number of palette entries, including transparency, between 2 and 256', 128)
  .option('-o, --output-dir <directory>', 'Specify a custom output directory')
  .action(main)

program
  .command('config')
  .description('API key configuration management')
  .option('-k, --key <string>', 'Set TinyPNG API key')
  .option('-s, --show', 'Display the current API key')
  .action((options) => {
    if (options.key) {
      config.set('apiKey', options.key);
      console.log('API key saved');
      process.exit(1);
    }
    
    if (options.show) {
      const savedKey = config.get('apiKey');
      if (savedKey) {
        console.log('Current saved API key:', savedKey);
      } else {
        console.log('No API key saved, please use config --key command to set.');
      }
      process.exit(1);
    }

    console.log('Use --key option to set API key or use --show to view current configuration');
    process.exit(1);
  });

program.parse(process.argv);
