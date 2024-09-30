#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .name('mycli')
  .description('A simple CLI tool')
  .version('1.0.0');

program
  .command('greet <name>')
  .description('Greet someone')
  .action((name) => {
    console.log(`Hello, ${name}!`);
  });

program.parse();