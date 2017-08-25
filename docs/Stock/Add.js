function isInputValid() {
    var EItemName = $('#txtName'),
        EItemPrice = $('#txtPrice'),
        EItemUnit = $('#txtUnit');
    Validator.startValidation();
    if (Validator.isInvalid(EItemName.val())) {
        EItemName.addClass('invalid').next().attr('data-error', Validator.ErrMsg);
    }
    if (Validator.isInvalid(EItemPrice.val(), {
            Type: "number"
        })) {
        EItemPrice.addClass('invalid').next().attr('data-error', Validator.ErrMsg);
    }
    if (Validator.isInvalid(EItemUnit.val(), {
            Type: 'number'
        })) {
        EItemQuantity.addClass('invalid').next().attr('data-error', Validator.ErrMsg);
    }

    if (!Validator.IsAnyError) {
        var Value = {
            ItemName: EItemName.val(),
            Price: Number(EItemPrice.val()),
            Unit: Number(EItemUnit.val())
        };
        Db.DbConnection.insert({
            Into: "Stock",
            Values: [Value]
        }, function (rowsCount) {
            if (rowsCount > 0) {
                DialogBox.alert('Successfully Added');
                $('form')[0].reset();
            }
        }, function (error) {
            if (error) {
                DialogBox.alert('Error Occured');
            }
            console.log(error);
        })
    }
}