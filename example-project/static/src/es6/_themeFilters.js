try {
    let baseUrl = `https://${location.host}`;
// let searchPrefix = 'html/search.html';
    let searchPrefix = `search`;
    let currantUrl = location.href;
    let searchGetParameter;
    let submitted = false;
    let ajaxForm = $('[data-ajax-filter]');
    let headerSearchForm = $('[data-header-search]');
    let headerSearchFormInput = $('[data-header-search-input]');
    let counter, explore;
    let screenMode;
    let selects, checkers, inputs;
    let data = {};
    let ajaxLoadMore = false;
    let actions = [];
    let wrappers = [];
    let paginationArr = [];
    let pagedArr = [];
    let isPagination = false;
    let noResultContent = `<div style="text-align: center; width: 100%; margin-top: 15px;">
                            <h2 style=" color: #3c3ca0; font-size: 24px;">No result</h2>
                       </div>`;
    let errorContent = `<div style="text-align: center; width: 100%; margin-top: 15px;">
                        <h2 style=" color: orangered; font-size: 24px;">Something went wrong !!!</h2>
                    </div>`;

    initScreen();

    if (headerSearchForm.get(0)) {
        initHeaderListeners();
    }
    if (ajaxForm.get(0)) {
        selects = ajaxForm.find('[data-filter-select]');
        inputs = ajaxForm.find('[data-filter-input]');
        checkers = $('[data-filter-check]');
        checkerCounts = $('[data-checker-count]');
        data.action = ajaxForm.data('action');
        counter = $(`[data-counter="${data.action}"]`);
        explore = $(`[data-explore="${data.action}"]`);
        ajaxForm.each(function () {
            let act = $(this).data('action');
            actions.push(act);
            wrappers.push($(`[data-content-wrapper="${act}"]`));
            pagedArr.push(1);
        });

        setInitialValues();
        searchGetParameter = findGetParameter('search');

        initPagination();
        ajaxForm.each(function (index) {
            makeRequest(index);
        });
        initListeners();
    }

    function setAjaxData(index) {
        selects.each(function (el) {
            data[$(this).data('filter')] = $(this).val();
        });
        if (inputs.get(0)) {
            inputs.eq(0).val(searchGetParameter);
        }
        data.search = inputs.get(0) ? inputs.eq(0).val() : null;
        data.action = actions[index];
        data.pgd = pagedArr[index];
        initItemsToShow(index);
    }

    function makeRequest(index) {
        setAjaxData(index);
        paginationArr[index].pagination.html('');
        showLoader(index);
        console.log(data)
        jQuery.ajax({
            type: "post",
            url: "https://" + location.host + "/wp-admin/admin-ajax.php",
            data: data,
            success: function (response) {
                if (response != false) {
                    const res = JSON.parse(response);
                    if (!res['content']) {
                        wrappers[index].html('');
                        paginationArr[index].pagination.html('');
                        counter.html('');
                        explore.html(noResultContent);
                    } else {
                        successResponse(res, index);
                    }
                    setCheckersCounts(res['checkers_counts']);
                } else {
                    wrappers[index].html('');
                    paginationArr[index].pagination.html('');
                    counter.html('');
                    explore.html(noResultContent);
                    checkerCounts.each(function (index) {
                        $(this).text(`(0)`);
                    });
                }
                initPagination();
                initListeners();
            },
            error: function (response) {
                wrappers[index].html('');
                paginationArr[index].pagination.html('');
                counter.html('');
                explore.html(errorContent);
            }
        });
    }

    function successResponse(res, index) {
        if (wrappers[index].get(0) && res['content']) {
            if (ajaxLoadMore) {
                hideLoader(index);
                wrappers[index].append(res['content']);
            } else {
                wrappers[index].html(res['content']);
            }
            if (paginationArr[index].pagination.get(0))
                paginationArr[index].pagination.html(res['pagination']);
        }
        if (counter.get(0) && res['counter']) {
            counter.html(res['counter']);
        }
        if (explore.get(0) && res['explore-count']) {
            explore.html(res['explore-count']);
        }
    }

    function initItemsToShow(index) {
        data.items_to_show = null;
        switch (actions[index]) {
            case 'filter_members' : {
                data.items_to_show = screenMode === 'tablet' ? 9 : 8;
                break;
            }
            case 'filter_search' : {
                data.items_to_show = screenMode === 'mobile' ? 6 : 8;
                break;
            }
            case 'filter_courses': {
                data.items_to_show = screenMode === 'mobile' ? 3 : 6;
                break;
            }
            case 'filter_article' : {
                data.items_to_show = screenMode === 'mobile' ? 5 : 6;
                break;
            }
            case 'filter_recentWebTalks' : {
                data.items_to_show = screenMode === 'mobile' ? 4 : 4;
                break;
            }
            case 'filter_pastWebTalks' : {
                data.items_to_show = screenMode === 'mobile' ? 5 : 6;
                break;
            }
        }
    }

    function setPagination(index) {
        let pag = paginationArr[index];
        pag.pagers.removeClass('active').removeClass('hidden-pager').eq(pagedArr[index] - 1).addClass('active');
        if (!ajaxLoadMore) {
            let newUrl = updateURLParameter(`${currantUrl}`, 'pgd', pagedArr[index]);
            window.history.replaceState('', '', newUrl);
        }
        if (pagedArr[index] < 3) {
            pag.pagePrev.addClass('disabled');
        } else {
            pag.pagePrev.removeClass('disabled');
        }
        if (pagedArr[index] >= pag.pagers.length - 2) {
            pag.pageNext.addClass('disabled');
        } else {
            pag.pageNext.removeClass('disabled');
        }

        if (pagedArr[index] === pag.pagers.length) {
            if (screenMode === 'mobile' && iOS()) {
                $('body, html').animate({scrollTop: explore.offset().top - 80}, 'slow');
            }
            if(data.action === 'filter_courses') {
                $('body, html').animate({scrollTop: explore.offset().top - 80}, 'slow');
            }
        }

        if (pag.pagers.length > 5) {
            if (pagedArr[index] === 1) {
                pag.pagers.each(function () {
                    if ($(this).index() > 4) {
                        $(this).addClass('hidden-pager');
                    }
                })
            } else if (pagedArr[index] >= pag.pagers.length - 2) {
                pag.pagers.each(function () {
                    if ($(this).index() < pag.pagers.length - 3) {
                        $(this).addClass('hidden-pager');
                    }
                });
            } else {
                pag.pagers.each(function () {
                    if ($(this).index() > pagedArr[index] + 2 || $(this).index() < pagedArr[index] - 1) {
                        $(this).addClass('hidden-pager');
                    } else {
                        $(this).removeClass('hidden-pager');
                    }
                })
            }
        } else {
            pag.pagePrev.addClass('disabled');
            pag.pageNext.addClass('disabled');
        }
    }

    function changeCheck(el) {
        wrappers[0].html('');
        checkers.removeClass('active');
        checkers.css('pointer-events', 'auto');
        inputs.removeClass('error');
        el.addClass('active');
        el.css('pointer-events', 'none');
        data[el.data('filter')] = el.data('value');
        let newUrl = updateURLParameter(`${currantUrl}`, el.data('filter'), el.data('value'));
        window.history.replaceState('', '', newUrl);
    }

    function initPagination() {
        paginationArr = [];
        actions.forEach(function (act, index) {
            let pag = $(`[data-for-action="${act}"]`);
            let pagers = pag.find('[data-pager]');
            let pageNext = pag.find('[data-pager-next]');
            let pagePrev = pag.find('[data-pager-prev]');
            let pagerMore = pag.find('[data-pager-more]');
            if (pagerMore.get(0)) {
                ajaxLoadMore = true;
            }
            paginationArr.push({
                pagination: pag,
                pagers: pagers,
                pageNext: pageNext,
                pagePrev: pagePrev,
                pagerMore: pagerMore
            });
            setPagination(index);
        });
    }

    function initHeaderListeners() {
        headerSearchForm.on({
            submit: function (e) {
                e.preventDefault();
                searchGetParameter = headerSearchFormInput.val().trim();
                if (validation(searchGetParameter, 1))
                    location.href = `${baseUrl}/${searchPrefix}?search=${searchGetParameter}`;
            }
        });
        headerSearchFormInput.on({
            blur: function (e) {
                if (screenMode === 'mobile' && iOS()) {
                    headerSearchFormInput.closest('form').submit();
                }
            }
        });
    }

    function initListeners() {
        ajaxForm.unbind('submit').on({
            submit: function (e) {
                e.preventDefault();
                if (!submitted) {
                    submitForm();
                    submitted = true;
                    resetSubmitted();
                }
            }
        });
        inputs.on({
            keyup: function (e) {
                searchGetParameter = $(this).val().trim();
                if (validation(searchGetParameter, 1)) {
                    inputs.removeClass('error');
                } else {
                    searchGetParameter = '';
                    inputs.addClass('error');
                }
                let newUrl = updateURLParameter(`${currantUrl}`, 'search', searchGetParameter);
                window.history.replaceState('', '', newUrl);
            },
            blur: function (e) {
                if (screenMode === 'mobile' && iOS()) {
                    inputs.closest('form').submit();
                }
            }
        });
        selects.unbind('change').on({
            change: function (e) {
                pagedArr[0] = 1;
                let newUrl = updateURLParameter(`${currantUrl}`, $(this).data('filter'), $(this).val());
                window.history.replaceState('', '', newUrl);
                setPagination(0);

                $('.js-input-styler').trigger('refresh');
                makeRequest(0);
            }
        });
        checkers.unbind('click').on({
            click: function (e) {
                e.preventDefault();
                pagedArr[0] = 1;
                changeCheck($(this));
                setPagination(0);
                makeRequest(0);
            }
        });
        paginationArr.forEach(function (pag, index) {
            pag.pagers.on({
                click: function (e) {
                    e.preventDefault();
                    isPagination = true;
                    pagedArr[index] = $(this).index();
                    setPagination(index);
                    makeRequest(index);
                }
            });
            pag.pagerMore.unbind('click').on({
                click: function (e) {
                    e.preventDefault();
                    isPagination = true;
                    pagedArr[index] = pagedArr[index] + 1;
                    setPagination(index);
                    makeRequest(index);
                }
            });
            pag.pageNext.on({
                click: function (e) {
                    e.preventDefault();
                    isPagination = true;
                    pagedArr[index] = pagedArr[index] + 1;
                    setPagination(index);
                    makeRequest(index);
                }
            });
            pag.pagePrev.on({
                click: function (e) {
                    e.preventDefault();
                    isPagination = true;
                    pagedArr[index] = pagedArr[index] - 1;
                    setPagination(index);
                    makeRequest(index);

                }
            })
        });
    }

    function submitForm() {
        let value = inputs.eq(0).val().trim();
        if (validation(value, 1)) {
            wrappers[0].html('');
            data.search = value;
            inputs.removeClass('error');
            let newUrl = updateURLParameter(`${currantUrl}`, 'search', value);
            searchGetParameter = value;
            window.history.replaceState('', '', newUrl);
            makeRequest(0);
        } else {
            inputs.addClass('error');
        }
    }

    function resetSubmitted() {
        setTimeout(function () {
            submitted = false;
        }, 1000);
    }

    function initScreen() {
        let ww = $(window).width();
        screenMode = ww < 768 ? 'mobile' : ww > 1030 ? 'desktop' : 'tablet';
    }

    function setCheckersCounts(counts) {
        if (checkerCounts.get(0)) {
            checkerCounts.each(function (index) {
                $(this).text(`(${counts[index]})`);
            });
        }
    }

    function findGetParameter(parameterName) {
        let result = null,
            tmp = [];
        location.search
            .substr(1)
            .split("&")
            .forEach(function (item) {
                tmp = item.split("=");
                if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
            });
        return result;
    }

    function updateURLParameter(url, param, paramVal) {
        if (param) {
            let found = false;
            let newAdditionalURL = "";
            let tempArray = url.split("?");
            let baseURL = tempArray[0];
            let additionalURL = tempArray[1];
            let temp = "";
            paramVal = encodeURIComponent(paramVal);
            if (additionalURL) {
                tempArray = additionalURL.split("&");
                for (let i = 0; i < tempArray.length; i++) {
                    if (tempArray[i].split('=')[0] !== param) {
                        newAdditionalURL += temp + tempArray[i];
                        temp = "&";
                    } else {
                        if (paramVal) {
                            newAdditionalURL += temp + param + '=' + paramVal;
                            temp = "&";
                        }
                        found = true;
                    }
                }
                if (!found) {
                    newAdditionalURL += temp + param + '=' + paramVal;
                }
            } else {
                newAdditionalURL += temp + param + '=' + paramVal;
            }
            currantUrl = baseURL + "?" + newAdditionalURL;
            return currantUrl;
        }
    }

    function validation(str, length) {
        if (str.length < length) return false;
        let symbolsCount = 0;
        for (let i = 0; i < 3; i++)
            symbolsCount = (str.charAt(i) === ' ' || /[$-/:-?{-~!"^_`\[\]]/.test(str.charAt(i))) ? symbolsCount + 1 : symbolsCount;
        return symbolsCount < 3;
    }

    function setInitialValues() {
        let tmp = [];
        location.search
            .substr(1)
            .split("&")
            .forEach(function (item) {
                tmp = item.split("=");
                if (tmp[0]) {
                    let key = tmp[0],
                        value = decodeURIComponent(tmp[1]);
                    if (key === 'paged') {
                        pagedArr[0] = parseInt(value);
                    } else {
                        let element = $(`[data-filter=${key}]`);
                        if (element.attr('data-filter-select') !== undefined)
                            element.val(value);
                        if (element.attr('data-filter-check') !== undefined) {
                            changeCheck(element.filter(function (el) {
                                return $(this).attr('data-value') === value;
                            }))
                        }
                    }
                }
            });
    }

    function showLoader(index) {

        // actions[0] === 'filter_courses'
        if (!ajaxLoadMore) {
            if (isPagination) {
                paginationArr[0].pagination.html(`<div class="lds-roller"></div>`);
                counter.html('');
                isPagination = false;
            } else {
                counter.html('');
                explore.html('');
                wrappers[index].html(`<div class="lds-roller"></div>`);
            }
        } else {
            wrappers[index].append(`<div class="lds-roller"></div>`)
        }

    }

    function hideLoader(index) {
        wrappers[index].find('.lds-roller').remove();
    }

    function iOS() {

        let iDevices = [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPod',
            'iPhone'
        ];

        if (!!navigator.platform) {
            while (iDevices.length) {
                if (navigator.platform === iDevices.pop()) {
                    return true;
                }
            }
        }

        return false;
    }

} catch (e) {
    console.log(e.message);
}
