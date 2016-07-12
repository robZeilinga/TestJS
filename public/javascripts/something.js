  var globalData;
  var selectedBuilding;
  var selectedFloor;
  var selectedRoom;
  var xMax;
  var yMax;
  var xBlockSize;
  var yBlockSize;
  var fileName;
  var imageObj;
  // var roomChanged = false;

  function buildingChange (object, data) {
    globalData = data;
    var opt = object.options[object.selectedIndex].value;
    // console.log('selected building = ' + opt);

    selectedBuilding = getBuildingFromGlobalData(opt);
    // console.log('num Floors :' + selectedBuilding[0].floors.length);
    var floors = selectedBuilding[0].floors;

    // add building to beginning of lblFileName
    // var lblFileName = document.getElementById('lblFileName');
    fileName = './images/' + opt + '_';

    var floorCombo = document.getElementById('selFloor');
    floorCombo.innerHTML = '<option value=0>Please Select</option>';
    // floorCombo.empty();
    floors.forEach(function (value) {
      // console.log(value.floor);
      floorCombo.innerHTML = floorCombo.innerHTML + '<option>' + value.floor + '</option>';
    });
  }

  function loadCanvas (dataURL) {
    var canvas = document.getElementById('canvas1');
    var context = canvas.getContext('2d');
    // load image from data url
    imageObj = new Image();
    imageObj.onload = function () {
      context.drawImage(this, 0, 0);
      var width = this.width / 2;
      var height = this.height / 2;
      canvas.width = width;
      canvas.height = height;
      context.drawImage(this, 0, 0, width, height);
      // console.log('in image onload');
      // console.log('width = ' + canvas.width);
      if ('undefined' !== typeof selectedRoom) {
      // if (selectedRoom[0] !== '') {
        var blocks = selectedRoom[0].blocks;
        blocks.forEach(function (block) {
          drawblock(xBlockSize, yBlockSize, block, 0, 0);
        });
      }
    };
    imageObj.src = dataURL;
  }

  function floorChange (object) {
    var opt = object.options[object.selectedIndex].value;
    // console.log('selected floor = ' + opt);
    // var lblFileName = document.getElementById('lblFileName');
    fileName = './images/' + selectedBuilding[0].building + '_' + opt + '.bmp';
    loadCanvas(fileName);
    selectedFloor = getFloorFromBuilding(opt);
    // console.log('room count = ' + selectedFloor[0].rooms.length);
    // populate room dropdown
    var selRoom = document.getElementById('selRoom');
    selRoom.innerHTML = '<option value=0>Please Select</option>';
    // floorCombo.empty();
    selectedFloor[0].rooms.forEach(function (value) {
      // console.log(value.roomNumber);
      selRoom.innerHTML = selRoom.innerHTML + '<option>' + value.roomNumber + '</option>';
    });
  }

/*
  function imageLoaded (object) {
    console.log('height = ' + object.height);
    console.log('width = ' + object.width);
    object.height = object.height / 2;
    console.log('height = ' + object.height);
    console.log('width = ' + object.width);
  }
*/

  function roomChange (object) {
    
    var opt = object.options[object.selectedIndex].value;
//    console.log('selected room = ' + opt);
    selectedRoom = getRoomFromFloor(opt);
//    console.log(JSON.stringify(selectedRoom));
    var canvas = document.getElementById('canvas1');
//    console.log('__height = ' + canvas.height);
//    console.log('__width = ' + canvas.width);
    // calculate boxes and draw here !!!
    xMax = selectedFloor[0].xMax;
    yMax = selectedFloor[0].yMax;
    // console.log('xMax = ' + xMax);
    // console.log('yMax = ' + yMax);
    xBlockSize = canvas.width / (xMax);
    yBlockSize = canvas.height / (yMax);

    loadCanvas(fileName);

    //drawGrid();

    //  get blocks
    //var blocks = selectedRoom[0].blocks;
    //blocks.forEach(function (block) {
    // drawblock(xBlockSize, yBlockSize, block, 0, 0);
    //});
  }

  function drawGrid () {
    var c = document.getElementById('canvas1');
    var ctx = c.getContext('2d');
    // vertical xBlocks
    var yStart = 0;
    var yEnd = c.height;
    ctx.beginPath();
    var cnt = 0;
    for (var x = 0; x < c.width; x = x + xBlockSize) {
      cnt++;
      console.log('x [' + cnt + ']  pos = ' + x);
      ctx.moveTo(x, yStart);
      ctx.lineTo(x, yEnd);
    }
    // horizontal xylocks
    var xStart = 0;
    var xEnd = c.width;
    // ctx.beginPath();
    for (var y = 0; y < c.height; y = y + yBlockSize) {
      ctx.moveTo(xStart, y);
      ctx.lineTo(xEnd, y);
    }
    ctx.lineStyle = 'blue';
    ctx.stroke();
  }

  function drawblock (xSize, ySize, block, xOffset, yOffset) {
    // console.log('xSize = ' + xSize + ', ySize =' + ySize);
    // console.log('block = ' + JSON.stringify(block));
    // console.log('xOffset = ' + xOffset + ',  yOffset = ' + yOffset);
    var c = document.getElementById('canvas1');
    var ctx = c.getContext('2d');
    ctx.beginPath();
    var xOrigin = xBlockSize * (block.x - 1);
    var yOrigin = yBlockSize * (block.y - 1);
    ctx.rect(xOrigin + xOffset, yOrigin + yOffset, xSize, ySize);
    // console.log('xOrigin = ' + xOrigin + ',  yOrigin = ' + yOrigin);
    ctx.fillStyle = 'red';
    ctx.fill();
    // return ctx;
  }

  function getRoomFromFloor (roomNumber) {
    return selectedFloor[0].rooms.filter(function (rm) {
      var retVal = rm.roomNumber.toString().trim() === roomNumber.toString().trim();
      return retVal;
    });
  }

  function getFloorFromBuilding (floorNumber) {
    return selectedBuilding[0].floors.filter(function (fl) {
      var retVal = fl.floor.toString().trim() === floorNumber.toString().trim();
      return retVal;
    });
  }

  function getBuildingFromGlobalData (buildingNumber) {
    return globalData.buildings.filter(function (el) {
      var retVal = el.building.toString().trim() === buildingNumber.toString().trim();
      return retVal;
    });
  }
