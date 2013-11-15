phonegap_zoo_keeper
===================

在 phonegap 上仿製經典小遊戲 zoo keeper

youtube 影片

[![youtube 影片](http://img.youtube.com/vi/Wu3GuX0gPfE/0.jpg)](http://www.youtube.com/watch?v=Wu3GuX0gPfE)


主要程式是寫在 www/zookeeper.js 裡


主要邏輯是由函式 _processField 所串起的
重點只有這個
        
        
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


然後將陣列 tmp 值為1的方塊消除


