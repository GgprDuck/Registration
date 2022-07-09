const { default: helmet } = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const app = express();

const jwtKey = "my_secret_key";

async function Refresh(req, res) {
    const token = req.cookies.Access_token

    if (!token) {
        return res.status(401).end()
    }

    let payload;
    try {
        payload = jwt.verify(token, jwtKey)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        return res.status(400).end()
    }
    
    const access_token = jwt.sign({ user }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    })
    user.Access_tocken = access_token;

    const refresh_token = jwt.sign({ user }, jwtKey, {
        algorithm: "HS256",
        expiresIn: 3600,
    })
    user.Refresh_tocken = refresh_token;
    await user.save();
    res.cookie("Access_token", access_token, { maxAge: jwtExpirySeconds * 1000 });
    res.cookie("Refresh_token", refresh_token, { maxAge: 3600 * 1000 });
    next();
}

async function CookieCheck() {
    const token = req.cookies.Access_token
    let payload
    try {
        payload = jwt.verify(token, jwtKey)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
    }
    next()
};

async function BodyParser() {
    console.log(app.use(bodyParser.json()));
    bodyParser.urlencoded({ extended: true });
    next();
}

async function CookieParser() {
    console.log(app.use(cookieParser.json()));
    next()
}

async function Compression() {
    app.use(compression());
    next();
}

async function Helmet() {
    app.use(helmet());
    next();
}

async function Cors() {
    app.use(cors());
    next();
}

module.exports = { BodyParser, CookieParser, Compression, Helmet, Cors, CookieCheck, Refresh }