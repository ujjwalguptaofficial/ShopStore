var WhereLogic = {},
    MaxRowInPage = 6,
    NoOfPages = 0,
    Order;
onPageLoaded = function () {
    showStockItems();
    createPagination();
    bindEvents();
}

function showStockItems(skip) {
    Db.DbConnection.select({
        From: 'Stock',
        Limit: MaxRowInPage,
        Skip: skip * MaxRowInPage,
        Order: Order ? Order : null
    }, function (stocks) {
        createItemsList(stocks);
    }, function (error) {
        console.log(error);
        alert('Error Occured');
    })
}

function createPagination() {
    Db.DbConnection.count({
        From: 'Stock',
        Where: Object.keys(WhereLogic).length > 0 ? WhereLogic : null,
        OnSuccess: function (count) {
            NoOfPages = Math.ceil(count / MaxRowInPage);
            var HtmlString = "";
            if (NoOfPages > 0) {
                HtmlString += '<li id="liPrev"><a href="#!"><i class="material-icons">chevron_left</i></a></li>';

                for (var i = 0; i < NoOfPages; i++) {
                    if (i == 0) {
                        HtmlString += '<li class="waves-effect active"><a href="#!">' + (i + 1) + '</a></li>';
                    } else {
                        HtmlString += '<li class="waves-effect"><a href="#!">' + (i + 1) + '</a></li>';
                    }
                }
                HtmlString += '<li id="liNext" class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>';
            }
            $('.pagination').html(HtmlString);
        },
        OnError: function (error) {
            console.log(error);
            alert('Error Occured');
        }
    })
}

function createItemsList(stocks) {
    var TableBody = document.querySelector('#tblStock tbody');
    TableBody.innerHTML = "";
    stocks.forEach(function (stock) {
        var Tr = document.createElement('tr');
        Tr.setAttribute('id', stock.ItemId);
        Tr.innerHTML = "<td>" + stock.ItemName + "</td><td>" + stock.Price + "</td><td>" +
            stock.Unit +
            "</td><td class='edit'><i class='material-icons'>edit</i></td><td class='delete'><i class='material-icons'>delete</i></td>";
        TableBody.appendChild(Tr);
    });
}

function searchItems(skip) {
    if (Object.keys(WhereLogic).length > 0) {
        if (skip == null) {
            createPagination();
        }
        Db.DbConnection.select({
            From: 'Stock',
            Where: WhereLogic,
            Limit: MaxRowInPage,
            Skip: skip * MaxRowInPage,
            Order: Order ? Order : null
        }, function (stocks) {
            createItemsList(stocks);
        }, function (error) {
            console.log(error);
            alert('Error Occured');
        })
    } else {
        if (skip == null) {
            createPagination();
        }
        showStockItems(skip);
    }
}

function deleteItem(itemRow) {
    Db.DbConnection.delete({
            From: 'Stock',
            Where: {
                ItemId: Number(itemRow.attr('Id'))
            }
        }, function (rowsAffected) {
            if (rowsAffected > 0) {
                itemRow.remove();
            } else {
                alert('No item deleted');
            }
        },
        function (error) {
            console.log(error);
            alert('Error Occured')
        })

}

function sortItem(type, column) {
    Order = {
        By: column,
        Type: type
    }
    searchItems();
}

function bindEvents() {
    $('table#tblStock').on('click', 'tr td.delete', function () {
        var ItemRow = $(this).parent();
        deleteItem(ItemRow);
    })

    $('table#tblStock').on('click', 'tr td.edit', function () {
        window.location.href = "edit.html?id=" + $(this).parent().attr('Id');
    })

    $('#tblStock tr#trHeading th').click(function () {
        var Column = $(this).data('column');
        if (Column) {
            var SortType = $(this).attr('sortType');
            if (SortType) {
                $(this).attr('sortType', SortType == 'asc' ? 'desc' : 'asc')
            } else {
                SortType = 'asc';
                $(this).attr('sortType', 'desc');
            }
            sortItem(SortType, Column);
        }
    })

    $('#tblStock tr#trSearch th input').keyup(function () {

        var Value = $(this).val(),
            ColumnName;
        switch ($(this).parent().index()) {
            case 0:
                ColumnName = 'ItemName';
                //if value is not null and item exist or does not exist
                if (Value.length > 0) {
                    WhereLogic[ColumnName] = {
                        Like: '%' + Value + '%'
                    }
                } else { // item exist and value is null
                    delete WhereLogic[ColumnName];
                }
                break;
            case 1:
                ColumnName = 'Price';
                //if value is not null and item exist or does not exist
                if (Value.length > 0) {
                    WhereLogic[ColumnName] = {
                        '<=': Number(Value)
                    }
                } else { // item exist and value is null
                    delete WhereLogic[ColumnName];
                }
                break;
            case 2:
                ColumnName = 'Unit';
                //if value is not null and item exist or does not exist
                if (Value.length > 0) {
                    WhereLogic[ColumnName] = {
                        '>=': Number(Value)
                    }
                } else { // item exist and value is null
                    delete WhereLogic[ColumnName];
                }
                break;
        }

        searchItems();
    });

    $('.pagination').on('click', 'li', function () {
        var Element = $(this),
            Skip = 0,
            ActiveElement = $(this).parent().find('li.active');
        switch (Element.attr('id')) {
            case 'liPrev':
                Skip = Number(ActiveElement.text());
                if (Skip != 1) {
                    Skip -= 2
                    ActiveElement.removeClass('active');
                    ActiveElement.prev().addClass('active');
                } else {
                    Skip = 0;
                }
                break;
            case 'liNext':
                Skip = Number(ActiveElement.text());
                if (Skip != NoOfPages) {
                    ActiveElement.removeClass('active');
                    ActiveElement.next().addClass('active');
                } else {
                    Skip -= 1;
                }
                break;
            default:
                Skip = Number($(this).text()) - 1;
                ActiveElement.removeClass('active');
                $(this).addClass('active');
                break;
        }
        searchItems(Skip);
    });
}