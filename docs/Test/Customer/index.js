var WhereLogic = {},
    MaxRowInPage = 5,
    NoOfPages = 0;

function onPageLoaded() {
    showCustomers();
    createPagination();
    bindEvents();
}

function createPagination() {
    Db.DbConnection.count({
        From: 'Customer',
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

function showCustomers(skip) {
    Db.DbConnection.select({
        From: 'Customer',
        Limit: MaxRowInPage,
        Skip: skip * MaxRowInPage,
        OnSuccess: function (customers) {
            createCustomersList(customers);
        },
        OnError: function (error) {
            console.log(error);
            alert('Error Occured');
        }
    });
}

function deleteItem(itemRow) {
    DialogBox.confirm("Are you sure want to delete ?", function (result) {
        if (result) {
            Db.DbConnection.delete({
                    From: 'Customer',
                    Where: {
                        CustomerID: Number(itemRow.attr('Id'))
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
    })
}

function bindEvents() {
    $('table#tblCustomer').on('click', 'tr td.delete', function () {
        var ItemRow = $(this).parent();
        deleteItem(ItemRow);
    })

    $('table#tblCustomer').on('click', 'tr td.edit', function () {
        window.location.href = "edit.html?id=" + $(this).parent().attr('Id');
    })

    $('#tblCustomer tr#trSearch th input').keyup(function () {
        var Value = $(this).val(),
            ColumnName;
        switch ($(this).parent().index()) {
            case 0:
                ColumnName = 'CustomerName';
                break;
            case 1:
                ColumnName = 'Dob';
                break;
            case 2:
                ColumnName = 'Email';
                break;
            case 3:
                ColumnName = 'Address';
                break;
            case 4:
                ColumnName = 'City';
                break;
            case 5:
                ColumnName = 'PostalCode';
                break;
            case 6:
                ColumnName = 'Country';
                break;
        }

        //if value is not null and item exist or does not exist
        if (Value.length > 0) {
            WhereLogic[ColumnName] = {
                Like: '%' + Value + '%'
            }
        } else { // item exist and value is null
            delete WhereLogic[ColumnName];
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

function createCustomersList(customers) {
    $('#divNoCustomerFound').hide();
    $('#tblCustomer').show(500);
    var TableBody = document.querySelector('#tblCustomer tbody');
    TableBody.innerHTML = "";
    customers.forEach(function (customer) {
        var Tr = document.createElement('tr');
        Tr.setAttribute('id', customer.CustomerID);
        Tr.innerHTML = "<td>" + customer.CustomerName + "</td><td>" + customer.ContactName +
            "</td><td>" + customer.Email +
            "</td><td>" + customer.Address +
            "</td><td>" + customer.City +
            "</td><td>" + customer.PostalCode +
            "</td><td>" + customer.Country +
            "</td><td class='edit'><i class='material-icons'>edit</i></td><td class='delete'><i class='material-icons'>delete</i></td>";
        TableBody.appendChild(Tr);
    })
}

function searchItems(skip) {
    if (Object.keys(WhereLogic).length > 0) {
        if (skip == null) {
            createPagination();
        }
        Db.DbConnection.select({
            From: 'Customer',
            Where: WhereLogic,
            Limit: MaxRowInPage,
            Skip: skip * MaxRowInPage
        }, function (customers) {
            createCustomersList(customers);
        }, function (error) {
            console.log(error);
            alert('Error Occured');
        })
    } else {
        if (skip == null) {
            createPagination();
        }
        showCustomers(skip);
    }
}

function sortItem(type, column) {
    Order = {
        By: column,
        Type: type
    }
    searchItems();
}