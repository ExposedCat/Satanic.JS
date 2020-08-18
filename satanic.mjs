import telegramBot from 'telegraf'
import fs from 'fs'
import nc from 'node-schedule'
import dotenv from 'dotenv'

const timeInMs = {
    millisecond: 1,
    second: 1000,
    minute: 1000 * 60,
    hour: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24
}

class superDate {
    leftTimeTo(date) {
        let timeInMsDelta = new Date(+new Date(date) - +this)
        const result = {}
        result.days = Math.floor(timeInMsDelta / timeInMs.day)
        timeInMsDelta -= result.days * timeInMs.day
        result.hours = Math.floor(timeInMsDelta / timeInMs.hour)
        timeInMsDelta -= result.hours * timeInMs.hour
        result.minutes = Math.floor(timeInMsDelta / timeInMs.minute)
        timeInMsDelta -= result.minutes * timeInMs.minute
        result.seconds = Math.floor(timeInMsDelta / timeInMs.second)
        timeInMsDelta -= result.seconds * timeInMs.second
        result.milliseconds = timeInMsDelta
        return result
    }
}
class superObject {
    prettify() {
        return JSON.stringify(this, null, '\t')
    }
    createCopy() {
        return JSON.parse(JSON.stringify(this))
    }
    find(rule) {
        for (const [key, value] of Object.entries(this)) {
            if (rule(key, value)) {
                return [key, value]
            }
        }
        return null
    }
}
class superNumber {
    inRange(min, max, inclusive) {
        return this > min && this < max || (inclusive && (this === min || this === max))
    }
    toBoolean() {
        return !!this
    }
    shortWithK() {
        let partsCount = +Math.floor(Math.floor(this).toString().length / 3).toFixed()
        if (this.toString().length <= partsCount * 3) {
            partsCount--
        }
        let ps = 'K'.repeat(partsCount)
        switch (partsCount) {
            case 2: {
                ps = 'M'
                break
            }
            case 4: {
                ps = 'T'
                break
            }
        }
        return (this / 1000 ** partsCount).toFixed(2) + ps
    }
}
class superArray {
    randomElement() {
        return this[random(0, this.length - 1)]
    }
    lastElement() {
        return this[this.length - 1]
    }
    removeElement(elementToDelete) {
        if (typeof elementToDelete === 'function') {
            for (const [i, element] of this) {
                if (elementToDelete(element)) {
                    this.splice(i, 1)
                }
            }
            return this
        }
        this.splice(this.indexOf(elementToDelete), 1)
        return this
    }
    sum() {
        return this.reduce((element, sum) => element + sum)
    }
    createCopy() {
        return JSON.parse(JSON.stringify(this))
    }
    setCbData(data) {
        const newArray = this.createCopy()
        newArray[0].callback_data = newArray[0].callback_data.setData(data)
        return newArray
    }
    isEmpty() {
        return this.length === 0
    }
    shuffle() {
        for (const [i, element] of Object.entries(this)) {
            const swapIndex = randomNumber(0, this.length - 1, 0)
            this[i] = [this[swapIndex], this[swapIndex] = element][0]
        }
        return this
    }
}
class superString {
    removeAll(substring) {
        return this.replace(new RegExp(substring, 'gm'), '')
    }
    toBoolean() {
        return !['false', 'null', 'undefined', '', '0'].includes(this)
    }
    setData(dataSet) {
        let string = this
        for (const [key, value] of Object.entries(dataSet)) {
            string = string.replace(new RegExp(`%${key}%`), value)
        }
        return string
    }
    firstToUpperCase() {
        return `${this[0].toUpperCase()}${this.substr(1)}`
    }
}
class JSONFile {
    constructor(path) {
        this.path = path
    }
    async toObject() {
        return await getJSON(this.path)
    }
    async get(path) {
        path = path.toString()
        let data = await this.toObject()
        for (let i = 0; i < path.split('.').length; ++i) {
            const key = path.split('.')[i]
            if ((data[key] === undefined || data[key] === null) && i !== path.split('.').length - 1) {
                return undefined
            }
            data = data[key]
        }
        return data
    }
    async set(path, value) {
        path = path.toString()
        let obj = await this.toObject()
        if (arguments.length === 2) {
            let tObj = obj
            for (let i = 0; i < path.split('.').length; ++i) {
                const key = path.split('.')[i]
                if (i === path.split('.').length - 1) {
                    tObj[key] = value
                } else {
                    if (tObj[key] === undefined || tObj[key] === null || typeof tObj[key] !== 'object') {
                        tObj[key] = {}
                    }
                    tObj = tObj[key]
                }
            }
            if (obj === undefined) {
                obj = {}
            }
            return await saveJSON(obj, this.path)
        } else {
            obj.push(path)
            return await saveJSON(obj, this.path)
        }
    }
    async add(path, value) {
        path = path.toString()
        let nowValue = await this.get(path)
        if (Array.isArray(nowValue)) {
            nowValue.push(value)
            return await this.set(path, nowValue)
        }
        return await this.set(path, nowValue + value)
    }
    async includes(key) {
        key = key.toString()
        const obj = await this.toObject()
        if (Array.isArray(obj)) {
            return obj.includes(key)
        } else {
            return Object.keys(obj).includes(key)
        }
    }
}
class Queue {
    constructor(processor) {
        this.tasks = []
        this.running = false
        this.processor = processor
    }
    addTask(task) {
        this.tasks.push(task)
        if (this.running === false) {
            this.processNextUpdate()
        }
    }
    removeFirstUpdate() {
        this.tasks.shift()
    }
    async processNextUpdate() {
        const nextTask = this.tasks[0]

        this.running = true
        this.removeFirstUpdate()
        await this.processor(nextTask)
        if (this.tasks.length > 0) {
            this.processNextUpdate()
        } else {
            this.running = false
        }
    }
}

function updateClasses(...prototypes) {
    for (const prototype of prototypes) {
        const className = (prototype.constructor || {}).name
        if (typeof className === 'string') {
            if (eval(`typeof super${className}`) !== 'undefined') {
                const methods = Object.getOwnPropertyNames(eval(`new super${className}()`).__proto__),
                    exportingProto = eval(`super${className}.prototype`)
                for (const method of methods) {
                    if (!prototype.hasOwnProperty(method)) {
                        prototype[method] = exportingProto[method]
                    }
                }
            }
        }
    }
}
updateClasses(String.prototype, Array.prototype, Number.prototype)

function log(data, silent, error) {
    if (!silent) {
        if (!error) {
            console.log(data)
        } else {
            console.error(data)
        }
    }
    fs.appendFile('logs.txt',
        `\r\n${new Date().toLocaleTimeString()}  ` + (error ? 'ERROR: ' : '') + ((data || '').toString() || JSON.stringify(data)),
        'utf8',
        (err) => {
            if (err) {
                console.error(err)
            }
        })
}
function readEnv(path = 'config.env') {
    const envData = dotenv.config({
        path: path
    })
    return envData.parsed
}
function getDate(cron) {
    const cronJob = new nc.scheduleJob(cron, () => { })
    const date = new Date(cronJob.nextInvocation())
    cronJob.cancel()
    return date
}
function randomBoolean() {
    return this.random(1).toBoolean()
}
function randomWithChance(data) {
    const values = Object.keys(data)
    const chances = Object.value(data)
    const pool = []
    for (let i = 0, pool = []; i < chances.length; i++) {
        for (let j = 0; j < chances[i]; j++) {
            pool.push(i)
        }
    }
    return values[pool.shuffle()['0']]
}
function doAtDate(date, cb) {
    return new nc.scheduleJob(date, async () => {
        await cb()
    })
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}
function repeat(count, callback) {
    for (let i = 0; i < count; ++i) {
        const cbResult = callback(i)
        if (cbResult === 'break') {
            break
        }
    }
}
function forObject(object, callback) {
    for (const [key, value] of Object.entries(object)) {
        const cbResult = callback(key, value)
        if (cbResult === 'break') {
            break
        }
    }
}

function randomNumber(min = 0, max = 1, fractionDigits = 0) {
    const precision = Math.pow(10, Math.max(fractionDigits, 0))
    const scaledMax = max * precision
    const scaledMin = min * precision
    const num = Math.floor(Math.random() * (scaledMax - scaledMin + 1)) + scaledMin
    return num / precision
}
function random(min, max, decimal = false) {
    const minIsNumber = !isNaN(parseFloat(min))
    const maxIsNumber = !isNaN(parseFloat(max))
    if (minIsNumber) {
        min = +min
    }
    if (maxIsNumber) {
        max = +max
    }
    if (Array.isArray(min)) {
        return min[random(0, min.length - 1)]
    }
    if (typeof min === 'object') {
        return Object.keys(min)[random(0, Object.keys(min).length - 1)]
    }
    if (minIsNumber && maxIsNumber) {
        if (max === Infinity) {
            max = Number.MAX_VALUE
        }
        return randomNumber(min, max, decimal ? 15 : 0)
    }
    if (minIsNumber) {
        return randomNumber(0, min, decimal ? 15 : 0)
    }
    return new Error(`Error: At least one of required arguments must be type of number, got ${typeof min} and ${typeof max}`)
}
function bot(token, errorHandling, start) {
    const bot = new telegramBot(token)
    if (errorHandling) {
        bot.catch((err) => console.error(err))
    }
    bot.start = () => {
        if (typeof start === 'function') {
            start()
        } else {
            if (start !== undefined) {
                throw new Error('Start function must be type of function')
            }
        }
        bot.launch()
        console.log(`Bot "${token}" started`)
    }
    return bot
}

async function saveJSON(data, path) {
    try {
        await fs.promises.writeFile(path, JSON.stringify(data), 'utf8')
    } catch (error) {
        return error
    }
}
async function getJSON(path) {
    try {
        const data = await fs.promises.readFile(path, 'UTF-8')
        return JSON.parse(data)
    } catch (error) {
        return error
    }
}

export default {
    timeInMs,

    random,
    updateClasses,
    log,
    readEnv,
    saveJSON,
    getJSON,
    getDate,
    randomBoolean,
    randomWithChance,
    doAtDate,
    sleep,
    repeat,
    forObject,
    bot,

    Queue,
    JSONFile
}
