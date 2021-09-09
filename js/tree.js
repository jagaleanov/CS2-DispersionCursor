const KEY = 0;
const NAME = 1;
const NEXT = 2;

class ListNode {
    data;
    next;

    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class Queue {

    head;

    constructor() {
        this.head = null;
    }

    enqueue(data) {
        var newNode = new ListNode(data);

        if (this.head == null) {
            this.head = newNode;
        } else {
            let nodeParent = this.findTail();
            nodeParent.next = newNode;
        }
    }

    findTail() {
        let pivot = this.head;
        while (pivot.next != null) {
            pivot = pivot.next;
        }
        return pivot;
    }

    dequeue() {

        var removed = this.head;
        var next = this.head.next;

        this.head = next;
        return removed.data;
    }

    isEmpty() {
        return this.head == null;
    }
}

class MatrixDispersion {

    constructor(mod) {
        this.counter = 0;
        this.nextAvailable;
        this.tableHeads = [];
        this.tableCursor = [];
        this.mod = mod;
        this.initTableHeads();
        this.addKeys();
    }

    addKeys() {

        let before = null;
        for (let i = 0; i < 5; i++) {
            this.counter++;
            this.tableCursor[this.counter] = [0, "", 0];
            if (before != null) {
                this.tableCursor[before][NEXT] = this.counter;
            } else {
                this.nextAvailable = this.counter;
            }
            before = this.counter;
        }
    }

    initTableHeads() {
        for (let i = 0; i < this.mod; i++) {
            this.tableHeads.push(0);
        }
    }

    find(key) {
        let head = key % this.mod;

        if (this.tableHeads[head] != 0) {

            let rowPivot = this.tableCursor[this.tableHeads[head]];
            let queue = new Queue();
            while (rowPivot[NEXT] != 0 && rowPivot[KEY] != key) {
                queue.enqueue(rowPivot[NEXT]);
                rowPivot = this.tableCursor[rowPivot[NEXT]];
            }

            let straight = [];
            straight.push(this.tableHeads[head]);
            while (!queue.isEmpty()) {
                straight.push(queue.dequeue());
            }

            if (rowPivot[KEY] == key) {
                return { key: key, head: head, straight: straight };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    insert(key, name) {
        console.log(key);
        if (this.find(key) == null) {
            let head = key % this.mod;

            let tempAvailable = this.tableCursor[this.nextAvailable][NEXT];

            this.tableCursor[this.nextAvailable][KEY] = key;
            this.tableCursor[this.nextAvailable][NAME] = name;
            this.tableCursor[this.nextAvailable][NEXT] = 0;

            if (this.tableHeads[head] == 0) {
                this.tableHeads[head] = this.nextAvailable;
            } else {
                let pivot = this.tableCursor[this.tableHeads[head]];
                while (pivot[NEXT] != 0) {
                    pivot = this.tableCursor[pivot[NEXT]];
                }
                pivot[NEXT] = this.nextAvailable;
            }

            if (tempAvailable != 0) {
                this.nextAvailable = tempAvailable;
            } else {
                this.addKeys();
            }
        } else {
            alert("La llave ya se encuentra en el cursor.");
        }
    }

    delete(key) {
        if (this.find(key) != null) {
            let head = key % this.mod;

            let rowPivot = this.tableCursor[this.tableHeads[head]];
            let rowParentPivot = null;
            while (rowPivot[NEXT] != 0 && rowPivot[KEY] != key) {
                rowParentPivot = rowPivot
                rowPivot = this.tableCursor[rowPivot[NEXT]];
            }
            rowPivot[KEY] = 0;
            rowPivot[NAME] = "";
            let tempNext = rowPivot[NEXT];
            rowPivot[NEXT] = this.nextAvailable;
            if (rowParentPivot != null) {
                this.nextAvailable = rowParentPivot[NEXT];
                if (tempNext != 0) {
                    rowParentPivot[NEXT] = tempNext;
                } else {
                    rowParentPivot[NEXT] = 0;
                }
            } else {
                this.nextAvailable = this.tableHeads[head];
                if (tempNext != 0) {
                    this.tableHeads[head] = tempNext;
                } else {
                    this.tableHeads[head] = 0;
                }
            }
        } else {
            alert("La llave no se encuentra en el cursor.");
        }

    }

    headsToHTML() {
        let html = "";
        html += '<tr class="table-active">';
        html += '<th>Clave</th>';
        for (let i = 0; i < this.tableHeads.length; i++) {
            html += '<th scope="row">' + i + '</th>';
        }
        html += '</tr>';
        html += '<tr>';
        html += '<th>Cabeza</th>';
        for (let i = 0; i < this.tableHeads.length; i++) {
            html += '<td>' + this.tableHeads[i] + '</td>';
        }
        html += '</tr>';

        return html;
    }

    cursorToHTML() {
        let html = "";
        let matrix = [];
        for (let i = 0; i < this.tableCursor[1].length; i++) {
            matrix[i] = [];
            for (let j = 1; j < this.tableCursor.length; j++) {
                matrix[i][j] = this.tableCursor[j][i];
            }
        }

        html += '<tr class="table-active">';
        html += '<th>Posición</th>';
        for (let i = 1; i < matrix[1].length; i++) {
            html += '<th scope="row">' + i + '</th>';
        }
        html += '</tr>';
        for (let i = 0; i < matrix.length; i++) {
            html += '<tr>';
            let myvar = "";
            switch (i) {
                case 1:
                    myvar = "Nombre";
                    break;
                case 2:
                    myvar = "Siguiente";
                    break;
                default:
                    myvar = "Llave";
            }

            html += '<th>' + myvar + '</th>';
            for (let j = 1; j < matrix[i].length; j++) {
                html += '<td>' + matrix[i][j] + '</td>';
            }
            html += '</tr>';
        }

        return html;
    }
}

var matrixDispersion;

$("#keyAddTxt").attr("readonly", true);
$("#nameTxt").attr("readonly", true);
$("#insertBtn").attr("disabled", true);

$("#keyFindTxt").attr("readonly", true);
$("#findBtn").attr("disabled", true);

$("#keyDelTxt").attr("readonly", true);
$("#deleteBtn").attr("disabled", true);

$("#keysAddTxt").attr("readonly", true);
$("#namesTxt").attr("readonly", true);
$("#insertsBtn").attr("disabled", true);

function esPrimo(key) {
    // Casos especiales
    if (key == 0 || key == 1 || key == 4) return false;
    for (let x = 2; x < key / 2; x++) {
        if (key % x == 0) return false;
    }
    return true;

}

function initCursor() {
    if (!esPrimo($('#divisorTxt').val())) {
        alert("Ingrese un numero primo");
    } else if ($('#divisorTxt').val() > 1) {
        matrixDispersion = new MatrixDispersion($('#divisorTxt').val());
        $("#divisorTxt").attr("readonly", true);
        $("#initBtn").attr("disabled", true);

        $("#keyAddTxt").attr("readonly", false);
        $("#nameTxt").attr("readonly", false);

        $("#insertBtn").attr("disabled", false);

        $("#keyFindTxt").attr("readonly", false);
        $("#findBtn").attr("disabled", false);

        $("#keyDelTxt").attr("readonly", false);
        $("#deleteBtn").attr("disabled", false);

        $("#keysAddTxt").attr("readonly", false);
        $("#namesTxt").attr("readonly", false);
        $("#insertsBtn").attr("disabled", false);

        $('#keyAddTxt').focus();
        printData();
    } else {
        alert("Ingrese un numero entero mayor a 1");
    }
}

function insertData() {
    if ($('#keyAddTxt').val() == "") {
        alert("Ingrese la llave");
    } else {
        matrixDispersion.insert($('#keyAddTxt').val(), $('#nameTxt').val());

        $('#keyAddTxt').val("");
        $('#nameTxt').val("");
        $('#keyAddTxt').focus();
        printData();
    }
}

function insertGroupData() {
    if ($('#keysAddTxt').val() == "") {
        alert("Ingrese un grupo de llaves separadas por coma");
    } else {
        //matrixDispersion.insert($('#keyAddTxt').val(), $('#nameTxt').val());

        let arrayKeys = $('#keysAddTxt').val().split(',');
        let arrayNames = $('#namesTxt').val().split(',');
        console.log(arrayKeys);

        for (let i = 0; i < arrayKeys.length; i++) {
            matrixDispersion.insert(arrayKeys[i], arrayNames.length > i ? arrayNames[i] : "-");
        }


        $('#keysAddTxt').val("");
        $('#namesTxt').val("");
        $('#keysAddTxt').focus();
        printData();
    }



    // if ($('#keyAddTxt').val() == "") {
    //     alert("Ingrese la llave");
    // } else {
    //     matrixDispersion.insert($('#keyAddTxt').val(), $('#nameTxt').val());

    //     $('#keyAddTxt').val("");
    //     $('#nameTxt').val("");
    //     $('#keyAddTxt').focus();
    //     printData();
    // }
}

function findData() {
    if ($('#keyFindTxt').val() >= 0) {

        let res = matrixDispersion.find($('#keyFindTxt').val());

        if (res != null) {
            $('#findRes').html("La llave " + res.key + " esta en la clave " + res.head + " recorriendo las posiciones " + res.straight.join(', ') + ".");
            $('#keyFindTxt').val("");
        } else {
            $('#findRes').html("");
            alert("La llave " + $('#keyFindTxt').val() + " no existe.");
            $('#keyFindTxt').val("");
            $('#keyFindTxt').focus();
        }

    } else {
        alert("Ingrese un numero entero mayor o igual a 0");
    }
}

function deleteData() {
    if ($('#keyDelTxt').val() >= 0) {
        matrixDispersion.delete($('#keyDelTxt').val());
        $('#keyDelTxt').val("");
        $('#keyDelTxt').focus();
        printData();
    } else {
        alert("Ingrese un numero entero mayor o igual a 0");
    }
}

function printData() {
    $('#headsTable').html(matrixDispersion.headsToHTML());
    $('#cursorTable').html(matrixDispersion.cursorToHTML());
    $('#nextAvailable').html(matrixDispersion.nextAvailable);
    $('#findRes').html("");

}

