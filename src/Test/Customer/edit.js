function onPageLoaded() {
    getCustomerDetail(Number(getQsValueByName('id')))
}

function getCustomerDetail(id) {
    Db.DbConnection.select({
        From: 'Customer',
        Where: {
            CustomerID: id
        }
    }, function (customer) {
        $('#txtName').val(customer[0].CustomerName);
        $('#txtCName').val(customer[0].ContactName);
        $('#txtEmail').val(customer[0].Email);
        $('#txtAddress').val(customer[0].Address);
        $('#txtCity').val(customer[0].City);
        $('#txtPostalCode').val(customer[0].PostalCode);
        $('#txtCountry').val(customer[0].Country);
    }, function (error) {
        console.log(error);
        alert('Error Occured');
    })
}

function update() {
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
        Db.DbConnection.update({
            In: "Customer",
            Set: Value,
            Where: {
                CustomerID: Number(getQsValueByName('id'))
            }
        }, function (rowsCount) {
            if (rowsCount > 0) {
                DialogBox.alert('Successfully Updated');
                window.location.href = 'index.html'
            }
        }, function (error) {
            if (error) {
                DialogBox.alert('Error Occured');
            }
            console.log(error);
        })
    }
}