
var l = console.log.bind(console);

$(function () {
    //there is another 1 like this below
    if (window.location.href.toLowerCase().indexOf('/english/') > -1) {
        $("#projects-app").css('text-align', 'left');
    }
    DocsProject.init();
});

var DocsProject = {
    getReadMore: function () {
        switch (DocsProject.lang) {
            case "ENG": return 'Read More';
            case "HEB": return 'קרא עוד';
            case "ARA": return 'اقرأ أكثر';
        }
    },

    getMonthes: function () {
        var lang = 'HEB';
        if (window.location.href.toLowerCase().indexOf('/english/') > -1) { lang = 'ENG'; };
        if (window.location.href.toLowerCase().indexOf('/arabic/') > -1) { lang = 'ARA'; };

        switch (lang) {
            case "ENG":
                return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            case "HEB":
                return ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
            case "ARA":
                return ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"];
        }
    },
    init: function () {
        var container = "#grid-docs";
        var filterContainer = "#grid-docs-filter";

        DocsProject.lang = 'HEB';
        if (window.location.href.toLowerCase().indexOf('/english/') > -1) { DocsProject.lang = 'ENG'; };
        if (window.location.href.toLowerCase().indexOf('/arabic/') > -1) { DocsProject.lang = 'ARA'; };


        DocsProject.getListItems(container, filterContainer);
    },
    getListItems: function (container, filterContainer) {
        var diri = '"Monthly Summary HE"';
        if (window.location.href.toLowerCase().indexOf('/english/') > -1) { diri = '"Monthly Summay EN"'; };
        if (window.location.href.toLowerCase().indexOf('/arabic/') > -1) { diri = '"Monthly Summary AR"'; };

        $.ajax({
            //Monthly Summay EN for en, Monthly Summary with 'r' for he or ar
            url: "/_api/search/query?querytext='ListId:CE50F36F-6E9F-455B-9E28-A69F89F8DE5B ParentLink:" + diri + "'&rowlimit=500&" +
			"selectproperties='cdArticleDateOWSDATE,Path'" +
			"&clienttype='ContentSearchRegular'&QueryTemplatePropertiesUrl='spfile://webroot/queryparametertemplate.xml'",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (response) {
                var htmlItems = "";
                var arr = [];
                var filtersArr = {};

                //cubes options
                var mediaQ = [{
                    width: 1100,
                    cols: 6,
                }, {
                    width: 600,
                    cols: 4,
                }, {
                    width: 480,
                    cols: 2,
                    options: {
                        gapHorizontal: 15,
                        gapVertical: 15,
                    }
                }]
                //end oprions

                var count = response.d.query.PrimaryQueryResult.RelevantResults.RowCount;
                l('DocsProject.getListItems - count: ' + count);

                $.each(response.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results, function (index, item) {
                    var searchResult = [];

                    // Normalize the fields
                    $.each(this.Cells.results, function (i, prop) {
                        searchResult[prop.Key] = prop.Value;
                    });

                    //https://cd.ewavetest.co.il/SiteCollectionDocuments/Monthly Summary HE/דוח חודשי –  אוגוסט 2015.pdf
                    var lastSlash = searchResult.Path.lastIndexOf('/');
                    var startIndexBack = searchResult.Path.length - (searchResult.Path.length - lastSlash + 1);
                    var lastSlash2 = searchResult.Path.lastIndexOf('/', startIndexBack) + 1;
                    var category = searchResult.Path.substring(lastSlash2, lastSlash);
                    //fix of stuff like מסמכי הקמה
                    category = category.replace(/ /g, '-');

                    if (!filtersArr[category]) {
                        filtersArr[category] = category;
                    }

                    searchResult.date = new Date(searchResult.cdArticleDateOWSDATE);
                    searchResult.category = category;
                    arr.push(searchResult);
                });

                arr.sort(function (a, b) {
                    return b.date - a.date;
                });

                $.each(arr, function (index, item) {
                    htmlItems += DocsProject.buidlItem(item);
                });

                $(filterContainer).html(DocsProject.buildFilterItem(filtersArr));
                $(container).html(htmlItems);

                if (window.location.href.toLowerCase().indexOf('/english/') > -1) {
                    $(".cbp-caption-defaultWrap").css('direction', 'ltr')
                }

                DocsProject.initCubes(container, mediaQ, 'fadeIn', filterContainer);
            },
            error: function (data) {
                console.log("Error: " + data);
            }
        });
    },
    buildFilterItem: function (filtersArr) {

        //heb הכל
        //en ALL
        //AR الكل

        var all = 'הכל';
        if (window.location.href.toLowerCase().indexOf('/english/') > -1) { all = 'ALL'; };
        if (window.location.href.toLowerCase().indexOf('/arabic/') > -1) { all = 'الكل'; };

        var content = '<a href="javascript:void(0);" data-filter="*" class="cbp-filter-item"> ';
        content += all + ' <div class="cbp-filter-counter"></div></a>';

        var keys = Object.keys(filtersArr);

        for (var i = 0; i < keys.length; i++) {
            content += '<a href="javascript:void(0);" data-filter=".' + keys[i] + '" class="cbp-filter-item">';
            content += ' ' + keys[i] + '<div class="cbp-filter-counter"></div></a>';
        }

        return content;
    },
    buidlItem: function (obj) {
        var monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
        monthNames = DocsProject.getMonthes();
        var fullDesc = obj.Path;

        var ne = fullDesc.indexOf(".pdf");
        fullDesc = fullDesc.substr(0, ne);
        var ns = fullDesc.indexOf("HE/");
        fullDesc = fullDesc.substr(ns + 4);
        var isYearly = false;
        if (obj.Title.indexOf('סיכום שנתי') != -1) {
            fullDesc = fullDesc.substr(12);
            isYearly = true;
        }
        else {
            fullDesc = fullDesc.substr(13);
        }
        
        //console.log(fullDesc);

        var content = '<div class="cbp-item ' + obj.category + '">';
        content += '<div class="cbp-caption">';
        content += '<div class="cbp-caption-defaultWrap">';
        content += '<img src="/assets/icons/report.png" alt="' + fullDesc + '"/>'
        content += '</div>';
        content += '<div class="cbp-caption-activeWrap">';
        content += '<div class="cbp-l-caption-alignCenter">';
        content += '<div class="cbp-l-caption-body">';
        //content += '<div class="cbp-l-caption-title">' + obj.Title + '</div>';
        var monthName = monthNames[obj.date.getMonth()];
        if (monthName != "undefined" && monthName != null && monthName != "") {
            content += '<div class="cbp-l-caption-desc">' + fullDesc + '</div>';
        }
        else {
            content += '<div class="cbp-l-caption-desc">' + fullDesc + '</div>';
        }
        content += '<a href="' + obj.Path + '" class=" cbp-l-caption-buttonLeft" rel="nofollow" title="' + fullDesc + '">' + DocsProject.getReadMore() + '</a>';
        content += '</div></div></div></div>';
        //content += '<a href="' + obj.Path + '" class=" cbp-l-grid-masonry-projects-title" rel="nofollow">' + obj.Title + '</a>';
        //content += '<div class="cbp-l-grid-masonry-projects-desc">' + obj.category + '</div>';

        if (isYearly)
        {
            content += '<div class="cbp-l-grid-masonry-projects-desc">' + obj.Title + '</div>';
        }
        else if (monthName != "undefined" && monthName != null && monthName != "") {
            content += '<div class="cbp-l-grid-masonry-projects-desc">' + monthName + ', ' + obj.date.getFullYear() + '</div>';
        }
        else {
            content += '<div class="cbp-l-grid-masonry-projects-desc">' + obj.date.getFullYear() + '</div>';
        }

        content += '</div>';
        return content;

    },
    initCubes: function (container, mediaQ, captionAnim, filterContainer) {
        l('DocsProject.initCubes');
        // init cubeportfolio
        $(container).cubeportfolio({
            filters: filterContainer,
            layoutMode: 'grid',
            mediaQueries: mediaQ,
            animationType: 'flipOutDelay',
            gapHorizontal: 10,
            gapVertical: 10,
            gridAdjustment: 'responsive',
            caption: captionAnim,
            displayType: 'sequentially',
            displayTypeSpeed: 100,



            plugins: {
                loadMore: {
                    selector: '#js-loadMore-lightbox-gallery',
                    action: 'click',
                    loadItems: 3,
                }
            },
        });
    }
}