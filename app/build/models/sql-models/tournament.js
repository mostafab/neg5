'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _tournament = require('../../data-access/tournament');

var _tournament2 = _interopRequireDefault(_tournament);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

    create: function create(_ref, username) {
        var name = _ref.name;
        var _ref$date = _ref.date;
        var date = _ref$date === undefined ? null : _ref$date;
        var _ref$questionSet = _ref.questionSet;
        var questionSet = _ref$questionSet === undefined ? null : _ref$questionSet;
        var _ref$comments = _ref.comments;
        var comments = _ref$comments === undefined ? null : _ref$comments;
        var _ref$location = _ref.location;
        var location = _ref$location === undefined ? null : _ref$location;
        var _ref$tossupScheme = _ref.tossupScheme;
        var tossupScheme = _ref$tossupScheme === undefined ? [] : _ref$tossupScheme;

        return new Promise(function (resolve, reject) {
            var id = _shortid2.default.generate();
            var tournament = {
                id: id,
                name: name.trim(),
                date: date,
                questionSet: questionSet === null ? null : questionSet.trim(),
                comments: comments === null ? null : comments.trim(),
                location: location === null ? null : location.trim(),
                tossupScheme: tossupScheme,
                username: username
            };
            _tournament2.default.saveTournament(tournament).then(function (result) {
                return resolve(result);
            }).catch(function (error) {
                return reject(error);
            });
        });
    },

    findByUser: function findByUser(username) {
        return new Promise(function (resolve, reject) {
            _tournament2.default.findTournamentsByUser(username.trim().toLowerCase()).then(function (result) {
                return resolve(result);
            }).catch(function (error) {
                return reject(error);
            });
        });
    },

    findById: function findById(tournamentId) {
        return new Promise(function (resolve, reject) {
            _tournament2.default.findTournamentById(tournamentId).then(function (tournament) {
                tournament.tossup_point_scheme = tournament.tossup_point_scheme.filter(function (tv) {
                    return tv.type !== null;
                }).sort(function (first, second) {
                    return first.value - second.value;
                });
                resolve(tournament);
            }).catch(function (error) {
                return reject(error);
            });
        });
    },

    update: function update(tournamentId, _ref2) {
        var _ref2$location = _ref2.location;
        var location = _ref2$location === undefined ? null : _ref2$location;
        var name = _ref2.name;
        var _ref2$date = _ref2.date;
        var date = _ref2$date === undefined ? null : _ref2$date;
        var _ref2$questionSet = _ref2.questionSet;
        var questionSet = _ref2$questionSet === undefined ? null : _ref2$questionSet;
        var _ref2$comments = _ref2.comments;
        var comments = _ref2$comments === undefined ? null : _ref2$comments;
        var _ref2$hidden = _ref2.hidden;
        var hidden = _ref2$hidden === undefined ? false : _ref2$hidden;

        return new Promise(function (resolve, reject) {
            var newTournamentInfo = {
                location: location === null ? null : location.trim(),
                name: name.trim(),
                questionSet: questionSet === null ? null : questionSet.trim(),
                date: date,
                comments: comments === null ? null : comments.trim(),
                hidden: hidden
            };
            _tournament2.default.updateTournament(tournamentId, newTournamentInfo).then(function (result) {
                return resolve(result);
            }).catch(function (error) {
                return reject(error);
            });
        });
    },

    addTossupPointValue: function addTossupPointValue(tournamentId, _ref3) {
        var type = _ref3.type;
        var value = _ref3.value;

        return new Promise(function (resolve, reject) {
            if (!type || !value) {
                return reject(new Error('Not all required fields provided'));
            }
            _tournament2.default.addTossupPointValue(tournamentId, { type: type, value: value }).then(function (result) {
                return resolve(result);
            }).catch(function (error) {
                return reject(error);
            });
        });
    },

    updateTossupPointValues: function updateTossupPointValues(tournamentId, newPointValues) {
        return new Promise(function (resolve, reject) {
            var validPoints = newPointValues.tossupValues.every(function (pv) {
                return pv.type && typeof pv.value === 'number';
            });
            if (validPoints) {
                _tournament2.default.updateTossupPointValues(tournamentId, newPointValues.tossupValues, newPointValues.bonusPointValue, newPointValues.partsPerBonus).then(function (result) {
                    return resolve(result);
                }).catch(function (error) {
                    return reject(error);
                });
            } else {
                reject(new Error('Invalid point values given'));
            }
        });
    },

    addCollaborator: function addCollaborator(tournamentId, currentUser, username) {
        var isAdmin = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

        return new Promise(function (resolve, reject) {
            if (currentUser === username) return reject(new Error('Cannot add yourself as a collaborator'));
            _tournament2.default.addCollaborator(tournamentId, username, isAdmin).then(function (result) {
                return resolve(result);
            }).catch(function (error) {
                return reject(error);
            });
        });
    },

    findCollaborators: function findCollaborators(tournamentId) {
        return new Promise(function (resolve, reject) {
            _tournament2.default.findTournamentCollaborators(tournamentId).then(function (result) {
                return resolve(result);
            }).catch(function (error) {
                return reject(error);
            });
        });
    },

    updateCollaborator: function updateCollaborator(tournamentId, username) {
        var isAdmin = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        return new Promise(function (resolve, reject) {
            _tournament2.default.updateCollaborator(tournamentId, username.toLowerCase(), isAdmin).then(function (result) {
                return resolve(result);
            }).catch(function (error) {
                return reject(error);
            });
        });
    },

    removeCollaborator: function removeCollaborator(tournamentId, username) {
        return new Promise(function (resolve, reject) {
            _tournament2.default.deleteCollaborator(tournamentId, username.toLowerCase()).then(function (deletedCollab) {
                return resolve(deletedCollab);
            }).catch(function (error) {
                return reject(error);
            });
        });
    }

};