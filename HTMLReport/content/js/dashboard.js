/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.64197530864197, "KoPercent": 1.3580246913580247};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6698837209302325, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.745, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/swagger"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-10"], "isController": false}, {"data": [0.15, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.98, 500, 1500, "https://demoqa.com/books-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.91, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.98, 500, 1500, "https://demoqa.com/books?book=9781449325862-8"], "isController": false}, {"data": [0.92, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.98, 500, 1500, "https://demoqa.com/books?book=9781449325862-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-6"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-4"], "isController": false}, {"data": [0.98, 500, 1500, "https://demoqa.com/books?book=9781449325862-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-5"], "isController": false}, {"data": [0.89, 500, 1500, "https://demoqa.com/books?book=9781449325862-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-5"], "isController": false}, {"data": [0.79, 500, 1500, "https://demoqa.com/books-4"], "isController": false}, {"data": [0.99, 500, 1500, "https://demoqa.com/books?book=9781491950296-7"], "isController": false}, {"data": [0.0, 500, 1500, "Log_out_Test"], "isController": true}, {"data": [0.97, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.91, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.99, 500, 1500, "https://demoqa.com/books?book=9781491950296-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.97, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-7"], "isController": false}, {"data": [0.5936363636363636, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.99, 500, 1500, "https://demoqa.com/books-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-6"], "isController": false}, {"data": [0.04, 500, 1500, "Open_Api_Page_Test"], "isController": true}, {"data": [0.98, 500, 1500, "https://demoqa.com/books-9"], "isController": false}, {"data": [0.52, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.86, 500, 1500, "https://demoqa.com/swagger-7"], "isController": false}, {"data": [0.0, 500, 1500, "Log_In_Test"], "isController": true}, {"data": [0.42, 500, 1500, "https://demoqa.com/swagger-6"], "isController": false}, {"data": [0.03, 500, 1500, "https://demoqa.com/-10"], "isController": false}, {"data": [0.21, 500, 1500, "https://demoqa.com/swagger-5"], "isController": false}, {"data": [0.39, 500, 1500, "Seach_Book_Test"], "isController": true}, {"data": [0.35333333333333333, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.98, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.99, 500, 1500, "https://demoqa.com/swagger-0"], "isController": false}, {"data": [0.92, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.96, 500, 1500, "https://demoqa.com/swagger-4"], "isController": false}, {"data": [0.96, 500, 1500, "https://demoqa.com/swagger-3"], "isController": false}, {"data": [0.68, 500, 1500, "https://demoqa.com/swagger-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/swagger-1"], "isController": false}, {"data": [0.54, 500, 1500, "https://demoqa.com/-7"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/-8"], "isController": false}, {"data": [0.34, 500, 1500, "https://demoqa.com/-9"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/-3"], "isController": false}, {"data": [0.19, 500, 1500, "https://demoqa.com/-4"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/-5"], "isController": false}, {"data": [0.44, 500, 1500, "https://demoqa.com/-6"], "isController": false}, {"data": [0.86, 500, 1500, "https://demoqa.com/-0"], "isController": false}, {"data": [0.21, 500, 1500, "https://demoqa.com/-1"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/-2"], "isController": false}, {"data": [0.0, 500, 1500, "Add_Book_To_Collection_Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.48, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.69, 500, 1500, "https://demoqa.com/"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4050, 55, 1.3580246913580247, 1073.0256790123467, 45, 17719, 330.0, 3179.700000000001, 4707.349999999999, 9960.309999999996, 20.38895069901378, 1865.4115885698536, 16.873223439615984], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/books", 100, 0, 0.0, 538.8200000000002, 73, 2452, 506.5, 935.9000000000001, 1113.7499999999993, 2438.9999999999936, 0.8010894816951053, 82.83136158926139, 2.694414403588881], "isController": false}, {"data": ["https://demoqa.com/swagger", 50, 0, 0.0, 1974.3600000000001, 1221, 3528, 1792.0, 3127.5, 3323.3499999999995, 3528.0, 0.5474652359575167, 857.9149144927735, 2.196276552063944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-10", 50, 0, 0.0, 258.4000000000001, 68, 444, 261.5, 345.8, 402.1499999999997, 444.0, 1.3123359580052494, 0.3537155511811024, 0.7535679133858267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 200, 0, 0.0, 2732.345, 280, 6020, 2301.0, 5036.3, 5345.799999999999, 5832.770000000001, 4.221635883905013, 1.5469574538258575, 1.9232354881266491], "isController": false}, {"data": ["https://demoqa.com/books-10", 50, 0, 0.0, 277.15999999999985, 69, 755, 259.0, 416.79999999999995, 554.8999999999993, 755.0, 1.0261462053113328, 0.27657846940032016, 0.5892323913311168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 50, 0, 0.0, 141.5, 64, 416, 95.5, 274.7, 298.49999999999994, 416.0, 0.8905988386591144, 2.98837657190695, 0.4479085956146913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 50, 0, 0.0, 416.85999999999996, 277, 696, 400.5, 615.0999999999999, 694.0, 696.0, 0.8841107613961877, 34.329986329437354, 0.4964489138699296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-8", 50, 0, 0.0, 291.88, 123, 709, 268.0, 384.09999999999997, 535.9999999999989, 709.0, 1.3130252100840336, 0.3526190749737395, 0.7513991924894958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 50, 0, 0.0, 392.91999999999996, 275, 1546, 322.0, 584.0, 714.6499999999993, 1546.0, 0.8824411852950002, 4.652929677158892, 0.4817232642381885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-9", 50, 0, 0.0, 293.15999999999997, 99, 662, 275.5, 366.5, 523.1999999999995, 662.0, 1.3128183584519244, 1.833330324791262, 0.7038449988184635], "isController": false}, {"data": ["https://demoqa.com/books-0", 50, 0, 0.0, 174.09999999999997, 65, 427, 127.0, 302.4, 329.0499999999998, 427.0, 1.0319491455461074, 3.4626731094691654, 0.4998503673738958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 50, 0, 0.0, 109.04, 45, 276, 76.5, 216.49999999999997, 258.94999999999993, 276.0, 0.8920129163470287, 0.7596047490767667, 0.5174371799903663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-6", 50, 0, 0.0, 110.48, 67, 269, 84.0, 233.19999999999996, 243.14999999999998, 269.0, 1.3199926080413948, 0.8324976817629822, 0.7682769476490932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-4", 50, 0, 0.0, 325.3999999999999, 170, 848, 251.0, 584.4, 723.0999999999999, 848.0, 0.8857866671390863, 128.24478188610556, 0.5202958638191578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-7", 50, 0, 0.0, 296.1, 217, 707, 277.5, 356.5, 540.2499999999987, 707.0, 1.312714957074221, 0.35125380687337554, 0.7537855417574628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-5", 50, 0, 0.0, 164.10000000000005, 86, 392, 111.5, 305.09999999999997, 346.8999999999999, 392.0, 0.8917106577257812, 0.3726375240761877, 0.5084840695890998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-4", 50, 0, 0.0, 515.1, 192, 3224, 342.5, 617.3, 2688.0999999999995, 3224.0, 1.3067112690779845, 189.19890330173268, 0.7673866101296257], "isController": false}, {"data": ["https://demoqa.com/books-3", 50, 0, 0.0, 156.88000000000002, 50, 403, 173.0, 276.9, 292.6499999999999, 403.0, 1.0327804515316135, 0.8794771032573896, 0.5990933478611117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-6", 50, 0, 0.0, 129.85999999999999, 59, 331, 82.5, 282.7, 294.19999999999993, 331.0, 0.8920129163470287, 0.5615674283713629, 0.5191793927176066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-5", 50, 0, 0.0, 141.92, 86, 358, 110.5, 265.9, 308.59999999999997, 358.0, 1.3157202252513025, 0.5498271472554076, 0.7502689003210357], "isController": false}, {"data": ["https://demoqa.com/books-4", 50, 0, 0.0, 478.53999999999996, 181, 2193, 476.0, 690.7, 805.4999999999999, 2193.0, 1.0291242152927857, 148.9807449251312, 0.6044094756612123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-7", 50, 0, 0.0, 278.04, 69, 608, 253.5, 424.9, 437.6499999999999, 608.0, 0.8851750876323337, 0.23685349024537056, 0.5082841323513791], "isController": false}, {"data": ["Log_out_Test", 50, 2, 4.0, 16583.62, 9783, 22695, 17639.5, 19039.4, 21091.3, 22695.0, 1.194543326086437, 1845.2101892305948, 8.638228074157249], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 50, 0, 0.0, 373.30000000000007, 271, 797, 338.5, 475.2, 755.0499999999997, 797.0, 1.3141986016926879, 6.925800962979025, 0.7768402476607265], "isController": false}, {"data": ["https://demoqa.com/books-1", 50, 0, 0.0, 395.20000000000005, 83, 806, 411.5, 655.2, 720.8, 806.0, 1.0270736617230187, 45.27601481296988, 0.5676989184914342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-8", 50, 0, 0.0, 279.1999999999999, 84, 606, 254.5, 409.6, 425.7, 606.0, 0.8863990923273294, 0.2380466312402496, 0.5072557305701318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 50, 0, 0.0, 95.61999999999996, 55, 229, 76.0, 188.0, 212.59999999999997, 229.0, 1.320620163228652, 1.1245906077493992, 0.7660628681228706], "isController": false}, {"data": ["https://demoqa.com/books-2", 50, 0, 0.0, 324.29999999999995, 83, 884, 330.5, 431.5, 558.3499999999996, 884.0, 1.0274535590991287, 10.5058731814072, 0.5598819198997205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-9", 50, 0, 0.0, 273.75999999999993, 93, 456, 263.0, 370.09999999999997, 426.0499999999999, 456.0, 0.891774274095741, 1.2453488398016694, 0.4781094496860955], "isController": false}, {"data": ["https://demoqa.com/books-7", 50, 0, 0.0, 294.1, 220, 463, 271.5, 430.69999999999993, 440.45, 463.0, 1.0280027961676057, 0.2750710606932851, 0.5902984806118673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 550, 50, 9.090909090909092, 906.0236363636368, 61, 4706, 290.5, 3036.9000000000005, 3727.499999999999, 4621.4800000000005, 2.9662228118713627, 1.7814717083016487, 1.2334683638854282], "isController": false}, {"data": ["https://demoqa.com/books-8", 50, 0, 0.0, 291.71999999999997, 69, 641, 271.0, 418.4, 445.1999999999998, 641.0, 1.0285526207520777, 0.27622262764338024, 0.5886053083600756], "isController": false}, {"data": ["https://demoqa.com/books-5", 50, 0, 0.0, 221.57999999999996, 92, 432, 262.5, 339.7, 368.14999999999986, 432.0, 1.0312042403118362, 0.4309305844865634, 0.5880281054715697], "isController": false}, {"data": ["https://demoqa.com/books-6", 50, 0, 0.0, 186.61999999999992, 64, 404, 201.5, 326.99999999999994, 372.3499999999998, 404.0, 1.0325458450355196, 0.6503425470840906, 0.6009739488683298], "isController": false}, {"data": ["Open_Api_Page_Test", 50, 0, 0.0, 2194.7799999999997, 1376, 3717, 2045.0, 3402.7, 3577.1499999999996, 3717.0, 0.5859809907766592, 918.5366479836395, 2.9098763067376097], "isController": true}, {"data": ["https://demoqa.com/books-9", 50, 0, 0.0, 296.72, 92, 622, 273.5, 434.79999999999995, 484.7999999999996, 622.0, 1.026588645929576, 1.4336150035930604, 0.5503878580227903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 50, 0, 0.0, 711.7199999999998, 471, 1621, 674.0, 975.0999999999999, 1080.7999999999997, 1621.0, 0.8768084173608067, 172.15259891494958, 5.424738327487944], "isController": false}, {"data": ["https://demoqa.com/swagger-7", 50, 0, 0.0, 462.18, 287, 1032, 420.5, 674.4, 771.9499999999994, 1032.0, 0.5541701302299806, 9.85491999168745, 0.2797909739540039], "isController": false}, {"data": ["Log_In_Test", 50, 0, 0.0, 14691.28, 4776, 18789, 16735.0, 18517.9, 18674.3, 18789.0, 1.839858698851928, 11.32289290182514, 3.85579762474242], "isController": true}, {"data": ["https://demoqa.com/swagger-6", 50, 0, 0.0, 1048.16, 605, 2030, 919.0, 1754.1999999999998, 1878.9999999999998, 2030.0, 0.5520408951895157, 183.23121439336228, 0.28572429145551104], "isController": false}, {"data": ["https://demoqa.com/-10", 50, 0, 0.0, 6183.740000000002, 1357, 14341, 6502.5, 11101.3, 13082.849999999999, 14341.0, 1.4367816091954022, 1112.5979368714081, 0.7015535201149425], "isController": false}, {"data": ["https://demoqa.com/swagger-5", 50, 0, 0.0, 1716.4999999999998, 981, 3359, 1570.5, 2649.1, 3123.5499999999993, 3359.0, 0.5484440641898932, 587.2914712834688, 0.27797116143999473], "isController": false}, {"data": ["Seach_Book_Test", 50, 0, 0.0, 1374.5999999999997, 962, 2015, 1366.0, 1699.7, 1909.9, 2015.0, 1.0077800620792519, 199.61446114000083, 8.522236982001049], "isController": true}, {"data": ["https://demoqa.com/Account/v1/Login", 150, 0, 0.0, 1868.920000000001, 95, 4912, 1344.0, 3869.2, 4149.25, 4820.200000000002, 3.256197629488126, 1.9524466254938566, 1.4553253077106758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 50, 0, 0.0, 213.92000000000004, 69, 590, 241.0, 324.79999999999995, 468.6999999999995, 590.0, 1.3250298131707963, 4.446096130912945, 0.666396829866172], "isController": false}, {"data": ["https://demoqa.com/swagger-0", 50, 0, 0.0, 131.73999999999998, 69, 514, 94.0, 250.39999999999998, 357.94999999999976, 514.0, 0.5558767287766264, 0.2665385486614489, 0.2703384872370703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 50, 0, 0.0, 406.7199999999999, 289, 876, 361.0, 571.2, 659.0499999999995, 876.0, 1.3083525225036634, 37.05698979157944, 0.7622686669196148], "isController": false}, {"data": ["https://demoqa.com/swagger-4", 50, 0, 0.0, 322.14, 78, 614, 324.0, 498.79999999999995, 551.9499999999999, 614.0, 0.555068328911289, 0.5279653831636675, 0.2797024001154542], "isController": false}, {"data": ["https://demoqa.com/swagger-3", 50, 0, 0.0, 292.20000000000005, 81, 696, 302.0, 452.5, 562.55, 696.0, 0.554686546632498, 0.5075598576119634, 0.27951001763903216], "isController": false}, {"data": ["https://demoqa.com/swagger-2", 50, 0, 0.0, 636.1800000000001, 281, 1613, 571.0, 1234.4999999999998, 1425.0999999999995, 1613.0, 0.5544159228253035, 78.13149706159561, 0.27774938321228587], "isController": false}, {"data": ["https://demoqa.com/swagger-1", 50, 0, 0.0, 123.84000000000003, 63, 331, 98.5, 215.8, 271.09999999999957, 331.0, 0.5559879906594017, 1.8151053249749804, 0.2709355540420327], "isController": false}, {"data": ["https://demoqa.com/-7", 50, 0, 0.0, 1375.8599999999997, 86, 6854, 690.5, 4292.4, 5032.05, 6854.0, 1.6153523083384485, 1.0506099974154364, 0.7919012292831067], "isController": false}, {"data": ["https://demoqa.com/-8", 50, 0, 0.0, 2289.2, 394, 6657, 1701.5, 5377.399999999999, 5850.299999999999, 6657.0, 1.5807777426493834, 85.01465924359785, 0.7703204038887133], "isController": false}, {"data": ["https://demoqa.com/-9", 50, 0, 0.0, 2055.26, 309, 6026, 995.0, 4801.1, 5448.799999999998, 6026.0, 1.6502194791907323, 2.3045057180104953, 0.8847368106208126], "isController": false}, {"data": ["https://demoqa.com/-3", 50, 0, 0.0, 2770.72, 319, 7368, 1421.0, 6790.599999999999, 7024.449999999999, 7368.0, 1.7465418471426575, 273.7320242638326, 0.9278503562945368], "isController": false}, {"data": ["https://demoqa.com/-4", 50, 0, 0.0, 3905.7799999999997, 512, 13832, 1884.0, 8091.7, 9712.599999999999, 13832.0, 1.4262079981744538, 206.46906777696958, 0.7869214052427406], "isController": false}, {"data": ["https://demoqa.com/-5", 50, 0, 0.0, 3005.8800000000006, 407, 9062, 1513.0, 7472.399999999998, 7946.399999999999, 9062.0, 1.6305233980107616, 129.46629657182456, 0.82640785504647], "isController": false}, {"data": ["https://demoqa.com/-6", 50, 0, 0.0, 1725.7599999999998, 221, 5105, 774.5, 5001.4, 5044.45, 5105.0, 1.8954471359793774, 2.669026498350961, 0.944021522802229], "isController": false}, {"data": ["https://demoqa.com/-0", 50, 0, 0.0, 370.62000000000006, 76, 967, 265.0, 863.2, 882.6999999999999, 967.0, 2.272933903082098, 7.62675868260751, 1.0898540492317483], "isController": false}, {"data": ["https://demoqa.com/-1", 50, 2, 4.0, 3303.28, 593, 9750, 1770.0, 6747.1, 8126.249999999998, 9750.0, 1.670843776106934, 141.13604323308272, 0.806704260651629], "isController": false}, {"data": ["https://demoqa.com/-2", 50, 1, 2.0, 4380.14, 735, 13266, 2443.0, 8676.4, 9576.999999999996, 13266.0, 1.4685150375939848, 356.87846707222155, 0.7336265162417763], "isController": false}, {"data": ["Add_Book_To_Collection_Test", 50, 50, 100.0, 7103.859999999999, 3646, 11230, 6902.0, 10585.3, 10896.55, 11230.0, 1.6596408537192553, 655.9308432842633, 26.756036165648755], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 50, 0, 0.0, 91.69999999999999, 65, 239, 80.5, 135.49999999999997, 187.99999999999991, 239.0, 0.8899647573956071, 0.7378711709266312, 0.3172237660638639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 50, 0, 0.0, 932.6400000000002, 459, 3767, 783.5, 1081.8999999999999, 2809.7999999999997, 3767.0, 1.301100731218611, 241.79821167770433, 8.135920097777719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-10", 50, 0, 0.0, 263.56000000000006, 70, 409, 256.0, 337.9, 371.4, 409.0, 0.8869808944315339, 0.23906906920224938, 0.5093210604743573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 50, 0, 0.0, 99.7, 67, 285, 86.0, 175.49999999999991, 217.29999999999995, 285.0, 1.3156163662675964, 1.0214013781081437, 0.4689452868043678], "isController": false}, {"data": ["https://demoqa.com/", 200, 2, 1.0, 2639.4949999999994, 62, 17719, 127.0, 13838.500000000002, 14950.499999999996, 16895.48000000001, 1.1108827629876081, 428.84214425368117, 2.011294466554097], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 50, 90.9090909090909, 1.2345679012345678], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, 5.454545454545454, 0.07407407407407407], "isController": false}, {"data": ["Assertion failed", 2, 3.6363636363636362, 0.04938271604938271], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4050, 55, "401/Unauthorized", 50, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, "Assertion failed", 2, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 550, 50, "401/Unauthorized", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/-1", 50, 2, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["https://demoqa.com/-2", 50, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/", 200, 2, "Assertion failed", 2, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
