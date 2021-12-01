sap.ui.define([
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
    "sap/m/Dialog",
    "sap/m/ButtonType",
    "sap/m/Button",
    "../../utils/xlsx.full.min"
],
    function (Spreadsheet, exportLibrary, Dialog, ButtonType, Button, xlsxjs) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        return {
            getModeloExcel: function (oEvent) {
                // alert('getModeloExcel');
                // this.downloadExcel();
                this.uploadExcel();
            },
            createColumnConfig: function (colums, prefix) {
                var aCols = [],
                    index = 1;
                do {

                    aCols.push({
                        // label: this.oResourceBundle.getText("material"),
                        label: " ",
                        property: prefix + index.toString(),
                        type: EdmType.String
                    });
                    index = index + index;
                } while (colums >= index);
                return aCols;
            },
            downloadExcel: function () {
                var dataSource = [
                    {
                        "colum1": "Nome",
                        "colum2": "Sobrenome",
                        "colum3": "Idade"
                    },
                    {
                        "colum1": "Danilo",
                        "colum2": "Jacinto",
                        "colum5": "27"
                    },
                    {
                        "colum1": "Item",
                        "colum2": "Valor",
                        "colum5": "Quantidade"
                    },
                    {
                        "colum1": "010",
                        "colum2": "100,00",
                        "colum5": "30"
                    }
                ];
                // const oData = this.getView().getModel("modelTable").getData();
                new Spreadsheet({
                    workbook: {
                        columns: this.createColumnConfig(2, "colum"),
                        context: {
                            sheetName: "Invoices"
                        }
                    },
                    dataSource: dataSource,
                    fileName: "Modelo Contrato.xlsx",
                }).build();
            },

            uploadExcel: function () {
                if (!this.oDefaultDialog) {
                    this.oDefaultDialog = new Dialog({
                        title: "Upload arquivo",
                        content: this.addFileUpload(),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Upload documento",
                            press: function () {
                                this.readerLoad();
                                this.oDefaultDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "Close",
                            press: function () {
                                this.oDefaultDialog.close();
                            }.bind(this)
                        })
                    });

                    // to get access to the controller's model
                    this.getView().addDependent(this.oDefaultDialog);
                }
                // this.oDefaultDialog.attachBeforeClose(this.readerLoad, this);
                this.oDefaultDialog.open();

            },
            readerLoad: function (oEvent) {
                var contentUpload = this.oDefaultDialog.getContent()[0];
                var domRef = contentUpload.getFocusDomRef();
                if (domRef.files.length == 0) {
                    return;
                }
                var file = domRef.files[0];

                var that = this;
                this.fileName = file.name,
                    this.fileType = file.type;
                var reader = new FileReader();
                reader.onload = function (e) {
                    // this.loadCsv(e);
                    this.loadXlsx(e);
                    
                }.bind(this);
                reader.readAsBinaryString(file)
            },
            loadCsv: function (e) {
                var resultJson = e.currentTarget.result.match(/[\w .]+(?=,?)/g),
                    qtdeColums = 9,
                    headerRow = resultJson.splice(0, qtdeColums),
                    data = [];
                while (resultJson.length > 0) {
                    let record = {},
                        excelDataItem = resultJson.splice(0, qtdeColums);
                    for (var i = 0; i < excelDataItem.length; i++) {
                        record[headerRow[i]] = excelDataItem[i].trim();
                    }
                    data.push(record);
                }
                console.log(data);
            },
            loadXlsx: function (event) {
                let data = event.target.result;
                let workbook = XLSX.read(data, { type: "binary" });
                console.log(workbook);
                workbook.SheetNames.forEach(sheet => {
                    let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                    console.log(rowObject);
                    console.log(JSON.stringify(rowObject, undefined, 4));
                });
            },
            addFileUpload() {
                return new sap.ui.unified.FileUploader({
                    name: "test1",
                    uploadUrl: "../../../../upload/",
                    sendXHR: true,
                    value: "",
                    tooltip: "Upload arquivo para criação/alteração",
                    placeholder: "Escolha o arquivo.",
                    fileType: ["xlsx"],
                    maximumFileSize: 2,
                    uploadOnChange: true,
                    multiple: true,
                    buttonText: "Upload"
                });
            }
        };
    });
