$(document).ready(function() {

    $("#entergamebutton").click(function(e) {
        // console.log($("#changegameform").serialize());
        editGameAJAX();
    });

    $("#editteambutton").click(function(e) {
        $(this).prop("disabled", true);
        $("#team-update-msgdiv").empty().
            append("<p style='margin:10px; font-size:16px;'>Saving Team <i class='fa fa-spinner fa-spin'></i></p>");
        editTeamAJAX();
    });

    $(".saveplayerbutton").click(function(e) {
        // console.log($(this).parent().prev().prev());
        var form = $(this).parent().prev().prev();
        // console.log($(form).serialize());
        editPlayerAJAX($(form).serialize());
    });

    $(".deleteplayerbutton").click(function(e) {
        var form = $(this).parent().prev().prev();
        removePlayerAJAX($(form).serialize(), $(this));
    });

    $(".teamselect").change(function() {
        if ($(this).attr("id") == "leftchoice") {
            getTeamPlayersAJAX("LEFT");
            $("#leftteamnameID").val($(this).find(":selected").text());
        } else {
            getTeamPlayersAJAX("RIGHT");
            $("#rightteamnameID").val($(this).find(":selected").text());
        }
    });

    $("#add-player-button").click(function(e) {
        var form = $(this).parent().serialize();
        $(this).prop("disabled", true);
        $("#player-add-msg").empty().
            append("<p style='margin:10px; font-size:16px;'>Adding Player <i class='fa fa-spinner fa-spin'></i></p>");
        addPlayerAJAX(form);
    });
});

function savePlayerSender(button) {
    var form = $(button).parent().prev().prev();
    console.log($(form).serialize());
    // editPlayerAJAX($(form).serialize());
}

function deletePlayerSender(button) {
    var buttonID = $(button).id();
    var form = $(button).parent().prev().prev();
    console.log($(form));
    console.log($(form).serialize());
    // console.log(form);
    // removePlayerAJAX($(button).parent().prev().prev(), button);
    // console.log($(form).serialize());
    //removePlayerAJAX($(form).serialize(), button);
}


function editGameAJAX() {
    $.ajax({
        url : "/home/tournaments/games/edit",
        type : "POST",
        data : $("#changegameform").serialize(),
        success : function(databack, status, xhr) {
            console.log(databack);
            console.log("Edited game successfully");
            $("#oldgameid_input").val(databack.shortID);
        }
    });
}

function editTeamAJAX() {
    $.ajax({
        url : "/home/tournaments/teams/edit",
        type : "POST",
        data : $("#teamdetailsform").serialize(),
        success : function(databack, status, xhr) {
            showTeamUpdateMsg(databack);
        },
        complete : function(databack) {
            $("#editteambutton").prop("disabled", false);
        }
    });
}

function editPlayerAJAX(playerForm) {
    $.ajax({
        url : "/home/tournaments/players/edit",
        type : "POST",
        data : playerForm,
        success : function(databack, status, xhr) {
            if (databack.err) {
                console.log(databack.msg);
            } else {
                console.log(databack.msg);
            }
        }
    });
}

function addPlayerAJAX(playerForm) {
    $.ajax({
        url : "/home/tournaments/players/create",
        type : "POST",
        data : playerForm,
        success : function(databack, status, xhr) {
            console.log(databack);
            showAddPlayerMsg(databack);
            if (!databack.err) {
                addNewPlayerRow(databack.player, databack.tid);
            }
        },
        complete : function(data) {
            $("#add-player-button").prop("disabled", false);

        }
    });
}

function removePlayerAJAX(playerForm, button) {
    $.ajax({
        url : "/home/tournaments/players/remove",
        type : "POST",
        data : playerForm,
        success : function(databack, status, xhr) {
            if (databack.err) {
                console.log(databack.err);
            } else {
                $(button).parent().parent().remove();
            }
        }
    })
}

function getTeamPlayersAJAX(side) {
    if (side == "LEFT") {
        $.ajax({
            url : "/home/tournaments/getplayers",
            type : "GET",
            data : {tournamentid : $("#tournament_id_change").val(),
                    teamname : $("#leftchoice").val()},
            success : function(databack, status, xhr) {
                console.log(databack);
                replacePlayerRows(databack.players, databack.pointScheme, "LEFT");
            }
        });
    } else {
        $.ajax({
            url : "/home/tournaments/getplayers",
            type : "GET",
            data : {tournamentid : $("#tournament_id_change").val(),
                    teamname : $("#rightchoice").val()},
            success : function(databack, status, xhr) {
                replacePlayerRows(databack.players, databack.pointScheme, "RIGHT");
            }
        });
    }
}

function showTeamUpdateMsg(databack) {
    if (databack.err || !databack.team) {
        $("#team-update-msgdiv").empty();
        $("<p style='margin:10px; font-size:16px; color:#ff3300'>" + databack.msg + "<i style='margin-left:5px' class='fa fa-times-circle'></i></p>").
            hide().appendTo("#team-update-msgdiv").fadeIn(300);
    } else {
        $("#team-update-msgdiv").empty();
        $("<p style='margin:10px; font-size:16px; color:#009933'>" + databack.msg + "<i style='margin-left:5px' class='fa fa-check-circle'></i></p>").
            hide().appendTo("#team-update-msgdiv").fadeIn(300);
    }
}

function showAddPlayerMsg(databack) {
    if (databack.err) {
        $("#player-add-msg").empty();
        $("<p style='margin:10px; font-size:16px; color:#ff3300'>" + databack.msg + "<i style='margin-left:5px' class='fa fa-times-circle'></i></p>").
            hide().appendTo("#player-add-msg").fadeIn(300);
    } else {
        $("#player-add-msg").empty();
        $("<p style='margin:10px; font-size:16px; color:#009933'>" + databack.msg + "<i style='margin-left:5px' class='fa fa-check-circle'></i></p>").
            hide().appendTo("#player-add-msg").fadeIn(300);
    }
}

function addNewPlayerRow(player, tid) {
    var html = "<tr> <form role='form' name='editplayerform'>";
    html += "<td>";
    html += "<input type='hidden' name='tournamentidform' value='" + tid + "'/>";
    html += "<input type='hidden' name='playerid' value='" + player._id + "'>";
    html += "<input type='input' class='form-control' name='playername' value='" + player.player_name + "'/>";
    html += "</td></form>";
    html += "<td>";
    html += "<button type='button' class='btn btn-sm btn-success saveplayerbutton'>Save Name</button>";
    html += "<button type='button' class='btn btn-sm btn-danger deleteplayerbutton'>Remove</button>";
    html += "</tr>";
    $(html).hide().appendTo("#playersbody").fadeIn(300);
}

function replacePlayerRows(players, pointScheme, side) {
    var choice = side == "LEFT" ? "#left-text" : "#right-text";
    var points = Object.keys(pointScheme);
    $(choice).empty();
    var html = "<table class='table table-striped table-bordered table-hover table-condensed'><thead><tr>";
    html += "<th class='table-head'>Name</th>";
    html += "<th class='table-head'>GP</th>";
    for (var i = 0; i < points.length; i++) {
        html += "<th class='table-head'>" + points[i] + "</th>";
    }
    html += "<th class='table-head'>Points</th>";
    html += "</tr></thead><tbody>";
    var playerNum = 1;
    var sideText = side == "LEFT" ? "_left" : "_right";
    for (var i = 0; i < players.length; i++) {
        html += "<tr>";
        html += "<input type='hidden' value='" + players[i]._id +  "' " + "name='" + "player" + playerNum + sideText + "id'" + "/>";
        html += "<td>" + players[i].player_name + "</td>";
        html += "<td> <input class='form-control' type='number' placeholder='GP'" + "value='0' name='" + "player" + playerNum + sideText + "gp'" + "/> </td>";
        for (var j = 0; j < points.length; j++) {
            var keyNameStr = "name='player" + playerNum + sideText + "_" + points[j] + "val' ";
            var keyId = "id='player" + playerNum + "_" + points[j] + sideText + "id' ";
            var json = JSON.stringify(pointScheme);
            var onkeyupString = "onkeyup=";
            onkeyupString += "'updatePoints(";
            onkeyupString += playerNum + ',' + json + ', "' + sideText + '"' + ")' ";
            var onchangeString = "onchange=";
            onchangeString += "'updatePoints(" + playerNum + ',' + json + ', "' + sideText + '"' + ")'";
            html += "<td><input class='form-control' type='number' placeholder='" + points[j] + "'" + keyNameStr + keyId + onkeyupString + onchangeString + "/></td>";
        }
        var idTag = "id='" + playerNum + sideText + "pts'";
        html += "<td> <input " + idTag + "class='form-control disabledview' type='input' placeholder='0' disabled /> </td>";
        html += "</tr>";
        playerNum++;
    }
    html += "</tbody><tfoot><tr></tr></tfoot></table>";
    $(choice).append(html);
}
