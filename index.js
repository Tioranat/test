
/* jshint undef: true, unused: true */
/* globals $ */
/*jshint strict:false */
/* jshint -W097 */

"use strict";

$(function () {
    loadHashReplace();
    loadDB(function (Data) {
        loadTable(Data,"nav-infection","InfectionRisk");
        loadTable(Data,"nav-group","RiskGroup");
    });
});



function loadTable(DB,ID,Group) {
    var NewTab = new Table();
    NewTab.loadHeader(['Question','Answer', 'Weight']);

    var QuestionArr = Object.keys(DB.questions);
    var Question;
    var QuestionSet ;
    var AnswerArr;
    var Answer;
    var k;
    var l;

    for (k = 0; k < QuestionArr.length; k++) {
        Question = QuestionArr[k];
        QuestionSet = DB.questions[Question];
        if (QuestionSet.group === Group) {
            AnswerArr = Object.keys(QuestionSet.answers);
            for(l=0;l < AnswerArr.length;l++){
                Answer = AnswerArr[l];
                NewTab.addRow([Question, Answer, QuestionSet.answers[Answer]]);
            }
        }
    }
    NewTab.putHTML("#"+ID);
}



/**
 * Class table
 * @constructor
 */
function Table() {
    this.Rows = [];
    this.Headers = [];
    this.putHTML = function (ID) {
        var HTML = '<table class="table table-bordered"><tr>';
        var k;
        var l;
        for (k = 0; k < this.Headers.length; k++) {
            HTML += "<th>" + this.Headers[k] + "</th>";
        }
        HTML += "</tr>";
        for (k = 0; k < this.Rows.length; k++) {
            HTML += "<tr>";
            for (l = 0; l < this.Headers.length; l++) {
                HTML += "<td>" + this.Rows[k][l] + "</td>";
            }
            HTML += "</tr>";
        }
        HTML += "</table>";
        $(ID).html(HTML);
    };

    this.loadHeader = function (Headers) {
        this.Headers = Headers;
    };

    this.addRow = function (Row) {
        this.Rows.push(Row);
    };
}

function loadDB(nextFunction) {
    var URL;
    if(location.hostname === "tioranat.github.io"){
        URL = "https://raw.githubusercontent.com/Tioranat/tioranat.info/master/rki/survey.json";
    }else{
        URL = "/survey.json";
    }
    $.ajax({
        'async': false,
        'global': false,
        'url': URL,
        'dataType': "json",
        'success': function (data) {
            nextFunction(data);
        }
    });
}

function loadHashReplace() {
    if (location.hash.substr(0, 2) === "#!") {
        $("a[href='#" + location.hash.substr(2) + "']").tab("show");
    };
    $("a[data-toggle='tab']").on("shown.bs.tab", function (e) {
        var hash = $(e.target).attr("href");
        if (hash.substr(0, 1) === "#") {
            location.replace("#!" + hash.substr(1));
        };
    });
}
