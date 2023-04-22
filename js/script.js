function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}


function setUpMenu() {
    $(".topmenubar").on("click", function () {
        $(".mobiletopmenu").toggle();
    });

}



$("table[id*='4371919E-0CCF-4143-A54B-DC8F2191231C'").find('tr').each(function (i, o) {
    debugger;
    try {
        var date = $(this).find('td:nth-child(5)').text().split(' ')[0];
        var time = $(this).find('td:nth-child(5)').text().split(' ')[1];

        var dArr = date.split('/');
        var text = dArr[2] + '-' + dArr[1] + '-' + dArr[0] + ' ' + time;

        if (moment(text) < moment()) {

        }
    }
    catch (err) { }
})


var reservationSticky = 380;
var diff = 118;
function getMenu() {
    $(".menuitems").load("menu.html", function () {

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            diff = 350;
            $(".content").css("margin-top", "80px");
        }
        else {
            diff = 400;

            $('.popmenuctrl')
                .mouseover(function () {
                    //$(".popmenu").addClass("openmenu");
                    var h = $("#tzarea").height() - 8;
                    $(".popmenu").stop().animate({ top: h + "px" }, { duration: 200 });
                })
                .mouseout(function () {
                    //$(".popmenu").removeClass("openmenu");
                    $(".popmenu").stop().animate({ top: "-160px" }, { duration: 500 });
                });

        }

        if (location.pathname.toLowerCase().indexOf("/index.html") != -1) {
            $("body").on("scroll", function () {

                //console.log($("body").scrollTop() + " : " + $(".reservectrl").position().top);
                if ($("body").scrollTop() >= diff) {
                    $(".reservectrl").addClass("stickyctrl");
                    $(".bottomcontent").addClass("stickyMode");
                }
                else {
                    $(".reservectrl").removeClass("stickyctrl");
                    $(".bottomcontent").removeClass("stickyMode");
                }


            });
        }
        else {
            $(".reservectrl").addClass("stickyctrl").addClass("stickyctrlLeft");
            $(".bottomcontent").addClass("stickyMode");
        }



        $(".menuitem").on("mouseover", function () {

            var c = $(this).attr("color");
            if (typeof (c) == "undefined" || c == "") {
                c = "gray";
            }
            $(this).css("background-color", "white").find("i").css("color", c);
            $(this).find("div").css("color", c);
        }).on("mouseleave", function () {
            $(this).css("background-color", "initial").find("i").css("color", "white");
            $(this).find("div").css("color", "white");
        });;
    });


}


function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getReservationCtrl() {
    $("#reservectrl").load('reservectrl.html', function () {

        var header = 80;

        var height = ($(window).height() / 2) - header;
        $("#reservectrl").css("top", "-" + height + "px");

        jQuery("#myModal").bmdIframe();
        $(".modaltrigger").on("click", function () {

            var src = $(this).attr("data-content");
            $("#modalimg").attr("src", src);
        })

        if (isMobile()) {
            $("#datetimepicker1").find(".desktop").remove();
        }
        else {
            $("#datetimepicker1").find(".mobile").remove();
            $('#datetimepicker1').datepicker({
                format: "dd/mm/yyyy",
                language: 'he',
                orientation: "top left",
                autoclose: true

            });
        }


    });


}
var isopen = false;
function setMainItemHeight() {
    var header = 68;
    if (isMobile()) {
        header = 50;
    }

    var height = $(window).height() - header;
    $(".mainitem").css("height", height + "px");
}

$("document").ready(function () {
//getReservationCtrl();
getMenu();

    setUpMenu();
    
    
    $("#datetimepicker1 input").attr("placeholder", "בחר תאריך הגעה");
    setMainItemHeight();

});
$(document).ready(function () {


    $(".carousel").on("touchstart", function (event) {
        var xClick = event.originalEvent.touches[0].pageX;
        $(this).one("touchmove", function (event) {
            var xMove = event.originalEvent.touches[0].pageX;
            if (Math.floor(xClick - xMove) > 5) {
                $(this).carousel('next');
            }
            else if (Math.floor(xClick - xMove) < -5) {
                $(this).carousel('prev');
            }
        });
        $(".carousel").on("touchend", function () {
            $(this).off("touchmove");
        });
    });
});
function attachHousesPopupForMobile(e) {
    if (isMobile()) {
        if ($('.housesmenu').hasClass('housesclosed')) {
            $('.housesmenu').addClass('housesopen').removeClass('housesclosed');
        }
        else {
            $('.housesmenu').removeClass('housesopen').addClass('housesclosed');
        }
        e.stopPropagation();
    }
}