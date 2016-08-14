import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import clientsession from 'client-sessions';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import accountApi from '../routes/api/account';
import tournamentApi from '../routes/api/tournament';
import matchApi from '../routes/api/match';
import teamApi from '../routes/api/team';
import statsApi from '../routes/api/stats';

import configuration from './configuration';

const {cookieName, secret, duration} = configuration.session;

export default () => {
    const app = express();

    app.locals.pretty = true;

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(helmet());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(clientsession({
        cookieName : cookieName,
        secret : secret,
        duration : duration,
        activeDuration : duration,
        httpOnly : true,
        secure : true
    }));
    
    app.set("views", path.join(__dirname, '../../views'));
    app.set("view engine", "jade");
    
    app.use(express.static(path.join(__dirname, '../../public')));
    
    require('../routes/index.js')(app);
    require("../routes/user-route.js")(app);
    require("../routes/stats-route.js")(app);
    
    accountApi(app);
    tournamentApi(app);
    matchApi(app);
    teamApi(app);
    statsApi(app);

    return app;
};
