var IsIndex = true,
    RowInserted = false,
    IsErrorOccured = false;

function onPageLoaded() {
    var Email = getQsValueByName('email');
    if (Email) {
        $('#txtEmail').val(Email);
        submit();
    }
    $('#tblBilling tbody').on('blur', 'input', function () {
        var TextBox = $(this);
        if (TextBox.hasClass('item-id')) {
            isItemValid(TextBox);
        } else {
            isQuantityValid(TextBox);
        }
    })
    insertRow();
}

function isQuantityValid(textbox) {
    var TdList = textbox.parents().eq(1).find('td'),
        QuantityInStock = Number(TdList.eq(0).attr('data-quantity')),
        RequiredQuanity = Number(textbox.val());
    if (QuantityInStock >= RequiredQuanity) {
        textbox.next().html('<i class="material-icons">check</i>');
        var Total = Number(TdList.eq(2).text()) * RequiredQuanity;
        TdList.eq(4).text(Total);
        var TotalAmount = 0;
        $('#tblBilling tbody tr td:last-child').each(function () {
            TotalAmount += Number($(this).text());
        })
        $('#totalAmount').text(TotalAmount);
        IsErrorOccured = false;
    } else {
        IsErrorOccured = true;
        textbox.next().html('<i class="material-icons">close</i>');
    }
}

function isItemValid(textbox) {
    Db.DbConnection.select({
        From: 'Stock',
        Where: {
            ItemId: Number(textbox.val())
        }
    }, function (items) {
        var Tr = textbox.parents().eq(1),
            TdList = Tr.find('td');
        if (items.length > 0) {
            textbox.next().html('<i class="material-icons">check</i>');
            TdList.eq(0).attr('data-quantity', items[0].Unit);
            TdList.eq(1).text(items[0].ItemName);
            TdList.eq(2).text(items[0].Price);
            if (!Tr.next().html()) {
                insertRow();
            }
            IsErrorOccured = false;
        } else {
            IsErrorOccured = true;
            textbox.next().html('<i class="material-icons">close</i>');
            TdList.eq(0).data('quantity', '');
            TdList.eq(1).text("");
            TdList.eq(2).text("");
        }
    })
}

function insertRow() {
    var Html = '<tr>' +
        '<td><input type="text" class="item-id"/><span class="Hide"></span></td>' +
        '<td></td><td></td>' +
        '<td><input type="number" min="1" class="item-quantity"/><span class="Hide"></span></td>' +
        '<td></td>' +
        '</tr>';
    $('#tblBilling tbody').append(Html) //+= Html;
}

function submit() {
    var TextInput = $('#txtEmail');
    // Validator.startValidation();
    if (Validator.isInvalid(TextInput.val(), {
            Type: 'email'
        })) {
        TextInput.addClass('invalid').next().attr('data-error', Validator.ErrMsg);
    } else {
        Db.DbConnection.select({
            From: 'Customer',
            Where: {
                Email: TextInput.val()
            }
        }, function (customers) {
            if (customers.length > 0) {
                $('#divCustomerDetail').attr('data-customerId', customers[0].CustomerID)
                $('#divCustomerName span').last().text(customers[0].CustomerName);
                $('#divCustomerEmail span').last().text(customers[0].Email);
                $('#divCustomerAddress span').last().text(customers[0].Address);
                $('#divInputContainer').hide();
                $('#divBillingContainer').show(500);
            } else {
                DialogBox.confirm('No Customer Found, do you want to create one ?', function (
                    result) {
                    if (result) {
                        window.location.href = 'Customer/Add.html?email=' + TextInput.val();
                    }
                });
            }
        }, function (error) {
            console.log(error);
            alert('Error Occured');
        })
    }

}

function CreateReceipt() {
    if (!IsErrorOccured) {
        var CustomerId = $('#divCustomerDetail').attr('data-customerId'),
            Value = {
                CustomerId: Number(CustomerId),
                Total: Number($('#totalAmount').text())
            };
        Db.DbConnection.insert({
            Into: 'Order',
            Return: true, // this will return the inserted datas
            Values: [Value]
        }, function (values) {
            if (values.length > 0) {
                var OrderId = values[0].OrderId;
                if (OrderId) {
                    insertShoppingList(OrderId);
                }
            } else {
                DialogBox.alert('Error Occured');
            }
        }, function (error) {
            console.log(error);
            DialogBox.alert('Error Occured');
        })
    } else {
        DialogBox.alert('Please correct all error');
    }
}

function insertShoppingList(orderId) {
    var ShoppingList = getShoppingList(orderId);
    if (ShoppingList.length > 0) {
        Db.DbConnection.insert({
            Into: 'OrderDetail',
            Values: ShoppingList,
            Return: true
        }, function (values) {
            if (values.length > 0) {
                DialogBox.alert('Successfully added');
                window.location.href = "print.html?order_id=" + orderId;
            } else {
                DialogBox.alert('Error Occured');
            }
        }, function (error) {
            console.log(error);
            DialogBox.alert('Error Occured');
        })
    }

}

function getShoppingList(orderId) {
    var List = [];
    $('#tblBilling tbody tr').each(function () {
        var Columns = $(this).find('td'),
            IsValidColumn = $(Columns[4]).text();
        if (IsValidColumn.length > 0) {
            List.push({
                OrderId: orderId,
                ItemId: Number($(Columns[0]).find('input').val()),
                Quantity: Number($(Columns[3]).find('input').val())
            })
        }
    });
    console.log(List);
    return List;

}