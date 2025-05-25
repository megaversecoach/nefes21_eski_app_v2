"use strict";

const express = require("express");
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const helmet = require("helmet");
const config = require("config");
const {handleError} = require('./middleware/errorHandler');
const jwt = require('./middleware/verifyJwt');

/**
 * api logları için kullanılacak kütüphaneler import edilir.
 */
 const fs = require('fs');
 const path = require('path');
 const morgan = require('morgan');
 const appLogStream = fs.createWriteStream(path.join(__dirname,'app.log'),{flags:'a'});

app.use(morgan('combined',{stream : appLogStream}));
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit : '200mb'}));
app.use(express.urlencoded({limit : '100mb', extended : true}));
app.use(express.static('public'));
app.use(helmet());
app.use(jwt());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
    next();
});

const author = require('./api/routes/authors');
const draftAuthor = require('./api/routes/draftedAuthors');
const authenticateUser = require('./api/routes/authorize');
const draftNarrator = require('./api/routes/draftedNarrators');
const narrator = require('./api/routes/narrator');
const soundscape = require('./api/routes/soundscapes');
const draftedSoundscape = require('./api/routes/draftedSoundscapes');
const contentType = require('./api/routes/contentType');
const content = require('./api/routes/contents');
const draftedContent = require('./api/routes/draftedContents');
const track = require('./api/routes/tracks');
const draftedTrack = require('./api/routes/draftedTracks');
const dimensions = require('./api/routes/dimensions');
const categories = require('./api/routes/categories');
const dimensionLayout = require('./api/routes/layouts');
const showcaseTypes = require('./api/routes/showcaseTypes');
const decks = require('./api/routes/deck');
const cards = require('./api/routes/card');
const today = require('./api/routes/today');
const user = require('./api/routes/users');
const ux = require('./api/routes/userExperiences');
const sessionTokens = require('./api/routes/sessionTokens');
const session = require('./api/routes/sessions');
const products = require('./api/routes/products');
const suppliers = require('./api/routes/supplier');
const codes = require('./api/routes/code');
const programs = require('./api/routes/programs');
const draftedPrograms = require('./api/routes/draftedPrograms');
const parts = require('./api/routes/parts');
const draftedParts = require('./api/routes/draftedParts');
const programLabel = require('./api/routes/programLabel');
const programLayout = require('./api/routes/programLayout');
const adminUsers = require('./api/routes/adminUsers');
const transaction = require('./api/routes/transactions');
const purchaseEvents = require('./api/routes/purchaseEvents');

app.use('/v2/tracks', track);
app.use('/v2/drafts/tracks', draftedTrack);
app.use('/v2/authors', author);
app.use('/v2/narrators', narrator);
app.use('/v2/drafts/authors', draftAuthor);
app.use('/v2/drafts/narrators', draftNarrator);
app.use('/v2/login', authenticateUser);
app.use('/v2/soundscapes', soundscape);
app.use('/v2/drafts/soundscapes', draftedSoundscape);
app.use('/v2/content-types', contentType );
app.use('/v2/contents', content);
app.use('/v2/drafts/contents', draftedContent);
app.use('/v2/dimensions', dimensions);
app.use('/v2/categories', categories);
app.use('/v2/layout', dimensionLayout);
app.use('/v2/showcase-types', showcaseTypes);
app.use('/v2/decks', decks);
app.use('/v2/cards', cards);
app.use('/v2/today', today);
app.use('/v2/users', user);
app.use('/v2/user-experience', ux);
app.use('/v2/session-tokens', sessionTokens);
app.use('/v2/sessions', session);
app.use('/v2/products', products);
app.use('/v2/suppliers', suppliers);
app.use('/v2/codes', codes);
app.use('/v2/programs', programs);
app.use('/v2/drafts/programs', draftedPrograms);
app.use('/v2/parts', parts);
app.use('/v2/drafts/parts', draftedParts);
app.use('/v2/program-labels', programLabel);
app.use('/v2/layout/programs', programLayout);
app.use('/v2/admin-users', adminUsers);
app.use('/v2/transactions', transaction);
app.use('/v2/purchase-events', purchaseEvents);

app.use(function (req, res, next) {
    res.status(400);
    res.send({"status": "error", "statusCode": "404", "message": "Request is not found!"});
});

app.use((err, req, res, next) => {
    handleError(err, res);
});

const port = config.get('Server.port');
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});