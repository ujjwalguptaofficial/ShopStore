var Validator, DialogBox;
$(document).ready(function () {
    insertMenu();
    Db.initiate(function () {
        if (typeof onPageLoaded !== "undefined") {
            onPageLoaded();
        }
    });
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

    $('#btnCancel').click(function () {
        window.history.back();
    })
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

function insertMenu() {
    var HtmlString;
    if (typeof IsIndex == 'undefined') {
        HtmlString = `<ul id="listCustomer" class="dropdown-content">
                    <li><a href="../Customer/add.html">Add</a></li>
                    <li><a href="../Customer/index.html">List</a></li>
                </ul>
                <ul id="listStock" class="dropdown-content">
                    <li><a href="../Stock/add.html">Add</a></li>
                    <li><a href="../Stock/index.html">List</a></li>
                </ul>
                <ul id="listOrder" class="dropdown-content">
                    <li><a href="../Order/index.html">List</a></li>
                </ul>
                <nav class="nav-extended">
                    <div class="nav-wrapper">
                        <ul id="nav-mobile" class="right">
                            <li><a href="../index.html">Home</a></li>
                            <li class="active"><a class="dropdown-button" href="#!" data-activates="listCustomer">Customer<i class="material-icons right">arrow_drop_down</i></a></li>
                            <li><a class="dropdown-button" href="#!" data-activates="listStock">Stock<i class="material-icons right">arrow_drop_down</i></a></li>
                            <li><a class="dropdown-button" href="#!" data-activates="listOrder">Order<i class="material-icons right">arrow_drop_down</i></a></li>
                        </ul>
                        <div class="brand-logo center-align">
                            <a href="#" title="Download MatDialog" class="logo">ShopDemo</a><br>
                        </div>
                    </div>
                </nav>`;
    } else {
        HtmlString = `
        <ul id="listCustomer" class="dropdown-content">
            <li><a href="Customer/add.html">Add</a></li>
            <li><a href="Customer/index.html">List</a></li>
        </ul>
        <ul id="listStock" class="dropdown-content">
            <li><a href="Stock/add.html">Add</a></li>
            <li><a href="Stock/index.html">List</a></li>
        </ul>
        <ul id="listOrder" class="dropdown-content">
            <li><a href="Order/index.html">List</a></li>
        </ul>
        <nav class="nav-extended">
            <div class="nav-wrapper">
                <ul id="nav-mobile" class="right">
                    <li class="active"><a href="index.html">Home</a></li>
                    <li><a class="dropdown-button" href="#!" data-activates="listCustomer">Customer<i class="material-icons right">arrow_drop_down</i></a></li>
                    <li><a class="dropdown-button" href="#!" data-activates="listStock">Stock<i class="material-icons right">arrow_drop_down</i></a></li>
                    <li><a class="dropdown-button" href="#!" data-activates="listOrder">Order<i class="material-icons right">arrow_drop_down</i></a></li>
                </ul>
                <div class="brand-logo center-align">
                    <a href="#" title="Download MatDialog" class="logo">ShopDemo</a><br>
                </div>
            </div>
        </nav>`;
    }
    $('#divNavContainer').html(HtmlString);
}