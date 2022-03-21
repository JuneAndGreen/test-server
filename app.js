const os = require('os')
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const mount = require('koa-mount')

const app = new Koa()
const router = new Router()

const homeData = require('./data/home.json')
const detailData = require('./data/detail.json')

for (let i = 1; i < 100; i++) {
    if (i === 26 || i === 37) continue

    router.get(`/cgi/test${i}`, async ctx => {
        ctx.body = {
            code: 0,
            data: `test${i} - ${Date.now()}`,
        }
    })
    
    router.post(`/cgi/test${i}`, async ctx => {
        ctx.body = {
            code: 0,
            data: `test${i} - ${Date.now()}`,
        }
    })
}

router.get(`/cgi/test23/:id`, async ctx => {
    ctx.body = {
        code: 0,
        data: `test4/${ctx.params.id} - ${Date.now()}`,
    }
})

for (let i = 1; i < 20; i++) {
    router.get(`/cgi/cache/test${i}`, async ctx => {
        ctx.body = {
            code: 0,
            data: `test${i} - ${Date.now()}`,
        }
    })
}

router.get('/cgi/get', async ctx => {
    ctx.body = {
        code: 0,
        data: 'get'
    }
})

router.post('/cgi/post', async ctx => {
    ctx.body = {
        code: 0,
        data: 'post'
    }
})

router.patch('/cgi/patch', async ctx => {
    ctx.body = {
        code: 0,
        data: 'patch'
    }
})

router.get('/cgi/home', async ctx => {
    ctx.body = homeData
})

router.get('/cgi/detail/:id', async ctx => {
    ctx.body = detailData[ctx.params.id]
})

app.use(bodyParser())
app.use(mount('/image', serve(path.resolve(__dirname, './image'))))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8080)

let ip
try {
    const ifaces = os.networkInterfaces()
    for (const key in ifaces) {
        const item = ifaces[key]
        if (item) {
            for (const subItem of item) {
                if (subItem.family === 'IPv4' && subItem.address !== '127.0.0.1') {
                    ip = subItem.address
                    break
                }
            }

            if (ip) break
        }
    }
} catch (err) {
    console.error(err)
}

ip = ip || '127.0.0.1'
fs.writeFileSync(path.join(__dirname, '../miniprogram/origin.js'), `export default 'http://${ip}:8080'`, 'utf-8')
console.log(`listen: http://${ip}:8080`)
