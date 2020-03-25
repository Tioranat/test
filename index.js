var DB;
$(function () {
    loadHashReplace();
    loadDB(function (Data) {
        DB = Data;
        //loadSymptoms();
        loadRadio();
        loadCheckbox();
    });
});


function loadCheckbox(){
    var NewTab = new table();
    NewTab.loadHeader(['Group', 'Question','weight']);

    var Survey;
    var Abswers;
    var k;
    for (var k = 0; k < DB["survey"].length; k++) {
        if (DB["survey"][k]["type"] == "radiocheck") {
            Survey = DB["survey"][k];
            Answers = Survey["answers"];
            NewTab.addRow([Survey["group"],Survey["name"],Survey["weight"]])
        }
    }
    NewTab.putHTML("#nav-checkbox");

}

function loadRadio() {
    var NewTab = new table();
    NewTab.loadHeader(['Group', 'Question','Answer', 'Weight']);

    var Survey;
    var Abswers;
    var k;
    for (var k = 0; k < DB["survey"].length; k++) {
        if (DB["survey"][k]["type"] == "radio") {
            Survey = DB["survey"][k];
            Answers = Survey["answers"];
            for (k = 0; k < Answers.length; k++) {
                NewTab.addRow([Survey["group"],Survey["name"], Answers[k]["answer"], Answers[k]["weight"]])
            }
        }
    }
    NewTab.putHTML("#nav-radio");

}

function loadSymptoms() {
    var NewTab = new table();
    NewTab.loadHeader(['Key', 'Weight', 'Intensity [0-5]']);

    var Survey;
    for (var k = 0; k < DB["survey"].length; k++) {
        if (DB["survey"][k]["name"] == "QuestionSymptoms") {
            Survey = DB["survey"][k]["answers"];
        }
    }
    for (var k = 0; k < Survey.length; k++) {
        NewTab.addRow([Survey[k]["answer"], Survey[k]["weight"], Survey[k]["target"]]);
    }
    NewTab.putHTML("#nav-sym");
}


function table() {
    this.Rows = [];
    this.Headers = [];
    this.putHTML = function (ID) {
        var HTML = '<table class="table table-border"><tr>';
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
    }

    this.loadHeader = function (Headers) {
        this.Headers = Headers;
    }

    this.addRow = function (Row) {
        this.Rows.push(Row);
    }
}

function loadDB(nextFunction) {
    $.ajax({
        'async': false,
        'global': false,
        'url': "https://raw.githubusercontent.com/Tioranat/tioranat.info/master/rki/survey.json",
        'dataType': "json",
        'success': function (data) {
            nextFunction(data);
        }
    });
}

function loadHashReplace() {
    if (location.hash.substr(0, 2) == "#!") {
        $("a[href='#" + location.hash.substr(2) + "']").tab("show");
    }
    ;
    $("a[data-toggle='tab']").on("shown.bs.tab", function (e) {
        var hash = $(e.target).attr("href");
        if (hash.substr(0, 1) == "#") {
            location.replace("#!" + hash.substr(1));
        }
        ;
    });
}