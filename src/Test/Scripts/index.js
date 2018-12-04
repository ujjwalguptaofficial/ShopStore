var IsIndex = true,
    RowInserted = false,
    IsValidQuantity = true,
    IsValidItemId = true;

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
    insertRow(true);
}

function isQuantityValid(textbox) {
    var TdList = textbox.parents().eq(1).find('td'),
        TdItemId = TdList.eq(0),
        QuantityInStock = Number(TdItemId.attr('data-quantity')),
        RequiredQuanity = Number(textbox.val());
    if (TdItemId.find('input').val().length > 0) {
        if (RequiredQuanity == 0) {
            IsValidQuantity = false;
            textbox.next().html('<i class="material-icons">close</i>').attr('Title', 'Zero Quantity is not allowed');
        } else if (QuantityInStock >= RequiredQuanity) {
            textbox.next().html('<i class="material-icons">check</i>').attr('Title', 'Valid Quantity');
            var Total = Number(TdList.eq(2).text()) * RequiredQuanity;
            TdList.eq(4).text(Total);
            var TotalAmount = 0;
            $('#tblBilling tbody tr td:last-child').each(function () {
                TotalAmount += Number($(this).text());
            })
            $('#totalAmount').text(TotalAmount);
            if (!IsValidQuantity) {
                IsValidQuantity = true;
                setTimeout(function () {
                    insertRow();
                }, 100);
            }
        } else {
            IsValidQuantity = false;
            textbox.next().html('<i class="material-icons">close</i>').attr('Title', 'Quantity does not exist in stock');
        }
    } else {
        IsValidQuantity = false;
        textbox.next().html('<i class="material-icons">close</i>').attr('Title', 'No ItemId');
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
            textbox.next().html('<i class="material-icons">check</i>').attr('Title', 'Valid ItemId');
            TdList.eq(0).attr('data-quantity', items[0].Unit);
            TdList.eq(1).text(items[0].ItemName);
            TdList.eq(2).text(items[0].Price);
            if (!Tr.next().html()) {
                insertRow();
            }
            IsValidItemId = true;
        } else {
            IsValidItemId = false;
            textbox.next().html('<i class="material-icons">close</i>').attr('Title', 'Invalid ItemId');
            TdList.eq(0).data('quantity', '');
            TdList.eq(1).text("");
            TdList.eq(2).text("");
        }
    })
}

function insertRow(isFirstRow) {
    var insertRowInternal = function () {
        var Html = '<tr>' +
            '<td><input type="text" class="item-id"/><span class="Hide"></span></td>' +
            '<td></td><td></td>' +
            '<td><input type="number" min="1" class="item-quantity"/><span class="Hide"></span></td>' +
            '<td></td>' +
            '</tr>';
        $('#tblBilling tbody').append(Html);
    }
    if (isFirstRow) {
        insertRowInternal();
    } else if (IsValidItemId && IsValidQuantity) {
        // $('#tblBilling tbody tr:last-child td:first-child input').val().length > 0
        var Rows = $('#tblBilling tbody tr'),
            LastRows = Rows.last();
        if (Rows.length > 1) {
            isQuantityValid(LastRows.prev().find('td:nth-child(4) input'));
            if (IsValidQuantity && LastRows.find('td:first-child input').val().length > 0) {
                insertRowInternal();
            }
        } else {
            insertRowInternal();
        }
    }
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
                        window.location.href = 'Customer/add.html?email=' + TextInput.val();
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
    if (IsValidItemId && IsValidQuantity) {
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
    var ShoppingList = getShoppingList(orderId),
        Length = ShoppingList.length;
    if (ShoppingList.length > 0) {
        ShoppingList.forEach(function (item, index) {
            //substract stock unit
            Db.DbConnection.update({
                In: 'Stock',
                Where: {
                    ItemId: item.ItemId
                },
                Set: {
                    Unit: {
                        '-': item.Quantity
                    }
                },
                OnSuccess: function (rowsUpdated) {
                    if (rowsUpdated <= 0) {
                        JsStore.stopExecution();
                    }
                },
                OnError: function (error) {
                    JsStore.stopExecution();
                    console.log(error);
                    DialogBox.alert('Error Occured');
                }
            }).
            insert({
                Into: 'OrderDetail',
                Values: [item]
            }, function (rowsInserted) {
                if (rowsInserted > 0) {
                    if (index + 1 == Length) {
                        window.location.href = "print.html?order_id=" + orderId;
                    }
                } else {
                    //this will stop further code execution
                    JsStore.stopExecution();
                    DialogBox.alert('Error Occured');
                }
            }, function (error) {
                JsStore.stopExecution();
                console.log(error);
                DialogBox.alert('Error Occured');
            })
        });
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