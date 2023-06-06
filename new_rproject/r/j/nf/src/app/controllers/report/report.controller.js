const Model = require("../../models");
var response = require("../../middleware/response.middleware");
var commonfunction = require("../commanFunctions/commanFunctions.controller");
const config = require("../../config/jwt.secret");
const { parse } = require("json2csv");
const excelController = require("../../middleware/excel.middleware");


exports.irrigationLog = async (req, res) => {
    if (!req.body.pid) {
        return response.fail(res, "project id is Required", "");
    }
    if (!req.body.from) {
        return response.fail(res, "From date is Required", "");
    }
    if (!req.body.to) {
        return response.fail(res, "To date is Required", "");
    }
    const pid = req.body.pid; // "ckjtutsd022820vrrvg276ocs"
    const unitId = req.body.unitId; // "cl095jsy01292590zv3d77e9dq1"
    const from = req.body.from; // "2022-12-30"
    const to = req.body.to; // "2023-01-02"
    const endpoint = config.graphql_endpoint;
    const variables = {
        pid: pid,
        unitId: unitId,
        from: from,
        to: to
    };
    const operationName = "newIrrigationLog";
    const query = `query newIrrigationLog(
        $from:
        String, $to: String, $unitId: String,
        $pid: String!, $programId: String,
        $entityId: String) {
        logsIrrigation(
        from: $from
        to: $to
        unitId: $unitId
        pid: $pid
        programId: $programId
        entityId: $entityId
        ) {
        program_run_id
        id
        date
        unitId
        unitName
        line
        programName
        openReason
        closeReason
        valveName
        startDate
        endDate
        amountType
        amountPlanned
        amount
        executionTime
        leakageFlow
        fertigations
        leftover
        valveOpenReason
        valveCloseReason
        watermeterName
        alerts
        __typename
        }
        }`;

    commonfunction.reportGraphql(
        endpoint,
        operationName,
        query,
        variables,
        function (reportGraphqlResponse) {
            if (reportGraphqlResponse != 0) {
                return response.success(
                    res,
                    "Irregation Log Response",
                    reportGraphqlResponse.logsIrrigation
                );
            } else {
                return response.success(res, "Error logged in Database", data);
            }
        }
    );
}

exports.getLogsPower = async (req, res) => {
    if (!req.body.pid) {
        return response.fail(res, "project id is Required", "");
    }
    if (!req.body.from) {
        return response.fail(res, "From date is Required", "");
    }
    if (!req.body.to) {
        return response.fail(res, "To date is Required", "");
    }
    const pid = req.body.pid; // "ckjtutsd022820vrrvg276ocs"
    const uid = req.body.uid; // "cl095jsy01292590zv3d77e9dq1"
    const from = req.body.from; // "2023-01-10"
    const to = req.body.to; // "2023-01-11"
    const endpoint = config.graphql_endpoint;
    const variables = {
        from: from,
        to: to,
        uid: uid,
        pid: pid

    };
    const operationName = "getLogsPower";
    const query = `query getLogsPower($from: String,
        $to: String, $uid: String, $pid: String)
        {
        logsPower(from: $from, to: $to,
        uid: $uid, pid: $pid) {
        dateTimeLocal
        value
        }
        }`;

    commonfunction.reportGraphql(
        endpoint,
        operationName,
        query,
        variables,
        function (reportGraphqlResponse) {
            if (reportGraphqlResponse != 0) {
                return response.success(
                    res,
                    "Power Log Response",
                    reportGraphqlResponse.logsPower
                );
            } else {
                return response.success(res, "Error logged in Database", data);
            }
        }
    );
}

exports.getLogsAnalog = async (req, res) => {
    if (!req.body.pid) {
        return response.fail(res, "project id is Required", "");
    }
    if (!req.body.from) {
        return response.fail(res, "From date is Required", "");
    }
    if (!req.body.to) {
        return response.fail(res, "To date is Required", "");
    }
    const pid = req.body.pid; // "ckjtutsd022820vrrvg276ocs"
    const uid = req.body.uid; // "cl095jsy01292590zv3d77e9dq1"
    const from = req.body.from; // "2023-01-10T13:30:00"
    const to = req.body.to; // "2023-01-11T13:30:00"
    const timeSlice = req.body.timeSlice != undefined ? req.body.timeSlice : "raw"; // "raw"
    const endpoint = config.graphql_endpoint;
    const variables = {
        from: from,
        to: to,
        uid: uid,
        pid: pid,
        timeSlice: timeSlice
    };
    const operationName = "getLogsAnalog";
    const query = `query getLogsAnalog(
        $from: String
        $to: String
        $uid: String!
        $pid: String!
        $entityId: String
        $timeSlice: String
        ) {
        logsAnalog(
        from: $from
        to: $to
        uid: $uid
        pid: $pid
        entityId: $entityId
        timeSlice: $timeSlice
        ) {
        serial
        dateTimeLocal
        timezone
        unitName
        projectId
        projectName
        entityId
        entityIndex
        entityName
        valueCurr
        valueMax
        valueMin
        valueAvg
        __typename
        }
        }`;

    commonfunction.reportGraphql(
        endpoint,
        operationName,
        query,
        variables,
        function (reportGraphqlResponse) {
            if (reportGraphqlResponse != 0) {
                return response.success(
                    res,
                    "Analog Log Response",
                    reportGraphqlResponse.logsAnalog
                );
            } else {
                return response.success(res, "Error logged in Database", data);
            }
        }
    );
}
exports.getLogsWaterMeterTs = async (req, res) => {
    if (!req.body.pid) {
        return response.fail(res, "project id is Required", "");
    }
    if (!req.body.from) {
        return response.fail(res, "From date is Required", "");
    }
    if (!req.body.to) {
        return response.fail(res, "To date is Required", "");
    }
    const pid = req.body.pid; // "ckjtutsd022820vrrvg276ocs"
    const uid = req.body.uid; // "cl095jsy01292590zv3d77e9dq1"
    const from = req.body.from; // "2023-01-09"
    const to = req.body.to; // "2023-01-11"
    const timeSlice = req.body.timeSlice != undefined ? req.body.timeSlice : "1 days"; // "raw"
    const entityType = req.body.entityType != undefined ? req.body.entityType : "WATERMETER"; // "raw"
    const endpoint = config.graphql_endpoint;
    const variables = {
        entityType: entityType,
        from: from,
        to: to,
        uid: uid,
        pid: pid,
        timeSlice: timeSlice
    };
    const operationName = "getLogsWaterMeterTs";
    const query = `query getLogsWaterMeterTs(
        $from: String
        $to: String
        $uid: String!
        $pid: String!
        $timeSlice: String
        $entityId: String
        $entityType: String
        $limit: Int
        $offset: Int
        ) {
        logsWaterMeterTs(
        from: $from
        to: $to
        uid: $uid
        pid: $pid
        timeSlice: $timeSlice
        entityId: $entityId
        entityType: $entityType
        limit: $limit
        offset: $offset
        ) {
        dateTime
        projectId
        projectName
        unitId
        unitName
        entityIndex
        entityId
        entityName
        sumAmount
        __typename
        }
        }`;

    commonfunction.reportGraphql(
        endpoint,
        operationName,
        query,
        variables,
        function (reportGraphqlResponse) {
            if (reportGraphqlResponse != 0) {
                return response.success(
                    res,
                    "Water Meter Log Response",
                    reportGraphqlResponse.logsWaterMeterTs
                );
            } else {
                return response.success(res, "Error logged in Database", "");
            }
        }
    );
}
exports.getLogsValveTs = async (req, res) => {
    if (!req.body.pid) {
        return response.fail(res, "project id is Required", "");
    }
    const pid = req.body.pid; // "ckjtutsd022820vrrvg276ocs"
    const uid = req.body.uid; // "cl095jsy01292590zv3d77e9dq1"
    const timeSlice = req.body.timeSlice != undefined ? req.body.timeSlice : "1 day"; // "raw"

    const endpoint = config.graphql_endpoint;
    const variables = {
        uid: uid,
        pid: pid,
        timeSlice: timeSlice
    };
    const operationName = "getLogsValveTs";
    const query = `query getLogsValveTs($from: String, $to: String, $uid: String!, $pid: String!, $timeSlice: String, $entityId: String) {
          logsValveTs(
            from: $from
            to: $to
            uid: $uid
            pid: $pid
            timeSlice: $timeSlice
            entityId: $entityId
          ) {
            dateTime
            projectId
            projectName
            unitId
            unitName
            entityIndex
            entityId
            entityName
            sumAmount
            __typename
      }
}
    `;

    commonfunction.reportGraphql(
        endpoint,
        operationName,
        query,
        variables,
        function (reportGraphqlResponse) {
            if (reportGraphqlResponse != 0) {
                return response.success(
                    res,
                    "Valves Log Response",
                    reportGraphqlResponse.logsValveTs
                );
            } else {
                return response.success(res, "Error logged in Database", "");
            }
        }
    );
}

// export functionality
exports.exportIrrigationLog = async (req, res) => {
    const pid = req.params.pid; // "ckjtutsd022820vrrvg276ocs"
    const unitId = req.params.unitId; // "cl095jsy01292590zv3d77e9dq1"
    const from = req.params.from; // "2022-12-30"
    const to = req.params.to; // "2023-01-02"
    const endpoint = config.graphql_endpoint;
    const variables = {
        pid: pid,
        unitId: unitId,
        from: from,
        to: to
    };
    const operationName = "newIrrigationLog";
    const query = `query newIrrigationLog(
        $from:
        String, $to: String, $unitId: String,
        $pid: String!, $programId: String,
        $entityId: String) {
        logsIrrigation(
        from: $from
        to: $to
        unitId: $unitId
        pid: $pid
        programId: $programId
        entityId: $entityId
        ) {
        program_run_id
        id
        date
        unitId
        unitName
        line
        programName
        openReason
        closeReason
        valveName
        startDate
        endDate
        amountType
        amountPlanned
        amount
        executionTime
        leakageFlow
        fertigations
        leftover
        valveOpenReason
        valveCloseReason
        watermeterName
        alerts
        __typename
        }
        }`;

    commonfunction.reportGraphql(endpoint, operationName, query, variables, function (reportGraphqlResponse) {

        var temp = [];
        var reportReponseData = reportGraphqlResponse.logsIrrigation
        if (reportReponseData.length === 0) {
            return response.fail(res, "No Data Found", "");
        }
        reportReponseData.forEach((element) => {
            temp.push({
                program_run_id: element.program_run_id,
                id: element.id,
                date: element.date,
                unitId: element.unitId,
                unitName: element.unitName,
                line: element.line,
                programName: element.programName,
                openReason: element.openReason,
                closeReason: element.closeReason,
                valveName: element.valveName,
                startDate: element.startDate,
                endDate: element.endDate,
                amountType: element.amountType,
                amountPlanned: element.amountPlanned,
                amount: element.amount,
                executionTime: element.executionTime,
                leakageFlow: element.leakageFlow,
                fertigations: element.fertigations,
                leftover: element.leftover,
                valveOpenReason: element.valveOpenReason,
                valveCloseReason: element.valveCloseReason,
                watermeterName: element.watermeterName,
                alerts: element.alerts,
                __typename: element.__typename,
            });
            // var count = 0;
            // element.orderDoLogList.forEach((orderDoLogListItem) => {
            //     if (count == 0) {
            //     } else {
            //         temp.push({
            //             SKUName: "",
            //             uomName: "",
            //             availableQty: "",
            //             nameOfYard: "",
            //             nameOfZone: "",
            //             batchName: "",
            //             availableWeight: "",
            //             dumpStockQty: "",
            //             dumpWeight: "",
            //             isBatchClose: "",
            //             date: orderDoLogListItem.date,
            //             invoiceNumber: orderDoLogListItem.invoiceNumber,
            //             inwardQty: orderDoLogListItem.inwardQty,
            //             inwardWeight: orderDoLogListItem.inwardWeight,
            //             outwardQty: orderDoLogListItem.outwardQty,
            //             outwardWeight: orderDoLogListItem.outwardWeight,
            //         });
            //     }
            //     count = count + 1;
            // });
        });
        var headerContent = [
            { header: "Program Run Id", key: "program_run_id", width: 25 },
            { header: "Id", key: "id", width: 25 },
            { header: "Date", key: "date", width: 25, },
            { header: "Unit Id", key: "unitId", width: 25 },
            { header: "Unit Name", key: "unitName", width: 25 },
            { header: "Line", key: "line", width: 25 },
            { header: "Program Name", key: "programName", width: 25 },
            { header: "Open Reason", key: "openReason", width: 25 },
            { header: "Close Reason", key: "closeReason", width: 25 },
            { header: "Valve Name", key: "valveName", width: 25 },
            { header: "Start Date", key: "startDate", width: 25 },
            { header: "End Date", key: "endDate", width: 25 },
            { header: "Amount Type", key: "amountType", width: 25 },
            { header: "Amount Planned", key: "amountPlanned", width: 25 },
            { header: "Amount", key: "amount", width: 25 },
            { header: "Execution Time", key: "executionTime", width: 25 },
            { header: "Leakage Flow", key: "leakageFlow", width: 25 },
            { header: "Fertigations", key: "fertigations", width: 25 },
            { header: "Leftover", key: "leftover", width: 25 },
            { header: "Valve Open Reason", key: "valveOpenReason", width: 25 },
            { header: "Valve Close Reason", key: "valveCloseReason", width: 25 },
            { header: "Watermeter Name", key: "watermeterName", width: 25 },
            { header: "Alerts", key: "alerts", width: 25 },
            { header: "Type Name", key: "__typename", width: 25 },
        ];
        var fileName = "irrigationReport";
        excelController.download(
            temp,
            headerContent,
            res,
            fileName,
            function (datares) { }
        );

    });
}

exports.exportGetLogsPower = async (req, res) => {
    const pid = req.params.pid; // "ckjtutsd022820vrrvg276ocs"
    const uid = req.params.uid; // "cl095jsy01292590zv3d77e9dq1"
    const from = req.params.from; // "2023-01-10"
    const to = req.params.to; // "2023-01-11"
    const endpoint = config.graphql_endpoint;
    const variables = {
        from: from,
        to: to,
        uid: uid,
        pid: pid

    };
    const operationName = "getLogsPower";
    const query = `query getLogsPower($from: String,
        $to: String, $uid: String, $pid: String)
        {
        logsPower(from: $from, to: $to,
        uid: $uid, pid: $pid) {
        dateTimeLocal
        value
        }
        }`;

    commonfunction.reportGraphql(
        endpoint,
        operationName,
        query,
        variables,
        function (reportGraphqlResponse) {
            var temp = [];
            var reportReponseData = reportGraphqlResponse.logsPower
            if (reportReponseData.length === 0) {
                return response.fail(res, "No Data Found", "");
            }
            reportReponseData.forEach((element) => {
                temp.push({
                    dateTimeLocal: element.dateTimeLocal,
                    value: element.value,
                });
            });
            var headerContent = [
                { header: "Date Time Local", key: "dateTimeLocal", width: 25 },
                { header: "Value", key: "value", width: 25 },
            ];
            var fileName = "Get Logs Power Report";
            excelController.download(
                temp,
                headerContent,
                res,
                fileName,
                function (datares) { }
            );

        }
    );
}

exports.exportGetLogsAnalog = async (req, res) => {
    const pid = req.params.pid; // "ckjtutsd022820vrrvg276ocs"
    const uid = req.params.uid; // "cl095jsy01292590zv3d77e9dq1"
    const from = req.params.from; // "2023-01-10T13:30:00"
    const to = req.params.to; // "2023-01-11T13:30:00"
    const timeSlice = req.params.timeSlice != undefined ? req.params.timeSlice : "raw"; // "raw"
    const endpoint = config.graphql_endpoint;
    const variables = {
        from: from,
        to: to,
        uid: uid,
        pid: pid,
        timeSlice: timeSlice
    };
    const operationName = "getLogsAnalog";
    const query = `query getLogsAnalog(
        $from: String
        $to: String
        $uid: String!
        $pid: String!
        $entityId: String
        $timeSlice: String
        ) {
        logsAnalog(
        from: $from
        to: $to
        uid: $uid
        pid: $pid
        entityId: $entityId
        timeSlice: $timeSlice
        ) {
        serial
        dateTimeLocal
        timezone
        unitName
        projectId
        projectName
        entityId
        entityIndex
        entityName
        valueCurr
        valueMax
        valueMin
        valueAvg
        __typename
        }
        }`;

    commonfunction.reportGraphql(
        endpoint,
        operationName,
        query,
        variables,
        function (reportGraphqlResponse) {
            var temp = [];
            var reportReponseData = reportGraphqlResponse.logsAnalog
            if (reportReponseData.length === 0) {
                return response.fail(res, "No Data Found", "");
            }
            reportReponseData.forEach((element) => {
                temp.push({
                    serial: element.serial,
                    dateTimeLocal: element.dateTimeLocal,
                    timezone: element.timezone,
                    unitName: element.unitName,
                    projectId: element.projectId,
                    projectName: element.projectName,
                    entityId: element.entityId,
                    entityIndex: element.entityIndex,
                    entityName: element.entityName,
                    valueCurr: element.valueCurr,
                    valueMax: element.valueMax,
                    valueMin: element.valueMin,
                    valueAvg: element.valueAvg,
                    __typename: element.__typename,
                });
            });
            var headerContent = [
                { header: "Serial", key: "serial", width: 25 },
                { header: "Date Time Local", key: "dateTimeLocal", width: 25 },
                { header: "Timezone", key: "timezone", width: 25 },
                { header: "Unit Name", key: "unitName", width: 25 },
                { header: "Project Id", key: "projectId", width: 25 },
                { header: "Project Name", key: "projectName", width: 25 },
                { header: "Entity Id", key: "entityId", width: 25 },
                { header: "Entity Index", key: "entityIndex", width: 25 },
                { header: "Entity Name", key: "entityName", width: 25 },
                { header: "Value Curr", key: "valueCurr", width: 25 },
                { header: "Value Max", key: "valueMax", width: 25 },
                { header: "Value Min", key: "valueMin", width: 25 },
                { header: "Value Avg", key: "valueAvg", width: 25 },
                { header: "Type Name", key: "__typename", width: 25 },
            ];
            var fileName = "Get Logs Analog Report";
            excelController.download(
                temp,
                headerContent,
                res,
                fileName,
                function (datares) { }
            );
        }
    );
}

exports.exportGetLogsWaterMeterTs = async (req, res) => {
    const pid = req.params.pid; // "ckjtutsd022820vrrvg276ocs"
    const uid = req.params.uid; // "cl095jsy01292590zv3d77e9dq1"
    const from = req.params.from; // "2023-01-09"
    const to = req.params.to; // "2023-01-11"
    const timeSlice = req.params.timeSlice != undefined ? req.params.timeSlice : "1 days"; // "raw"
    const entityType = req.params.entityType != undefined ? req.params.entityType : "WATERMETER"; // "raw"
    const endpoint = config.graphql_endpoint;
    const variables = {
        entityType: entityType,
        from: from,
        to: to,
        uid: uid,
        pid: pid,
        timeSlice: timeSlice
    };
    const operationName = "getLogsWaterMeterTs";
    const query = `query getLogsWaterMeterTs(
        $from: String
        $to: String
        $uid: String!
        $pid: String!
        $timeSlice: String
        $entityId: String
        $entityType: String
        $limit: Int
        $offset: Int
        ) {
        logsWaterMeterTs(
        from: $from
        to: $to
        uid: $uid
        pid: $pid
        timeSlice: $timeSlice
        entityId: $entityId
        entityType: $entityType
        limit: $limit
        offset: $offset
        ) {
        dateTime
        projectId
        projectName
        unitId
        unitName
        entityIndex
        entityId
        entityName
        sumAmount
        __typename
        }
        }`;

    commonfunction.reportGraphql(
        endpoint,
        operationName,
        query,
        variables,
        function (reportGraphqlResponse) {
            var temp = [];
            var reportReponseData = reportGraphqlResponse.logsWaterMeterTs
            if (reportReponseData.length === 0) {
                return response.fail(res, "No Data Found", "");
            }
            reportReponseData.forEach((element) => {
                temp.push({
                    dateTime: element.dateTime,
                    projectId: element.projectId,
                    projectName: element.projectName,
                    unitId: element.unitId,
                    unitName: element.unitName,
                    entityIndex: element.entityIndex,
                    entityId: element.entityId,
                    entityName: element.entityName,
                    sumAmount: element.sumAmount,
                    __typename: element.__typename,
                });
            });
            var headerContent = [
                { header: "Date Time", key: "dateTime", width: 25 },
                { header: "Project Id", key: "projectId", width: 25 },
                { header: "Project Name", key: "projectName", width: 25 },
                { header: "Unit Id", key: "unitId", width: 25 },
                { header: "Unit Name", key: "unitName", width: 25 },
                { header: "Entity Index", key: "entityIndex", width: 25 },
                { header: "Entity Id", key: "entityId", width: 25 },
                { header: "Entity Name", key: "entityName", width: 25 },
                { header: "Sum Amount", key: "sumAmount", width: 25 },
                { header: "Type Name", key: "__typename", width: 25 },
            ];
            var fileName = "Water Meter Log Report";
            excelController.download(
                temp,
                headerContent,
                res,
                fileName,
                function (datares) { }
            );
        }
    );
}

exports.exportGetLogsValveTs = async (req, res) => {
    const pid = req.params.pid; // "ckjtutsd022820vrrvg276ocs"
    const uid = req.params.uid; // "cl095jsy01292590zv3d77e9dq1"
    const timeSlice = req.params.timeSlice != undefined ? req.params.timeSlice : "1 day"; // "raw"

    const endpoint = config.graphql_endpoint;
    const variables = {
        uid: uid,
        pid: pid,
        timeSlice: timeSlice
    };
    const operationName = "getLogsValveTs";
    const query = `query getLogsValveTs($from: String, $to: String, $uid: String!, $pid: String!, $timeSlice: String, $entityId: String) {
          logsValveTs(
            from: $from
            to: $to
            uid: $uid
            pid: $pid
            timeSlice: $timeSlice
            entityId: $entityId
          ) {
            dateTime
            projectId
            projectName
            unitId
            unitName
            entityIndex
            entityId
            entityName
            sumAmount
            __typename
      }
}
    `;

    commonfunction.reportGraphql(
        endpoint,
        operationName,
        query,
        variables,
        function (reportGraphqlResponse) {
            var temp = [];
            var reportReponseData = reportGraphqlResponse.logsValveTs
            if (reportReponseData.length === 0) {
                return response.fail(res, "No Data Found", "");
            }
            reportReponseData.forEach((element) => {
                temp.push({
                    dateTime: element.dateTime,
                    projectId: element.projectId,
                    projectName: element.projectName,
                    unitId: element.unitId,
                    unitName: element.unitName,
                    entityIndex: element.entityIndex,
                    entityId: element.entityId,
                    entityName: element.entityName,
                    sumAmount: element.sumAmount,
                    __typename: element.__typename,
                });
            });
            var headerContent = [
                { header: "DateTime", key: "dateTime", width: 25 },
                { header: "Project Id", key: "projectId", width: 25 },
                { header: "Project Name", key: "projectName", width: 25 },
                { header: "Unit Id", key: "unitId", width: 25 },
                { header: "Unit Name", key: "unitName", width: 25 },
                { header: "Entity Index", key: "entityIndex", width: 25 },
                { header: "Entity Id", key: "entityId", width: 25 },
                { header: "Entity Name", key: "entityName", width: 25 },
                { header: "Sum Amount", key: "sumAmount", width: 25 },
                { header: "Type Name", key: "__typename", width: 25 },
            ];
            var fileName = "Valves Log Report";
            excelController.download(
                temp,
                headerContent,
                res,
                fileName,
                function (datares) { }
            );
        }
    );
}
