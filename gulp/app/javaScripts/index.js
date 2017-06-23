/**
 * Created by Administrator on 2017/3/6.
 */
$(document).ready(function() {
    if (!sessionStorage.newVer) {
        $('.spinner').css('display', 'block')
        sendRequest('ver.getNewVer', [], function(data) {
            sessionStorage.newVer = JSON.stringify(data.data)
            if (data.code === 0 && data.data) {
                $('.spinner').remove()
            }
        })
    }
    $('#useType').change(function() {
        var chooseType = $(this).val()
        getData(chooseType)
    })
    getData();
})

function getData(type) {
    var chooseType = type || -1;
    var method = 'server.getStatusList';
    var arr = [chooseType];
    sendRequest(method, arr, function(data) {
        if ($('.lineData')) {
            $('#tb').empty()
        }
        data.data.head = ['ip', 'cpu', 'desc', 'memory', 'links'];
        renderTable(data)
    });
}

function renderTable(content) {
    $('#tb').append(
        `    <tr class="th">
            <td >${content.data.head[0]}</td>
            <td >${content.data.head[1]}</td>
            <td >${content.data.head[2]}</td>
            <td >${content.data.head[3]}</td>
            <td >${content.data.head[4]}</td>
        </tr>`
    )
    content.data.forEach(function(row) {
        $('#tb').append(`
        <tr class="lineData">
            <td>${row.ip}</td>
            <td>${row.cpu}</td>
            <td>${row.desc}</td>
            <td>${row.memory}</td>
            <td>${row.links}</td>
        </tr>
        `)
    })
}