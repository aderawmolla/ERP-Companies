frappe.query_reports["Supplier Winner Report"] = {
    "filters": [
        {
             
	         	"fieldname": "rq",
			"label": __("Request for Quatation"),
			"fieldtype": "Link",
			"options": "Request for Quotation",
			"default": "",
			"reqd": 1,
		
        }
    ]
}
    document.addEventListener('DOMContentLoaded', function() {
        var data = [
            // Your data array with necessary information
            { "Item Code": "ABC123", "UOM": "Each", "Quantity": 5, "Total Amount": 100, "Supplier": "Supplier1", "Remark": "Good" },
            { "Item Code": "XYZ456", "UOM": "Pack", "Quantity": 2, "Total Amount": 50, "Supplier": "Supplier2", "Remark": "Excellent" },
            // Add more data as needed
        ];

        var seenSuppliers = [];
        var tableBody = document.getElementById('supplierTableBody');

        for (var i = 0; i < data.length; i++) {
            if (typeof data[i] === 'object') {
                if (!seenSuppliers.includes(data[i]["Supplier"])) {
                    var row = document.createElement('tr');
                    row.appendChild(createTableCell(data[i]["Item Code"]));
                    row.appendChild(createTableCell(data[i]["UOM"]));
                    row.appendChild(createTableCell(data[i]["Quantity"]));
                    row.appendChild(createTableCell(data[i]["Total Amount"]));
                    row.appendChild(createTableCell(data[i]["Total Amount"] * data[i]["Quantity"]));
                    row.appendChild(createTableCell(data[i]["Supplier"]));
                    row.appendChild(createTableCell(data[i]["Remark"]));
                    tableBody.appendChild(row);

                    seenSuppliers.push(data[i]["Supplier"]);
                }
            } else {
                var row = document.createElement('tr');
                var cell = document.createElement('td');
                cell.textContent = "Supplier information not available";
                row.appendChild(cell);
                tableBody.appendChild(row);
            }
        }

        function createTableCell(content) {
            var cell = document.createElement('td');
            cell.style.width = "12%";
            cell.textContent = content || "";
            return cell;
        }
    });
