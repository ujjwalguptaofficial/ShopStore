var Db = {
    DbConnection: null,
    Initiate: function () {
        this.DbConnection = new JsStore.Instance().createDb(this.getDbStructure());
    },
    deleteDb: function () {
        if (this.DbConnection != null) {
            this.DbConnection.dropDb(function () {
                console.log('Db deleted successfully')
            }, function (err) {
                console.log('Error occured:' + err);
            });
        }
    },
    getDbStructure: function () {
        var TableStock = {
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
            TableCustomer = {
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
                    Name: "MobNo",
                    Unique: true,
                    NotNull: true,
                    DataType: 'number'
                }, {
                    Name: "Email",
                    Unique: true,
                    DataType: 'string'
                }]
            },
            TableBill = {
                Name: "Order",
                Columns: [{
                    Name: "OrderId",
                    PrimaryKey: true,
                    AutoIncrement: true,
                    DataType: 'number'
                }, {
                    Name: "ItemId",
                    NotNull: true,
                    DataType: 'number'
                }, {
                    Name: "ReceiptId",
                    NotNull: true,
                    DataType: 'number'
                }, {
                    Name: "Quantity",
                    NotNull: true,
                    DataType: 'number'
                }],
                Version: 1
            },
            TableReceipt = {
                Name: "Receipt",
                Columns: [{
                    Name: "ReceiptId",
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
                    Name: "PurchaseDate",
                    CurrentDate: true,
                    NotNull: true,
                    DataType: 'object'
                }],
                Version: 1
            },
            DataBase = {
                Name: "Shop",
                Tables: [TableStock, TableCustomer, TableReceipt, TableBill]
            }
        return DataBase;
    }

}