onPageLoaded = function () {
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 100, // Creates a dropdown of 15 years to control year,
        format: 'yyyy-mm-dd'
    });
    var Email = getQsValueByName('email');
    if (Email != null) {
        $('#txtEmail').focus().val(Email);
    }
}

function save() {
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
        Db.DbConnection.insert({
            Into: "Customer",
            Values: [Value]
        }, function (rowsCount) {
            if (rowsCount > 0) {
                DialogBox.alert('Successfully Added');
                if (getQsValueByName('email') != null) {
                    window.location.href = "../index.html?email=" + ECustomerEmail.val();
                }
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