require("babel/register")

const app = require("koa")()
const koaBody = require("koa-better-body")
const hbs = require("koa-hbs")
const logger = require("koa-logger")
const koaMount = require("koa-mount")
const passport = require("koa-passport")
const KoaRouter = require("koa-router")
const session = require("koa-session")
const koaStatic = require("koa-static")
const path = require("path")
const bcrypt = require("bcryptjs")

const r = require("rethinkdbdash")()

let router = new KoaRouter()

app.use(koaBody({
  multipart: true,
  formLimit: 100000,
  extendTypes: {
    json: [ "application/x-javascript" ],
    multipart: [ "multipart/mixed" ]
  }
}))

app.use(logger())

app.keys = [ "1234567890" ]
app.use(session(app))

app.use(hbs.middleware({
  viewPath: path.join(__dirname, "/views")
}))

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  r.db("quoth").table("users").get(id).run(function (err, user) {
    if (err) {
      done(err, false)
    }

    done(null, user)
  })
})

let LocalStrategy = require("passport-local").Strategy

passport.use(new LocalStrategy(function (username, password, done) {
  r.db("quoth").table("users").filter({ email: username}).run(function (err, rows) {
    if (err) {
      done(err, false)
    }

    let user = rows[ 0 ]

    if (bcrypt.compareSync(password, user.digest)) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(require("./routes")(router))

app.use(koaMount("/", router.middleware()))

app.listen(3000, function () {
  console.log("Listening on port 3000.")
})
