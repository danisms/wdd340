/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()

const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")

const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")  // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", inventoryRoute)
// File Not Found Rote - must be last route in the route list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  let description = 'Error Page'
  let error404Humor
  if (err.status == 404) {
    message = err.message
    error404Humor = await utilities.get404PageNotFoundDisplay()
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }
  // log error to terminal
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  // respond to page with error message
  res.render("errors/error", {
    description,
    title: err.status || 'Server Error',
    message,
    nav,
    error404Humor
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
