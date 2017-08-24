function onPageLoaded() {
    getCustomerDetail(Number(getQsValueByName('id')))
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 100 // Creates a dropdown of 15 years to control year
    });
}

function getCustomerDetail(id) {
    Db.DbConnection.select({
        From: 'Customer',
        Where: {
            CustomerId: id
        }
    }, function (customer) {
        $('#txtName').val(customer[0].CustomerName);
        $('#txtDob').val(customer[0].Dob);
        $('#txtEmail').val(customer[0].Email);
    }, function (error) {
        console.log(error);
        alert('Error Occured');
    })
}

function update() {
    var ECustomerName = $('#txtName'),
        ECustomerDob = $('#txtDob'),
        ECustomerEmail = $('#txtEmail');
    Validator.startValidation();
    if (Validator.isInvalid(ECustomerName.val())) {
        ECustomerName.addClass('invalid').next().attr('data-error', Validator.ErrMsg);
    }
    if (Validator.isInvalid(ECustomerDob.val())) {
        ECustomerDob.addClass('invalid').next().attr('data-error', Validator.ErrMsg);
    }   
    if (Validator.isInvalid(ECustomerEmail.val(), {
            Type: 'email'
        })) {
        ECustomerEmail.addClass('invalid').next().attr('data-error', Validator.ErrMsg);
    }

    if (!Validator.IsAnyError) {
        var Value = {
            CustomerName: ECustomerName.val(),
            Email: ECustomerEmail.val(),
            Dob: ECustomerDob.val()
        };
        Db.DbConnection.update({
            In: "Customer",
            Set: Value,
            Where: {
                CustomerId: Number(getQsValueByName('id'))
            }
        }, function (rowsCount) {
            if (rowsCount > 0) {
                DialogBox.alert('Successfully Updated');
                window.location.href='index.html'
            }
        }, function (error) {
            if (error) {
                DialogBox.alert('Error Occured');
            }
            console.log(error);
        })
    }
}