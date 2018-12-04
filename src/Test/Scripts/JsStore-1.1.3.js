var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/** JsStore.js - v1.1.3 - 04/09/2017
 * https://github.com/ujjwalguptaofficial/JsStore
 * Copyright (c) 2017 @Ujjwal Gupta; Licensed MIT */ 
var JsStore;
(function (JsStore) {
    var ErrorType;
    (function (ErrorType) {
        ErrorType["UndefinedColumn"] = "undefined_column";
        ErrorType["UndefinedValue"] = "undefined_value";
        ErrorType["UndefinedColumnName"] = "undefined_column_name";
        ErrorType["UndefinedColumnValue"] = "undefined_column_value";
        ErrorType["NotArray"] = "not_array";
        ErrorType["NoValueSupplied"] = "no_value_supplied";
        ErrorType["ColumnNotExist"] = "column_not_exist";
        ErrorType["InvalidOp"] = "invalid_operator";
        ErrorType["NullValue"] = "null_value";
        ErrorType["BadDataType"] = "bad_data_type";
        ErrorType["NextJoinNotExist"] = "next_join_not_exist";
        ErrorType["TableNotExist"] = "table_not_exist";
        ErrorType["DbNotExist"] = "db_not_exist";
    })(ErrorType = JsStore.ErrorType || (JsStore.ErrorType = {}));
    var ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus["Connected"] = "connected";
        ConnectionStatus["Closed"] = "closed";
        ConnectionStatus["NotStarted"] = "not_started";
    })(ConnectionStatus = JsStore.ConnectionStatus || (JsStore.ConnectionStatus = {}));
    var Occurence;
    (function (Occurence) {
        Occurence["First"] = "f";
        Occurence["Last"] = "l";
        Occurence["Any"] = "a";
    })(Occurence = JsStore.Occurence || (JsStore.Occurence = {}));
    ;
    JsStore.EnableLog = false;
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.getError = function (errorType, logError, errorDetail) {
            if (logError === void 0) { logError = false; }
            var Error = {
                Name: errorType,
                Message: ''
            };
            switch (errorType) {
                case JsStore.ErrorType.NotArray:
                    Error.Message = "Supplied value is not an array";
                    break;
                case JsStore.ErrorType.UndefinedColumn:
                    Error.Message = "Column is undefined in Where";
                    break;
                case JsStore.ErrorType.UndefinedValue:
                    Error.Message = "Value is undefined in Where";
                    break;
                case JsStore.ErrorType.UndefinedColumnName:
                    Error.Message = "Column name is undefined";
                    break;
                case JsStore.ErrorType.UndefinedColumnValue:
                    Error.Message = "Column value is undefined";
                    break;
                case JsStore.ErrorType.NoValueSupplied:
                    Error.Message = "No value supplied";
                    break;
                case JsStore.ErrorType.InvalidOp:
                    Error.Message = "Invalid Op Value '" + errorDetail['Op'] + "'";
                    break;
                case JsStore.ErrorType.ColumnNotExist:
                    Error.Message = "Column '" + errorDetail['ColumnName'] + "' does not exist";
                    break;
                case JsStore.ErrorType.NullValue:
                    Error.Message = "Null value is not allowed for column '" + errorDetail['ColumnName'] + "'";
                    break;
                case JsStore.ErrorType.BadDataType:
                    Error.Message = "Supplied value for column '" + errorDetail['ColumnName'] + "' does not have valid type";
                    break;
                case JsStore.ErrorType.NextJoinNotExist:
                    Error.Message = "Next join details not supplied";
                    break;
                case JsStore.ErrorType.TableNotExist:
                    Error.Message = "Table '" + errorDetail['TableName'] + "' does not exist";
                    break;
                case JsStore.ErrorType.DbNotExist:
                    Error.Message = "Database '" + errorDetail['DbName'] + "' does not exist";
                    break;
                default: console.error('the error type is not defined');
            }
            if (logError) {
                console.error("JsStore Error :- " + Error.Message);
            }
            return Error;
        };
        Utils.convertObjectintoLowerCase = function (obj) {
            var keys = Object.keys(obj);
            var n = keys.length;
            while (n--) {
                var key = keys[n];
                obj[key.toLowerCase()] = obj[key];
                delete obj[key];
            }
        };
        /**
         * determine and set the DataBase Type
         *
         *
         * @memberOf MainLogic
         */
        Utils.setDbType = function () {
            self.indexedDB = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;
            if (indexedDB) {
                self.IDBTransaction = self.IDBTransaction || self.webkitIDBTransaction || self.msIDBTransaction;
                self.IDBKeyRange = self.IDBKeyRange || self.webkitIDBKeyRange || self.msIDBKeyRange;
            }
            else {
                throw 'Your browser doesnot support IndexedDb';
            }
        };
        return Utils;
    }());
    JsStore.Utils = Utils;
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    /**
    * checks whether db exist or not
    *
    * @param {string} dbName
    * @param {Function} callback
    */
    JsStore.isDbExist = function (dbInfo, callback) {
        var DbName;
        if (typeof dbInfo == 'string') {
            JsStore.getDbVersion(dbInfo, function (dbVersion) {
                callback(Boolean(dbVersion));
            });
        }
        else {
            JsStore.getDbVersion(dbInfo.DbName, function (dbVersion) {
                callback(dbInfo.Table.Version <= dbVersion);
            });
        }
    };
    /**
    * get Db Version
    *
    * @param {string} dbName
    * @param {Function} callback
    */
    JsStore.getDbVersion = function (dbName, callback) {
        KeyStore.get("JsStore_" + dbName + '_Db_Version', function (dbVersion) {
            callback(Number(dbVersion));
        });
    };
    /**
    * get Database Schema
    *
    * @param {string} dbName
    * @param {Function} callback
    */
    JsStore.getDbSchema = function (dbName, callback) {
        if (callback) {
            KeyStore.get("JsStore_" + dbName + "_Schema", function (result) {
                callback(result);
            });
        }
    };
    /**
    * check value null or not
    *
    * @param {any} value
    * @returns
    */
    JsStore.isNull = function (value) {
        if (value == null) {
            return true;
        }
        else {
            switch (typeof value) {
                case 'string': return value.length == 0;
                case 'number': return isNaN(value);
            }
        }
        return false;
    };
    /**
    * Enable log
    *
    */
    JsStore.enableLog = function () {
        JsStore.EnableLog = true;
    };
    /**
    * disable log
    *
    */
    JsStore.disableLog = function () {
        JsStore.EnableLog = false;
    };
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Model;
    (function (Model) {
        var Column = (function () {
            function Column(key, tableName) {
                if (key.Name != null) {
                    this.Name = key.Name;
                }
                else {
                    throw "Column Name is not defined for table:" + tableName;
                }
                this.AutoIncrement = key.AutoIncrement != null ? key.AutoIncrement : false;
                this.PrimaryKey = key.PrimaryKey != null ? key.PrimaryKey : false;
                this.Unique = key.Unique != null ? key.Unique : false;
                this.NotNull = key.NotNull != null ? key.NotNull : false;
                this.DataType = key.DataType != null ? key.DataType : '';
                this.Default = key.Default;
            }
            return Column;
        }());
        Model.Column = Column;
    })(Model = JsStore.Model || (JsStore.Model = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Model;
    (function (Model) {
        var Table = (function () {
            function Table(table, dbName) {
                this.Name = "";
                this.Columns = [];
                //internal Members
                this.RequireDelete = false;
                this.RequireCreation = false;
                this.PrimaryKey = "";
                this.Name = table.Name;
                this.Version = table.Version == undefined ? 1 : table.Version;
                var That = this;
                table.Columns.forEach(function (item) {
                    That.Columns.push(new Model.Column(item, table.Name));
                });
                this.setRequireDelete(dbName);
                this.setDbVersion(dbName);
                this.setPrimaryKey(dbName);
            }
            //private methods
            Table.prototype.setPrimaryKey = function (dbName) {
                var That = this;
                this.Columns.forEach(function (item) {
                    if (item.PrimaryKey) {
                        That.PrimaryKey = item.Name;
                    }
                });
            };
            Table.prototype.setRequireDelete = function (dbName) {
                var That = this;
                KeyStore.get("JsStore_" + dbName + "_" + this.Name + "_Version", function (tableVersion) {
                    if (tableVersion == null) {
                        That.RequireCreation = true;
                    }
                    else if (tableVersion != That.Version) {
                        That.RequireDelete = true;
                    }
                });
            };
            Table.prototype.setDbVersion = function (dbName) {
                var That = this;
                JsStore.DbVersion = JsStore.DbVersion ? (JsStore.DbVersion > That.Version ? JsStore.DbVersion : That.Version) : That.Version;
                //setting db version
                KeyStore.set('JsStore_' + dbName + '_Db_Version', JsStore.DbVersion)
                    .set("JsStore_" + dbName + "_" + That.Name + "_Version", JsStore.DbVersion);
                That.Version = JsStore.DbVersion;
            };
            return Table;
        }());
        Model.Table = Table;
    })(Model = JsStore.Model || (JsStore.Model = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Model;
    (function (Model) {
        var DataBase = (function () {
            function DataBase(dataBase) {
                this.Tables = [];
                var That = this;
                this.Name = dataBase.Name;
                dataBase.Tables.forEach(function (item) {
                    That.Tables.push(new Model.Table(item, That.Name));
                });
            }
            return DataBase;
        }());
        Model.DataBase = DataBase;
    })(Model = JsStore.Model || (JsStore.Model = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Base = (function () {
            function Base() {
                this.ErrorOccured = false;
                this.ErrorCount = 0;
                this.RowAffected = 0;
                this.onErrorOccured = function (e, customError) {
                    if (customError === void 0) { customError = false; }
                    ++this.ErrorCount;
                    if (this.ErrorCount == 1) {
                        if (this.OnError != null) {
                            if (!customError) {
                                var Error = {
                                    Name: e.target.error.name,
                                    Message: e.target.error.message
                                };
                                this.OnError(Error);
                            }
                            else {
                                this.OnError(e);
                            }
                            if (JsStore.EnableLog) {
                                console.error(Error);
                            }
                        }
                    }
                };
                this.onTransactionTimeout = function (e) {
                    console.log('transaction timed out');
                };
                this.onExceptionOccured = function (ex, info) {
                    switch (ex.name) {
                        case 'NotFoundError':
                            var Error = JsStore.Utils.getError(JsStore.ErrorType.TableNotExist, false, info);
                            throw Error;
                        default: console.error(ex);
                    }
                };
                this.getTable = function (tableName) {
                    var CurrentTable, That = this;
                    Business.ActiveDataBase.Tables.every(function (table) {
                        if (table.Name == tableName) {
                            CurrentTable = table;
                            return false;
                        }
                        return true;
                    });
                    return CurrentTable;
                };
                this.getKeyRange = function (value, op) {
                    var KeyRange;
                    switch (op) {
                        case '-':
                            KeyRange = IDBKeyRange.bound(value.Low, value.High, false, false);
                            break;
                        case '>':
                            KeyRange = IDBKeyRange.lowerBound(value, true);
                            break;
                        case '>=':
                            KeyRange = IDBKeyRange.lowerBound(value);
                            break;
                        case '<':
                            KeyRange = IDBKeyRange.upperBound(value, true);
                            break;
                        case '<=':
                            KeyRange = IDBKeyRange.upperBound(value);
                            break;
                        default:
                            KeyRange = IDBKeyRange.only(value);
                            break;
                    }
                    return KeyRange;
                };
            }
            /**
            * For matching the different column value existance
            *
            * @private
            * @param {any} where
            * @param {any} value
            * @returns
            *
            * @memberOf SelectLogic
            */
            Base.prototype.checkForWhereConditionMatch = function (rowValue) {
                var Where = this.Query.Where, Status = true;
                var checkIn = function (column, value) {
                    var Values = Where[column].In;
                    for (var i = 0, length = Values.length; i < length; i++) {
                        if (Values[i] == value) {
                            Status = true;
                            break;
                        }
                        else {
                            Status = false;
                        }
                    }
                    ;
                }, checkLike = function (column, value) {
                    var Values = Where[column].Like.split('%'), CompSymbol, CompValue, SymbolIndex;
                    if (Values[1]) {
                        CompValue = Values[1];
                        CompSymbol = Values.length > 2 ? JsStore.Occurence.Any : JsStore.Occurence.Last;
                    }
                    else {
                        CompValue = Values[0];
                        CompSymbol = JsStore.Occurence.First;
                    }
                    value = value.toLowerCase();
                    SymbolIndex = value.indexOf(CompValue.toLowerCase());
                    switch (CompSymbol) {
                        case JsStore.Occurence.Any:
                            if (SymbolIndex < 0) {
                                Status = false;
                            }
                            ;
                            break;
                        case JsStore.Occurence.First:
                            if (SymbolIndex > 0 || SymbolIndex < 0) {
                                Status = false;
                            }
                            ;
                            break;
                        default:
                            if (SymbolIndex(CompValue) < value.length - 1) {
                                Status = false;
                            }
                            ;
                    }
                }, checkComparisionOp = function (column, value, symbol) {
                    var CompareValue = Where[column][symbol];
                    switch (symbol) {
                        //greater than
                        case '>':
                            if (CompareValue <= value) {
                                Status = false;
                            }
                            ;
                            break;
                        //less than
                        case '<':
                            if (CompareValue >= value) {
                                Status = false;
                            }
                            ;
                            break;
                        //less than equal
                        case '<=':
                            if (value > CompareValue) {
                                Status = false;
                            }
                            ;
                            break;
                        //greather than equal
                        case '>=':
                            if (value < CompareValue) {
                                Status = false;
                            }
                            ;
                            break;
                        //between
                        case '-':
                            if (value < CompareValue.Low || value > CompareValue.High) {
                                Status = false;
                            }
                            ;
                            break;
                    }
                };
                for (var Column in Where) {
                    var ColumnValue = Where[Column];
                    if (Status) {
                        var CompareValue = rowValue[Column];
                        if (typeof ColumnValue == 'string' && ColumnValue != CompareValue) {
                            Status = false;
                        }
                        else {
                            for (var key in ColumnValue) {
                                if (Status) {
                                    switch (key) {
                                        case 'In':
                                            checkIn(Column, rowValue[Column]);
                                            break;
                                        case 'Like':
                                            checkLike(Column, rowValue[Column]);
                                            break;
                                        case '-':
                                        case '>':
                                        case '<':
                                        case '>=':
                                        case '<=':
                                            checkComparisionOp(Column, rowValue[Column], key);
                                            break;
                                    }
                                }
                                else {
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        break;
                    }
                }
                return Status;
            };
            return Base;
        }());
        Business.Base = Base;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var CreateDb = (function () {
            function CreateDb(dbVersion, onSuccess, onError) {
                var That = this, DbRequest = indexedDB.open(Business.ActiveDataBase.Name, dbVersion);
                DbRequest.onerror = function (event) {
                    if (onError != null) {
                        onError(event.target.error);
                    }
                };
                DbRequest.onsuccess = function (event) {
                    Business.Status.ConStatus = JsStore.ConnectionStatus.Connected;
                    Business.DbConnection = DbRequest.result;
                    Business.DbConnection.onclose = function () {
                        Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                        Business.Status.LastError = "Connection Closed";
                    };
                    Business.DbConnection.onversionchange = function (e) {
                        if (e.newVersion === null) {
                            e.target.close(); // Manually close our connection to the db
                        }
                    };
                    Business.DbConnection.onerror = function (e) {
                        Business.Status.LastError = "Error occured in connection :" + e.target.result;
                    };
                    Business.DbConnection.onabort = function (e) {
                        Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                        Business.Status.LastError = "Connection aborted";
                    };
                    if (onSuccess != null) {
                        onSuccess();
                    }
                    //save dbSchema in keystore
                    KeyStore.set("JsStore_" + Business.ActiveDataBase.Name + "_Schema", Business.ActiveDataBase);
                };
                DbRequest.onupgradeneeded = function (event) {
                    var db = event.target.result;
                    Business.ActiveDataBase.Tables.forEach(function (item) {
                        if (item.RequireDelete) {
                            // Delete the old datastore.    
                            if (db.objectStoreNames.contains(item.Name)) {
                                db.deleteObjectStore(item.Name);
                            }
                            createObjectStore(db, item);
                        }
                        else if (item.RequireCreation) {
                            createObjectStore(db, item);
                        }
                    });
                };
                var createObjectStore = function (dbConnection, item) {
                    try {
                        if (item.PrimaryKey.length > 0) {
                            var Store = dbConnection.createObjectStore(item.Name, {
                                keyPath: item.PrimaryKey
                            });
                            item.Columns.forEach(function (column) {
                                if (column.PrimaryKey) {
                                    Store.createIndex(column.Name, column.Name, { unique: true });
                                }
                                else {
                                    Store.createIndex(column.Name, column.Name, { unique: column.Unique });
                                }
                                if (column.AutoIncrement) {
                                    KeyStore.set("JsStore_" + Business.ActiveDataBase.Name + "_" + item.Name + "_" + column.Name + "_Value", 0);
                                }
                            });
                        }
                        else {
                            var Store = dbConnection.createObjectStore(item.Name, {
                                autoIncrement: true
                            });
                            item.Columns.forEach(function (column) {
                                Store.createIndex(column.Name, column.Name, { unique: column.Unique });
                                if (column.AutoIncrement) {
                                    KeyStore.set("JsStore_" + Business.ActiveDataBase.Name + "_" + item.Name + "_" + column.Name + "_Value", 0);
                                }
                            });
                        }
                        //setting the table version
                        KeyStore.set("JsStore_" + Business.ActiveDataBase.Name + "_" + item.Name + "_Version", item.Version);
                    }
                    catch (e) {
                        console.error(e);
                    }
                };
            }
            return CreateDb;
        }());
        Business.CreateDb = CreateDb;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var DropDb = (function () {
            function DropDb(name, onSuccess, onError) {
                var DbDropRequest = indexedDB.deleteDatabase(name);
                DbDropRequest.onblocked = function () {
                    if (onError != null) {
                        onError("delete database is in progress");
                    }
                    ;
                };
                DbDropRequest.onerror = function (e) {
                    if (onError != null) {
                        onError(event.target.error);
                    }
                };
                DbDropRequest.onsuccess = function () {
                    Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                    KeyStore.remove('JsStore_' + Business.ActiveDataBase.Name + '_Db_Version');
                    Business.ActiveDataBase.Tables.forEach(function (table) {
                        KeyStore.remove("JsStore_" + Business.ActiveDataBase.Name + "_" + table.Name + "_Version");
                        table.Columns.forEach(function (column) {
                            if (column.AutoIncrement) {
                                KeyStore.remove("JsStore_" + Business.ActiveDataBase.Name + "_" + table.Name + "_" + column.Name + "_Value");
                            }
                        });
                    });
                    KeyStore.remove("JsStore_" + Business.ActiveDataBase.Name + "_Schema");
                    if (onSuccess != null) {
                        onSuccess();
                    }
                };
            }
            return DropDb;
        }());
        Business.DropDb = DropDb;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Insert = (function (_super) {
            __extends(Insert, _super);
            function Insert(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.ValuesAffected = [];
                _this.ValuesIndex = 0;
                _this.onTransactionCompleted = function () {
                    if (this.OnSuccess != null) {
                        this.OnSuccess(this.Query.Return ? this.ValuesAffected : this.RowAffected);
                    }
                };
                _this.checkAndModifyValues = function (callBack) {
                    var That = this, checkInternal = function (value) {
                        if (value) {
                            That.checkAndModifyValue(value, function () {
                                if (!That.ErrorOccured) {
                                    checkInternal(That.Query.Values[That.ValuesIndex++]);
                                }
                                else {
                                    That.onErrorOccured(That.Error, true);
                                }
                            });
                        }
                        else {
                            callBack();
                        }
                    };
                    checkInternal(this.Query.Values[this.ValuesIndex++]);
                };
                _this.insertData = function () {
                    var That = this, IsReturn = this.Query.Return, insertDataintoTable = function (value) {
                        if (value) {
                            var AddResult = That.ObjectStore.add(value);
                            AddResult.onerror = function (e) {
                                That.onErrorOccured(e);
                            };
                            AddResult.onsuccess = function (e) {
                                if (IsReturn) {
                                    That.ValuesAffected.push(value);
                                }
                                else {
                                    ++That.RowAffected;
                                }
                                insertDataintoTable(That.Query.Values[That.ValuesIndex++]);
                            };
                        }
                    };
                    That.ValuesIndex = 0;
                    That.Transaction = Business.DbConnection.transaction([That.Query.Into], "readwrite");
                    That.ObjectStore = That.Transaction.objectStore(That.Query.Into);
                    That.Transaction.oncomplete = function (e) {
                        That.onTransactionCompleted();
                    };
                    insertDataintoTable(this.Query.Values[That.ValuesIndex++]);
                };
                try {
                    _this.Query = query;
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    var That = _this;
                    _this.Table = _this.getTable(query.Into);
                    if (_this.Table) {
                        if (!_this.Query.SkipExtraCheck) {
                            _this.checkAndModifyValues(function () {
                                That.insertData();
                            });
                        }
                        else {
                            _this.insertData();
                        }
                    }
                    else {
                        var Error = JsStore.Utils.getError(JsStore.ErrorType.TableNotExist, false, { TableName: query.Into });
                        throw Error;
                    }
                }
                catch (ex) {
                    _this.onExceptionOccured(ex, { TableName: query.Into });
                }
                return _this;
            }
            /**
             * check the value based on defined schema and modify or create the value
             *
             * @private
             * @param {any} value
             * @param {string} tableName
             *
             * @memberof InsertLogic
             */
            Insert.prototype.checkAndModifyValue = function (value, callBack) {
                var That = this, TableName = this.Table.Name, Index = 0, checkAndModifyInternal = function (column) {
                    if (column) {
                        var CheckNotNullAndDataType = function () {
                            //check not null schema
                            if (column.NotNull && JsStore.isNull(value[column.Name])) {
                                That.ErrorOccured = true;
                                That.Error = JsStore.Utils.getError(JsStore.ErrorType.NullValue, false, { ColumnName: column.Name });
                            }
                            else if (column.DataType && typeof value[column.Name] != column.DataType) {
                                That.ErrorOccured = true;
                                That.Error = JsStore.Utils.getError(JsStore.ErrorType.BadDataType, false, { ColumnName: column.Name });
                            }
                            checkAndModifyInternal(That.Table.Columns[Index++]);
                        };
                        if (!That.ErrorOccured) {
                            //check auto increment scheme
                            if (column.AutoIncrement) {
                                KeyStore.get("JsStore_" + Business.ActiveDataBase.Name + "_" + TableName + "_" + column.Name + "_Value", function (columnValue) {
                                    value[column.Name] = ++columnValue;
                                    KeyStore.set("JsStore_" + Business.ActiveDataBase.Name + "_" + TableName + "_" + column.Name + "_Value", columnValue);
                                    CheckNotNullAndDataType();
                                });
                            }
                            else if (column.Default && value[column.Name] == null) {
                                value[column.Name] = column.Default;
                                CheckNotNullAndDataType();
                            }
                            else {
                                CheckNotNullAndDataType();
                            }
                        }
                        else {
                            callBack();
                        }
                    }
                    else {
                        callBack();
                    }
                };
                checkAndModifyInternal(That.Table.Columns[Index++]);
            };
            return Insert;
        }(Business.Base));
        Business.Insert = Insert;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var OpenDb = (function () {
            function OpenDb(dbVersion, onSuccess, onError) {
                if (Business.ActiveDataBase.Name.length > 0) {
                    var DbRequest = indexedDB.open(Business.ActiveDataBase.Name, dbVersion), That = this;
                    DbRequest.onerror = function (event) {
                        if (onError != null) {
                            onError(event.target.error);
                        }
                    };
                    DbRequest.onsuccess = function (event) {
                        Business.Status.ConStatus = JsStore.ConnectionStatus.Connected;
                        Business.DbConnection = DbRequest.result;
                        Business.DbConnection.onclose = function () {
                            Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                            Business.Status.LastError = "Connection Closed, trying to reconnect";
                        };
                        Business.DbConnection.onversionchange = function (e) {
                            if (e.newVersion === null) {
                                e.target.close(); // Manually close our connection to the db
                            }
                        };
                        Business.DbConnection.onerror = function (e) {
                            Business.Status.LastError = "Error occured in connection :" + e.target.result;
                        };
                        Business.DbConnection.onabort = function (e) {
                            Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                            Business.Status.LastError = "Connection Aborted";
                        };
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                }
                else {
                    if (onError != null) {
                        onError(JsStore.Utils.getError(JsStore.ErrorType.DbNotExist, true, { DbName: Business.ActiveDataBase.Name }));
                    }
                }
            }
            return OpenDb;
        }());
        Business.OpenDb = OpenDb;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Clear = (function (_super) {
            __extends(Clear, _super);
            function Clear(tableName, onSuccess, onError) {
                var _this = _super.call(this) || this;
                var That = _this, ObjectStore = Business.DbConnection.transaction([tableName], "readwrite").objectStore(tableName), ClearRequest = ObjectStore.clear();
                ClearRequest.onsuccess = function (e) {
                    var CurrentTable = That.getTable(tableName);
                    CurrentTable.Columns.forEach(function (column) {
                        if (column.AutoIncrement) {
                            KeyStore.remove("JsStore_" + Business.ActiveDataBase.Name + "_" + tableName + "_" + column.Name + "_Value");
                        }
                    });
                    if (onSuccess != null) {
                        onSuccess();
                    }
                };
                ClearRequest.onerror = function (e) {
                    if (onError != null) {
                        onError();
                    }
                };
                return _this;
            }
            return Clear;
        }(Business.Base));
        Business.Clear = Clear;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        Business.Status = {
            ConStatus: JsStore.ConnectionStatus.NotStarted,
            LastError: ""
        };
        var Main = (function () {
            function Main(onSuccess) {
                if (onSuccess === void 0) { onSuccess = null; }
                this.checkConnectionAndExecuteLogic = function (request) {
                    if (JsStore.EnableLog) {
                        console.log('checking connection and executing request:' + request.Name);
                    }
                    if (request.Name == 'create_db' || request.Name == 'open_db') {
                        this.executeLogic(request);
                    }
                    else {
                        if (Business.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                            this.executeLogic(request);
                        }
                        else if (Business.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                            var That = this;
                            setTimeout(function () {
                                That.checkConnectionAndExecuteLogic(request);
                            }, 50);
                        }
                        else if (Business.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                            var That = this;
                            this.openDb(Business.ActiveDataBase.Name, function () {
                                That.checkConnectionAndExecuteLogic(request);
                            });
                        }
                    }
                };
                this.returnResult = function (result) {
                    if (this.OnSuccess) {
                        this.OnSuccess(result);
                    }
                    else {
                        self.postMessage(result);
                    }
                };
                this.executeLogic = function (request) {
                    var That = this, OnSuccess = function (results) {
                        That.returnResult({
                            ReturnedValue: results
                        });
                    }, OnError = function (err) {
                        That.returnResult({
                            ErrorOccured: true,
                            ErrorDetails: err
                        });
                    };
                    switch (request.Name) {
                        case 'select':
                            this.select(request.Query, OnSuccess, OnError);
                            break;
                        case 'insert':
                            this.insert(request.Query, OnSuccess, OnError);
                            break;
                        case 'update':
                            this.update(request.Query, OnSuccess, OnError);
                            break;
                        case 'delete':
                            this.delete(request.Query, OnSuccess, OnError);
                            break;
                        case 'create_db':
                            this.createDb(request.Query, OnSuccess, OnError);
                            break;
                        case 'clear':
                            this.clear(request.Query, OnSuccess, OnError);
                            break;
                        case 'drop_db':
                            this.dropDb(OnSuccess, OnError);
                            break;
                        case 'count':
                            this.count(request.Query, OnSuccess, OnError);
                            break;
                        case 'open_db':
                            this.openDb(request.Query, OnSuccess, OnError);
                            break;
                    }
                };
                this.openDb = function (dbName, onSuccess, onError) {
                    KeyStore.get("JsStore_" + dbName + '_Db_Version', function (dbVersion) {
                        if (dbVersion != null) {
                            KeyStore.get("JsStore_" + dbName + "_Schema", function (result) {
                                Business.ActiveDataBase = result;
                                new Business.OpenDb(dbVersion, onSuccess, onError);
                            });
                        }
                        else {
                            var Error = JsStore.Utils.getError(JsStore.ErrorType.DbNotExist, true, { DbName: dbName });
                            throw Error;
                        }
                    });
                };
                this.closeDb = function () {
                    if (Business.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                        Business.DbConnection.close();
                    }
                };
                this.dropDb = function (onSuccess, onError) {
                    new Business.DropDb(Business.ActiveDataBase.Name, onSuccess, onError);
                };
                this.update = function (query, onSuccess, onError) {
                    new Business.Update.Instance(query, onSuccess, onError);
                };
                this.insert = function (query, onSuccess, onError) {
                    if (!Array.isArray(query.Values)) {
                        throw "Value should be array :- supplied value is not array";
                    }
                    else if (query.Values.length > 0) {
                        new Business.Insert(query, onSuccess, onError);
                    }
                    else {
                        if (onError != null) {
                            onError(JsStore.Utils.getError(JsStore.ErrorType.NoValueSupplied, true, null));
                        }
                    }
                };
                this.delete = function (query, onSuccess, onError) {
                    new Business.Delete.Instance(query, onSuccess, onError);
                };
                this.select = function (query, onSuccess, onError) {
                    if (typeof query.From === 'object') {
                        new Business.Select.Join(query, onSuccess, onError);
                    }
                    else {
                        new Business.Select.Instance(query, onSuccess, onError);
                    }
                };
                this.count = function (query, onSuccess, onError) {
                    if (typeof query.From === 'object') {
                        query['Count'] = true;
                        new Business.Select.Join(query, onSuccess, onError);
                    }
                    else {
                        new Business.Count.Instance(query, onSuccess, onError);
                    }
                };
                this.createDb = function (dataBase, onSuccess, onError) {
                    var That = this;
                    KeyStore.get("JsStore_" + dataBase.Name + "_Db_Version", function (version) {
                        JsStore.DbVersion = version;
                        Business.ActiveDataBase = new JsStore.Model.DataBase(dataBase);
                        var createDbInternal = function () {
                            setTimeout(function () {
                                var LastTable = Business.ActiveDataBase.Tables[Business.ActiveDataBase.Tables.length - 1];
                                KeyStore.get("JsStore_" + Business.ActiveDataBase.Name + "_" + LastTable.Name + "_Version", function (version) {
                                    if (version == LastTable.Version) {
                                        new Business.CreateDb(JsStore.DbVersion, onSuccess, onError);
                                    }
                                    else {
                                        createDbInternal();
                                    }
                                });
                            }, 200);
                        };
                        createDbInternal();
                    });
                };
                this.clear = function (tableName, onSuccess, onError) {
                    new Business.Clear(tableName, onSuccess, onError);
                };
                this.OnSuccess = onSuccess;
            }
            return Main;
        }());
        Business.Main = Main;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var BaseSelect = (function (_super) {
                __extends(BaseSelect, _super);
                function BaseSelect() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.Results = [];
                    _this.SendResultFlag = true;
                    _this.Sorted = false;
                    return _this;
                }
                return BaseSelect;
            }(Business.Base));
            Select.BaseSelect = BaseSelect;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var NotWhere = (function (_super) {
                __extends(NotWhere, _super);
                function NotWhere() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeWhereUndefinedLogic = function () {
                        var That = this, CursorOpenRequest, executeSkipAndLimit = function () {
                            var RecordSkipped = false;
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    if (RecordSkipped && That.Results.length != That.LimitRecord) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                    else {
                                        RecordSkipped = true;
                                        Cursor.advance(That.SkipRecord);
                                    }
                                }
                            };
                        }, executeSkip = function () {
                            var RecordSkipped = false;
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    if (RecordSkipped) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                    else {
                                        RecordSkipped = true;
                                        Cursor.advance(That.SkipRecord);
                                    }
                                }
                            };
                        }, executeSimple = function () {
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    That.Results.push(Cursor.value);
                                    Cursor.continue();
                                }
                            };
                        }, executeLimit = function () {
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor && That.Results.length != That.LimitRecord) {
                                    That.Results.push(Cursor.value);
                                    Cursor.continue();
                                }
                            };
                        };
                        if (this.Query.Order && this.Query.Order.By) {
                            if (That.ObjectStore.indexNames.contains(this.Query.Order.By)) {
                                var OrderType = this.Query.Order.Type && this.Query.Order.Type.toLowerCase() == 'desc' ? 'prev' : 'next';
                                this.Sorted = true;
                                CursorOpenRequest = this.ObjectStore.index(That.Query.Order.By).openCursor(null, OrderType);
                            }
                            else {
                                JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: this.Query.Order.By });
                                return false;
                            }
                        }
                        else {
                            CursorOpenRequest = this.ObjectStore.openCursor();
                        }
                        if (this.SkipRecord && this.LimitRecord) {
                            executeSkipAndLimit();
                        }
                        else if (this.SkipRecord) {
                            executeSkip();
                        }
                        else if (this.LimitRecord) {
                            executeLimit();
                        }
                        else {
                            executeSimple();
                        }
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    return _this;
                }
                return NotWhere;
            }(Select.BaseSelect));
            Select.NotWhere = NotWhere;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var Like = (function (_super) {
                __extends(Like, _super);
                function Like() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.CheckFlag = false;
                    _this.filterOnOccurence = function (value) {
                        var Found = false, Value = value[this.Column].toLowerCase();
                        switch (this.CompSymbol) {
                            case JsStore.Occurence.Any:
                                if (Value.indexOf(this.CompValue) >= 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            case JsStore.Occurence.First:
                                if (Value.indexOf(this.CompValue) == 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            default:
                                if (Value.lastIndexOf(this.CompValue) == Value.length - 1) {
                                    Found = true;
                                }
                                ;
                        }
                        return Found;
                    };
                    _this.executeSkipAndLimit = function () {
                        var Skip = this.SkipRecord, That = this;
                        this.CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result, skipOrPush = function () {
                                if (Skip == 0) {
                                    That.Results.push(Cursor.value);
                                }
                                else {
                                    --Skip;
                                }
                            };
                            if (That.Results.length != That.LimitRecord && Cursor) {
                                if (!That.CheckFlag && That.filterOnOccurence(Cursor.value)) {
                                    skipOrPush();
                                }
                                else if (That.filterOnOccurence(Cursor.value) &&
                                    That.checkForWhereConditionMatch(Cursor.value)) {
                                    skipOrPush();
                                }
                                Cursor.continue();
                            }
                        };
                    };
                    _this.executeSkip = function () {
                        var Skip = this.SkipRecord, That = this;
                        this.CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result, skipOrPush = function () {
                                if (Skip == 0) {
                                    That.Results.push(Cursor.value);
                                }
                                else {
                                    --Skip;
                                }
                            };
                            if (Cursor) {
                                if (!That.CheckFlag && That.filterOnOccurence(Cursor.value)) {
                                    skipOrPush();
                                }
                                else if (That.filterOnOccurence(Cursor.value) &&
                                    That.checkForWhereConditionMatch(Cursor.value)) {
                                    skipOrPush();
                                }
                                Cursor.continue();
                            }
                        };
                    };
                    _this.executeLimit = function () {
                        var That = this;
                        this.CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (That.Results.length != That.LimitRecord && Cursor) {
                                if (!That.CheckFlag && That.filterOnOccurence(Cursor.value)) {
                                    That.Results.push(Cursor.value);
                                }
                                else if (That.filterOnOccurence(Cursor.value) &&
                                    That.checkForWhereConditionMatch(Cursor.value)) {
                                    That.Results.push(Cursor.value);
                                }
                                Cursor.continue();
                            }
                        };
                    };
                    _this.executeSimple = function () {
                        var That = this;
                        this.CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                if (!That.CheckFlag && That.filterOnOccurence(Cursor.value)) {
                                    That.Results.push(Cursor.value);
                                }
                                else if (That.filterOnOccurence(Cursor.value) &&
                                    That.checkForWhereConditionMatch(Cursor.value)) {
                                    That.Results.push(Cursor.value);
                                }
                                Cursor.continue();
                            }
                        };
                    };
                    _this.executeLikeLogic = function (column, value, symbol) {
                        var That = this;
                        this.CompValue = value.toLowerCase();
                        this.CompSymbol = symbol;
                        this.Column = column;
                        this.CursorOpenRequest = this.ObjectStore.index(column).openCursor();
                        this.CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        if (this.SkipRecord && this.LimitRecord) {
                            this.executeSkipAndLimit();
                        }
                        else if (this.SkipRecord) {
                            this.executeSkip();
                        }
                        else if (this.LimitRecord) {
                            this.executeLimit();
                        }
                        else {
                            this.executeSimple();
                        }
                    };
                    return _this;
                }
                return Like;
            }(Select.NotWhere));
            Select.Like = Like;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var Where = (function (_super) {
                __extends(Where, _super);
                function Where() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeRequest = function (column, value, op) {
                        var That = this, CursorOpenRequest, executeSkipAndLimit = function () {
                            var RecordSkipped = false;
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    if (RecordSkipped && That.Results.length != That.LimitRecord) {
                                        if (!That.CheckFlag) {
                                            That.Results.push(Cursor.value);
                                        }
                                        else if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            That.Results.push(Cursor.value);
                                        }
                                        Cursor.continue();
                                    }
                                    else {
                                        RecordSkipped = true;
                                        Cursor.advance(That.SkipRecord);
                                    }
                                }
                            };
                        }, executeSkip = function () {
                            var RecordSkipped = false;
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    if (RecordSkipped) {
                                        if (!That.CheckFlag) {
                                            That.Results.push(Cursor.value);
                                        }
                                        else if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            That.Results.push(Cursor.value);
                                        }
                                        Cursor.continue();
                                    }
                                    else {
                                        RecordSkipped = true;
                                        Cursor.advance(That.SkipRecord);
                                    }
                                }
                            };
                        }, executeLimit = function () {
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor && That.Results.length != That.LimitRecord) {
                                    if (!That.CheckFlag) {
                                        That.Results.push(Cursor.value);
                                    }
                                    else if (That.checkForWhereConditionMatch(Cursor.value)) {
                                        That.Results.push(Cursor.value);
                                    }
                                    Cursor.continue();
                                }
                            };
                        }, executeSimple = function () {
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    if (!That.CheckFlag) {
                                        That.Results.push(Cursor.value);
                                    }
                                    else if (That.checkForWhereConditionMatch(Cursor.value)) {
                                        That.Results.push(Cursor.value);
                                    }
                                    Cursor.continue();
                                }
                            };
                        };
                        value = op ? value[op] : value;
                        CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));
                        if (this.SkipRecord && this.LimitRecord) {
                            executeSkipAndLimit();
                        }
                        else if (this.SkipRecord) {
                            executeSkip();
                        }
                        else if (this.LimitRecord) {
                            executeLimit();
                        }
                        else {
                            executeSimple();
                        }
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    _this.executeWhereLogic = function () {
                        for (var Column in this.Query.Where) {
                            if (!this.ErrorOccured) {
                                if (this.ObjectStore.indexNames.contains(Column)) {
                                    var Value = this.Query.Where[Column];
                                    if (typeof Value == 'string') {
                                        this.executeRequest(Column, Value);
                                    }
                                    else {
                                        this.CheckFlag = Object.keys(Value).length > 1 || Object.keys(this.Query.Where).length > 1 ? true : false;
                                        if (Value.Like) {
                                            var FilterValue = Value.Like.split('%');
                                            if (FilterValue[1]) {
                                                if (FilterValue.length > 2) {
                                                    this.executeLikeLogic(Column, FilterValue[1], JsStore.Occurence.Any);
                                                }
                                                else {
                                                    this.executeLikeLogic(Column, FilterValue[1], JsStore.Occurence.Last);
                                                }
                                            }
                                            else {
                                                this.executeLikeLogic(Column, FilterValue[0], JsStore.Occurence.First);
                                            }
                                        }
                                        else if (Value['In']) {
                                            for (var i = 0; i < Value['In'].length; i++) {
                                                this.executeRequest(Column, Value['In'][i]);
                                            }
                                        }
                                        else if (Value['-']) {
                                            this.executeRequest(Column, Value, '-');
                                        }
                                        else if (Value['>']) {
                                            this.executeRequest(Column, Value, '>');
                                        }
                                        else if (Value['<']) {
                                            this.executeRequest(Column, Value, '<');
                                        }
                                        else if (Value['>=']) {
                                            this.executeRequest(Column, Value, '>=');
                                        }
                                        else if (Value['<=']) {
                                            this.executeRequest(Column, Value, '<=');
                                        }
                                        else {
                                            this.executeRequest(Column, Value);
                                        }
                                    }
                                }
                                else {
                                    this.ErrorOccured = true;
                                    this.Error = JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                    this.onErrorOccured(this.Error, true);
                                }
                            }
                            break;
                        }
                    };
                    return _this;
                }
                return Where;
            }(Select.Like));
            Select.Where = Where;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var Join = (function (_super) {
                __extends(Join, _super);
                function Join(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.QueryStack = [];
                    _this.CurrentQueryStackIndex = 0;
                    _this.onTransactionCompleted = function (e) {
                        if (this.OnSuccess != null && (this.QueryStack.length == this.CurrentQueryStackIndex + 1)) {
                            if (this.Query['Count']) {
                                this.OnSuccess(this.Results.length);
                            }
                            else {
                                if (this.Query['Skip'] && this.Query['Limit']) {
                                    this.Results.splice(0, this.Query['Skip']);
                                    this.Results.splice(this.Query['Limit'] - 1, this.Results.length);
                                }
                                else if (this.Query['Skip']) {
                                    this.Results.splice(0, this.Query['Skip']);
                                }
                                else if (this.Query['Limit']) {
                                    this.Results.splice(this.Query['Limit'] - 1, this.Results.length);
                                }
                                this.OnSuccess(this.Results);
                            }
                        }
                    };
                    _this.executeWhereJoinLogic = function (joinQuery, query) {
                        var That = this, Results = [], JoinIndex = 0, Column = query.Column, TmpResults = That.Results, Item, ResultLength = TmpResults.length;
                        //get the data from query table
                        new Select.Instance({
                            From: query.Table,
                            Where: query.Where,
                            Order: query.Order
                        }, function (results) {
                            //perform join
                            results.forEach(function (value, index) {
                                //search item through each global result
                                for (var i = 0; i < ResultLength; i++) {
                                    Item = TmpResults[i][joinQuery.Table][joinQuery.Column];
                                    //if (Item == value[query.Column]) {
                                    doJoin(Item, value, i);
                                    //}
                                }
                            });
                            That.Results = Results;
                            //check if further execution needed
                            if (That.QueryStack.length > That.CurrentQueryStackIndex + 1) {
                                That.startExecutionJoinLogic();
                            }
                            else {
                                That.onTransactionCompleted(null);
                            }
                        }, function (error) {
                            That.onErrorOccured(error);
                        });
                        var doJoin = function (value1, value2, itemIndex) {
                            Results[JoinIndex] = {};
                            if (value1 == value2[query.Column]) {
                                Results[JoinIndex][query.Table] = value2;
                                //copy other relative data into current result
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[itemIndex][That.QueryStack[j].Table];
                                }
                                ++JoinIndex;
                            }
                            else if (query.JoinType == 'left') {
                                //left join
                                Results[JoinIndex] = {};
                                Results[JoinIndex][query.Table] = null;
                                //copy other relative data into current result
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[itemIndex][That.QueryStack[j].Table];
                                }
                                //Results[JoinIndex][joinQuery.Table] = TmpResults[ItemIndex][joinQuery.Table];
                                ++JoinIndex;
                            }
                        };
                    };
                    _this.executeRightJoin = function (joinQuery, query) {
                        var That = this, Results = [], JoinIndex = 0, Column = query.Column, TmpResults = That.Results, Item, ResultLength = TmpResults.length, ItemIndex = 0, Where = {}, onExecutionFinished = function () {
                            That.Results = Results;
                            //check if further execution needed
                            if (That.QueryStack.length > That.CurrentQueryStackIndex + 1) {
                                That.startExecutionJoinLogic();
                            }
                            else {
                                That.onTransactionCompleted(null);
                            }
                        }, doRightJoin = function (results) {
                            var ValueFound = false;
                            results.forEach(function (item, index) {
                                for (ItemIndex = 0; ItemIndex < ResultLength; ItemIndex++) {
                                    if (item[query.Column] == TmpResults[ItemIndex][joinQuery.Table][joinQuery.Column]) {
                                        ValueFound = true;
                                        break;
                                    }
                                }
                                Results[index] = {};
                                Results[index][query.Table] = item;
                                if (ValueFound) {
                                    ValueFound = false;
                                    for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                        Results[index][That.QueryStack[j].Table] = TmpResults[ItemIndex][That.QueryStack[j].Table];
                                    }
                                }
                                else {
                                    for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                        Results[index][That.QueryStack[j].Table] = null;
                                    }
                                }
                            });
                        }, executeLogic = function () {
                            new Select.Instance({
                                From: query.Table,
                                Where: query.Where,
                                Order: query.Order
                            }, function (results) {
                                doRightJoin(results);
                                onExecutionFinished();
                            }, function (error) {
                                That.ErrorOccured = true;
                                That.onErrorOccured(error);
                            });
                        };
                        executeLogic();
                    };
                    _this.executeWhereUndefinedLogicForJoin = function (joinQuery, query) {
                        var That = this, Results = [], JoinIndex = 0, Column = query.Column, TmpResults = That.Results, Item, ResultLength = TmpResults.length, ItemIndex = 0, Where = {}, onExecutionFinished = function () {
                            That.Results = Results;
                            //check if further execution needed
                            if (That.QueryStack.length > That.CurrentQueryStackIndex + 1) {
                                That.startExecutionJoinLogic();
                            }
                            else {
                                That.onTransactionCompleted(null);
                            }
                        }, doJoin = function (results) {
                            if (results.length > 0) {
                                results.forEach(function (value) {
                                    Results[JoinIndex] = {};
                                    Results[JoinIndex][query.Table] = value;
                                    //copy other relative data into current result
                                    for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                        Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[ItemIndex][That.QueryStack[j].Table];
                                    }
                                    ++JoinIndex;
                                });
                            }
                            else if (query.JoinType == 'left') {
                                //left join
                                Results[JoinIndex] = {};
                                Results[JoinIndex][query.Table] = null;
                                //copy other relative data into current result
                                for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                    Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[ItemIndex][That.QueryStack[j].Table];
                                }
                                //Results[JoinIndex][joinQuery.Table] = TmpResults[ItemIndex][joinQuery.Table];
                                ++JoinIndex;
                            }
                        }, executeLogic = function () {
                            if (ItemIndex < ResultLength) {
                                if (!That.ErrorOccured) {
                                    Where[query.Column] = TmpResults[ItemIndex][joinQuery.Table][joinQuery.Column];
                                    new Select.Instance({
                                        From: query.Table,
                                        Where: Where,
                                        Order: query.Order
                                    }, function (results) {
                                        doJoin(results);
                                        ++ItemIndex;
                                        executeLogic();
                                    }, function (error) {
                                        That.ErrorOccured = true;
                                        That.onErrorOccured(error);
                                    });
                                }
                            }
                            else {
                                onExecutionFinished();
                            }
                        };
                        executeLogic();
                    };
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    _this.Query = query;
                    var That = _this, TableList = []; // used to open the multiple object store
                    var convertQueryIntoStack = function (query) {
                        if (query.hasOwnProperty('Table1')) {
                            query.Table2['JoinType'] = query.Join == undefined ? 'inner' : query.Join.toLowerCase();
                            That.QueryStack.push(query.Table2);
                            if (That.QueryStack.length % 2 == 0) {
                                That.QueryStack[That.QueryStack.length - 1].NextJoin = query.NextJoin;
                            }
                            TableList.push(query.Table2.Table);
                            return convertQueryIntoStack(query.Table1);
                        }
                        else {
                            That.QueryStack.push(query);
                            TableList.push(query.Table);
                            return;
                        }
                    };
                    convertQueryIntoStack(query.From);
                    _this.QueryStack.reverse();
                    //get the data for first table
                    if (!_this.ErrorOccured) {
                        new Select.Instance({
                            From: _this.QueryStack[0].Table,
                            Where: _this.QueryStack[0].Where
                        }, function (results) {
                            var TableName = That.QueryStack[0].Table;
                            results.forEach(function (item, index) {
                                That.Results[index] = {};
                                That.Results[index][TableName] = item;
                            });
                            That.startExecutionJoinLogic();
                        }, function (error) {
                            That.onErrorOccured(error);
                        });
                    }
                    return _this;
                }
                Join.prototype.startExecutionJoinLogic = function () {
                    var JoinQuery;
                    if (this.CurrentQueryStackIndex >= 1 && this.CurrentQueryStackIndex % 2 == 1) {
                        JoinQuery = {
                            Table: this.QueryStack[this.CurrentQueryStackIndex].NextJoin.Table,
                            Column: this.QueryStack[this.CurrentQueryStackIndex].NextJoin.Column
                        };
                        this.CurrentQueryStackIndex++;
                    }
                    else {
                        JoinQuery = this.QueryStack[this.CurrentQueryStackIndex++];
                    }
                    var Query = this.QueryStack[this.CurrentQueryStackIndex];
                    if (Query.JoinType == 'right') {
                        this.executeRightJoin(JoinQuery, Query);
                    }
                    else if (Query.Where) {
                        this.executeWhereJoinLogic(JoinQuery, Query);
                    }
                    else {
                        this.executeWhereUndefinedLogicForJoin(JoinQuery, Query);
                    }
                };
                return Join;
            }(Select.BaseSelect));
            Select.Join = Join;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Select;
        (function (Select) {
            var Instance = (function (_super) {
                __extends(Instance, _super);
                function Instance(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.onTransactionCompleted = function () {
                        var Order = this.Query.Order;
                        if (Order && this.Results.length > 0 && !this.Sorted && Order.By) {
                            Order.Type = Order.Type ? Order.Type.toLowerCase() : 'asc';
                            var That = this, OrderColumn = Order.By, sortNumberInAsc = function () {
                                That.Results.sort(function (a, b) {
                                    return a[OrderColumn] - b[OrderColumn];
                                });
                            }, sortNumberInDesc = function () {
                                That.Results.sort(function (a, b) {
                                    return b[OrderColumn] - a[OrderColumn];
                                });
                            }, sortAlphabetInAsc = function () {
                                That.Results.sort(function (a, b) {
                                    return a[OrderColumn].toLowerCase().localeCompare(b[OrderColumn].toLowerCase());
                                });
                            }, sortAlphabetInDesc = function () {
                                That.Results.sort(function (a, b) {
                                    return b[OrderColumn].toLowerCase().localeCompare(a[OrderColumn].toLowerCase());
                                });
                            };
                            if (typeof this.Results[0][OrderColumn] == 'string') {
                                if (Order.Type == 'asc') {
                                    sortAlphabetInAsc();
                                }
                                else {
                                    sortAlphabetInDesc();
                                }
                            }
                            else if (typeof this.Results[0][OrderColumn] == 'number') {
                                if (Order.Type == 'asc') {
                                    sortNumberInAsc();
                                }
                                else {
                                    sortNumberInDesc();
                                }
                            }
                            if (this.OnSuccess) {
                                this.OnSuccess(this.Results);
                            }
                        }
                        else if (this.SendResultFlag) {
                            if (this.OnSuccess) {
                                this.OnSuccess(this.Results);
                            }
                        }
                    };
                    var That = _this;
                    _this.Query = query;
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    _this.SkipRecord = _this.Query.Skip;
                    _this.LimitRecord = _this.Query.Limit;
                    try {
                        _this.Transaction = Business.DbConnection.transaction([query.From], "readonly");
                        _this.Transaction.oncomplete = function (e) {
                            That.onTransactionCompleted();
                        };
                        _this.Transaction.ontimeout = That.onTransactionCompleted;
                        _this.ObjectStore = _this.Transaction.objectStore(query.From);
                        if (query.Where != undefined) {
                            _this.executeWhereLogic();
                        }
                        else {
                            _this.executeWhereUndefinedLogic();
                        }
                    }
                    catch (ex) {
                        _this.onExceptionOccured(ex, { TableName: query.From });
                    }
                    return _this;
                }
                return Instance;
            }(Select.Where));
            Select.Instance = Instance;
        })(Select = Business.Select || (Business.Select = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Count;
        (function (Count) {
            var BaseCount = (function (_super) {
                __extends(BaseCount, _super);
                function BaseCount() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.ResultCount = 0;
                    _this.SendResultFlag = true;
                    _this.CheckFlag = false;
                    return _this;
                }
                return BaseCount;
            }(Business.Base));
            Count.BaseCount = BaseCount;
        })(Count = Business.Count || (Business.Count = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Count;
        (function (Count) {
            var NotWhere = (function (_super) {
                __extends(NotWhere, _super);
                function NotWhere() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeWhereUndefinedLogic = function () {
                        var That = this, CursorOpenRequest = this.ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                ++That.ResultCount;
                                Cursor.continue();
                            }
                        };
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    return _this;
                }
                return NotWhere;
            }(Count.BaseCount));
            Count.NotWhere = NotWhere;
        })(Count = Business.Count || (Business.Count = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Count;
        (function (Count) {
            var Like = (function (_super) {
                __extends(Like, _super);
                function Like() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.filterOnOccurence = function (value) {
                        var Found = false, Value = value[this.Column].toLowerCase();
                        switch (this.CompSymbol) {
                            case JsStore.Occurence.Any:
                                if (Value.indexOf(this.CompValue) >= 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            case JsStore.Occurence.First:
                                if (Value.indexOf(this.CompValue) == 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            default:
                                if (Value.lastIndexOf(this.CompValue) == Value.length - 1) {
                                    Found = true;
                                }
                                ;
                        }
                        return Found;
                    };
                    _this.executeLikeLogic = function (column, value, symbol) {
                        var That = this;
                        this.CompValue = value.toLowerCase();
                        this.CompSymbol = symbol;
                        this.Column = column;
                        this.CursorOpenRequest = this.ObjectStore.index(column).openCursor();
                        this.CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        this.CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                if (That.filterOnOccurence(Cursor.value) && That.checkForWhereConditionMatch(Cursor.value)) {
                                    ++That.ResultCount;
                                }
                                Cursor.continue();
                            }
                        };
                    };
                    return _this;
                }
                return Like;
            }(Count.NotWhere));
            Count.Like = Like;
        })(Count = Business.Count || (Business.Count = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Count;
        (function (Count) {
            var Where = (function (_super) {
                __extends(Where, _super);
                function Where() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeRequest = function (column, value, op) {
                        var That = this, CursorOpenRequest;
                        value = op ? value[op] : value;
                        CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                if (!That.CheckFlag) {
                                    ++That.ResultCount;
                                }
                                else if (That.checkForWhereConditionMatch(Cursor.value)) {
                                    ++That.ResultCount;
                                }
                                Cursor.continue();
                            }
                        };
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    _this.executeWhereLogic = function () {
                        for (var Column in this.Query.Where) {
                            if (!this.ErrorOccured) {
                                if (this.ObjectStore.indexNames.contains(Column)) {
                                    var Value = this.Query.Where[Column];
                                    if (typeof Value == 'string') {
                                        this.executeRequest(Column, Value);
                                    }
                                    else {
                                        this.CheckFlag = Object.keys(Value).length > 1 || Object.keys(this.Query.Where).length > 1 ? true : false;
                                        if (Value.Like) {
                                            var FilterValue = Value.Like.split('%');
                                            if (FilterValue[1]) {
                                                if (FilterValue.length > 2) {
                                                    this.executeLikeLogic(Column, FilterValue[1], JsStore.Occurence.Any);
                                                }
                                                else {
                                                    this.executeLikeLogic(Column, FilterValue[1], JsStore.Occurence.Last);
                                                }
                                            }
                                            else {
                                                this.executeLikeLogic(Column, FilterValue[0], JsStore.Occurence.First);
                                            }
                                        }
                                        else if (Value['In']) {
                                            for (var i = 0; i < Value['In'].length; i++) {
                                                this.executeRequest(Column, Value['In'][i]);
                                            }
                                        }
                                        else if (Value['-']) {
                                            this.executeRequest(Column, Value, '-');
                                        }
                                        else if (Value['>']) {
                                            this.executeRequest(Column, Value, '>');
                                        }
                                        else if (Value['<']) {
                                            this.executeRequest(Column, Value, '<');
                                        }
                                        else if (Value['>=']) {
                                            this.executeRequest(Column, Value, '>=');
                                        }
                                        else if (Value['<=']) {
                                            this.executeRequest(Column, Value, '<=');
                                        }
                                        else {
                                            this.executeRequest(Column, Value);
                                        }
                                    }
                                }
                                else {
                                    this.ErrorOccured = true;
                                    this.Error = JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                    this.onErrorOccured(this.Error, true);
                                }
                            }
                            break;
                        }
                    };
                    return _this;
                }
                return Where;
            }(Count.Like));
            Count.Where = Where;
        })(Count = Business.Count || (Business.Count = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Count;
        (function (Count) {
            var Instance = (function (_super) {
                __extends(Instance, _super);
                function Instance(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.onTransactionCompleted = function () {
                        if (this.SendResultFlag && this.OnSuccess != null) {
                            this.OnSuccess(this.ResultCount);
                        }
                    };
                    var That = _this;
                    _this.Query = query;
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    try {
                        _this.Transaction = Business.DbConnection.transaction([query.From], "readonly");
                        _this.Transaction.oncomplete = function (e) {
                            That.onTransactionCompleted();
                        };
                        _this.ObjectStore = _this.Transaction.objectStore(query.From);
                        if (query.Where != undefined) {
                            _this.executeWhereLogic();
                        }
                        else {
                            _this.executeWhereUndefinedLogic();
                        }
                    }
                    catch (ex) {
                        if (ex.name == "NotFoundError") {
                            JsStore.Utils.getError(JsStore.ErrorType.TableNotExist, true, { TableName: query.From });
                        }
                        else {
                            console.warn(ex);
                        }
                    }
                    return _this;
                }
                return Instance;
            }(Count.Where));
            Count.Instance = Instance;
        })(Count = Business.Count || (Business.Count = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Update;
        (function (Update) {
            Update.updateValue = function (suppliedValue, storedValue) {
                for (var key in suppliedValue) {
                    if (typeof suppliedValue[key] != 'object') {
                        storedValue[key] = suppliedValue[key];
                    }
                    else {
                        for (var op in suppliedValue[key]) {
                            switch (op) {
                                case '+':
                                    storedValue[key] += suppliedValue[key][op];
                                    break;
                                case '-':
                                    storedValue[key] -= suppliedValue[key][op];
                                    break;
                                case '*':
                                    storedValue[key] *= suppliedValue[key][op];
                                    break;
                                case '/':
                                    storedValue[key] /= suppliedValue[key][op];
                                    break;
                                default: storedValue[key] = suppliedValue[key];
                            }
                            break;
                        }
                    }
                }
                return storedValue;
            };
        })(Update = Business.Update || (Business.Update = {}));
        var BaseUpdate = (function (_super) {
            __extends(BaseUpdate, _super);
            function BaseUpdate() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.SendResultFlag = true;
                _this.CheckFlag = false;
                return _this;
            }
            return BaseUpdate;
        }(Business.Base));
        Business.BaseUpdate = BaseUpdate;
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Update;
        (function (Update) {
            var NotWhere = (function (_super) {
                __extends(NotWhere, _super);
                function NotWhere() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeWhereUndefinedLogic = function () {
                        var That = this, CursorOpenRequest = this.ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                Cursor.update(Update.updateValue(That.Query.Set, Cursor.value));
                                ++That.RowAffected;
                                Cursor.continue();
                            }
                        };
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    return _this;
                }
                return NotWhere;
            }(Business.BaseUpdate));
            Update.NotWhere = NotWhere;
        })(Update = Business.Update || (Business.Update = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Update;
        (function (Update) {
            var Like = (function (_super) {
                __extends(Like, _super);
                function Like() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.filterOnOccurence = function (value) {
                        var Found = false, Value = value[this.Column].toLowerCase();
                        switch (this.CompSymbol) {
                            case JsStore.Occurence.Any:
                                if (Value.indexOf(this.CompValue) >= 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            case JsStore.Occurence.First:
                                if (Value.indexOf(this.CompValue) == 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            default:
                                if (Value.lastIndexOf(this.CompValue) == Value.length - 1) {
                                    Found = true;
                                }
                                ;
                        }
                        return Found;
                    };
                    _this.executeLikeLogic = function (column, value, symbol) {
                        var That = this;
                        this.CompValue = value.toLowerCase();
                        this.CompSymbol = symbol;
                        this.Column = column;
                        this.CursorOpenRequest = this.ObjectStore.index(column).openCursor();
                        this.CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        this.CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result, updateValueInternal = function () {
                                Cursor.update(Update.updateValue(That.Query.Set, Cursor.value));
                                ++That.RowAffected;
                            };
                            if (Cursor) {
                                if (!That.CheckFlag && That.filterOnOccurence(Cursor.value)) {
                                    updateValueInternal();
                                }
                                else if (That.filterOnOccurence(Cursor.value) &&
                                    That.checkForWhereConditionMatch(Cursor.value)) {
                                    updateValueInternal();
                                }
                                Cursor.continue();
                            }
                        };
                    };
                    return _this;
                }
                return Like;
            }(Update.NotWhere));
            Update.Like = Like;
        })(Update = Business.Update || (Business.Update = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Update;
        (function (Update) {
            var Where = (function (_super) {
                __extends(Where, _super);
                function Where() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeRequest = function (column, value, op) {
                        var That = this, CursorOpenRequest;
                        value = op ? value[op] : value;
                        CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                var updateValueInternal = function () {
                                    Cursor.update(Update.updateValue(That.Query.Set, Cursor.value));
                                    ++That.RowAffected;
                                };
                                if (!That.CheckFlag) {
                                    updateValueInternal();
                                }
                                else if (That.checkForWhereConditionMatch(Cursor.value)) {
                                    updateValueInternal();
                                }
                                Cursor.continue();
                            }
                        };
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    _this.executeWhereLogic = function () {
                        for (var Column in this.Query.Where) {
                            if (!this.ErrorOccured) {
                                if (this.ObjectStore.indexNames.contains(Column)) {
                                    var Value = this.Query.Where[Column];
                                    if (typeof Value == 'string') {
                                        this.executeRequest(Column, Value);
                                    }
                                    else {
                                        this.CheckFlag = Object.keys(Value).length > 1 || Object.keys(this.Query.Where).length > 1 ? true : false;
                                        if (Value.Like) {
                                            var FilterValue = Value.Like.split('%');
                                            if (FilterValue[1]) {
                                                if (FilterValue.length > 2) {
                                                    this.executeLikeLogic(Column, FilterValue[1], JsStore.Occurence.Any);
                                                }
                                                else {
                                                    this.executeLikeLogic(Column, FilterValue[1], JsStore.Occurence.Last);
                                                }
                                            }
                                            else {
                                                this.executeLikeLogic(Column, FilterValue[0], JsStore.Occurence.First);
                                            }
                                        }
                                        else if (Value['In']) {
                                            for (var i = 0; i < Value['In'].length; i++) {
                                                this.executeRequest(Column, Value['In'][i]);
                                            }
                                        }
                                        else if (Value['-']) {
                                            this.executeRequest(Column, Value, '-');
                                        }
                                        else if (Value['>']) {
                                            this.executeRequest(Column, Value, '>');
                                        }
                                        else if (Value['<']) {
                                            this.executeRequest(Column, Value, '<');
                                        }
                                        else if (Value['>=']) {
                                            this.executeRequest(Column, Value, '>=');
                                        }
                                        else if (Value['<=']) {
                                            this.executeRequest(Column, Value, '<=');
                                        }
                                        else {
                                            this.executeRequest(Column, Value);
                                        }
                                    }
                                }
                                else {
                                    this.ErrorOccured = true;
                                    this.Error = JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                    this.onErrorOccured(this.Error, true);
                                }
                            }
                            break;
                        }
                    };
                    return _this;
                }
                return Where;
            }(Update.Like));
            Update.Where = Where;
        })(Update = Business.Update || (Business.Update = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Update;
        (function (Update) {
            var Instance = (function (_super) {
                __extends(Instance, _super);
                function Instance(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.onTransactionCompleted = function () {
                        if (this.OnSuccess != null) {
                            this.OnSuccess(this.RowAffected);
                        }
                    };
                    try {
                        var That = _this;
                        _this.checkSchema(query.Set, query.In);
                        if (!_this.ErrorOccured) {
                            _this.Query = query;
                            _this.OnSuccess = onSuccess;
                            _this.OnError = onError;
                            _this.Transaction = Business.DbConnection.transaction([query.In], "readwrite");
                            _this.ObjectStore = _this.Transaction.objectStore(query.In);
                            var That = _this;
                            _this.Transaction.oncomplete = function (e) {
                                That.onTransactionCompleted();
                            };
                            _this.Transaction.ontimeout = That.onTransactionTimeout;
                            if (query.Where == undefined) {
                                _this.executeWhereUndefinedLogic();
                            }
                            else {
                                _this.executeWhereLogic();
                            }
                        }
                        else {
                            _this.onErrorOccured(_this.Error, true);
                        }
                    }
                    catch (ex) {
                        _this.onExceptionOccured(ex, { TableName: query.In });
                    }
                    return _this;
                }
                Instance.prototype.checkSchema = function (suppliedValue, tableName) {
                    var CurrentTable = this.getTable(tableName), That = this;
                    if (CurrentTable) {
                        //loop through table column and find data is valid
                        CurrentTable.Columns.every(function (column) {
                            if (!That.ErrorOccured) {
                                if (column.Name in suppliedValue) {
                                    var executeCheck = function (value) {
                                        //check not null schema
                                        if (column.NotNull && JsStore.isNull(value)) {
                                            That.ErrorOccured = true;
                                            That.Error = JsStore.Utils.getError(JsStore.ErrorType.NullValue, false, { ColumnName: column.Name });
                                        }
                                        //check datatype
                                        if (column.DataType && typeof value != column.DataType) {
                                            That.ErrorOccured = true;
                                            That.Error = JsStore.Utils.getError(JsStore.ErrorType.BadDataType, false, { ColumnName: column.Name });
                                        }
                                    };
                                    executeCheck(suppliedValue[column.Name]);
                                    return true;
                                }
                            }
                            else {
                                return false;
                            }
                        });
                    }
                    else {
                        var Error = JsStore.Utils.getError(JsStore.ErrorType.TableNotExist, false, { TableName: tableName });
                        throw Error;
                    }
                };
                return Instance;
            }(Update.Where));
            Update.Instance = Instance;
        })(Update = Business.Update || (Business.Update = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Delete;
        (function (Delete) {
            var BaseDelete = (function (_super) {
                __extends(BaseDelete, _super);
                function BaseDelete() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.SendResultFlag = true;
                    _this.CheckFlag = false;
                    return _this;
                }
                return BaseDelete;
            }(Business.Base));
            Delete.BaseDelete = BaseDelete;
        })(Delete = Business.Delete || (Business.Delete = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Delete;
        (function (Delete) {
            var NotWhere = (function (_super) {
                __extends(NotWhere, _super);
                function NotWhere() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeWhereUndefinedLogic = function () {
                        var That = this, CursorOpenRequest = this.ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                Cursor.delete();
                                ++That.RowAffected;
                                Cursor.continue();
                            }
                        };
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    return _this;
                }
                return NotWhere;
            }(Delete.BaseDelete));
            Delete.NotWhere = NotWhere;
        })(Delete = Business.Delete || (Business.Delete = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Delete;
        (function (Delete) {
            var Like = (function (_super) {
                __extends(Like, _super);
                function Like() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.filterOnOccurence = function (value) {
                        var Found = false, Value = value[this.Column].toLowerCase();
                        switch (this.CompSymbol) {
                            case JsStore.Occurence.Any:
                                if (Value.indexOf(this.CompValue) >= 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            case JsStore.Occurence.First:
                                if (Value.indexOf(this.CompValue) == 0) {
                                    Found = true;
                                }
                                ;
                                break;
                            default:
                                if (Value.lastIndexOf(this.CompValue) == Value.length - 1) {
                                    Found = true;
                                }
                                ;
                        }
                        return Found;
                    };
                    _this.executeLikeLogic = function (column, value, symbol) {
                        var That = this;
                        this.CompValue = value.toLowerCase();
                        this.CompSymbol = symbol;
                        this.Column = column;
                        this.CursorOpenRequest = this.ObjectStore.index(column).openCursor();
                        this.CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        this.CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result, deleteValue = function () {
                                Cursor.delete();
                                ++That.RowAffected;
                            };
                            if (Cursor) {
                                if (!That.CheckFlag && That.filterOnOccurence(Cursor.value)) {
                                    deleteValue();
                                }
                                else if (That.filterOnOccurence(Cursor.value) && That.checkForWhereConditionMatch(Cursor.value)) {
                                    deleteValue();
                                }
                                Cursor.continue();
                            }
                        };
                    };
                    return _this;
                }
                return Like;
            }(Delete.NotWhere));
            Delete.Like = Like;
        })(Delete = Business.Delete || (Business.Delete = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Delete;
        (function (Delete) {
            var Where = (function (_super) {
                __extends(Where, _super);
                function Where() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.executeRequest = function (column, value, op) {
                        var That = this, CursorOpenRequest;
                        value = op ? value[op] : value;
                        CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result, deleteValue = function () {
                                Cursor.delete();
                                ++That.RowAffected;
                            };
                            if (Cursor) {
                                if (!That.CheckFlag) {
                                    deleteValue();
                                }
                                else if (That.checkForWhereConditionMatch(Cursor.value)) {
                                    deleteValue();
                                }
                                Cursor.continue();
                            }
                        };
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    _this.executeWhereLogic = function () {
                        for (var Column in this.Query.Where) {
                            if (!this.ErrorOccured) {
                                if (this.ObjectStore.indexNames.contains(Column)) {
                                    var Value = this.Query.Where[Column];
                                    if (typeof Value == 'string') {
                                        this.executeRequest(Column, Value);
                                    }
                                    else {
                                        this.CheckFlag = Object.keys(Value).length > 1 || Object.keys(this.Query.Where).length > 1 ? true : false;
                                        if (Value.Like) {
                                            var FilterValue = Value.Like.split('%');
                                            if (FilterValue[1]) {
                                                if (FilterValue.length > 2) {
                                                    this.executeLikeLogic(Column, FilterValue[1], JsStore.Occurence.Any);
                                                }
                                                else {
                                                    this.executeLikeLogic(Column, FilterValue[1], JsStore.Occurence.Last);
                                                }
                                            }
                                            else {
                                                this.executeLikeLogic(Column, FilterValue[0], JsStore.Occurence.First);
                                            }
                                        }
                                        else if (Value['In']) {
                                            for (var i = 0; i < Value['In'].length; i++) {
                                                this.executeRequest(Column, Value['In'][i]);
                                            }
                                        }
                                        else if (Value['-']) {
                                            this.executeRequest(Column, Value, '-');
                                        }
                                        else if (Value['>']) {
                                            this.executeRequest(Column, Value, '>');
                                        }
                                        else if (Value['<']) {
                                            this.executeRequest(Column, Value, '<');
                                        }
                                        else if (Value['>=']) {
                                            this.executeRequest(Column, Value, '>=');
                                        }
                                        else if (Value['<=']) {
                                            this.executeRequest(Column, Value, '<=');
                                        }
                                        else {
                                            this.executeRequest(Column, Value);
                                        }
                                    }
                                }
                                else {
                                    this.ErrorOccured = true;
                                    this.Error = JsStore.Utils.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                    this.onErrorOccured(this.Error, true);
                                }
                            }
                            break;
                        }
                    };
                    return _this;
                }
                return Where;
            }(Delete.Like));
            Delete.Where = Where;
        })(Delete = Business.Delete || (Business.Delete = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var Business;
    (function (Business) {
        var Delete;
        (function (Delete) {
            var Instance = (function (_super) {
                __extends(Instance, _super);
                function Instance(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.onTransactionCompleted = function () {
                        if (this.OnSuccess != null) {
                            this.OnSuccess(this.RowAffected);
                        }
                    };
                    try {
                        var That = _this;
                        _this.Query = query;
                        _this.OnSuccess = onSuccess;
                        _this.OnError = onError;
                        _this.Transaction = Business.DbConnection.transaction([query.From], "readwrite");
                        _this.ObjectStore = _this.Transaction.objectStore(query.From);
                        _this.Transaction.oncomplete = function () {
                            That.onTransactionCompleted();
                        };
                        _this.Transaction.onerror = function (e) {
                            That.onErrorOccured(e);
                        };
                        if (query.Where == undefined) {
                            _this.executeWhereUndefinedLogic();
                        }
                        else {
                            _this.executeWhereLogic();
                        }
                    }
                    catch (ex) {
                        _this.onExceptionOccured(ex, { TableName: query.From });
                    }
                    return _this;
                }
                return Instance;
            }(Delete.Where));
            Delete.Instance = Instance;
        })(Delete = Business.Delete || (Business.Delete = {}));
    })(Business = JsStore.Business || (JsStore.Business = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var WebWorkerStatus;
    (function (WebWorkerStatus) {
        WebWorkerStatus["Registered"] = "registerd";
        WebWorkerStatus["Failed"] = "failed";
        WebWorkerStatus["NotStarted"] = "not_started";
    })(WebWorkerStatus = JsStore.WebWorkerStatus || (JsStore.WebWorkerStatus = {}));
    ;
    JsStore.WorkerStatus = WebWorkerStatus.NotStarted;
    var CodeExecutionHelper = (function () {
        function CodeExecutionHelper() {
            this.RequestQueue = [];
            this.IsCodeExecuting = false;
            this.prcoessExecutionOfCode = function (request) {
                this.RequestQueue.push(request);
                if (JsStore.EnableLog) {
                    console.log("request pushed:" + request.Name);
                }
                if (this.RequestQueue.length == 1 && JsStore.WorkerStatus != WebWorkerStatus.NotStarted) {
                    this.executeCode();
                }
            };
            this.executeCode = function () {
                if (!this.IsCodeExecuting && this.RequestQueue.length > 0) {
                    if (JsStore.EnableLog) {
                        console.log("request executing" + this.RequestQueue[0].Name);
                    }
                    this.IsCodeExecuting = true;
                    var Request = {
                        Name: this.RequestQueue[0].Name,
                        Query: this.RequestQueue[0].Query
                    };
                    if (JsStore.WorkerStatus == WebWorkerStatus.Registered) {
                        this.executeCodeUsingWorker(Request);
                    }
                    else {
                        this.executeCodeDirect(Request);
                    }
                }
            };
            this.executeCodeDirect = function (request) {
                var That = this;
                new JsStore.Business.Main(function (results) {
                    That.processFinishedRequest(results);
                }).checkConnectionAndExecuteLogic(request);
            };
            this.executeCodeUsingWorker = function (request) {
                JsStore.WorkerInstance.postMessage(request);
            };
            this.processFinishedRequest = function (message) {
                var FinishedRequest = this.RequestQueue.shift();
                this.IsCodeExecuting = false;
                if (FinishedRequest) {
                    if (JsStore.EnableLog) {
                        console.log("request finished:" + FinishedRequest.Name);
                    }
                    if (message.ErrorOccured) {
                        if (FinishedRequest.OnError) {
                            FinishedRequest.OnError(message.ErrorDetails);
                        }
                    }
                    else {
                        if (FinishedRequest.OnSuccess) {
                            if (message.ReturnedValue != null) {
                                FinishedRequest.OnSuccess(message.ReturnedValue);
                            }
                            else {
                                FinishedRequest.OnSuccess();
                            }
                        }
                    }
                    this.executeCode();
                }
            };
            this.onWorkerFailed = function () {
                console.warn('JsStore is not runing in web worker');
                JsStore.WorkerStatus = WebWorkerStatus.Failed;
                this.executeCode();
            };
            this.createWorker = function () {
                var That = this;
                try {
                    if (Worker) {
                        var ScriptUrl = this.getScriptUrl();
                        if (ScriptUrl && ScriptUrl.length > 0) {
                            JsStore.WorkerInstance = new Worker(ScriptUrl);
                            JsStore.WorkerInstance.onmessage = function (msg) {
                                That.onMessageFromWorker(msg);
                            };
                            setTimeout(function () {
                                if (JsStore.WorkerStatus != WebWorkerStatus.Failed) {
                                    JsStore.WorkerStatus = WebWorkerStatus.Registered;
                                }
                                That.executeCode();
                            }, 100);
                        }
                        else {
                            That.onWorkerFailed();
                        }
                    }
                    else {
                        That.onWorkerFailed();
                    }
                }
                catch (ex) {
                    That.onWorkerFailed();
                }
            };
            this.onMessageFromWorker = function (msg) {
                var That = this;
                if (typeof msg.data == 'string') {
                    var Datas = msg.data.split(':')[1];
                    switch (Datas) {
                        case 'WorkerFailed':
                            That.onWorkerFailed();
                            break;
                    }
                }
                else {
                    this.processFinishedRequest(msg.data);
                }
            };
        }
        CodeExecutionHelper.prototype.getScriptUrl = function (fileName) {
            var ScriptUrl = "";
            var FileName = fileName ? fileName.toLowerCase() : "jsstore";
            var Scripts = document.getElementsByTagName('script');
            for (var i = Scripts.length - 1, url = ""; i >= 0; i--) {
                url = Scripts[i].src;
                url = url.substring(url.lastIndexOf('/') + 1).toLowerCase();
                if (url.length > 0 && url.indexOf(FileName) >= 0) {
                    ScriptUrl = Scripts[i].src;
                    return ScriptUrl;
                }
            }
            return ScriptUrl;
        };
        return CodeExecutionHelper;
    }());
    JsStore.CodeExecutionHelper = CodeExecutionHelper;
})(JsStore || (JsStore = {}));
var Model = JsStore.Model;
var DataBase = Model.DataBase;
var Column = Model.Column;
var Table = Model.Table;
var JsStore;
(function (JsStore) {
    var Instance = (function (_super) {
        __extends(Instance, _super);
        function Instance(dbName) {
            var _this = _super.call(this) || this;
            if (JsStore.WorkerStatus == JsStore.WebWorkerStatus.NotStarted) {
                JsStore.Utils.setDbType();
                _this.createWorker();
            }
            else {
                JsStore.WorkerInstance.terminate();
                _this.createWorker();
            }
            if (dbName != null) {
                _this.prcoessExecutionOfCode({
                    Name: 'open_db',
                    Query: dbName
                });
            }
            return _this;
        }
        /**
         * creates DataBase
         *
         * @param {IDataBase} dataBase
         * @param {Function} onSuccess
         * @param {Function} [onError=null]
         * @returns
         *
         * @memberOf Main
         */
        Instance.prototype.createDb = function (dataBase, onSuccess, onError) {
            if (onError === void 0) { onError = null; }
            this.prcoessExecutionOfCode({
                Name: 'create_db',
                OnSuccess: onSuccess,
                OnError: onError,
                Query: dataBase
            });
            return this;
        };
        /**
         * drop dataBase
         *
         * @param {Function} onSuccess
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        Instance.prototype.dropDb = function (onSuccess, onError) {
            if (onError === void 0) { onError = null; }
            this.prcoessExecutionOfCode({
                Name: 'drop_db',
                OnSuccess: onSuccess,
                OnError: onError
            });
            return this;
        };
        /**
         * select data from table
         *
         * @param {IQuery} query
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         *
         * @memberOf Main
         */
        Instance.prototype.select = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
            query.OnSuccess = null;
            query.OnError = null;
            this.prcoessExecutionOfCode({
                Name: 'select',
                Query: query,
                OnSuccess: OnSuccess,
                OnError: OnError
            });
            return this;
        };
        /**
         * get no of result from table
         *
         * @param {ICount} query
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        Instance.prototype.count = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
            query.OnSuccess = null;
            query.OnError = null;
            this.prcoessExecutionOfCode({
                Name: 'count',
                Query: query,
                OnSuccess: OnSuccess,
                OnError: OnError
            });
            return this;
        };
        /**
         * insert data into table
         *
         * @param {IInsert} query
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        Instance.prototype.insert = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
            query.OnSuccess = null;
            query.OnError = null;
            this.prcoessExecutionOfCode({
                Name: 'insert',
                Query: query,
                OnSuccess: OnSuccess,
                OnError: OnError
            });
            return this;
        };
        /**
         * update data into table
         *
         * @param {IUpdate} query
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        Instance.prototype.update = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
            query.OnSuccess = null;
            query.OnError = null;
            this.prcoessExecutionOfCode({
                Name: 'update',
                Query: query,
                OnSuccess: OnSuccess,
                OnError: OnError
            });
            return this;
        };
        /**
         * delete data from table
         *
         * @param {IDelete} query
         * @param {Function} [onSuccess=null]
         * @param {Function} onError
         * @memberof Instance
         */
        Instance.prototype.delete = function (query, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            var OnSuccess = query.OnSuccess ? query.OnSuccess : onSuccess, OnError = query.OnError ? query.OnError : onError;
            query.OnSuccess = null;
            query.OnError = null;
            this.prcoessExecutionOfCode({
                Name: 'delete',
                Query: query,
                OnSuccess: OnSuccess,
                OnError: OnError
            });
            return this;
        };
        /**
         * delete all data from table
         *
         * @param {string} tableName
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        Instance.prototype.clear = function (tableName, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            this.prcoessExecutionOfCode({
                Name: 'clear',
                Query: tableName,
                OnSuccess: onSuccess,
                OnError: onerror
            });
            return this;
        };
        return Instance;
    }(JsStore.CodeExecutionHelper));
    JsStore.Instance = Instance;
})(JsStore || (JsStore = {}));
(!self.alert);
{
    self.onmessage = function (e) {
        if (JsStore.EnableLog) {
            console.log("Request executing from WebWorker, request name:" + e.data.Name);
        }
        var Request = e.data, IndexDbObject = new JsStore.Business.Main();
        IndexDbObject.checkConnectionAndExecuteLogic(Request);
    };
}
var KeyStore;
(function (KeyStore) {
    var Utils = (function () {
        function Utils() {
        }
        /**
         * determine and set the DataBase Type
         *
         *
         * @memberOf UtilityLogic
         */
        Utils.setDbType = function () {
            self.indexedDB = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;
            if (indexedDB) {
                self.IDBTransaction = self.IDBTransaction || self.webkitIDBTransaction || self.msIDBTransaction;
                self.IDBKeyRange = self.IDBKeyRange || self.webkitIDBKeyRange || self.msIDBKeyRange;
            }
            else if (!self.alert) {
                console.log('worked failed');
                self.postMessage('message:WorkerFailed');
            }
            else {
                throw 'Your browser doesnot support IndexedDb';
            }
        };
        return Utils;
    }());
    KeyStore.Utils = Utils;
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus["Connected"] = "connected";
        ConnectionStatus["Closed"] = "closed";
        ConnectionStatus["NotStarted"] = "not_connected";
    })(ConnectionStatus = KeyStore.ConnectionStatus || (KeyStore.ConnectionStatus = {}));
    KeyStore.RequestQueue = [], KeyStore.TableName = "LocalStore", KeyStore.IsCodeExecuting = false;
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    KeyStore.prcoessExecutionOfCode = function (request) {
        KeyStore.RequestQueue.push(request);
        if (KeyStore.RequestQueue.length == 1) {
            KeyStore.executeCode();
        }
    };
    KeyStore.executeCode = function () {
        if (!KeyStore.IsCodeExecuting && KeyStore.RequestQueue.length > 0) {
            KeyStore.IsCodeExecuting = true;
            var Request = {
                Name: KeyStore.RequestQueue[0].Name,
                Query: KeyStore.RequestQueue[0].Query
            };
            KeyStore.executeCodeDirect(Request);
        }
    };
    KeyStore.executeCodeDirect = function (request) {
        var That = this;
        new KeyStore.Business.Main(function (results) {
            That.processFinishedRequest(results);
        }).checkConnectionAndExecuteLogic(request);
    };
    KeyStore.processFinishedRequest = function (message) {
        var FinishedRequest = KeyStore.RequestQueue.shift();
        KeyStore.IsCodeExecuting = false;
        if (message.ErrorOccured) {
            if (FinishedRequest.OnError) {
                FinishedRequest.OnError(message.ErrorDetails);
            }
            else {
                console.log(message.ErrorDetails);
            }
        }
        else {
            if (FinishedRequest.OnSuccess) {
                if (message.ReturnedValue != null) {
                    FinishedRequest.OnSuccess(message.ReturnedValue);
                }
                else {
                    FinishedRequest.OnSuccess();
                }
            }
        }
        this.executeCode();
    };
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var Base = (function () {
            function Base() {
                this.Results = null;
                this.ErrorOccured = false;
                this.ErrorCount = 0;
                this.onErrorOccured = function (e) {
                    ++this.ErrorCount;
                    if (this.ErrorCount == 1) {
                        if (this.OnError != null) {
                            this.OnError(e.target.error);
                        }
                    }
                    console.error(e);
                };
            }
            return Base;
        }());
        Business.Base = Base;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var Get = (function (_super) {
            __extends(Get, _super);
            function Get(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.get = function () {
                    var That = this, getData = function (column, value) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                That.Results = Cursor.value['Value'];
                            }
                        };
                    };
                    for (var column in this.Query.Where) {
                        getData(column, this.Query.Where[column]);
                        break;
                    }
                };
                var That = _this;
                _this.Query = query;
                _this.OnError = onError;
                _this.Transaction = Business.DbConnection.transaction([query.From], "readonly");
                _this.ObjectStore = _this.Transaction.objectStore(query.From);
                _this.Transaction.oncomplete = function (e) {
                    if (onSuccess != null) {
                        onSuccess(That.Results);
                    }
                };
                _this.get();
                return _this;
            }
            return Get;
        }(Business.Base));
        Business.Get = Get;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var Set = (function (_super) {
            __extends(Set, _super);
            function Set(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.setData = function (value) {
                    var That = this, updateIfExistElseInsert = function () {
                        var CursorOpenRequest = That.ObjectStore.index('Key').openCursor(IDBKeyRange.only(value['Key']));
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                Cursor.value['Value'] = value['Value'];
                                Cursor.update(Cursor.value);
                            }
                            else {
                                insertData();
                            }
                        };
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    }, insertData = function () {
                        var AddResult = That.ObjectStore.add(value);
                        AddResult.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    updateIfExistElseInsert();
                };
                try {
                    var That = _this;
                    _this.OnError = onError;
                    _this.Transaction = Business.DbConnection.transaction([query.TableName], "readwrite");
                    _this.ObjectStore = _this.Transaction.objectStore(query.TableName);
                    _this.Transaction.oncomplete = function (e) {
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                    _this.setData(query.Set);
                }
                catch (ex) {
                    console.error(ex);
                }
                return _this;
            }
            return Set;
        }(Business.Base));
        Business.Set = Set;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var Remove = (function (_super) {
            __extends(Remove, _super);
            function Remove(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.RowAffected = 0;
                _this.remove = function () {
                    var That = this, removeData = function (column, value) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                Cursor.delete();
                                ++That.RowAffected;
                                Cursor.continue();
                            }
                        };
                    };
                    for (var Column in this.Query.Where) {
                        if (!That.ErrorOccured) {
                            removeData(Column, That.Query.Where[Column]);
                        }
                        break;
                    }
                };
                var That = _this;
                _this.Query = query;
                _this.OnError = onError;
                _this.Transaction = Business.DbConnection.transaction([query.From], "readwrite");
                _this.ObjectStore = _this.Transaction.objectStore(query.From);
                _this.Transaction.oncomplete = function () {
                    if (onSuccess != null) {
                        onSuccess(That.RowAffected);
                    }
                };
                _this.Transaction.onerror = function (e) {
                    That.onErrorOccured(e);
                };
                _this.remove();
                return _this;
            }
            return Remove;
        }(Business.Base));
        Business.Remove = Remove;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var InitDb = (function () {
            function InitDb(dbName, tableName, onSuccess, onError) {
                var That = this, DbRequest = self.indexedDB.open(dbName, 1);
                DbRequest.onerror = function (event) {
                    if (onError != null) {
                        onError(event.target.error);
                    }
                };
                DbRequest.onsuccess = function (event) {
                    Business.Status.ConStatus = KeyStore.ConnectionStatus.Connected;
                    Business.DbConnection = DbRequest.result;
                    Business.DbConnection.onclose = function () {
                        Business.Status.ConStatus = KeyStore.ConnectionStatus.Closed;
                        Business.Status.LastError = "Connection Closed";
                    };
                    Business.DbConnection.onversionchange = function (e) {
                        if (e.newVersion === null) {
                            e.target.close(); // Manually close our connection to the db
                        }
                    };
                    Business.DbConnection.onerror = function (e) {
                        Business.Status.LastError = "Error occured in connection :" + e.target.result;
                    };
                    Business.DbConnection.onabort = function (e) {
                        Business.Status.ConStatus = KeyStore.ConnectionStatus.Closed;
                        Business.Status.LastError = "Connection aborted";
                    };
                    if (onSuccess != null) {
                        onSuccess();
                    }
                };
                DbRequest.onupgradeneeded = function (event) {
                    var db = event.target.result, Column = "Key";
                    db.createObjectStore(tableName, {
                        keyPath: Column
                    }).createIndex(Column, Column, { unique: true });
                };
            }
            return InitDb;
        }());
        Business.InitDb = InitDb;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        Business.Status = {
            ConStatus: KeyStore.ConnectionStatus.NotStarted,
            LastError: ""
        };
        var Main = (function () {
            function Main(onSuccess) {
                if (onSuccess === void 0) { onSuccess = null; }
                this.checkConnectionAndExecuteLogic = function (request) {
                    if (request.Name == 'create_db' || request.Name == 'open_db') {
                        this.executeLogic(request);
                    }
                    else {
                        if (Business.Status.ConStatus == KeyStore.ConnectionStatus.Connected) {
                            this.executeLogic(request);
                        }
                        else if (Business.Status.ConStatus == KeyStore.ConnectionStatus.NotStarted) {
                            var That = this;
                            setTimeout(function () {
                                That.checkConnectionAndExecuteLogic(request);
                            }, 50);
                        }
                        else if (Business.Status.ConStatus == KeyStore.ConnectionStatus.Closed) {
                            var That = this;
                            this.createDb(KeyStore.TableName);
                            setTimeout(function () {
                                That.checkConnectionAndExecuteLogic(request);
                            }, 50);
                        }
                    }
                };
                this.returnResult = function (result) {
                    if (this.OnSuccess) {
                        this.OnSuccess(result);
                    }
                };
                this.executeLogic = function (request) {
                    var That = this, OnSuccess = function (results) {
                        That.returnResult({
                            ReturnedValue: results
                        });
                    }, OnError = function (err) {
                        That.returnResult({
                            ErrorOccured: true,
                            ErrorDetails: err
                        });
                    };
                    switch (request.Name) {
                        case 'get':
                            this.get(request.Query, OnSuccess, OnError);
                            break;
                        case 'set':
                            this.set(request.Query, OnSuccess, OnError);
                            break;
                        case 'remove':
                            this.remove(request.Query, OnSuccess, OnError);
                            break;
                        case 'create_db':
                            this.createDb(request.Query, OnSuccess, OnError);
                            break;
                    }
                };
                this.set = function (query, onSuccess, onError) {
                    var ObjInsert = new Business.Set(query, onSuccess, onError);
                };
                this.remove = function (query, onSuccess, onError) {
                    var ObjDelete = new Business.Remove(query, onSuccess, onError);
                };
                this.get = function (query, onSuccess, onError) {
                    new Business.Get(query, onSuccess, onError);
                };
                this.createDb = function (tableName, onSuccess, onError) {
                    var DbName = "KeyStore";
                    new Business.InitDb(DbName, tableName, onSuccess, onError);
                };
                this.OnSuccess = onSuccess;
            }
            return Main;
        }());
        Business.Main = Main;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    /**
     * Initialize KeyStore
     *
     */
    KeyStore.init = function () {
        KeyStore.Utils.setDbType();
        if (indexedDB) {
            KeyStore.prcoessExecutionOfCode({
                Name: 'create_db',
                Query: KeyStore.TableName
            });
        }
    };
    /**
    * return the value by key
    *
    * @param {string} key
    * @param {Function} onSuccess
    * @param {Function} [onError=null]
    */
    KeyStore.get = function (key, onSuccess, onError) {
        if (onError === void 0) { onError = null; }
        var Query = {
            From: this.TableName,
            Where: {
                Key: key
            }
        };
        KeyStore.prcoessExecutionOfCode({
            Name: 'get',
            Query: Query,
            OnSuccess: onSuccess,
            OnError: onError
        });
        return this;
    };
    /**
    * insert or update value
    *
    * @param {any} key
    * @param {any} value
    * @param {Function} [onSuccess=null]
    * @param {Function} [onError=null]
    */
    KeyStore.set = function (key, value, onSuccess, onError) {
        if (onSuccess === void 0) { onSuccess = null; }
        if (onError === void 0) { onError = null; }
        var Query = {
            TableName: this.TableName,
            Set: {
                Key: key,
                Value: value
            }
        };
        KeyStore.prcoessExecutionOfCode({
            Name: 'set',
            Query: Query,
            OnSuccess: onSuccess,
            OnError: onError
        });
        return this;
    };
    /**
    * delete value
    *
    * @param {string} key
    * @param {Function} [onSuccess=null]
    * @param {Function} [onError=null]
    */
    KeyStore.remove = function (key, onSuccess, onError) {
        if (onSuccess === void 0) { onSuccess = null; }
        if (onError === void 0) { onError = null; }
        var Query = {
            From: this.TableName,
            Where: {
                Key: key
            }
        };
        KeyStore.prcoessExecutionOfCode({
            Name: 'remove',
            Query: Query,
            OnSuccess: onSuccess,
            OnError: onError
        });
        return this;
    };
})(KeyStore || (KeyStore = {}));
KeyStore.init();
//# sourceMappingURL=JsStore-1.1.3.js.map