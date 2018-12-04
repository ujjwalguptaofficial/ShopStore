var IsIndex = true,
    OrderId;

function onPageLoaded() {
    getDetailsAndPrint();
}

function getDetailsAndPrint() {
    OrderId = Number(getQsValueByName('order_id'));
    showCustomerData(showOrderDetails);
}

function printDoc() {
    $('#divPrint').hide();
    $('#nav-mobile').hide();
    $('.brand-logo').css({
        position: 'relative',
        display: 'block'
    });
    window.print();
    $('#nav-mobile').show();
    $('.brand-logo').attr('style', '');
    $('#divPrint').show();
}

function showOrderDetails() {
    var Logic1 = {
            Table1: {
                Table: 'Order',
                Column: 'OrderId',
                Where: {
                    OrderId: OrderId
                }

            },
            Join: 'inner',
            Table2: {
                Table: 'OrderDetail',
                Column: 'OrderId',
            },
            NextJoin: {
                Table: 'OrderDetail',
                Column: 'ItemId'
            }
        },
        FromLogic = {
            Table1: Logic1,
            Join: 'inner',
            Table2: {
                Table: 'Stock',
                Column: 'ItemId',
            }
        };

    Db.DbConnection.select({
        From: FromLogic,
    }, function (values) {
        if (values.length > 0) {
            console.log(values);
            var TableBody = document.querySelector('#tblBilling tbody'),
                TotalAmount = 0;
            values.forEach(function (item) {
                var OrderDetail = item.OrderDetail,
                    Item = item.Stock,
                    Tr = document.createElement('tr'),
                    Total = OrderDetail.Quantity * Item.Price;
                Html = "<tr><td>" + OrderDetail.ItemId + "</td>" +
                    "<td> " + Item.ItemName + " </td>" +
                    "<td> " + Item.Price + " </td>" +
                    "<td> " + OrderDetail.Quantity + " </td>" +
                    "<td> " + Total + " </td>" +
                    "</tr>";
                TotalAmount += Total;
                Tr.innerHTML = Html;
                TableBody.appendChild(Tr);
            });
            document.querySelector('#tblBilling tfoot #totalAmount').innerText =
                TotalAmount;
            printDoc();
        } else {
            DialogBox.alert('Error Occured');
        }
    }, function (error) {
        console.log(error);
        DialogBox.alert('Error Occured');
    })
}

function showCustomerData(callBack) {
    var FromLogic = {
        Table1: {
            Table: 'Order',
            Column: 'CustomerId',
            Where: {
                OrderId: OrderId
            }
        },
        Join: 'inner',
        Table2: {
            Table: 'Customer',
            Column: 'CustomerID',
        }
    };
    Db.DbConnection.select({
        From: FromLogic,
    }, function (values) {
        if (values.length > 0) {
            var Customer = values[0].Customer;
            $('#divCustomerDetail').attr('data-customerId', Customer.CustomerId)
            $('#divCustomerName span').last().text(Customer.CustomerName);
            $('#divCustomerEmail span').last().text(Customer.Email);
            $('#divCustomerAddress span').last().text(Customer.Address);
            if (callBack != null) {
                callBack();
            }
        } else {
            DialogBox.alert('Error Occured');
        }
    }, function (error) {
        console.log(error);
        DialogBox.alert('Error Occured');
    })
}