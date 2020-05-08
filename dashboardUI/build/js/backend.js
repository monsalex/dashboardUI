$(document).ready(function(){
    //init_chart_doughnut();
    var data;
    //console.log(data);
    pickDateBackend(moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), 0);

    /*$(".iHiddeShow").click(function(){
        $(this).toggleClass("fa-plus-circle fa-close");
        
        $("#divBelow").toggle();
    });*/
});



function pickDateBackend(startdate, enddate, source){
    //console.log(window.location.pathname.split('/').pop());
    var params = [];
    

    if(window.location.pathname.split('/').pop() != 'Analytics.html'){
        var api_url = 'https://api.integracionektgt.com/rep-prod-v1/dashboard/orders'
        
        if(source == 1){
            params = {
                "fdFechaInit" : moment(startdate).format("YYYY-MM-DD") + " 00:00:00",
                "fdFechaFin" : moment(enddate).format("YYYY-MM-DD") + " 23:59:59"
            }
            
    
        }
        else{
            params = {
                "fdFechaInit" : startdate + " 00:00:00",
                "fdFechaFin" : enddate + " 23:59:59"
            }
            
    
        }
        
        //console.log(JSON.stringify(params));
        if (typeof NProgress != 'undefined') {
            
            NProgress.start();
            
        }

        //console.log(api_url)
        $.ajax({
            
            url: api_url,
            headers: { 
                'x-api-key' : '5OoJZQQzO7aUJ17qFRoKZ9iTuKL6PU9NDlTU9wsa',
                'Content-Type' : 'application/json'
            },
            method: "POST",
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(params),
            success: function(result){
                data = JSON.parse(result.body);
                //console.log(data); 
                //console.log(data.ordersByStat.length);

                //Charts
                fillKPIs(data);
                
                //Tables tiendas
                fillTablesStore(data);

                //Charts
                fillCharts(data.ordersDateBefore, enddate);
                //Charts

                //TipoPago
                fillTipoPago(data);

                //Monto por status
                fillMontoStatus(data);

                //Monto por Semanas
                fillReporteSemanas(data.amountByWeek);

                //Ordenes por Semanas
                fillReporteOrdenes(data.ordersByWeek);

                fillTazBines(data.ordersByPayBines);

                fillCash(data);

                if (typeof NProgress != 'undefined') {
            
                    NProgress.done();
                }
            },
            error: function(result){
                if (typeof NProgress != 'undefined') {
            
                    NProgress.done();
                }
                //console.log(result);
            }
        })
    }else{
        var paramDate
        if(source == 1){
            paramDate = {
                "fdFechaInit" : moment(startdate).format("YYYY-MM-DD"),
                "fdFechaFin" : moment(enddate).format("YYYY-MM-DD")
            }
            
    
        }
        else{
            paramDate = {
                "fdFechaInit" : startdate,
                "fdFechaFin" : enddate
            }
            
    
        }
        getAanlyticsData(paramDate);
    }
}

function fillCash(data){
    //console.log(data);
    var arrAxisWeek = [];
    var arrAmountDataPayed =[];
    var arrNumDataPayed = []; 
    var arrAmountDataNotPayed =[];
    var arrNumDataNotPayed = []; 
    var s1 = 0;
    var s2 = 0;
    var s3 = 0;
    var s4 = 0;
    var s5 = 0;
    var s6 = 0;
    var total = 0;
    var n1 = 0;
    var n2 = 0;
    var n3 = 0;
    var n4 = 0;
    var n5 = 0;
    var n6 = 0;
    var totalNum = 0;

    if (data.paymentCashByWeek && data.weeksByDate){
        const arrs = {
            arrSemanas : data.weeksByDate,
            arrPayments : data.paymentCashByWeek
        } 

        

        arrs['arrSemanas'].forEach(element=>{
            arrAxisWeek.push('Sem ' + element.Sem1.substr(4));
            arrAxisWeek.push('Sem ' + element.Sem2.substr(4));
            arrAxisWeek.push('Sem ' + element.Sem3.substr(4));
            arrAxisWeek.push('Sem ' + element.Sem4.substr(4));
            arrAxisWeek.push('Sem ' + element.Sem5.substr(4));
            arrAxisWeek.push('Sem ' + element.Sem6.substr(4));
            
        });
        
        arrs['arrPayments'].forEach(element=>{
            if(element.Status == 'Pagadas'){
                arrAmountDataPayed.push(element.Monto1);
                arrAmountDataPayed.push(element.Monto2);
                arrAmountDataPayed.push(element.Monto3);
                arrAmountDataPayed.push(element.Monto4);
                arrAmountDataPayed.push(element.Monto5);
                arrAmountDataPayed.push(element.Monto6);

                arrNumDataPayed.push(element.Num1);
                arrNumDataPayed.push(element.Num2);
                arrNumDataPayed.push(element.Num3);
                arrNumDataPayed.push(element.Num4);
                arrNumDataPayed.push(element.Num5);
                arrNumDataPayed.push(element.Num6);
            }

            if(element.Status == 'No pagadas'){
                arrAmountDataNotPayed.push(element.Monto1);
                arrAmountDataNotPayed.push(element.Monto2);
                arrAmountDataNotPayed.push(element.Monto3);
                arrAmountDataNotPayed.push(element.Monto4);
                arrAmountDataNotPayed.push(element.Monto5);
                arrAmountDataNotPayed.push(element.Monto6);

                arrNumDataNotPayed.push(element.Num1);
                arrNumDataNotPayed.push(element.Num2);
                arrNumDataNotPayed.push(element.Num3);
                arrNumDataNotPayed.push(element.Num4);
                arrNumDataNotPayed.push(element.Num5);
                arrNumDataNotPayed.push(element.Num6);
            }

            s1 += parseInt(element.Monto1);
            s2 += parseInt(element.Monto2);
            s3 += parseInt(element.Monto3);
            s4 += parseInt(element.Monto4);
            s5 += parseInt(element.Monto5);
            s6 += parseInt(element.Monto6);
            total += parseInt(element.TotalMonto);
            
            n1 += parseInt(element.Num1);
            n2 += parseInt(element.Num2);
            n3 += parseInt(element.Num3);
            n4 += parseInt(element.Num4);
            n5 += parseInt(element.Num5);
            n6 += parseInt(element.Num6);
            totalNum += parseInt(element.TotalOrdenes);

        });

        if ($('#mainb_cash').length) {

            var echartBar = echarts.init(document.getElementById('mainb_cash'), theme);

            echartBar.setOption({
                title: {
                    text: '',//'Graph title',
                    subtext: ''//'Graph Sub-text'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['Pagadas Q', 'No pagadas Q']
                },
                toolbox: {
                    show: false
                },
                calculable: false,
                xAxis: [{
                    type: 'category',
                    data: arrAxisWeek//['1?', '2?', '3?', '4?', '5?', '6?', '7?', '8?', '9?', '10?', '11?', '12?']
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: 'Pagadas Q',
                    type: 'bar',
                    data: arrAmountDataPayed,//[2000, 4900, 7000, 23200, 25600, 76700],
                    
                    markLine: {
                        data: [{
                            type: 'average'
                        }]
                    }
                }, {
                    name: 'No pagadas Q',
                    type: 'bar',
                    data: arrAmountDataNotPayed,//[2600, 5900, 9000, 26400, 28700, 70700],
               
                    markLine: {
                        data: [{
                            type: 'average'
                        }]
                    }
                }]
            });

        }

        if ($('#echart_bar_horizontal_cash').length) {
            //console.log(arrAxisWeek);
            arrAxisWeek = [];
            arrs['arrSemanas'].forEach(element=>{
                arrAxisWeek.push(element.Sem1.substr(4));
                arrAxisWeek.push(element.Sem2.substr(4));
                arrAxisWeek.push(element.Sem3.substr(4));
                arrAxisWeek.push(element.Sem4.substr(4));
                arrAxisWeek.push(element.Sem5.substr(4));
                arrAxisWeek.push(element.Sem6.substr(4));
                
            });

            var echartBar = echarts.init(document.getElementById('echart_bar_horizontal_cash'), theme);
    
            echartBar.setOption({
                title: {
                    text: '',//'Bar Graph',
                    subtext: ''//'Graph subtitle'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    x: 100,
                    data: ['Pagadas', 'No pagadas']
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {
                            show: false,
                            title: "Save Image"
                        }
                    }
                },
                calculable: true,
                xAxis: [{
                    type: 'value',
                    boundaryGap: [0, 0.01]
                }],
                yAxis: [{
                    type: 'category',
                    data: arrAxisWeek//['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                }],
                series: [{
                    name: 'Pagadas',
                    type: 'bar',
                    data: arrNumDataPayed//[182, 23, 290, 104, 131, 630]
                }, {
                    name: 'No pagadas',
                    type: 'bar',
                    data: arrNumDataNotPayed//[193, 23, 31, 12, 134, 681]
                }]
            });
    
        }


        /*** Tablas*/
        /***** Montos */
    
        var tableHeader = ''
        var totalesTr = ''
        var tableBody = ''
        
        tableHeader = '<thead><tr>';
        arrs['arrSemanas'].forEach(element=>{
            tableHeader += '<th>Efectivo</th><th>Sem '+element.Sem1.substr(4)+'</th><th>Sem '+element.Sem2.substr(4)+'</th><th>Sem '+element.Sem3.substr(4)+'</th><th>Sem '+element.Sem4.substr(4)+'</th><th>Sem '+element.Sem5.substr(4)+'</th><th>Sem '+element.Sem6.substr(4)+'</th><th>Total</th><th>Pct</th>';
        });

        tableHeader += '</tr></thead>';
        tableBody = '<tbody>'

        arrs['arrPayments'].forEach(element =>{
            tableBody += '<tr><td>'+ element.Status +'</td><td>'+ formatNumber(element.Monto1) +'</td><td>'+ formatNumber(element.Monto2) +'</td><td>'+ formatNumber(element.Monto3) +'</td><td>'+ formatNumber(element.Monto4) +'</td><td>'+ formatNumber(element.Monto5) +'</td><td>'+ formatNumber(element.Monto6) +'</td><td>'+ formatNumber(element.TotalMonto) +'</td><td>'+Math.round((element.TotalMonto/total)*100)+'%</td></tr>';
        });
            
        totalesTr = '<tr><td><strong>Totales</strong></td><td><strong>'+formatNumber(s1)+'</strong></td><td><strong>'+formatNumber(s2)+'</strong></td><td><strong>'+formatNumber(s3)+'</strong></td><td><strong>'+formatNumber(s4)+'</strong></td><td><strong>'+formatNumber(s5)+'</strong></td><td><strong>'+formatNumber(s6)+'</strong></td><td><strong>'+formatNumber(total)+'</strong></td><td><strong>100%</strong></td></tr>';

        tableBody += totalesTr + '</tbody>'

        $("#datatable-buttons_orderCash").DataTable({}).destroy();
        $("#datatable-buttons_orderCash").html(tableHeader + tableBody);

        var handleDataTableButtons = function () {
            if ($("#datatable-buttons_orderCash").length) {
                $("#datatable-buttons_orderCash").DataTable({
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


        /****** Ordenes */

        var tableHeader = ''
        
        tableHeader = '<thead><tr>';
        arrs['arrSemanas'].forEach(element=>{
            tableHeader += '<th>Efectivo</th><th>Sem '+element.Sem1.substr(4)+'</th><th>Sem '+element.Sem2.substr(4)+'</th><th>Sem '+element.Sem3.substr(4)+'</th><th>Sem '+element.Sem4.substr(4)+'</th><th>Sem '+element.Sem5.substr(4)+'</th><th>Sem '+element.Sem6.substr(4)+'</th><th>Total</th><th>Pct</th>';
        });

        tableHeader += '</tr></thead>';
        tableBody = '<tbody>'

        arrs['arrPayments'].forEach(element =>{
            tableBody += '<tr><td>'+ element.Status +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.Num1) +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.Num2) +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.Num3) +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.Num4) +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.Num5) +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.Num6) +'</td><td>'+ new Intl.NumberFormat('en-US').format(element.TotalOrdenes) +'</td><td>'+Math.round((element.TotalOrdenes/totalNum)*100)+'%</td></tr>';
        });
            
        totalesTr = '<tr><td><strong>Totales</strong></td><td><strong>'+new Intl.NumberFormat('en-US').format(n1)+'</strong></td><td><strong>'+new Intl.NumberFormat('en-US').format(n2)+'</strong></td><td><strong>'+new Intl.NumberFormat('en-US').format(n3)+'</strong></td><td><strong>'+new Intl.NumberFormat('en-US').format(n4)+'</strong></td><td><strong>'+new Intl.NumberFormat('en-US').format(n5)+'</strong></td><td><strong>'+new Intl.NumberFormat('en-US').format(n6)+'</strong></td><td><strong>'+new Intl.NumberFormat('en-US').format(totalNum)+'</strong></td><td><strong>100%</strong></td></tr>';

        tableBody += totalesTr + '</tbody>'

        $("#datatable-buttons_orderNum").DataTable({}).destroy();
        $("#datatable-buttons_orderNum").html(tableHeader + tableBody);

        var handleDataTableButtons = function () {
            if ($("#datatable-buttons_orderNum").length) {
                $("#datatable-buttons_orderNum").DataTable({
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

function fillTazBines(data){
    var arrData = [{label: 'Sin registros', value:0}];
    
    if(data){
         arrData = [];
        data.forEach(element=>{
            //console.log(element.paymentType);
            arrData.push({label: element.paymentType, value: element.ordersNumber});
        });
    }

    if ($('#graph_donut_TAZ').length) {

        Morris.Donut({
            element: 'graph_donut_TAZ',
            data: arrData, /*[
                { label: 'Jam', value: 0 },
                { label: 'Frosted', value: 40 },
                { label: 'Custard', value: 25 },
                { label: 'Sugar', value: 10 }
            ],*/
            colors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            formatter: function (y) {
                return y + "";
            },
            resize: true
        });

    }
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

function fillCharts(data, enddate){

    var arrPagadas = [];
    var arrNoPagadas = [];
    var arrCanceladas = [];
    var arrDates = [];

    const arrs = {
        invoice: arrPagadas,
        'payment-pending': arrNoPagadas,
        cancel: arrCanceladas
    }
    
    for(var i=6; i>=0; i--){
        //console.log(i);
        arrDates.push(reemp_Mes_(moment(enddate).subtract(i,'days').format("MMM D YY")));
        
    }

    data.forEach(element => {
        let status = element.vtexStatus;
        let arr = arrs[status];
        if(arr) arr.push(element.AmountPerDay);
    })



    //Inicialización Configuración
    if ($('#echart_line_').length) {

        var echartLine = echarts.init(document.getElementById('echart_line_'), theme);

        echartLine.setOption({
            title: {
                text: 'Monto por tipo de orden',
                subtext: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 220,
                y: 40,
                data: ['Q Pagadas', 'Q No pagadas', 'Q Canceladas']
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
                name: 'Q Pagadas',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: arrPagadas//[830, 612, 521, 954, 260, 830, 710]
            }, {
                name: 'Q No pagadas',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: arrNoPagadas//[5, 6, 10, 15, 3, 3, 2]
            }, {
                name: 'Q Canceladas',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: arrCanceladas//[20, 30, 15, 40, 120, 90, 20]
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

            

        }
    }else{
        labelsArr.push('No registrado.');
        dataArr.push(1);
        totalOrden += 1;
        table +='<tr><td><p><i class="fa fa-square '+ colorsRow[0] +'"></i>'+labelsArr[0]+' </p></td><td>'+Math.round(((dataArr[0]/totalOrden)*100))+'%</td></tr>';
    }

    $('.tile_info').html(table);

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

function fillMontoStatus(data){
    var divStatusOrdenes = '';
    var divStatusNumOrdenes = ''
    var divEach ='';
    var montoTotal = 0;
    var ordersTotal = 0;
    var arrAmountCancel = [];
    var arrAmountHandling = [];
    var arrAmountInvoice = [];
    var arrAmountApprove = [];
    var arrAmountPending = [];
    var arrAmountCreated = [];
    var arrTotales = [];
    var conteo = 0;
    
    if(data.amountByStat){
        for(var i=0; i < data.amountByStat.length; i++){
            if(data.amountByStat[i].statusVtex == 'approve-payment' || data.amountByStat[i].statusVtex == 'cancel'
                || data.amountByStat[i].statusVtex == 'canceled' || data.amountByStat[i].statusVtex == 'invoice'
                || data.amountByStat[i].statusVtex == 'invoiced' || data.amountByStat[i].statusVtex == 'order-created'
                || data.amountByStat[i].statusVtex == 'ready-for-handling' || data.amountByStat[i].statusVtex == 'start-handling'
                || data.amountByStat[i].statusVtex == 'handling' || data.amountByStat[i].statusVtex == 'payment-pending'){
                    montoTotal += Number(data.amountByStat[i].amounSatus);
                    
                    
                    if(data.amountByStat[i].statusVtex == 'order-created'){
                        arrAmountCreated.push(data.amountByStat[i].amounSatus);
                    }

                    if(data.amountByStat[i].statusVtex == 'cancel'|| data.amountByStat[i].statusVtex == 'canceled' ){
                        arrAmountCancel.push(data.amountByStat[i].amounSatus);
                    }

                    if(data.amountByStat[i].statusVtex == 'invoice'|| data.amountByStat[i].statusVtex == 'invoiced' ){
                        arrAmountInvoice.push(data.amountByStat[i].amounSatus);
                    }

                    if(data.amountByStat[i].statusVtex == 'ready-for-handling' || data.amountByStat[i].statusVtex == 'start-handling'
                    || data.amountByStat[i].statusVtex == 'handling'){
                        arrAmountHandling.push(data.amountByStat[i].amounSatus);
                    }

                    if(data.amountByStat[i].statusVtex == 'approve-payment'){
                        arrAmountApprove.push(data.amountByStat[i].amounSatus);
                    }

                    if(data.amountByStat[i].statusVtex == 'payment-pending'){
                        arrAmountPending.push(data.amountByStat[i].amounSatus);
                    }


            }
        }

        for(var i=0; i<arrAmountCreated.length;i++){
            conteo += arrAmountCreated[i];
        }
        if(conteo >0){
            arrTotales.push(['order-created', conteo]);
        }

        conteo = 0;
        for(var i=0; i<arrAmountCancel.length;i++){
            conteo += arrAmountCancel[i];
        }
        if(conteo >0){
            arrTotales.push(['cancel', conteo]);
        }

        conteo = 0;
        for(var i=0; i<arrAmountPending.length;i++){
            conteo += arrAmountPending[i];
        }
        if(conteo >0){
            arrTotales.push(['payment-pending', conteo]);
        }

        conteo = 0;
        for(var i=0; i<arrAmountApprove.length;i++){
            conteo += arrAmountApprove[i];
        }
        if(conteo >0){
            arrTotales.push(['approve-payment', conteo]);
        }

        conteo = 0;
        for(var i=0; i<arrAmountHandling.length;i++){
            conteo += arrAmountHandling[i];
        }
        if(conteo >0){
            arrTotales.push(['handling', conteo]);
        }

        conteo = 0;
        for(var i=0; i<arrAmountInvoice.length;i++){
            conteo += arrAmountInvoice[i];
        }
        if(conteo >0){
            arrTotales.push(['invoiced', conteo]);
        }

        for(var i=0; i < arrTotales.length; i++){
            
            divEach = '';
            divEach += '<div class="widget_summary">';
            divEach += '<div class="w_left w_25">';
            divEach += '<span>'+cambiarNombreStatus(arrTotales[i][0])[0]+'</span>';
            divEach += '</div>';
            divEach += '<div class="w_center w_50">';
            divEach += '<div class="progress">';
            divEach += '<div class="progress-bar bg-'+cambiarNombreStatus(arrTotales[i][0])[1]+'" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: '+Math.round((arrTotales[i][1]/montoTotal)*100)+'%;">';
            divEach += '<span class="sr-only">60% Complete</span>';
            divEach += '</div>';
            divEach += '</div>';
            divEach += '</div>';
            divEach += '<div class="w_right w_25">';
            divEach += '<span>'+ formatNumber(arrTotales[i][1])+'</span>';
            divEach += '</div>';
            divEach += '<div class="clearfix"></div>';
            divEach += '</div>';

            divStatusOrdenes += divEach;
            
        }
        //console.log(divStatusOrdenes);
        $("#divMontoStatusOrdenes").html(divStatusOrdenes);

    }

    

    if(data.ordersByStat != 'undefined' && data.ordersByStat != 'null'){

        arrAmountCancel = [];
        arrAmountHandling = [];
        arrAmountInvoice = [];
        arrAmountPending = [];
        arrAmountApprove = [];
        arrAmountCreated = [];
        arrTotales = [];
        conteo = 0;
        
        for(var i=0; i < data.ordersByStat.length; i++){
            if(data.ordersByStat[i].statusVtex == 'approve-payment' || data.ordersByStat[i].statusVtex == 'cancel'
            || data.ordersByStat[i].statusVtex == 'canceled' || data.ordersByStat[i].statusVtex == 'invoice'
            || data.ordersByStat[i].statusVtex == 'invoiced' || data.ordersByStat[i].statusVtex == 'order-created'
            || data.ordersByStat[i].statusVtex == 'ready-for-handling' || data.ordersByStat[i].statusVtex == 'start-handling'
            || data.ordersByStat[i].statusVtex == 'handling' || data.ordersByStat[i].statusVtex == 'payment-pending'){
                    
                    
                    ordersTotal += Number(data.ordersByStat[i].ordersNumber);
                    

                    if(data.ordersByStat[i].statusVtex == 'order-created'){
                        arrAmountCreated.push(data.ordersByStat[i].ordersNumber);
                    }

                    if(data.ordersByStat[i].statusVtex == 'cancel'|| data.ordersByStat[i].statusVtex == 'canceled' ){
                        arrAmountCancel.push(data.ordersByStat[i].ordersNumber);
                    }

                    if(data.ordersByStat[i].statusVtex == 'invoice'|| data.ordersByStat[i].statusVtex == 'invoiced' ){
                        arrAmountInvoice.push(data.ordersByStat[i].ordersNumber);
                    }

                    if(data.ordersByStat[i].statusVtex == 'ready-for-handling' || data.ordersByStat[i].statusVtex == 'start-handling'
                    || data.ordersByStat[i].statusVtex == 'handling'){
                        arrAmountHandling.push(data.ordersByStat[i].ordersNumber);
                    }

                    if(data.ordersByStat[i].statusVtex == 'approve-payment'){
                        arrAmountApprove.push(data.ordersByStat[i].ordersNumber);
                    }

                    if(data.ordersByStat[i].statusVtex == 'payment-pending'){
                        arrAmountPending.push(data.ordersByStat[i].ordersNumber);
                    }


                }
        }
        
        for(var i=0; i<arrAmountCreated.length;i++){
            conteo += arrAmountCreated[i];
        }
        if(conteo >0){
            arrTotales.push(['order-created', conteo]);
        }

        conteo = 0;
        for(var i=0; i<arrAmountCancel.length;i++){
            conteo += arrAmountCancel[i];
        }
        if(conteo >0){
            arrTotales.push(['cancel', conteo]);
        }

        conteo = 0;
        for(var i=0; i<arrAmountPending.length;i++){
            conteo += arrAmountPending[i];
        }
        if(conteo >0){
            arrTotales.push(['payment-pending', conteo]);
        }

        conteo = 0;
        for(var i=0; i<arrAmountApprove.length;i++){
            conteo += arrAmountApprove[i];
        }
        if(conteo >0){
            arrTotales.push(['approve-payment', conteo]);
        }

        conteo = 0;
        for(var i=0; i<arrAmountHandling.length;i++){
            conteo += arrAmountHandling[i];
        }
        if(conteo >0){
            arrTotales.push(['handling', conteo]);
        }

        conteo = 0;
        for(var i=0; i<arrAmountInvoice.length;i++){
            conteo += arrAmountInvoice[i];
        }
        if(conteo >0){
            arrTotales.push(['invoiced', conteo]);
        }
        

        for(var i=0; i < arrTotales.length; i++){
            
            divEach = '';
            divEach += '<div class="widget_summary">';
            divEach += '<div class="w_left w_25">';
            divEach += '<span>'+cambiarNombreStatus(arrTotales[i][0])[0]+'</span>';
            divEach += '</div>';
            divEach += '<div class="w_center w_55">';
            divEach += '<div class="progress">';
            divEach += '<div class="progress-bar bg-'+cambiarNombreStatus(arrTotales[i][0])[1]+'" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: '+Math.round((arrTotales[i][1]/ordersTotal)*100)+'%;">';
            divEach += '<span class="sr-only">60% Complete</span>';
            divEach += '</div>';
            divEach += '</div>';
            divEach += '</div>';
            divEach += '<div class="w_right w_20">';
            divEach += '<span>'+ new Intl.NumberFormat('en-US').format(arrTotales[i][1])+'</span>';
            divEach += '</div>';
            divEach += '<div class="clearfix"></div>';
            divEach += '</div>';

            divStatusNumOrdenes += divEach;
                
        }
        //console.log(divStatusOrdenes);
        $("#divStatusNumOrdenes").html(divStatusNumOrdenes);

    }
} 

function cambiarNombreStatus(statusName){
    switch(statusName){
        case 'approve-payment':
            return ['Pago confirmado','green'];
        case 'request-cancel'://No Contar
        case 'cancel':
        case 'canceled':
            return ['Canceladas', 'red'];
        case 'invoice':
        case 'invoiced':
            return ['Facturadas', 'green'];
        case 'on-order-completed': // No contar
            return ['Orden completa', 'green'];
        case 'on-order-completed-ffm': //No contar
            return ['Orden completa en FC', 'green'];
        case 'order-accepted': // No contar
            return ['Orden aceptada', 'green'];
        case 'order-created':
            return ['Orden creada', 'blue-sky'];
        case 'waiting-ffmt-authorization': //No Contar
            return ['En autorización por FC', 'green'];
        case 'ready-for-handling':
        case 'start-handling':
        case 'handling':
            return ['Preparación para envío','blue'];
        case 'payment-pending':
            return ['Pago pendiente', 'orange'];
        case 'window-to-cancel': //No contar
            return ['Ventana de Cancelación','orange'];
        default:
            return ['Otro', 'grey'];
    }
}

function fillTablesStore(data){
    var tableBody = '';
    var tableHeader = '';
    var cont = 1;

    if (data.amountStoresByWeek && data.weeksByDate){
        const arrs = {
            arrSemanas : data.weeksByDate,
            arrMontos : data.amountStoresByWeek
        } 
        tableHeader = '<thead><tr>';
        arrs['arrSemanas'].forEach(element=>{
            tableHeader += '<th>Tienda</th><th>Semana '+element.Sem1.substr(4)+'</th><th>Semana '+element.Sem2.substr(4)+'</th><th>Semana '+element.Sem3.substr(4)+'</th><th>Semana '+element.Sem4.substr(4)+'</th><th>Semana '+element.Sem5.substr(4)+'</th><th>Semana '+element.Sem6.substr(4)+'</th><th>Total</th>';
        });
        
        tableHeader += '</tr></thead>';
        tableBody = '<tbody>'

        arrs['arrMontos'].forEach(element =>{
            tableBody += '<tr><td>'+ element.Street +'</td><td>'+ formatNumber(element.Monto1) +'</td><td>'+ formatNumber(element.Monto2) +'</td><td>'+ formatNumber(element.Monto3) +'</td><td>'+ formatNumber(element.Monto4) +'</td><td>'+ formatNumber(element.Monto5) +'</td><td>'+ formatNumber(element.Monto6) +'</td><td>'+ formatNumber(element.Total) +'</td></tr>';
            cont++;
        });
            
        
        tableBody += '</tbody>'

    $("#datatable-buttons_stores").DataTable({}).destroy();
    $("#datatable-buttons_stores").html(tableHeader + tableBody);

        var handleDataTableButtons = function () {
            if ($("#datatable-buttons_stores").length) {
                $("#datatable-buttons_stores").DataTable({
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

function fillReporteSemanas(data){
    var tableBody = '';
    var tableHeader = '<thead><tr><th>Tipo Pago</th><th>Semana '+data[0]['Sem1'].substr(4)+'</th><th>Semana '+data[0]['Sem2'].substr(4)+'</th><th>Semana '+data[0]['Sem3'].substr(4)+'</th><th>Semana '+data[0]['Sem4'].substr(4)+'</th><th>Semana '+data[0]['Sem5'].substr(4)+'</th><th>Semana '+data[0]['Sem6'].substr(4)+'</th><th>Total</th><th>%</th></tr></thead>';
    var totalesTr = '';
    var s1 = 0;
    var s2 = 0;
    var s3 = 0;
    var s4 = 0;
    var s5 = 0;
    var s6 = 0;
    var p1 = 0;
    var p2 = 0;
    var p3 = 0;
    var p4 = 0;
    var p5 = 0;
    var p6 = 0;
    var total = 0;
    var pctT = 0;
    var pctE = 0;
    var pctTaz = 0;
    
    if(data){
        data.forEach(element =>{
            s1 += parseInt(element.Monto1);
            s2 += parseInt(element.Monto2);
            s3 += parseInt(element.Monto3);
            s4 += parseInt(element.Monto4);
            s5 += parseInt(element.Monto5);
            s6 += parseInt(element.Monto6);
            total += parseInt(element.Total);
        });

        tableBody = '<tbody>'
        data.forEach(element =>{
            if(element.Tipo == 'TAZ'){
                tableBody += '<tr><td><strong>'+element.Tipo+'</strong></td><td>'+formatNumber(element.Monto1)+'</td><td>'+formatNumber(element.Monto2)+'</td><td>'+formatNumber(element.Monto3)+'</td><td>'+formatNumber(element.Monto4)+'</td><td>'+formatNumber(element.Monto5)+'</td><td>'+formatNumber(element.Monto6)+'</td><td>'+formatNumber(element.Total)+'</td><td>'+Math.round((element.Total*100)/total)+'%</td></tr>';
                tableBody += '<tr><td><strong>TAZ(%)</strong></td><td align="center">'+Math.round((element.Monto1*100)/s1)+'%</td><td align="center">'+Math.round((element.Monto2*100)/s2)+'%</td><td align="center">'+Math.round((element.Monto3*100)/s3)+'%</td><td align="center">'+Math.round((element.Monto4*100)/s4)+'%</td><td align="center">'+Math.round((element.Monto5*100)/s5)+'%</td><td align="center">'+Math.round((element.Monto6*100)/s6)+'%</td><td align="center">'+Math.round((element.Total*100)/total)+'%</td><td></td></tr>';

            }else{
                tableBody += '<tr><td><strong>'+element.Tipo+'</strong></td><td>'+formatNumber(element.Monto1)+'</td><td>'+formatNumber(element.Monto2)+'</td><td>'+formatNumber(element.Monto3)+'</td><td>'+formatNumber(element.Monto4)+'</td><td>'+formatNumber(element.Monto5)+'</td><td>'+formatNumber(element.Monto6)+'</td><td>'+formatNumber(element.Total)+'</td><td>'+Math.round((element.Total*100)/total)+'%</td></tr>';
            }
        });
        totalesTr = '<tr><td><strong>Totales</strong></td><td><strong>'+formatNumber(s1)+'</strong></td><td><strong>'+formatNumber(s2)+'</strong></td><td><strong>'+formatNumber(s3)+'</strong></td><td><strong>'+formatNumber(s4)+'</strong></td><td><strong>'+formatNumber(s5)+'</strong></td><td><strong>'+formatNumber(s6)+'</strong></td><td><strong>'+formatNumber(total)+'</strong></td><td><strong>100%</strong></td></tr>';
        tableBody += totalesTr + '</tbody>';

    }

    

    $("#datatable-buttons_semanas").DataTable({}).destroy();
    $("#datatable-buttons_semanas").html(tableHeader+tableBody);

    var handleDataTableButtons = function () {
        if ($("#datatable-buttons_semanas").length) {
            $("#datatable-buttons_semanas").DataTable({
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

function fillReporteOrdenes(data){
    var tableBody = '';
    var tableHeader = '<thead><tr><th>Tipo Pago</th><th>Semana '+data[0]['Sem1'].substr(4)+'</th><th>Semana '+data[0]['Sem2'].substr(4)+'</th><th>Semana '+data[0]['Sem3'].substr(4)+'</th><th>Semana '+data[0]['Sem4'].substr(4)+'</th><th>Semana '+data[0]['Sem5'].substr(4)+'</th><th>Semana '+data[0]['Sem6'].substr(4)+'</th><th>Total</th><th>%</th></tr></thead>';
    var totalesTr = '';
    var s1 = 0;
    var s2 = 0;
    var s3 = 0;
    var s4 = 0;
    var s5 = 0;
    var s6 = 0;
    var p1 = 0;
    var p2 = 0;
    var p3 = 0;
    var p4 = 0;
    var p5 = 0;
    var p6 = 0;
    var total = 0;
    var pctT = 0;
    var pctE = 0;
    var pctTaz = 0;
    if(data){

        data.forEach(element =>{
            s1 += parseInt(element.Total1);
            s2 += parseInt(element.Total2);
            s3 += parseInt(element.Total3);
            s4 += parseInt(element.Total4);
            s5 += parseInt(element.Total5);
            s6 += parseInt(element.Total6);
            total += parseInt(element.Total);
        });

        tableBody = '<tbody>'
        data.forEach(element =>{
            if(element.Tipo == 'TAZ'){
                
                tableBody += '<tr><td><strong>'+element.Tipo+'</strong></td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total1)+'</td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total2)+'</td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total3)+'</td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total4)+'</td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total5)+'</td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total6)+'</td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total)+'</td><td align="center">'+Math.round((element.Total*100)/total)+'%</td></tr>';
                tableBody += '<tr><td><strong>TAZ(%)</strong></td><td align="center">'+Math.round((element.Total1*100)/s1)+'%</td><td align="center">'+Math.round((element.Total2*100)/s2)+'%</td><td align="center">'+Math.round((element.Total3*100)/s3)+'%</td><td align="center">'+Math.round((element.Total4*100)/s4)+'%</td><td align="center">'+Math.round((element.Total5*100)/s5)+'%</td><td align="center">'+Math.round((element.Total6*100)/s6)+'%</td><td align="center">'+Math.round((element.Total*100)/total)+'%</td><td></td></tr>';
            }else{
                tableBody += '<tr><td><strong>'+element.Tipo+'</strong></td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total1)+'</td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total2)+'</td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total3)+'</td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total4)+'</td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total5)+'</td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total6)+'</td><td align="center">'+new Intl.NumberFormat('en-US').format(element.Total)+'</td><td align="center">'+Math.round((element.Total*100)/total)+'%</td></tr>';
            }
        });
        totalesTr = '<tr><td><strong>Totales</strong></td><td align="center"><strong>'+new Intl.NumberFormat('en-US').format(s1)+'</strong></td><td align="center"><strong>'+new Intl.NumberFormat('en-US').format(s2)+'</strong></td><td align="center"><strong>'+new Intl.NumberFormat('en-US').format(s3)+'</strong></td><td align="center"><strong>'+new Intl.NumberFormat('en-US').format(s4)+'</strong></td><td align="center"><strong>'+new Intl.NumberFormat('en-US').format(s5)+'</strong></td><td align="center"><strong>'+new Intl.NumberFormat('en-US').format(s6)+'</strong></td><td align="center"><strong>'+new Intl.NumberFormat('en-US').format(total)+'</strong></td><td align="center"><strong>100%</strong></td></tr>';
        tableBody += totalesTr + '</tbody>';

    }

    

    $("#datatable-buttons_Ordenes").DataTable({}).destroy();
    $("#datatable-buttons_Ordenes").html(tableHeader+tableBody);

    var handleDataTableButtons_Ordenes = function () {
        if ($("#datatable-buttons_Ordenes").length) {
            $("#datatable-buttons_Ordenes").DataTable({
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
                handleDataTableButtons_Ordenes();
            }
        };
    }();

    
    TableManageButtons.init();
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
        
        minimumFractionDigits: 0
    });
    return 'Q' + formatter.format(num);
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

