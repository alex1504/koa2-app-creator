const Sequelize = require('sequelize')
const {
    DB_CONFIG
} = require('../config')
const chalk = require('chalk')

const db = new Sequelize(DB_CONFIG.DATABASE, DB_CONFIG.USERNAEM, DB_CONFIG.PASSWORD, {
    host: DB_CONFIG.HOST,
    dialect: 'mysql',
    port: "3306",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false,
    // 数据库层面定义字符集及排序规则，默认是latin1、latin1_swedish_ci
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true
    },
    // 东八区时间
    timezone: '+08:00'
})

const initModels = () => {
    db.sync({
        force: true
    })
}

const updateModels = () => {
    db.sync({
        force: false,
        alter: true
    })
}

db.authenticate()
    .then(() => {
        console.log(chalk.green(`---Connect database success---`))
    })
    .catch(err => {
        console.error(chalk.red(`---Fail to connect database---`), err)
    })

module.exports = {
    Sequelize,
    db,
    initModels,
    updateModels
}