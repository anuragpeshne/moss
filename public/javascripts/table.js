$(document).ready(function() {
    var tableDimensions = (function() {
        var tableContainer = $('#tableContainer');
        var columnNum = tableContainer.width() / 120;
        var rowNum = ($(document).height() - $('h1').height()) / 20;
        return {
            'maxColumns': function() {
                return columnNum;
            },
            'maxRows': function() {
                return rowNum;
            }
        };
    })();

    function getEditor() {
        var activeCell = null;
        var isEditable = false;
        function isValid(x, y) {
            return (
                (x >= 0 && x < tableDimensions.maxRows()) &&
                    (y >= 0 && y < tableDimensions.maxColumns())
            );
        }

        return {
            'move': function (newCellGetter) {
                if (activeCell === null) return true;
                if (isEditable === true) return false;

                var activeCellLoc = activeCell.attr('id').split('-');
                var newCell = newCellGetter(activeCellLoc);
                if (isValid(newCell.x, newCell.y)) { //1st row will have '0-n'
                    this.jumpToCell($('td#' + newCell.x + '-' + newCell.y));
                }
                return true; //prevent default events
            },
            'jumpToCell': function(currentCell) {
                this.closeEditable();
                if (activeCell !== null) {
                    activeCell.removeClass('activeCell');
                }
                activeCell = currentCell;
                activeCell.addClass('activeCell');
                return true; //prevent default events
            },
            'makeEditable': function(cell) {
                if (activeCell === null) return;

                if (isEditable === true) {
                    this.closeEditable();
                    return;
                }

                if (typeof cell === "undefined") {
                    cell = activeCell;
                }
                var content = cell.text();
                var ipBox = '<input id="ip-' + cell.attr('id') + '" value="' +
                    content + '" >';
                cell.data['origContent'] = content;
                cell.html(ipBox);
                cell.children('input').focus();
                isEditable = true;
            },
            'closeEditable': function() {
                if (isEditable === false) return;

                var newContent = activeCell.children('input').val();
                var oldContent = activeCell.children('input').data['origContent'];
                activeCell.html(newContent);
                isEditable = false;

                if (newContent !== oldContent) {
                    // dirty cell- update it
                    console.log('update cell' + activeCell.attr('id'));
                }
            }
        };
    }

    (function() {
        var tableContainer = $('#tableContainer');
        for (var i = 0; i < tableDimensions.maxRows(); i++) {
            var row = '<tr>';
            for (var j = 0; j < tableDimensions.maxColumns(); j++) {
                var column = '<td id=\'' + i + '-' + j + '\'></td>';
                row += column;
            }
            tableContainer.append(row + '</tr>');
        }
    })();

    var editor = getEditor();
    $('#tableContainer tr td').click(function(e) {
        var cell = $(e.target);
        editor.jumpToCell(cell);
    });
    $('#tableContainer tr td').dblclick(function(e){
        var cell = $(e.target);
        editor.makeEditable(cell);
    });

    $(document).keydown(function(e) {
        var preventDefault = true;
        switch (e.which) {
        case 37: // left
            preventDefault = editor.move(function(newCell) {
                return {x: newCell[0], y: (parseInt(newCell[1]) - 1)};
            });
            break;

        case 38: // up
            preventDefault = editor.move(function(newCell) {
                return {x: (parseInt(newCell[0]) - 1), y: newCell[1]};
            });
            break;

        case 39: // right
            preventDefault = editor.move(function(newCell) {
                return {x: newCell[0], y: (parseInt(newCell[1]) + 1)};
            });
            break;

        case 40: // down
            preventDefault = editor.move(function(newCell) {
                return {x: (parseInt(newCell[0]) + 1), y: newCell[1]};
            });
            break;

        case 13: // enter key
            preventDefault = editor.makeEditable();
            break;

        default: return; // exit this handler for other keys
        }
        if (preventDefault) e.preventDefault(); // prevent the default action (scroll / move caret)
    });
});
