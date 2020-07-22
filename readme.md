# Getting started

Satanic.JS is a Node.JS module, that provides convenient functions, that make coding easier and Telegraf wrapper

P.S. There will be no conflicts with native methods in new methods of global classes - if one of them already exists, it will not be replaced by a new one

# Installation

```bash
npm i satanic 
```
or using `yarn`:

```bash
yarn add satanic 
```

# Usage

```node
import tools from 'satanic'
```
# API
## Realtime work with JSON 
##### data/file.json (example):
```json
{
    "key 1": "value",
    "key 2": "value 1",
    "key 3": 100
}
```
### Create instance
```js
    const path = 'data/file.json'
    const file = new JSONFile(path)
```
### toObject()
Convert file data to object
```js
await file.toObject() // {"key 1": "value","key 2": "value 1","key 3": 100}
```
### get(path)
Get value by key from json file
```js
await file.get('key 2') // 'value 1'
```
### set(path, value)
Set value by key in json file
```js
await file.set('key 2', 'new value') // 'new value'
```
### add(path, value)
Add value to existing value by key in json file
```js
await file.get('key 2') // 'value 1'
await file.add('key 2', ', 2')
await file.get('key 2') // 'value 1, 2'
```
### includes(key)
Check if json file includes key
```js
await file.includes('key 3') // true
await file.includes('key 2') // false
```
## Tools
### Queue
### addTask(task)
Add task to queue
```js
const logQueue = new Queue(data => console.log(data))
logQueue.addTask('Some data to log')
```
### random(min, max, decimal)
Returns random entities
```js
tools.random(10) // random integer between 0 and 10
tools.random(10, 100) // random integer between 10 and 100
tools.random(10, 100, true) // random decimal between 10 and 100
tools.random([...]) // random element from array
tools.random({...}) // random key from object
```
### timeInMs
Returns object with time frames in milliseconds

Available `millisecond`, `second`, `minute`, `hour` and `day`
```js
tools.timeInMs.hour // 3600000
tools.timeInMs.day // 86400000
```
## updateClasses(...prototypes)
Function that adds new method of library to global classes

Available `String`, `Array`, `Object`, `Number` and `Date` methods
```js
tools.updateClasses(Date.prototype, Number.prototype, Array.prototype)
```
### log(data, silent, error)
Write logs to `logs.txt` and log data to console
Use `silent = true` to log without sending data to console
Use `error = true` to log data like error

```js
tools.log('Debug data', true)
tools.log('Error', false, true)
tools.log(['Array', 'of', 'data'])
```
### readEnv(path)
Read .env config
Returns object

```js
const env = readEnv() // default path is './config.env'
```
or
```js
const env = readEnv('path/to/config.env')
```
### saveJSON(data, path)
Write JSON to local file
```js
tools.saveJSON({
    key: 'value'
}, 'data/file.json')
```
### getJSON(path)
Get JSON from local file
```js
tools.saveJSON({ key: 'value' }, 'data/file.json')
const data = tools.getJSON('data/file.json')
console.log(data) // { "key": "value" }
```
### getDate(cron)
Returns Date object by cron
```js
const cron = '* */2 * *'
const date = tools.getDate(cron)
console.log(date instanceof Date) // true
```
### randomBoolean()
Get random Boolean value
### randomWithChance(data)
Get random item with chance
```js
tools.randomWithChance({
    'key 1': 30, // key: percent of chance
    'key 2': 50,
    'key 3': 20
})
```
### doAtDate(date)
Run code at date (also supports cron time)
```js
tools.doAtDate(new Date(1595425476085), () => {
    console.log('Now is Wed Jul 22 2020 16:44:36')
})
tools.doAtDate('*/1 * * * *', () => {
    console.log('Console log every minute')
})
```
### sleep(ms)
Async sleep
```js
console.log('Log now')
tools.sleep(1000)
console.log('Log after a second')
```
### repeat(count, callback)
Repeat `callback` function `count` times
```js
tools.repeat(4, i => console.log(i))
// 0
// 1
// 2
// 3
```
### bot(token, errorHandling, start)
Invokes Telegram bot instance(wrapper for Telegraf)
More in [Telegraf docks](https://telegraf.js.org)
```js
const token = '****************************'
const bot = tools.bot(token, true, () => {
    console.log('Bot will be launched after this function')
})
```
# Methods of updated classes
## String
### removeAll(substring)
Remove all substrings from string
```js
'a b c a b c'.removeAll(' c') // a b a b
'nananas'.removeAll(/^n/) // ananas
```
### setData(data)
Returns a new string with replaced `%key%` with specified value 
```js
const user = {
    name: 'John',
    age: 20
}
'My name is %name%, I am %age% y.o.'.setData(user) // My name is John, I am 20 y.o
```
### firstToUpperCase()
Returns a new string with first symbol at upper case 
```js
'darkness'.firstToUpperCase() // Darkness
```
### toBoolean()
Converts string to `boolean`
```js
'true'.toBoolean() // true
'0'.toBoolean() // false
'str'.toBoolean() // true
```
## Array
### randomElement()
Returns random element from array
```js
[1, 2, 3].randomElement() // Randomly 1, 2 or 3

const names = ['Jonh', 'Helen', 'Fluffy']
name.randomElement() // Random name from names
```
### lastElement()
Returns last element from array
```js
[1, 2, 3].lastElement() // 3

const names = ['Jonh', 'Helen', 'Fluffy']
names.lastElement() // Fluffy
```
### removeElement(element)
Removes specified element from array
Note, that this will not work with arrays and objects
```js
[5, 4, 3, 2, 1].removeElement(2) // [5, 4, 3, 1]

const names = ['Jonh', 'Helen', 'Fluffy']
names.removeElement('Helen') // ['John', 'Fluffy']
```
### sum()
Returns sum of all elements of array
```js
[5, 4, 3, 2, 1].sum() // 15
[18, 2, 5, '$'].sum() // 25$
```
### createCopy()
Returns shallow copy of array
```js
const a = [1, 2, 3, 4, 5]
const b1 = a
const b2 = a.createCopy()
a[0] = 99
console.log(b1[0]) // 99
console.log(b2[0]) // 1

```
### setCbData()
Set callback_data of Telegram bot inline keyboard
```js
const inlineButton = [{
    text: 'Button',
    callback_data: 'id_%id%'
}]
inlineButton.setCbData({
    id: 312
})
```
### isEmpty()
Check if array has no items
```js
[1, 2, 3].isEmpty() // false
[].isEmpty() // true
```
### shuffle()
Randomly shuffles array elements
```js
const array = [1, 2, 3, 4, 5]
array.shuffle()
console.log(array) // [2, 1, 4, 5, 3]
```
## Number
### inRange(a, b, inclusive)
Returns `true` or `false` corresponding to the existence of a number in the interval `(a;b)` (or `[a;b]` for `inclusive = true`)
```js
const number = 115
number.inRange(0, 100) // false
number.inRange(100, 115, false) // false
number.inRange(100, 115, true) // true
number.inRange(100, 200) // true
```
### toBoolean()
Converts number to `boolean`. `false` if `number = 0`, otherwise `true`
```js
const [number1, number2, number3] = [0, 125, -312]
number1.toBoolean() // false
number2.toBoolean() // true
number3.toBoolean() // true
```
### shortWithK()
Shorts number with `K` (1.000), `M` (1.000.000) and `T` (1.000.000.000.000)
```js
const [number1, number2, number3, number4] = [1234, 1234567, 1234567890123, 12345678901231300]
number1.shortWithK() // 1.23K
number2.shortWithK() // 1.23M
number3.shortWithK() // 1.23T
number4.shortWithK() // 12.35KKKKK
```
## Object
### prettify()
Converts object to string, placing tabs
```js
const user = {
    name: 'Fluffy',
    age: 20,
    friends: ['John', 'Helen']
}
JSON.stringify(user)  // "{"name":"Fluffy","age":20,"friends":["John","Helen"]}"

user.toShowString() // result will be:
{
    "name": "Fluffy",
    "age": 20,
    "friends": [
        'John',
        'Helen'
    ]
}
```
### createCopy()
Returns a copy of object. Also, all values of keys of object will be also copies, not a links to it
Note, that all class instances will be converted to simple Objects
```js
const user1 = {
    name: 'Fluffy',
    age: 20,
    friends: ['John', 'Helen']
}
const user2 = user1
const user3 = user1.createCopy()
user1.age++

user2.age // 21
user3.age // 20
```
### find()
Find pair key-value in object by function. Returns null if not found
```js
const object = {
    key1: 15,
    key2: 33,
    key3: 14,
    key5: 122
}
object.find((key, value) => value % 2 === 0) // ['key3', 14]
```
## Date
### leftTimeTo(date)
Returns object with time to specified date in days, hours, minutes, seconds and milliseconds
```js
const date = new Date('December 02, 2020 12:36:11:16')
const nextDate = new Date('December 31, 2020 24:00:00:00')
    
date.leftTimeTo(nextDate) // { days: 29, hours: 11, minutes: 23, seconds: 48, milliseconds: 984 }
```
## License
[MIT](https://choosealicense.com/licenses/mit/)

