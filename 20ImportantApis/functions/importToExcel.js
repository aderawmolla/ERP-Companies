function exportToExcel() {
    var table = document.getElementById("reportTable");
    var workbook = XLSX.utils.table_to_book(table, { sheet: "Report" });
    var reportNameInput = document.getElementById("report");
    var reportName = reportNameInput.value.trim() || "financial_statement";
    var excelFileName =reportName + ".xlsx";
    XLSX.writeFile(workbook, excelFileName);
}