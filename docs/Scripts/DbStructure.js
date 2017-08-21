var Db = {
    DbConnection: null,
    initiate: function (callBack) {
        var DbName = 'Shop',
            That = this;
        JsStore.isDbExist(DbName, function (isExist) {
            if (isExist) {
                That.DbConnection = new JsStore.Instance(DbName);
            } else {
                That.DbConnection = new JsStore.Instance().createDb(getDbStructure());
            }
            callBack();
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
                    Name: "Quantity",
                    NotNull: true,
                    DataType: 'number'
                }
            ]

        },
        Customer = {
            Name: "Customer",
            Columns: [{
                Name: "CustomerId",
                PrimaryKey: true,
                AutoIncrement: true,
                DataType: 'number'
            }, {
                Name: "CustomerName",
                NotNull: true,
                DataType: 'string'
            }, {
                Name: "Dob",
                DataType: 'string'
            }, {
                Name: "Email",
                Unique: true,
                DataType: 'string'
            }]
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
                Default: new Date().toDateString(),
                NotNull: true,
                DataType: 'string'
            }],
            Version: 1
        },
        DataBase = {
            Name: "Shop",
            Tables: [Stock, Customer, OrderDetail, Order]
        }
    return DataBase;
}