angular.module('fluidApp', ['tools','ngSanitize'])
.controller('MainCtrl', ['$scope', 'toolService', '$filter', function($scope, ts, $filter) {
    ts.log("Layout initialized");
    $scope.alerts = [];
    $scope.schema = ['box3','box3','box3','box2','box2','box1'];
    // array for holding boxes
    $scope.boxes = [];
    // restore these variables from "state"
    $scope.tallyId = 0;
    $scope.boxOrderById = [];
    $scope.boxTally = 0;
    $scope.deletedBoxTally = 0;
    $scope.defaultState= {
            tallyId: 0,
            boxOrderById: [],
            boxes: [],
            lastBoxId: null,
            boxTally: 0,
            deletedBoxTally: 0,
            colorAt: 128
        };
    
    // function to resize and layout boxes for responsiveness
    $scope.relayout = function() {
        var all_width = $("#container2").innerWidth()-20;
        $(".box3").css({
            width: (all_width/3)-12
        });
        $(".box2").css({
            width: (all_width/2)-14
        });
        $(".box1").css({
            width: all_width-18
        });
        $scope.width = {
            'box3': (all_width/3)-12,
            'box2': (all_width/2)-14,
            'box1': all_width-18
        };
        //ts.log("Layout done");
    };
    
    // ui method for setting active state on "hover"
    $scope.setActive = function( id ) {
        $("#"+id).parents("div").addClass("active");
    };
    // ui method for clearing active state on "hover"
    $scope.clearActive = function() {
        $("#container1,#container2").removeClass("active");
    };
    
    // method for getting "dirty" list of neighbors
    $scope.getNeighbors = function(box) {
        var neighbors = $filter('filter')($scope.boxes, { row: box.row }, function(exp,actual) {
            return angular.equals(actual,exp);
        });
        return neighbors;
    };
    
    // method for box logic
    $scope.reBuild = function() {
        $scope.relayout();
        var key=0; var row = 0;
        angular.forEach($scope.boxes, function(box,ind) {
            key = key > 5 ? 0 : key;
            if(key===0 || key===3 || key===5) {
                row += 1;
            }
            box.schemaPosition = key;
            box.className = 'box ' + $scope.schema[key];
            box.width = $scope.width[$scope.schema[key]];
            box.innerClassName = 'box-mod-'+(key+1);
            box.row = row;
            box.pos = ind;
            key += 1;
        });
        // get content
        var lastBoxId = $scope.boxOrderById[$scope.boxOrderById.length-1];
        // resolution of adjacent neighbors by requirements
        angular.forEach($scope.boxes, function(box,k) {
            var adjBoxes = $scope.getNeighbors(box);
            var adjIds = [];
            angular.forEach(adjBoxes, function(abox) {
                if(!angular.equals(abox.id,box.id) && Math.abs(abox.pos-box.pos)<2 && angular.equals(box.row,abox.row)) {
                    adjIds.push(abox.id); 
                }
            });
            if(angular.equals(box.id, lastBoxId)) {
                box.className += ' last';
            }
            box.html = adjIds.join(", ");
        });
        $scope.lastBoxId = lastBoxId;
        //ts.log($scope.boxOrderById, 'Box order');
        //ts.log($scope.boxes);
        $scope.saveAppState();
    };
    
    $scope.setAlert = function(msg, cfg) {
        var c = {
            type: 'info'
        };
        if(cfg) {
            angular.extend(c,cfg);
        }
        $scope.alerts = [{ message: msg, class: c.type }];
        clearTimeout($scope.boxExit);
        $scope.boxExit = setTimeout(function() {
            $scope.alerts = [];
        }, 5000);
    };
    
    $scope.saveAppState = function() {
        angular.forEach($scope.boxes, function(box) {
           delete(box['$$hashKey']); 
        });
        var state ={
            tallyId: $scope.tallyId,
            boxOrderById: $scope.boxOrderById,
            boxes: $scope.boxes,
            lastBoxId: $scope.lastBoxId,
            boxTally: $scope.boxTally,
            deletedBoxTally: $scope.deletedBoxTally,
            colorAt: $scope.colorAt
        };
        $.jStorage.set("fluidAppState", JSON.stringify(state));
        ts.log(state, 'App state saved');
    };
    
    $scope.componentToHex =function(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };

    $scope.rgbToHex=function(r, g, b) {
        return "#" + $scope.componentToHex(r) + $scope.componentToHex(g) + $scope.componentToHex(b);
    };

    $scope.restoreAppState = function() {
        //var state = JSON.parse($.jStorage.get("fluidAppState", JSON.stringify($scope.defaultState)));
        var state = JSON.parse($.jStorage.get("fluidAppState"));
        if(!state) {
            state= $scope.defaultState;
        }
        $scope.boxes = state.boxes;
        $scope.boxOrerById = state.boxOrderById;
        $scope.tallyId = state.tallyId;
        $scope.lastBoxId = state.lastBoxId;
        $scope.boxTally = state.boxTally;
        $scope.deletedBoxTally = state.deletedBoxTally;
        ts.log(state,'App state');
        var bgColor=$scope.rgbToHex(state.colorAt,state.colorAt,state.colorAt);
        ts.log(bgColor, 'New background color->');
        document.querySelector('#container2').style.backgroundColor = bgColor;
        $scope.colorAt = state.colorAt;
    };
    
    $scope.reset = function() {
        var state = $scope.defaultState;
        $scope.boxes = state.boxes;
        $scope.boxOrerById = state.boxOrderById;
        $scope.tallyId = state.tallyId;
        $scope.boxTally = state.boxTally;
        $scope.deletedBoxTally = state.deletedBoxTally;
        $scope.lastBoxId = state.lastBoxId;
        $scope.colorAt = state.colorAt;
        var bgColor=$scope.rgbToHex(state.colorAt,state.colorAt,state.colorAt);
        document.querySelector('#container2').style.backgroundColor = bgColor;
        $scope.addBox();
    };
    
    $scope.addBox = function( at ) {
        $scope.tallyId += 1;
        if(!at) {
            at=0;
        }
        if($scope.boxes.length>0) {
            $scope.boxes.splice(at+1, 0, {
               id: $scope.tallyId
            });
        } else {
            $scope.boxes.push({
               id: $scope.tallyId
            });
        }
        $scope.boxOrderById.push($scope.tallyId);
        $scope.boxTally += 1;
        $scope.reBuild();
    };
    
    $scope.removeBox = function( at ) {
        var boxesList = $scope.boxes;
        var removeId = null;
        $scope.boxes = [];
        angular.forEach(boxesList, function(box,j) {
            if(j!==at) {
                $scope.boxes.push(box);
            } else {
                removeId = box.id;
            }
        });
        // remove box id from list
        if(removeId) {
            $scope.boxOrderById.splice($scope.boxOrderById.indexOf(removeId), 1);
        }
        $scope.deletedBoxTally += 1;
        $scope.colorAt = ($scope.colorAt >= 248 ? 248 : $scope.colorAt + 8);
        ts.log($scope.colorAt, 'Color at->');
        var bgColor=$scope.rgbToHex($scope.colorAt,$scope.colorAt,$scope.colorAt);
        ts.log(bgColor, 'New background color->');
        document.querySelector('#container2').style.backgroundColor = bgColor;
        $scope.setAlert('Box #' + removeId + ' was deleted');
        $scope.reBuild();
    };
    
    // restore app state or populate defaults if app state is not available
    $scope.restoreAppState();
    
    // add the first box
    if($scope.boxes.length<1) {
        $scope.addBox();
    }
    
    $(window).on('resize', function() {
        //$scope.relayout();
        $scope.reBuild();
    });
    
    /** Test Suite **/
    $scope.toggleTest = function() {
        $scope.TESTING = !$scope.TESTING;
        $scope.setupTests();
    };
    $scope.TestCount = 3;
    $scope.tests = [];
    $scope.TestActions = [
        {
            Name: 'Add boxes',
            Do: function( num ) {
                for(var i=0;i<num;i++) {
                    $scope.addBox( $scope.boxes.length - 1 );
                }
            },
            input: false
        },
        {
            Name: 'Delete last box',
            Do: function() {
                if($scope.boxes.length<2) {
                    $scope.setAlert("Deleting first box is not allowed",{type:'error'});
                } else {
                    angular.forEach($scope.boxes, function(box,at) {
                        if(angular.equals(box.id,$scope.lastBoxId)) {
                            $scope.removeBox(at);
                        }
                    });
                }
            },
            input: false
        },
        {
            Name: 'Reset layout',
            Do: function() {
                $scope.reset();
            },
            input: false
        }
    ];
    $scope.setupTests = function() {
        $scope.tests = [];
        for(var i=0;i<$scope.TestCount;i++) {
            var defaultAction = $scope.TestActions[0];
            var thisTest = {
                Action: defaultAction,
                input: (defaultAction.input ? 1 : 0), 
                inputVal: 1
            };
            $scope.tests.push(thisTest);
        }
    };
    $scope.buildTests = function() {
        $scope.testQueue = [];
        ts.log($scope.tests, 'Tests');
        angular.forEach($scope.tests, function(test) {
            if(angular.isFunction(test.Action.Do)) {
                $scope.testQueue.push({ task: test.Action.Do, val: test.inputVal, wait: 1200, at: $scope.testQueue.length, done: false });
            }
        });
        ts.log($scope.testQueue, 'Queue');
    };
    $scope.runTest = function() {
        $scope.RUNNING_TEST = true;
        $scope.buildTests();
        if(angular.isArray($scope.testQueue)) {
            var cumulWait = 0;
            angular.forEach($scope.testQueue, function(test, j) {
                cumulWait += test.wait;
                setTimeout(function() {
                    ts.log("Running task #" + (j+1) + "...");
                    test.task(test.val);
                    test.done = true;
                }, cumulWait);
            });
            $scope.waitTillDone = setInterval(function() {
                var pendingTasks = $filter('filter')($scope.testQueue, { done: false }, function(exp,act) {
                    return angular.equals(act,exp);
                });
                if(pendingTasks.length<1) {
                    $scope.RUNNING_TEST = false;
                    clearInterval($scope.waitTillDone);
                    ts.log('All tasks done');
                    $scope.setAlert("Tests complete");
                    $('body').scrollTo('#container2',{duration: 'slow'});
                }
            }, 500);
        }
    };
    
}]);
