var WhereLogic = {};
onPageLoaded = function () {
    showOrderItems();
    bindEvents();
}

function showOrderItems() {
    var FromLogic = {
        Table1: {
            Table: 'Order',
            Column: 'CustomerId',
            Order: {
                By: 'PurchaseDate',
                Type: 'desc'
            }
        },
        Join: 'left',
        Table2: {
            Table: 'Customer',
            Column: 'CustomerID'
        }
    };
    Db.DbConnection.select({
        From: FromLogic
    }, function (stocks) {
        console.log(stocks);
        createItemsList(stocks);
    }, function (error) {
        console.log(error);
        alert('Error Occured');
    })
}

function createItemsList(orders) {
    var TableBody = document.querySelector('#tblOrder tbody');
    TableBody.innerHTML = "";
    orders.forEach(function (item) {
        if (item.Customer != null) {
            var Customer = item.Customer,
                Order = item.Order;
            Tr = document.createElement('tr');
            Tr.innerHTML = "<td>" + Order.OrderId + "</td><td>" + Customer.CustomerName +
                "</td><td>" + Order.Date +
                "</td><td>" + Order.Total +
                "</td><td class='print'><i class='material-icons'>print</i></td>";
            TableBody.appendChild(Tr);
        }
    });
}

function searchItems() {
    if (WhereInLogic.length > 0 || CustomerWhereInLogic) {
        var FromLogic = {
            Table1: {
                Table: 'Receipt',
                Column: 'CustomerId',
                Order: {
                    By: 'PurchaseDate',
                    Type: 'desc'
                },
                WhereIn: WhereInLogic
            },
            Join: 'left',
            Table2: {
                Table: 'Customer',
                Column: 'CustomerId',
                WhereIn: CustomerWhereInLogic
            }
        };

        Db.DbConnection.select({
            From: FromLogic
        }, function (stocks) {
            createItemsList(stocks);
        }, function (error) {
            console.log(error);
            alert('Error Occured');
        })

    } else {
        showOrderItems();
    }
}

function bindEvents() {
    $('table#tblOrder').on('click', 'tr td.print', function () {
        window.location.href = "../print.html?order_id=" + $(this).parent().find('td:first').text();
    })

    $('#tblOrder tr#trSearch th input').keyup(function () {
        var Value = $(this).val(),
            ColumnName,
            Index = $(this).parent().index();
        switch (Index) {
            case 0:
                ColumnName = 'ReceiptId';
                break;
            case 1:
                ColumnName = 'CustomerName';
                break;
            case 2:
                ColumnName = 'PurchaseDate';
                break;
            case 3:
                ColumnName = 'Total';
                break;

        }
        //if value is not null and item exist or does not exist
        if (Value.length > 0) {
            if (Index == 0) {
                WhereLogic[ColumnName] = {
                    '<=': Number(Value)
                }
            } else {
                WhereLogic[ColumnName] = {
                    Like: '%' + Value + '%'
                }
            }
        } else { // item exist and value is null
            delete WhereLogic[ColumnName];
        }
        searchItems();
    });

}