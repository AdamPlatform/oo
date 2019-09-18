import $ from 'jquery';
global._div2Excel = (divId, filename) => {
  let oHtml = $('#' + divId);
  let innerHTML = oHtml[0].innerHTML;
  innerHTML = innerHTML.replace(/加载中...|导 出/g,'');
  let excelHtml = `<html><head><meta charset="UTF-8"><style>
    th {
    border: 1px #000 solid;
    }
    td {
    border: 1px #000 solid;
    }
    </style></head><body>${innerHTML}</body></html>`;
  let excelBlob = new Blob([excelHtml], {type: 'application/vnd.ms-excel'});
  // 创建一个a标签
  let oA = document.createElement('a');
  // 利用URL.createObjectURL()方法为a元素生成blob URL
  oA.href = URL.createObjectURL(excelBlob);
  // 给文件命名
  oA.download = filename + '.xls';
  // 模拟点击
  oA.click();
}