import * as soap from "soap";
// import * as parser from "xml2json";
import axios from "axios";

export class DataService {

    private apiWSDL = "https://uatwebservices.apexclearing.com/VendorStockLocate.wsdl";

    constructor() {
    }

    public getData(vendorId) {
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
    }

    public getExternalData(data) {
        return axios.get(data.url);
    }

}
