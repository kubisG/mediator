"use strict";
exports.__esModule = true;
// import * as parser from "xml2json";
var axios_1 = require("axios");
var DataService = /** @class */ (function () {
    function DataService() {
        this.apiWSDL = "https://uatwebservices.apexclearing.com/VendorStockLocate.wsdl";
    }
    DataService.prototype.getData = function (vendorId) {
        return Promise.resolve();
        // const that = this;
        // const promise = new Promise((resolve, reject) => {
        //     soap.createClient(that.apiWSDL, (err, client) => {
        //         if (err) throw new Error(err);
        //         const args = {
        //             argVendorID: vendorId,
        //             argDateTime: "",
        //             argCorrespondentCode: "",
        //             argTradeDateMin: "",
        //             argTradeDateMax: "",
        //             argFilterSecID: "",
        //         };
        //         client.vendorViewStockLocate(args, (err2, result) => {
        //             if (err2) reject(err2);
        //             if (!result) {
        //             }
        //             // xml to json
        //             const json = JSON.parse(parser.toJson(result.vendorViewStockLocateResult));
        //             resolve(json);
        //         });
        //     });
        // });
        // return promise;
    };
    DataService.prototype.getExternalData = function (data) {
        return axios_1["default"].get(data.url);
    };
    return DataService;
}());
exports.DataService = DataService;
