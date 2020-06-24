$(document).ready(function(){
    //init_chart_doughnut();
    var data;

    pickDateBackend(moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), 0);

    /*$(".iHiddeShow").click(function(){
        $(this).toggleClass("fa-plus-circle fa-close");
        
        $("#divBelow").toggle();
    });*/
});

function pickDateBackend(startdate, enddate, source){
   
    
    var api_url = 'https://api.integracionektgt.com/rep-prod-v1/dashboard/orders'
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
    if (typeof NProgress != 'undefined') {
        
        NProgress.start();
        
    }
    $.ajax({
        
    url: api_url,
    method: "POST",
    contentType: "application/json",
    dataType: 'json',
    headers: { "x-api-key": "5OoJZQQzO7aUJ17qFRoKZ9iTuKL6PU9NDlTU9wsa" },
    data: JSON.stringify(params),
    success: function(result){
            data = JSON.parse(result.body);
        //console.log(data); 
        //console.log(data.ordersByStat.length);
        //Tables
        fillTables(data);

        fillTablesCategorias(data);
        if (typeof NProgress != 'undefined') {
    
            NProgress.done();
        }
        },
        error: function(result){
            if (typeof NProgress != 'undefined') {
        
                NProgress.done();
            }
        }
    })
}

function fillTables(data){
    var tableBody = '';
    var tableHeader = '';

    if(data.ordersByBrand != 'undefined' && data.ordersByBrand != null){
        //fillTables(data.ordersByBrand);
        tableHeader = '<thead><tr><th>Marca</th><th>Cantidad Productos</th><th>Monto</th></tr></thead>';
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
    
}

function fillTablesCategorias(data){
    var tableBody = '';
    var tableHeader = '';

    if(data){

        const arrs = {
            arrSemanas : data.weeksByDate,
            arrAmountByWeek : data.amountByCatByWeek,
            arrOrderByWeek : data.ordersByCatByWeek
        } 

        var tableHeader = ''
        var totalesTr = ''
        var tableBody = ''
        
        tableHeader = '<thead><tr>';
        arrs['arrSemanas'].forEach(element=>{
            tableHeader += '<th>Categoría</th><th>Sem '+element.Sem1.substr(4)+'</th><th>Sem '+element.Sem2.substr(4)+'</th><th>Sem '+element.Sem3.substr(4)+'</th><th>Sem '+element.Sem4.substr(4)+'</th><th>Sem '+element.Sem5.substr(4)+'</th><th>Sem '+element.Sem6.substr(4)+'</th><th>Total</th>';
        });

        tableHeader += '</tr></thead>';
        tableBody = '<tbody>'

        arrs['arrAmountByWeek'].forEach(element =>{
            tableBody += '<tr><td>'+ element.Categoria +'</td><td>'+ formatNumber(element.Monto1) +'</td><td>'+ formatNumber(element.Monto2) +'</td><td>'+ formatNumber(element.Monto3) +'</td><td>'+ formatNumber(element.Monto4) +'</td><td>'+ formatNumber(element.Monto5) +'</td><td>'+ formatNumber(element.Monto6) +'</td><td>'+ formatNumber(element.Total) +'</td></tr>';
        });
            
        //totalesTr = '<tr><td><strong>Totales</strong></td><td><strong>'+formatNumber(s1)+'</strong></td><td><strong>'+formatNumber(s2)+'</strong></td><td><strong>'+formatNumber(s3)+'</strong></td><td><strong>'+formatNumber(s4)+'</strong></td><td><strong>'+formatNumber(s5)+'</strong></td><td><strong>'+formatNumber(s6)+'</strong></td><td><strong>'+formatNumber(total)+'</strong></td></tr>';

        tableBody += totalesTr + '</tbody>'
        
        
        
        //console.log(tableHeader+tableBody);
        $('#datatable-buttons_categorias').html(tableHeader + tableBody);

        $("#datatable-buttons_categorias").DataTable({}).destroy();

        var handleDataTableButtons = function () {
            if ($("#datatable-buttons_categorias").length) {
                $("#datatable-buttons_categorias").DataTable({
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

        /**Tabla de ordes por categoría */
        tableBody = '<tbody>'

        arrs['arrOrderByWeek'].forEach(element =>{
            tableBody += '<tr><td>'+ element.Categoria +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.Monto1) +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.Monto2) +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.Monto3) +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.Monto4) +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.Monto5) +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.Monto6) +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.Total) +'</td></tr>';
        });
            
        //totalesTr = '<tr><td><strong>Totales</strong></td><td><strong>'+formatNumber(s1)+'</strong></td><td><strong>'+formatNumber(s2)+'</strong></td><td><strong>'+formatNumber(s3)+'</strong></td><td><strong>'+formatNumber(s4)+'</strong></td><td><strong>'+formatNumber(s5)+'</strong></td><td><strong>'+formatNumber(s6)+'</strong></td><td><strong>'+formatNumber(total)+'</strong></td></tr>';

        tableBody += totalesTr + '</tbody>';

        $('#datatable-buttons_categoriasOrdenes').html(tableHeader + tableBody);

        $("#datatable-buttons_categoriasOrdenes").DataTable({}).destroy();

        var handleDataTableButtons = function () {
            if ($("#datatable-buttons_categoriasOrdenes").length) {
                $("#datatable-buttons_categoriasOrdenes").DataTable({
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
        
}

function formatNumber(num){
    //console.log(num)
    const formatter = new Intl.NumberFormat('en-US',{
        
        minimumFractionDigits: 0
    });
    return 'Q' + formatter.format(num);
}