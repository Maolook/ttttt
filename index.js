#!/usr/bin/env node
 
const program = require('commander');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const ora = require('ora');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const fs = require('fs');

const templates = {
    'crud': {
        url: 'https://github.com/Maolook/tools',
        downloadUrl: 'https://github.com:Maolook/tools#master',
        description: '增删改查模板'
    }
}
 
program.version('0.1.0'); 
 
program
    .command('init <template> <project>')
    .description('初始化项目模板')
    .action((templateName, projectName) => {
        let {downloadUrl} = templates[templateName];
        const spinner = ora('正在下载模板..').start();
        download(downloadUrl, projectName, {clone: true}, err => {
            if(err){
                spinner.fail('项目模板下载失败');
            } else {
                spinner.succeed('下载模板成功');
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: '请输入项目名称',
                        default: projectName
                    },
                    {
                        type: 'input',
                        name: 'description',
                        message: '请输入项目简介',
                        default: ''
                    },
                    {
                        type: 'input',
                        name: 'author',
                        message: '请输入作者名称',
                        default: ''
                    }
                ]).then(answers => {
                    let pachageContent = fs.readFileSync(`${projectName}/package.json`, 'utf8');
                    let packageResult = handlebars.compile(pachageContent)(answers);
                    fs.writeFileSync(`${projectName}/package.json`, packageResult);
                    console.log(logSymbols.success, chalk.green('模板项目文件准备成功'))
                })
            }
        })
    })
 
program
    .command('list')
    .description('查看所有可用模板')
    .action(() => {
        console.log(`
            --crud   增删改查模板
        `)
    })
 
program.parse(process.argv);
