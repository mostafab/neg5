'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _pgPromise = require('pg-promise');

var _pgPromise2 = _interopRequireDefault(_pgPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QueryFile = _pgPromise2.default.QueryFile;

var getSQL = function getSQL(file) {
    var relativePath = './../sql/';
    return new QueryFile(relativePath + file, { minify: true });
};

exports.default = {
    tournament: {
        add: getSQL('tournament-sql/createTournament.sql'),
        findByUser: getSQL('tournament-sql/findByUser.sql'),
        findById: getSQL('tournament-sql/findById.sql'),
        update: getSQL('tournament-sql/updateTournament.sql'),
        editPointScheme: {
            addPointValue: getSQL('tournament-sql/addTossupPointValue.sql'),
            edit: {
                deleteTossupValues: getSQL('tournament-sql/transactions/editPointScheme/deleteTossupValues.sql'),
                updateBonusValues: getSQL('tournament-sql/transactions/editPointScheme/updateBonusValues.sql'),
                updateTossupPointValues: getSQL('tournament-sql/transactions/editPointScheme/updateTossupPointValues.sql')
            }
        }
    },
    account: {
        add: getSQL('account-sql/createAccount.sql'),
        findOne: getSQL('account-sql/findAccount.sql'),
        permissions: getSQL('tournament-sql/tournamentPermission.sql'),
        findUsers: getSQL('account-sql/findUsers.sql')
    },
    match: {
        findByTournament: getSQL('match-sql/findMatchesByTournament.sql')
    },
    team: {
        findByTournament: getSQL('team-sql/findTeamsByTournament.sql')
    },
    collaborator: {
        add: getSQL('collaborator-sql/addCollaborator.sql'),
        findByTournament: getSQL('collaborator-sql/findCollaboratorsByTournament.sql'),
        edit: getSQL('collaborator-sql/updateCollaboratorPermissions.sql'),
        remove: getSQL('collaborator-sql/deleteCollaborator.sql')
    }
};