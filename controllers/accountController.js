const utilities = require('../utilities/')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const { errors } = require('jshint/src/messages')

/* ***************************************
* Deliver Login View
* ************************************* */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    // req.flash("notice", "This is a flash message.")  // for testing
    res.render("account/login", {
        description: "Login Page",
        title: "Login",
        nav,
        errors: null,
    })
}

/* ***************************************
* Deliver Registration View
* ************************************* */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        description: "Registration page",
        title: "Sign-up",
        nav,
        errors: null,
    })
}

/* **************************************
* Process Registration
* ************************************ */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Has the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            description: "Registration Page",
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount (
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash ("notice", `Congratulations, you are registered ${account_firstname}. Please log in.`)
        res.status(201).render("account/login", {
            description: "login page",
            title: "Login",
            nav,
            errors: null
        })
    } else {
        req.flash ("notice", "Sorry, the registration failed.")
        res.status(501).render("account/registration", {
            description: "registration page",
            title: "Registration",
            nav,
            errors: null
        })
    }
}

module.exports = { buildLogin, buildRegister, registerAccount }