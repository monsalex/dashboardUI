$(document).ready(function(){
    //alert('')
    var api_url = 'https://3x6w4x1m7e.execute-api.us-east-1.amazonaws.com/dev/servreportingdashboardorders'
    var params = {
        "fdFechaInit" : "2020-01-07",
        "fdFechaFin" : "2020-02-05",
    }
    $.ajax({
        url: api_url,
        method: "POST",
        contentType: "application/json",
        dataType: 'json',
        //data: JSON.stringify(params),
        success: function(result){
            var data = JSON.parse(result.body);
            console.log(data); 
            //console.log(data.ordersByStat.length);

            //Charts

            fillCharts(data);
            
            //Charts

            //Tables
            fillTables(data);
            
            //Tables
        }
    })
});

function fillCharts(data){
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

            var ventas = new Intl.NumberFormat().format(pagadas);
            $('#VentasPagadas').html(ventas);

            var noventas = new Intl.NumberFormat().format(nopagadas);
            $('#OrdenesNoPago').html(noventas);

        }
    }      
    
    if(data.amounProdByStat != 'undefined' && data.amounProdByStat != null){
        if(data.amounProdByStat.length >0){
            if(data.amounProdByStat[0].invoicedProducts != null)
                if(data.amounProdByStat[0].invoicedProducts > 0){
                    var unidades = data.amounProdByStat[0].invoicedProducts;
                    var monto = data.amounProdByStat[0].amountInvoiced;
                    
                    var neew = formatNumber(monto);
                    $("#VentasUnidades").html(unidades);
                    $("#VentasMonto").html(neew);
                }
        }
    }
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

function formatNumber(num){
    //console.log(num)
    const formatter = new Intl.NumberFormat('en-US',{
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
    return formatter.format(num);
}

