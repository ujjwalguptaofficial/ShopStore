var Validator, DialogBox;
$(document).ready(function () {
    Validator = new JsValidator(),
        DialogBox = new MatDialog();
    $('select').material_select();
    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: true, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'left', // Displays dropdown with edge aligned to the left of button
        stopPropagation: true // Stops event propagation
    });
    Db.Initiate();
    if (typeof onPageLoaded !== "undefined") {
        onPageLoaded();
    }
});

function getQsValueByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadPage(containerId, pageUrl, callBack) {
    $.get(pageUrl, function (data) {
        var Body = data.replace(/^.*?<body[^>]*>(.*?)<\/body>.*?$/i, "$1");
        $('#' + containerId).html(Body);
        if (callBack) {
            callBack();
        }
    });
}

