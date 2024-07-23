var string_table = [];
var _input = document.getElementById("input");
var _output = document.getElementById("output");
var _frequent = document.getElementById("frequent");
var _support = document.getElementById("support");
solve.onclick = function (e) {
    var support = Number(_support.value);
    if(_support.value==""||support==0){
        alert("invalid support");
    }
    else{
        clear();
        var re = scan(_input.value);
        string_table = re.string_table;
        var items =  re._first_table;
        var removed = [];
        var i = 1;
        while (items.length !=0) {
            _output.appendChild(make_label(i+"-items before removing infrequent items"));
            _output.appendChild(createTableHtml(items))
    
            removed = remove_infrequent(items, support);
            if(removed.length==0)break;
            _output.appendChild(make_label(i+"-items after removing infrequent items"));
            _output.appendChild(createTableHtml(removed));
            _frequent.appendChild(make_label(i+"-items"));
            _frequent.appendChild(createTableHtml(removed));
    
            items = generate_candidate(removed,i);
            i++;
        }
    }
}

function scan(str_value = "") {
    var _table = [];
    var string_table = [];
    var _first_table = [];
    _table = str_value.split('\n');
    for (var index_row in _table) {
        _table[index_row] = _table[index_row].replaceAll("}{", ",");
        _table[index_row] = _table[index_row].replaceAll("{", "");
        _table[index_row] = _table[index_row].replaceAll("}", "");
        var dis_in_row = "";
        for (var a of _table[index_row]) {
            if (!dis_in_row.includes(a)&&a!=',') {
                var object = _first_table.find(_element => _element.event[0] == a);
                if (object) {
                    object.count++;
                    dis_in_row += a;
                }
                else {
                    object = { event: [a], count: 1 };
                    _first_table.push(object);
                    dis_in_row += a;
                }
            }
        }
        _table[index_row] = _table[index_row].split(",");
        for (var index_row1 in _table[index_row]) {
            _table[index_row][index_row1] = sortAlphabets(_table[index_row][index_row1]);
        }
        string_table.push(toSeq(_table[index_row]));
    }
    return {string_table:string_table, _first_table:_first_table};
}

function generate_candidate(table = [], i = 1) {
    if (i == 1)
        return generate_candidate_size_2(table);
    else
        return generate_candidate_size_greater2(table);
}
function generate_candidate_size_2(table = []) {
    var _table = [];
    for (var row_index1 = 0; row_index1 < table.length; row_index1++) {
        for (var row_index2 = 0; row_index2 < table.length; row_index2++) {
            var arr = [table[row_index1].event[0], table[row_index2].event[0]];
            _table.push({ event: arr, count: search_in_table(arr, string_table) })
        }
    }
    for (var row_index1 = 0; row_index1 < table.length; row_index1++) {
        for (var row_index2 = row_index1 + 1; row_index2 < table.length; row_index2++) {
            var arr = [sortAlphabets(table[row_index1].event[0] + table[row_index2].event[0])];
            _table.push({ event: arr, count: search_in_table(arr, string_table) })
        }
    }
    return _table;
}
function generate_candidate_size_greater2(table = []) {
    var _table = [];
    for (var row_index1 in table) {
        for (var row_index2 in table) {
            var str1 = toString(table[row_index1].event);
            var str2 = toString(table[row_index2].event);
            var maxLength = str1.length + 1;
            var len = table[row_index1].event[0].length + table[row_index2].event[table[row_index2].event.length - 1].length;
            var arr = [];
            arr.push(table[row_index1].event[0]);
            if (str1.substring(1) == str2.slice(0, -1)) {
                var i = 1;
                while (len < maxLength) {
                    arr.push(table[row_index1].event[i]);
                    len += (table[row_index1].event[i]).length;
                    i++;
                }
                arr.push(table[row_index2].event[table[row_index2].event.length - 1]);
                _table.push({ event: arr, count: search_in_table(arr, string_table) })
            }
        }
    }
    return _table;
}


function remove_infrequent(table = [], support = 0) {
    var new_table = [];
    for (var row of table) {
        if (row.count >= support) {
            new_table.push(row);
        }
    }
    return new_table;
}


var sortAlphabets = function (text) {
    return text.split('').sort().join('');
};
function search_in_table(elements = [], table = []) {
    var count = 0;
    var reg = "";
    for (var element of elements) {
        reg += ".*{.*" + sortAlphabets(element) + ".*}.*";
    }
    const re = new RegExp(reg);
    for (var str of table) {
        if (re.test(str)) {
            count++;
        }
    }
    return count;
}
function toString(arr = []) {
    var str = "";
    arr.forEach(function (e) {
        str += e;
    });
    return str;
}
function toSeq(row = []) {
    var str = "";
    for (const element of row) {
        str += "{" + element + "}";
    }
    return str;
}
function make_label(str = ""){
    var label = document.createElement("label");
    label.innerText = str;
    return label;
}
function createTableHtml(table = []) {
    var Etable = document.createElement("table");
    Etable.insertAdjacentHTML("afterbegin", "<tr><th>Event</th><th>Count</th></tr>")
    for (var row of table) {
        var tr = document.createElement("tr");
        Etable.append(tr);
        var td0 = document.createElement("td");
        var td1 = document.createElement("td");
        tr.append(td0);
        tr.append(td1);
        td0.innerText = toSeq(row.event);
        td1.innerText = row.count;
    }
    return Etable;
}
function clear(){
    _output.innerHTML = "";
    _output.insertAdjacentHTML("afterbegin",'<label for="output">Steps</label>');
    _frequent.innerHTML = "";
    _frequent.insertAdjacentHTML("afterbegin",'<label for="frequent">Frequent items</label>');
}