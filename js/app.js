var app = angular.module('App', []);
app.controller('adventureController', function ($scope, $http, $q) {

        var log = document.getElementById("log");
        var jLog = $('#log');
        var titleDiv = $('#titleDiv');
        var hColor = titleDiv.css('backgroundColor');
        try {
            document.styleSheets[0].addRule("#log::-webkit-scrollbar-thumb", "background-color: " + hColor + ";outline: 1px solid slategrey;");
            console.log("Color:" + hColor);
        } catch (err) {
            console.log(err);
        }


        var commandBox = document.getElementById("command");
        commandBox.focus();
        $scope.rooms = {};
        $scope.room = {};

        $scope.objects = {};
        $scope.object = {};

        $scope.command = "";


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
            log.appendChild(para);
            //log.scrollTop = log.scrollHeight;

            jLog.animate({scrollTop: jLog.prop("scrollHeight")}, 500);
        };

        $scope.setRoom = function (room) {

            if (!$scope.rooms[room]) {
                var url = "/rooms/" + room + ".json?U=" + guid();
                $.ajax({
                    url: url,
                    async: false,
                    dataType: 'json',
                    success: function (response) {
                        $scope.rooms[room] = response;
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            }
            $scope.room = $scope.rooms[room];
            if (!$scope.room.vistCount) $scope.room.vistCount = 0;
            $scope.room.vistCount += 1;


            if ($scope.room.vistCount > 1) {
                $scope.addLog($scope.room.repeatVisit);

            } else {
                $scope.addLog($scope.room.firstVisit);
            }
            $scope.objects = {};

            if ($scope.room.moves) {
                $scope.room.moves.forEach(function (move, index) {
                    if (move.object) {
                        if (!move.object.content && move.object.id) {
                            move.object.content = $scope.getObject(move.object.id);
                        }

                    }
                });
            }

        };

        $scope.getObject = function (objId) {
            if (!$scope.objects[objId]) {
                var url = "/objects/" + objId + ".json?U=" + guid();
                $.ajax({
                    url: url,
                    async: false,
                    dataType: 'json',
                    success: function (response) {
                        $scope.objects[objId] = response;
                    }
                });
            }
            return $scope.objects[objId];
        };

        $scope.processCommand = function () {

            var cmd = $scope.command;
            if (cmd.length < 1) return;
            var cmdOK = false;

            var clist = parseCommand(cmd, $scope);
            if (clist.length > 0) {
                cmdOK=true;
                $scope.syntax = clist;
            }
            if (!cmdOK) $scope.addLog('<span class="message messageError">Unknown Command</span>' + cmd);
            $scope.command = "";
            commandBox.focus();
        }

    }
);

var commands = ["look", "move", "attack"];

var parseCommand = function(command,scope){
    var clist = command.match(/\S+/g) || [];
    var syntaxList = [];
    clist.forEach(function(word){
        var cw=word.toLowerCase();
        var cp = commands.indexOf(cw);
        if (cp >= 0 ) {
            var syntax = {}
            syntax.word = word;
            syntax.type = 1;
            syntaxList.push(syntax);
        }


    });
    return syntaxList;
};


app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
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
