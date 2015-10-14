$(document).ready(function() {
    var tableDimensions = (function() {
        var tableContainer = $('#tableContainer');
        var columnNum = tableContainer.width() / 120;
        var rowNum = $(document).height() / 20;
        return {
            'maxColumns': function() {
                return columnNum;
            },
            'maxRows': function() {
                return rowNum;
            }
        };
    })();

    function getHighlighter() {
        var activeCell = null;
        function isValid(x, y) {
            return (
                (x >= 0 && x < tableDimensions.maxRows()) &&
                (y >= 0 && y < tableDimensions.maxColumns())
            );
        }

        return {
            'move': function (newCellGetter) {
                if (activeCell === null) return;

                var activeCellLoc = activeCell.attr('id').split('-');
                var newCell = newCellGetter(activeCellLoc);
                if (isValid(newCell.x, newCell.y)) { //1st row will have '0-n'
                    this.jumpToCell($('td#' + newCell.x + '-' + newCell.y));
                }
            },
            'up': function() {
                this.move(function(newCell) {
                    return {x: (parseInt(newCell[0]) - 1), y: newCell[1]};
                });
            },
            'down': function() {
                this.move(function(newCell) {
                    return {x: (parseInt(newCell[0]) + 1), y: newCell[1]};
                });
            },
            'right': function() {
                this.move(function(newCell) {
                    return {x: newCell[0], y: (parseInt(newCell[1]) + 1)};
                });
            },
            'left': function() {
                this.move(function(newCell) {
                    return {x: newCell[0], y: (parseInt(newCell[1]) - 1)};
                });
            },
            'jumpToCell': function(currentCell) {
                if (activeCell !== null) {
                    activeCell.removeClass('activeCell');
                }
                activeCell = currentCell;
                activeCell.addClass('activeCell');
            }
        }
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

    var highlighter = getHighlighter();
    $('#tableContainer tr td').click(function(e) {
        var cell = $(e.target);
        highlighter.jumpToCell(cell);
    });

    $(document).keydown(function(e) {
        switch (e.which) {
        case 37: // left
            highlighter.left();
            break;

        case 38: // up
            highlighter.up();
            break;

        case 39: // right
            highlighter.right();
            break;

        case 40: // down
            highlighter.down();
            break;

        default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
});
