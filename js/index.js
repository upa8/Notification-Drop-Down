var app = angular.module('app', ['ngAnimate']);
app.controller('demoController', function($scope){
    var opendd;
    var storedNewNotifications;
    var storedReadNotifications;
    var storedawaitingNotifications;
    var init = function(){
        storedNewNotifications = JSON.parse(localStorage.getItem('newNotifications'));
        storedReadNotifications = JSON.parse(localStorage.getItem('readNotifications'));
        storedawaitingNotifications = JSON.parse(localStorage.getItem('awaitingNotifications'));
        if(storedNewNotifications == null){
            $scope.newNotifications = [
                {
                    user: pollingData.users[1],
                    action: pollingData.actions[0],
                    target: pollingData.actionTargets[2],
                    timestamp: new Date()
                }
            ];
        }
        else{
            $scope.newNotifications = storedNewNotifications;
        }
        if(storedReadNotifications == null){
            $scope.readNotifications = [
                {
                    user: pollingData.users[2],
                    action: pollingData.actions[1],
                    target: pollingData.actionTargets[0],
                    timestamp: new Date()
                }
            ];
        }
        else{
            $scope.readNotifications = storedReadNotifications;
        }
        if(storedawaitingNotifications == null)
            $scope.awaitingNotifications = 1;
        else{
            $scope.awaitingNotifications = storedawaitingNotifications;
            if($scope.awaitingNotifications == 0)
                angular.element('#notifications-count').hide();
        }
        $scope.showNotifications = function($event){
            var targetdd = angular.element($event.target).closest('.dropdown-container').find('.dropdown-menu');
            opendd = targetdd;
            if(targetdd.hasClass('fadeInDown')){
                hidedd(targetdd);
            }
            else{
                targetdd.css('display', 'block').removeClass('fadeOutUp').addClass('fadeInDown')
                    .on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function(){
                        angular.element(this).show();
                    });
                targetdd.find('.dropdown-body')[0].scrollTop = 0;
                $scope.awaitingNotifications = 0;
                angular.element('#notifications-count').removeClass('fadeIn').addClass('fadeOut');
            }
        };
        $scope.hideInfo = function(){
            angular.element('#demoInfo').addClass('zoomOut')
                .on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function(){
                    angular.element(this).hide();
                    angular.element('.instruction').addClass('zoomIn').show();
                });
        }
        //show notifications count if new notifications are received
        setInterval(function(){
            if($scope.awaitingNotifications > 0 && opendd == null && (angular.element('#notifications-count').css('opacity') == '0' || angular.element('#notifications-count').is(':hidden')))
                angular.element('#notifications-count').removeClass('fadeOut').addClass('fadeIn').show();
        }, 400);
        dummyPolling();
    }

    //Hide dropdown function
    var hidedd = function(targetdd){
        targetdd.removeClass('fadeInDown').addClass('fadeOutUp')
            .on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function(){
                angular.element(this).hide();
            });
        opendd = null;
        $scope.awaitingNotifications = 0;
        angular.forEach($scope.newNotifications, function(notification){
            $scope.readNotifications.push(notification);
        });
        $scope.newNotifications = [];
        localStorage.setItem('readNotifications', JSON.stringify($scope.readNotifications));
        localStorage.setItem('newNotifications', JSON.stringify($scope.newNotifications));
        localStorage.setItem('awaitingNotifications', JSON.stringify($scope.awaitingNotifications));
        if($scope.awaitingNotifications > 0)
            angular.element('#notifications-count').removeClass('fadeOut').addClass('fadeIn');
    }

    //New notification is created by selecting random user, action and targets from this object
    var pollingData = {
        users : [
            {
                name: "Pratik Upacharya",
                imageUrl: "https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAANfAAAAJDE1MzNiYjM1LWVjYzUtNDcwZi1hMmExLTQ5ZDVjYzViMDkzYQ.jpg"
            },
            {
                name: "Elon Musk",
                imageUrl: "https://media.licdn.com/mpr/mpr/shrinknp_800_800/AAEAAQAAAAAAAAV8AAAAJDJiOGNlNmU2LTBmNDEtNGJiMy04Y2JkLWYyYmVlOGJmZThjYw.jpg"
            },
            {
                name: "Steve Jobs",
                imageUrl: "https://thinkmarketingmagazine.com/wp-content/uploads/2013/06/steve-jobs.jpg"
            }
        ],
        actions: ["upvoted", "promoted", "shared"],
        actionTargets: ["your answer", "your post", "your question"]
    };

    //generates a random number between 0 and 2 to select random polling data
    var getRandomNumber = function(){
        return Math.floor(Math.random() * 3);
    };

    //creates and returns a new notification
    var getNewNotification = function(){
        var userIndex = getRandomNumber();
        var actionIndex = getRandomNumber();
        var actionTargetIndex = getRandomNumber();
        var newNotification = {
            user: pollingData.users[userIndex],
            action: pollingData.actions[actionIndex],
            target: pollingData.actionTargets[actionTargetIndex],
            timestamp: new Date()
        }
        return newNotification;
    };


    var dummyPolling = function(){
        // TODO:
        // we can convert this logic to socket which is more efficient
        // I choose to do it via polling as it was easy to implement
        // I will refactor it to socket once I complete the task and I get more time
        var randomInterval = 2*Math.round(Math.random() * (3000 - 500)) + 1000;
        setTimeout(function() {
            $scope.$apply(function(){
                console.log(randomInterval);
                // if there is new notification, then update this, otherwise no.
                console.log(randomInterval);
                if(newNotificationRecieved(randomInterval)){
                    $scope.newNotifications.push(getNewNotification());
                    $scope.awaitingNotifications++;
                    localStorage.setItem('newNotifications', JSON.stringify($scope.newNotifications));
                    localStorage.setItem('awaitingNotifications', JSON.stringify($scope.awaitingNotifications));
                }else{
                    console.log("No new notification");
                }
            });
            dummyPolling();
        }, randomInterval);
    }
    function newNotificationRecieved(temp) {
        // make an ajax call to check whether new notification is present or not
        return temp%5 == 0;
    }

    window.onclick = function(event){
        var clickedElement = angular.element(event.target);
        var clickedDdTrigger = clickedElement.closest('.dd-trigger').length;
        var clickedDdContainer = clickedElement.closest('.dropdown-menu').length;
        if(opendd != null && clickedDdTrigger == 0 && clickedDdContainer == 0){
            hidedd(opendd);
        }
    }

    window.onbeforeunload = function(e) {
        if(opendd != null){
            console.log('closingdd');
            hidedd(opendd);
        }
    };

    init();
})