var TableInsertCount = 0,
    NoofTables = 0,
    Db = {
        DbConnection: null,
        initiate: function (callBack) {
            var DbName = 'Shop',
                That = this;
            JsStore.isDbExist({
                DbName: DbName,
                Table: {
                    Name: 'Order',
                    Version: 2
                }
            }, function (isExist) {
                if (isExist) {
                    console.log('Db exist');
                    That.DbConnection = new JsStore.Instance(DbName);
                } else {
                    console.log('Db not exist');
                    createModal('Please wait - we are configuring editor for first use.');
                    setStatusMsg('Creating Database');
                    That.DbConnection = new JsStore.Instance().createDb(getDbStructure(), function (tablesCreated) {
                        insertIntoDb(tablesCreated);
                    });
                }
                callBack();
            }, function (err) {
                alert(err);
            });
        },
        deleteDb: function () {
            if (this.DbConnection != null) {
                this.DbConnection.dropDb(function () {
                    console.log('Db deleted successfully')
                }, function (err) {
                    console.log('Error occured:' + err);
                });
            }
        }
    }

function getDbStructure() {
    var Stock = {
            Name: "Stock",
            Columns: [{
                    Name: "ItemId",
                    PrimaryKey: true,
                    AutoIncrement: true,
                    DataType: 'number'
                },
                {
                    Name: "ItemName",
                    NotNull: true,
                    DataType: 'string'
                },
                {
                    Name: "Price",
                    NotNull: true,
                    DataType: 'number'
                },
                {
                    Name: "Unit",
                    NotNull: true,
                    DataType: 'number'
                }
            ]

        },
        Customer = {
            Name: "Customer",
            Columns: [{
                    Name: "CustomerID",
                    PrimaryKey: true,
                    AutoIncrement: true,
                    DataType: 'number'
                }, {
                    Name: "CustomerName",
                    NotNull: true,
                    DataType: 'string'
                }, {
                    Name: "ContactName",
                    DataType: 'string'
                }, {
                    Name: "Email",
                    Unique: true,
                    DataType: 'string'
                },
                {
                    Name: 'Address',
                    DataType: 'string'
                },
                {
                    Name: 'City',
                    DataType: 'string'
                }, {
                    Name: 'PostalCode',
                    DataType: 'string'
                },
                {
                    Name: 'Country',
                    DataType: 'string'
                }
            ],
            Version: 2
        },
        OrderDetail = {
            Name: "OrderDetail",
            Columns: [{
                Name: "Id",
                PrimaryKey: true,
                AutoIncrement: true,
                DataType: 'number'
            }, {
                Name: "ItemId",
                NotNull: true,
                DataType: 'number'
            }, {
                Name: "OrderId",
                NotNull: true,
                DataType: 'number'
            }, {
                Name: "Quantity",
                NotNull: true,
                DataType: 'number'
            }],
            Version: 1
        },
        Order = {
            Name: "Order",
            Columns: [{
                Name: "OrderId",
                PrimaryKey: true,
                AutoIncrement: true,
                DataType: 'number'
            }, {
                Name: "CustomerId",
                NotNull: true,
                DataType: 'number'
            }, {
                Name: "Total",
                NotNull: true,
                DataType: 'number'
            }, {
                Name: "Date",
                NotNull: true,
                DataType: 'string'
            }],
            Version: 2
        },
        DataBase = {
            Name: "Shop",
            Tables: [Stock, Customer, OrderDetail, Order]
        }
    return DataBase;
}

function insertCustomers(fileUrl) {
    $.getJSON(fileUrl, function (results) {
        setStatusMsg('Inserting data into table Customers');
        Db.DbConnection.insert({
            Into: 'Customer',
            Values: results,
            OnSuccess: function (rowsInserted) {
                var Msg = rowsInserted + " rows inserted for table customers";
                console.log(Msg);
                setStatusMsg(Msg);
                onDataInserted();
            },
            OnError: function (err) {
                debugger;
            }
        })
    })
}

function insertProducts(fileUrl) {
    $.getJSON(fileUrl, function (results) {
        setStatusMsg('Inserting data into table Products');
        Db.DbConnection.insert({
            Into: 'Stock',
            Values: results,
            OnSuccess: function (rowsInserted) {
                var Msg = rowsInserted + " rows inserted for table Products";
                console.log(Msg);
                setStatusMsg(Msg);
                onDataInserted();
            }
        })
    })
}

function onDataInserted() {
    ++TableInsertCount;
    if (TableInsertCount == NoofTables) {
        setStatusMsg('All data inserted');
        DialogBox.closeModal();
        window.location.reload();
    }
}

function insertIntoDb(tablesCreated) {
    if (typeof IsIndex != 'undefined' && IsIndex) {
        if (tablesCreated.indexOf('Customer') >= 0) {
            ++NoofTables;
            insertCustomers("Customer/Customers.json");
        }
        if (tablesCreated.indexOf('Stock') >= 0) {
            ++NoofTables;
            insertProducts("Stock/Stocks.json");
        }
    } else {
        if (tablesCreated.indexOf('Customer') >= 0) {
            ++NoofTables;
            insertCustomers("../Customer/Customers.json");
        }
        if (tablesCreated.indexOf('Stock') >= 0) {
            ++NoofTables;
            insertProducts("../Stock/Stocks.json");
        }
    }
    if (NoofTables.length > 0) {
        DialogBox.closeModal();
    }
}

function setStatusMsg(msg) {
    $('#spanStatusMsg').text(msg);
}

function createModal(Msg) {
    DialogBox.create({
        Content: {
            Label: '<span>' + Msg + '</span>' +
                '<div class="divider margin-top-20px"></div>' +
                '<div class="margin-top-20px"><b>Status : </b><span id="spanStatusMsg"></span></div>'
        }
    });
}