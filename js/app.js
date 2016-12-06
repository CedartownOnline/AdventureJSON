var app = angular.module('App', []);
app.controller('adventureController', function ($scope, $http) {

    var log = document.getElementById("log");
    $scope.rooms = {};
    $scope.room = {};

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
        var node = document.createTextNode(message);
        para.appendChild(node);
        log.appendChild(para);
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
        var url = "/rooms/" + room + ".json"
        $http.get(url)
            .then(function (response) {
                $scope.rooms[room] = response.data;
                $scope.rooms[room].vistCount = 0;
                if (setCurrent) $scope.setRoom(room, true);
            });
    };

});
