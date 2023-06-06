const excel = require("exceljs");

const download = (InterpreterLog, headerContent, res, fileName, callback) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet(fileName);
  worksheet.columns = headerContent;
  // Add Array Rows
  worksheet.addRows(InterpreterLog);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + fileName + ".xlsx"
  );

  return workbook.xlsx.write(res).then(function (re) {
    callback(1);
    return false;
  });
};

module.exports = {
  download,
};
