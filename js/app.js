var app = angular.module('App', []);
app.controller('adventureController', function ($scope, $http) {

    var log = document.getElementById("log");
    var commandBox = document.getElementById("command");
    commandBox.focus();
    $scope.rooms = {};
    $scope.room = {};
    $scope.command ="";


    $scope.Title = "Loading";
    $http.get("index.json")
        .then(function (response) {
            $scope.indexJson = response.data;
            $scope.Title = $scope.indexJson.title;
            $scope.currentRoom = $scope.indexJson.start;
            $scope.setRoom($scope.currentRoom);
        });





    $scope.addLog = function (message) {
        var para = document.createElement("p");
        para.innerHTML = message;
        //var node = document.createTextNode(message);
        //para.appendChild(node);
        log.insertBefore(para, log.firstChild);
        //log.appendChild(para);
    };

    $scope.setRoom = function (room, setRoom) {

        if ($scope.rooms[room]) {
            $scope.rooms[room].vistCount += 1;
            $scope.room = $scope.rooms[room];
        } else {
            $scope.loadRoom(room, true);
            return;
        }

        if ($scope.room.vistCount>1){
            $scope.addLog($scope.room.repeatVisit);

        } else
        {
            $scope.addLog($scope.room.firstVisit);
        }

    };

    $scope.loadRoom = function (room, setCurrent) {
        var url = "/rooms/" + room + ".json?U=" + guid();
        $http.get(url)
            .then(function (response) {
                $scope.rooms[room] = response.data;
                $scope.rooms[room].vistCount = 0;
                if (setCurrent) $scope.setRoom(room, true);
            });
    };




    $scope.processCommand = function(){
        var cmd = $scope.command;
        var cmdOK = false;

        if (!cmdOK) $scope.addLog('<span class="message messageError">Unknown Command</span>' + cmd);
        $scope.command ="";
        commandBox.focus();
    }

});


app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});


function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
