// ==UserScript==
// @name         starwalkerUC
// @namespace    https://undercards.net
// @version      1.1.2
// @description  he sees u
// @author       galadino
// @match        https://*.undercards.net/*
// @icon         https://raw.githubusercontent.com/galadinowo/starwalkerUC/main/starwalkerUC.png
// @grant        none
// ==/UserScript==

const checkInit = setInterval(() => {
    if (window.location.pathname !== '/CardSkinsShop') { clearInterval(checkInit); return; }
    if (typeof initCardSkinsShop === 'function'){
        clearInterval(checkInit);
        function initOverride () {
        $.ajax({
        url: url + "?action=shop",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            frameName = data.frameName;
            var rawCardSkins = JSON.parse(data.cardSkins);
            authors = [];
            cardIds = [];
            cardSkins = [];
            for (var i = 0; i < rawCardSkins.length; i++) {
                var cardSkin = rawCardSkins[i];
                var cardId = cardSkin.cardId;
                var authorName = cardSkin.authorName;

                if (!authors.includes(authorName)) {
                    authors.push(authorName);
                }
                if (!cardIds.includes(cardId)) {
                    cardIds.push(cardId);
                }
                    cardSkins.push(cardSkin);
            }
            ucp = data.ucp;
            refreshLists();
            applyFilters();
            showPage(0);
        }
    });
        }} initOverride(); initCardSkinsShop = initOverride;
});

const checkIsRemoved = setInterval(() => {
    if (window.location.pathname !== '/CardSkinsShop') { clearInterval(checkIsRemoved); return; }
    if (typeof isRemoved === 'function') {
        clearInterval(checkIsRemoved)
        function newIsRemoved(cardSkin) {

            var removed = false;

            //Card
            if (!removed) {

                var cardId = $("#selectCards").val();

                if (cardId.length > 0) {
                    removed = parseInt(cardId) !== cardSkin.cardId;
                }
            }

            //Author
            if (!removed) {

                var author = $("#selectAuthors").val();

                if (author.length > 0) {
                    removed = author !== cardSkin.authorName;
                }
            }

            //Owned
            if (!removed) {
                var owned = $('#ownedInput').prop('checked');

                if (owned) {
                    removed = cardSkin.owned !== owned;
                }

            }
            //Legacy
            if (!removed) {
                var unavailable = $('#unavailableInput').prop('checked');

                if (unavailable) {
                    removed = cardSkin.unavailable !== unavailable;
                }

            }

            //DiscountPage

            if (!removed) {
                if (isDiscountPage) {
                    removed = cardSkin.discount === 0;
                }
            }

            //Search

            if (!removed) {
                var searchValue = $('#searchInput').val().toLowerCase();

                if (searchValue.length > 0) {

                    var findableString = '';

                    findableString += $.i18n('card-name-' + cardSkin.cardId, 1);
                    findableString += cardSkin.name;
                    findableString += cardSkin.authorName;
                    findableString += (cardSkin.ucpCost - cardSkin.discount);

                    removed = !findableString.toLowerCase().includes(searchValue);
                }
            }

            return removed;
        }
    } isRemoved = newIsRemoved;
});


if (document.readyState !== 'loading') {
    appendLegacyFilter()
} else {
    document.addEventListener('DOMContentLoaded', appendLegacyFilter());
}

function appendLegacyFilter() {
    if (window.location.pathname !== '/CardSkinsShop') { return; }
    var newLabel = document.createElement('label');

    var inputElement = document.createElement('input');
    inputElement.type = 'checkbox';
    inputElement.id = 'unavailableInput';
    inputElement.setAttribute('onchange', 'applyFilters(); showPage(0);');

    var spanElement = document.createElement('span');
    spanElement.className = 'glyphicon glyphicon-star yellow';
    spanElement.style.padding = '5px';
    newLabel.appendChild(inputElement);
    newLabel.appendChild(spanElement);

    var tdElement = document.querySelector('td[style="width: 180px;"]');
    tdElement.appendChild(newLabel);
};