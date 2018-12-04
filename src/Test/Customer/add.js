onPageLoaded = function () {
    var Email = getQsValueByName('email');
    if (Email != null) {
        $('#txtEmail').focus().val(Email);
    }
}

function save() {
    var CustomerName = $('#txtName'),
        ContactName = $('#txtCName'),
        CustomerEmail = $('#txtEmail'),
        Address = $('#txtAddress'),
        City = $('#txtCity'),
        PostalCode = $('#txtPostalCode'),
        Country = $('#txtCountry')

    Validator.startValidation();
    if (Validator.isInvalid(CustomerName.val())) {
        CustomerName.addClass('invalid').next().attr('data-error', Validator.ErrMsg);
    } else if (ContactName.val().length == 0) {
        ContactName.val(CustomerName.val().split(' ')[0])
    }
    if (Validator.isInvalid(CustomerEmail.val(), {
            Type: 'email'
        })) {
        CustomerEmail.addClass('invalid').next().attr('data-error', Validator.ErrMsg);
    }
    if (Validator.isInvalid(Address.val())) {
        Address.addClass('invalid').next().attr('data-error', Validator.ErrMsg);
    }
    if (Validator.isInvalid(City.val())) {
        City.addClass('invalid').next().attr('data-error', Validator.ErrMsg);
    }
    if (Validator.isInvalid(PostalCode.val())) {
        PostalCode.addClass('invalid').next().attr('data-error', Validator.ErrMsg);
    }
    if (Validator.isInvalid(Country.val())) {
        Country.addClass('invalid').next().attr('data-error', Validator.ErrMsg);
    }

    if (!Validator.IsAnyError) {
        var Value = {
            CustomerName: CustomerName.val(),
            ContactName: ContactName.val(),
            Email: CustomerEmail.val(),
            Address: Address.val(),
            City: City.val(),
            PostalCode: PostalCode.val(),
            Country: Country.val()
        };
        Db.DbConnection.insert({
            Into: "Customer",
            Values: [Value]
        }, function (rowsCount) {
            if (rowsCount > 0) {
                DialogBox.alert('Successfully Added');
                if (getQsValueByName('email') != null) {
                    window.location.href = "../index.html?email=" + CustomerEmail.val();
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