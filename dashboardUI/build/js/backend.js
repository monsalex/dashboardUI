$(document).ready(function(){
    //init_chart_doughnut();

    pickDateBackend(moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), 0)
});

function pickDateBackend(startdate, enddate, source){
    
    var api_url = 'https://3x6w4x1m7e.execute-api.us-east-1.amazonaws.com/dev/servreportingdashboardorders'
    var params = [];
    if(source == 1){
        params = {
            "fdFechaInit" : moment(startdate).format("YYYY-MM-DD") + " 00:00:00",
            "fdFechaFin" : moment(enddate).format("YYYY-MM-DD") + " 23:59:59",
        }
        //console.log(params)
    }
    else{
        params = {
            "fdFechaInit" : startdate + " 00:00:00",
            "fdFechaFin" : enddate + " 23:59:59",
        }
        
    }
    //console.log(JSON.stringify(params));
    $.ajax({
        
        url: api_url,
        method: "POST",
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(params),
        success: function(result){
            var data = JSON.parse(result.body);
            //console.log(data); 
            //console.log(data.ordersByStat.length);

            //Charts

            fillKPIs(data);
            
            //Charts

            //Tables
            //TableDropOff.drop();
            fillTables(data);
            
            //Tables

            //Charts
            fillCharts(data);
            //Charts

            //TipoPago
            fillTipoPago(data);
            //TIpoPago
        }
    })
}

function fillKPIs(data){
    if(data.ordersByStat != 'undefined' && data.ordersByStat != null){
        if(data.ordersByStat.length >0){
            var pagadas = 0;
            var nopagadas = 0;
            for(var i = 0; i < data.ordersByStat.length; i++){
            //if(data.ordersByStat[1] != null)
                if(data.ordersByStat[i].statusVtex == 'invoice' || data.ordersByStat[i].statusVtex == 'invoiced'){
                    pagadas += data.ordersByStat[i].ordersNumber;
                }

                if(data.ordersByStat[i].statusVtex == 'payment-pending'){
                    nopagadas += data.ordersByStat[i].ordersNumber;
                }
            }

            var ventas = new Intl.NumberFormat('en-US').format(pagadas);
            $('#VentasPagadas').html(ventas);

            var noventas = new Intl.NumberFormat('en-US').format(nopagadas);
            $('#OrdenesNoPago').html(noventas);

        }
    }      
    
    if(data.amounProdByStat != 'undefined' && data.amounProdByStat != null){
        if(data.amounProdByStat.length >0){
            if(data.amounProdByStat[0].invoicedProducts != null)
                if(data.amounProdByStat[0].invoicedProducts > 0){
                    var unidades = new Intl.NumberFormat('en-US').format(data.amounProdByStat[0].invoicedProducts);
                    var monto = data.amounProdByStat[0].amountInvoiced;
                    
                    var neew = formatNumber(monto);
                    $("#VentasUnidades").html(unidades);
                    $("#VentasMonto").html(neew);
                }
        }
    }
}

function fillCharts(data){
    //echart Line
    
    var arrDates = [];
    
    for(var i=6; i>=0; i--){
        //console.log(i);
        arrDates.push(reemp_Mes_(moment().subtract(i,'days').format("MMM D YY")));
        //console.log(arrDates[i]);
    }
    //arrDates.push(moment().format("MMM D YY"));

    //Inicialización Configuración
    if ($('#echart_line_').length) {

        var echartLine = echarts.init(document.getElementById('echart_line_'), theme);

        echartLine.setOption({
            title: {
                text: 'Ventas',
                subtext: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 220,
                y: 40,
                data: ['Canceladas', 'No pagadas', 'Pagadas']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: 'Linear',
                            bar: 'Barra',
                            stack: 'Vertical',
                            tiled: 'Íconos'
                        },
                        type: ['line', 'bar', 'stack', 'tiled']
                    },
                    restore: {
                        show: true,
                        title: "Restaurar"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Guardar imagen"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: arrDates//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: 'Pagadas',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [830, 612, 521, 954, 260, 830, 710]
            }, {
                name: 'No pagadas',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [5, 6, 10, 15, 3, 3, 2]
            }, {
                name: 'Canceladas',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [20, 30, 15, 40, 120, 90, 20]
            }]
        });

    }
}

function fillTipoPago(data){
    // Doughnut chart
    var labelsArr = [];
    var dataArr= [];
    var totalOrden = 0;
    var table='';
    var colorsRow = ['aero', 'purple', 'red', 'green', 'blue']
    if(data.ordersByPay != 'undefined' && data.ordersByPay != null){
        if(data.ordersByPay.length >0){
            for(var i = 0; i < data.ordersByPay.length; i++){
                labelsArr.push(data.ordersByPay[i].paymentType.replace('Pago en Efectivo','Efectivo'));
                dataArr.push(data.ordersByPay[i].ordersNumber);
                totalOrden += Number(data.ordersByPay[i].ordersNumber);
            }
            //console.log(totalOrden);
            for(var i = 0; i < data.ordersByPay.length; i++){
                table +='<tr><td><p><i class="fa fa-square '+ colorsRow[i] +'"></i>'+labelsArr[i]+' </p></td><td>'+Math.round(((data.ordersByPay[i].ordersNumber/totalOrden)*100))+'%</td></tr>';
            }

            $('.tile_info').html(table);

        }
    }

    var chart_doughnut_settings = {
        type: 'doughnut',
        tooltipFillColor: "rgba(51, 51, 51, 0.55)",
        data: {
            labels: labelsArr,
            datasets: [{
                data: dataArr,
                backgroundColor: [
                    "#BDC3C7",
                    "#9B59B6",
                    "#E74C3C",
                    "#26B99A",
                    "#3498DB"
                ],
                hoverBackgroundColor: [
                    "#CFD4D8",
                    "#B370CF",
                    "#E95E4F",
                    "#36CAAB",
                    "#49A9EA"
                ]
            }]
        },
        options: {
            legend: false,
            responsive: false
        }
    }
    
    $('.canvasDoughnut').each(function () {

        var chart_element = $(this);
        var chart_doughnut = new Chart(chart_element, chart_doughnut_settings);

    });
    
}

function fillTables(data){
    var tableBody = '';
    var tableHeader = '';

    if(data.ordersByBrand != 'undefined' && data.ordersByBrand != null){
        //fillTables(data.ordersByBrand);
        tableHeader = '<thead><tr><th>Marca</th><th>Cantidad Productos</th><th>Monto Total</th></tr></thead>';
        tableBody = '<tbody>'
        for(var i = 0; i < data.ordersByBrand.length; i++){
            tableBody += '<tr><td>'+ data.ordersByBrand[i].brandName +'</td><td>'+ data.ordersByBrand[i].quantityProducts +'</td><td>'+ formatNumber(data.ordersByBrand[i].price) +'</td></tr>';
        }
        tableBody += '</tbody>'
        

        
        //console.log(tableHeader+tableBody);
        $('#datatable-buttons_').html(tableHeader + tableBody);
        
        $("#datatable-buttons_").DataTable({}).destroy();

        var handleDataTableButtons = function () {
            if ($("#datatable-buttons_").length) {
                $("#datatable-buttons_").DataTable({
                    dom: "Blfrtip",
                    buttons: [
                        {
                            extend: "copy",
                            className: "btn-sm"
                        },
                        {
                            extend: "csv",
                            className: "btn-sm"
                        },
                        {
                            extend: "excel",
                            className: "btn-sm"
                        },
                        {
                            extend: "pdfHtml5",
                            className: "btn-sm"
                        },
                        {
                            extend: "print",
                            className: "btn-sm"
                        },
                    ],
                    responsive: true
                });
            }
        };
    
        TableManageButtons = function () {
            "use strict";
            return {
                init: function () {
                    handleDataTableButtons();
                }
            };
        }();

        
        TableManageButtons.init();
        
    }
    //$.getScript("../build/js/custom.min.js", function(data, textStatus, jqxhr){
        //console.log(jqxhr.status);
    //});
    
}

var dropTable = function(){
    if ($("#datatable-buttons_").length) {
        $("#datatable-buttons_").DataTable({}).destroy();
    }

} 

TableDropOff = function(){
    "use strict";
    return{
        drop: function(){
            dropTable();
        }
    }
}();



function reemp_Mes_(fecha){
        
    if(fecha.includes('Jan'))
        return fecha.replace('Jan','Ene');
    if(fecha.includes('Feb'))
        return fecha.replace('Feb','Feb');
    if(fecha.includes('Mar'))
        return fecha.replace('Mar','Mar');
    if(fecha.includes('Apr'))
        return fecha.replace('Apr','Abr');
    if(fecha.includes('May'))
        return fecha.replace('May','May');
    if(fecha.includes('Jun'))
        return fecha.replace('Jun','Jun') 
    if(fecha.includes('Jul'))
        return fecha.replace('Jul','Jul'); 
    if(fecha.includes('Aug'))
        return fecha.replace('Aug','Ago'); 
    if(fecha.includes('Sep'))
        return fecha.replace('Sep','Sep'); 
    if(fecha.includes('Oct'))
        return fecha.replace('Oct', 'Oct');
    if(fecha.includes('Nov'))
        return fecha.replace('Nov','Nov'); 
    if(fecha.includes('Dec'))
        return fecha.replace('Dec','Dic');  

}

function formatNumber(num){
    //console.log(num)
    const formatter = new Intl.NumberFormat('en-US',{
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
    return formatter.format(num);
}

var theme = {
    color: [
        '#26B99A', '#34495E', '#E6776C', '#3498DB',
        '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
    ],

    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'normal',
            color: '#408829'
        }
    },

    dataRange: {
        color: ['#1f610a', '#97b58d']
    },

    toolbox: {
        color: ['#408829', '#408829', '#408829', '#408829']
    },

    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#408829',
                type: 'dashed'
            },
            crossStyle: {
                color: '#408829'
            },
            shadowStyle: {
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    dataZoom: {
        dataBackgroundColor: '#eee',
        fillerColor: 'rgba(64,136,41,0.2)',
        handleColor: '#408829'
    },
    grid: {
        borderWidth: 0
    },

    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#408829'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },

    valueAxis: {
        axisLine: {
            lineStyle: {
                color: '#408829'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#eee']
            }
        }
    },
    timeline: {
        lineStyle: {
            color: '#408829'
        },
        controlStyle: {
            normal: { color: '#408829' },
            emphasis: { color: '#408829' }
        }
    },

    k: {
        itemStyle: {
            normal: {
                color: '#68a54a',
                color0: '#a9cba2',
                lineStyle: {
                    width: 1,
                    color: '#408829',
                    color0: '#86b379'
                }
            }
        }
    },
    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },
    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    strokeColor: '#408829'
                }
            }
        }
    },
    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },
    gauge: {
        startAngle: 225,
        endAngle: -45,
        axisLine: {
            show: true,
            lineStyle: {
                color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                width: 8
            }
        },
        axisTick: {
            splitNumber: 10,
            length: 12,
            lineStyle: {
                color: 'auto'
            }
        },
        axisLabel: {
            textStyle: {
                color: 'auto'
            }
        },
        splitLine: {
            length: 18,
            lineStyle: {
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {
                color: '#333'
            }
        },
        detail: {
            textStyle: {
                color: 'auto'
            }
        }
    },
    textStyle: {
        fontFamily: 'Arial, Verdana, sans-serif'
    }
};

function init_chart_doughnut() {

    if (typeof (Chart) === 'undefined') { return; }

    //console.log('init_chart_doughnut');

    if ($('.canvasDoughnut').length) {

        var chart_doughnut_settings = {
            type: 'doughnut',
            tooltipFillColor: "rgba(51, 51, 51, 0.55)",
            data: {
                labels: [
                    "Not",
                    "Blackberry",
                    "Other",
                    "Android",
                    "IOS"
                ],
                datasets: [{
                    data: [15, 20, 30, 10, 30],
                    backgroundColor: [
                        "#BDC3C7",
                        "#9B59B6",
                        "#E74C3C",
                        "#26B99A",
                        "#3498DB"
                    ],
                    hoverBackgroundColor: [
                        "#CFD4D8",
                        "#B370CF",
                        "#E95E4F",
                        "#36CAAB",
                        "#49A9EA"
                    ]
                }]
            },
            options: {
                legend: false,
                responsive: false
            }
        }

        $('.canvasDoughnut').each(function () {

            var chart_element = $(this);
            var chart_doughnut = new Chart(chart_element, chart_doughnut_settings);

        });

    }

}