
var zookeeper = {

    field: null,
    selectedItem: null,
    points: 0,

    init: function() {

        self = this;

        field = new Array(8);
        for (var x = 0; x < 8; x++) {
            field[x] = new Array(8);
            for (var y = 0; y < 8; y++) {
                field[x][y] = Math.ceil(Math.random() * 5);
                self._addPiece(x, y, field[x][y]);
            }
        }

        self._processField();
    },
    // 點擊
	_click: function() {

	  var $elem = $(this);
	  
      // 點擊第二下
	  if (self.selectedItem != null) {

		  var backgroundImg = self.selectedItem.css("background-image");
		  var num = backgroundImg.indexOf(".png")
		  var type = backgroundImg.charAt(num - 3);
		  self.selectedItem.css({ backgroundImage: 'url("img/ct' + type + '.png")' });
	  
          // 交換2個方塊
		  self._swap(self.selectedItem, $elem);
		  self.selectedItem = null;
	  
      // 點擊第一下
      } else {

		  var backgroundImg = $elem.css("background-image");
		  var num = backgroundImg.indexOf(".png")
		  var type = backgroundImg.charAt(num - 1);
		  $elem.css({ backgroundImage: 'url("img/ct' + type + '_2.png")' });
		  self.selectedItem = $elem;
	  }
	},
    // 交換2個方塊
    _swap: function(elem1, elem2, cancelProcessing) {

        var tmp;
        var coords1 = self._getCoords(elem1);
        var coords2 = self._getCoords(elem2);

        if ((coords1.x == coords2.x && Math.abs(coords1.y - coords2.y) == 1) || (coords1.y == coords2.y && Math.abs(coords1.x - coords2.x) == 1)) {

            var p1 = elem1.position();
            var p2 = elem2.position();

            $('#xy' + coords1.x + coords1.y).animate({ top: p2.top, left: p2.left }, 300);
            $('#xy' + coords2.x + coords2.y).animate({ top: p1.top, left: p1.left }, 300, function() {
                if (!cancelProcessing) {
                    self._processField(elem1, elem2);
                }
            });

            tmp = field[coords1.x][coords1.y];
            field[coords1.x][coords1.y] = field[coords2.x][coords2.y];
            field[coords2.x][coords2.y] = tmp;

            tmp = elem1.attr('id');
            elem1.attr('id', elem2.attr('id'));
            elem2.attr('id', tmp);
        }
    },
    // 新增一個方塊
    _addPiece: function(x, y, type, top) {

        var div = $('<div class="item"><div>');
        top = top ? (-1 - 2 * top) * 40 : y * 40;
        div.css({ top: top + 'px', left: (x * 40) + 'px', backgroundImage: 'url("img/ct' + type + '.png")' });
		div.addClass('x' + x).addClass('y' + y).attr('id', ('xy' + x) + y).bind( 'click', zookeeper._click ).appendTo('#field');

        return div;
    },
    // 主要邏輯的地方
    _processField: function(elem1, elem2) {

        var tmp = [];
        var x, y;

        // 初始化
        for (x = 0; x < 8; x++) {
            tmp[x] = [];
            for (y = 0; y < 8; y++) {
                tmp[x][y] = 0;
            }
        }

        // 取出上下或左右有3個相同方塊
        for (x = 0; x < 8; x++) {
            for (y = 0; y < 8; y++) {
                
                // 判斷方塊的上與下是否相同
                if (y > 0 && y < 7 && field[x][y] == field[x][y - 1] && field[x][y] == field[x][y + 1]) {
                    tmp[x][y] = 1;      // 本身
                    tmp[x][y - 1] = 1;  // 上方方塊
                    tmp[x][y + 1] = 1;  // 下方方塊
                }
                
                // 判斷方塊的左與右是否相同
                if (x > 0 && x < 7 && field[x][y] == field[x - 1][y] && field[x][y] == field[x + 1][y]) {
                    tmp[x][y] = 1;      // 本身
                    tmp[x - 1][y] = 1;  // 左方方塊
                    tmp[x + 1][y] = 1;  // 右方方塊
                }
            }
        }

        var deleted = 0;

        // 移除相同的方塊
        for (x = 0; x < 8; x++) {
            for (y = 0; y < 8; y++) {
                if (tmp[x][y] == 1) {
                    field[x][y] = 0;
                    $(('#xy' + x) + y).addClass('remove');
                    deleted++;
                }
            }
        }

        // 移除方塊的 fadeout 效果
        $('.remove').animate({ opacity: 0 }, 500, function() {
            $('.remove').remove();
			$('.remove').unbind('click');
        });

        if (deleted > 0) {

            // 設定分數
			app.SetScore( deleted );
        }

        if (deleted > 0) {
            setTimeout('self._caving()', 500);
        } else if (elem1 && elem2) {
            self._swap(elem1, elem2, true);
        }
    },

    // 向下填滿
    _caving: function() {

        var x, y, yfull, deleted, delay = 0;

        for (x = 0; x < 8; x++) {
            yfull = 7;
            deleted = 0;
            for (y = 7; y >= 0; y--) {
                while (field[x][y] == 0 && y >= 0) {
                    deleted++;
                    y--;
                }
                if (yfull != y) {
                    var d = yfull - y;
                    delay = Math.max(delay, d * 150);
                    $(('#xy' + x) + y).animate({ top: '+=' + (40 * d) }, d * 150).attr('id', ('xy' + x) + yfull);
                    field[x][yfull] = field[x][y];
                }
                yfull--;
            }

            for (var i = 1; i <= deleted; i++) {
                type = Math.ceil(Math.random() * 5);
                field[x][deleted - i] = type;
                self._addPiece(x, deleted - i, type, i).animate({ top: '+=' + ((deleted + i + 1) * 40) }, 150 * (deleted + i + 1));
                delay = Math.max(delay, 150 * (deleted + i + 1));
            }
        }

        setTimeout('self._processField()', delay);
    },

    // 方塊的座標方置
    _getCoords: function(elem) {
        var id = elem.attr('id');
        return { x: parseInt(id.charAt(2)), y: parseInt(id.charAt(3)) };
    }
};
