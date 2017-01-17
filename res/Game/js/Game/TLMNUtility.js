var TLMNUtility = {
    HAI: 0,
    DOI: 1,
    BA: 2,
    TUQUY: 3,
    BADOITHONG: 4,
    BONDOITHONG: 5,
    DAY: 6,
    preventable: [
        [3, 4, 5], // chan 2
        [1], // chan doi
        [2], // chan bo ba
        [3, 5], // chan tu quy
        [4, 5], // chan ba doi thong
        [5], //chan bon doi thong
        [6] // chan day
    ],

    getGroupType: function (cards) {
        if (!cards)
            return -1;

        if (cards.length <= 0) {
            return -1; // no suggest
        }
        if (cards.length == 1 && cards[0].rank != 2) {
            return -1; // no suggest
        }
        if (cards.length == 1 && cards[0].rank == 2) {
            return TLMNUtility.HAI;
        }

        var rankFreq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var suitFreq = [0, 0, 0, 0];

        for (var i = 0; i < cards.length; i++) {
            rankFreq[cards[i].rank]++;
            suitFreq[cards[i].suit]++;
        }

        //doi, ba , tu quy
        for (var i = 0; i < rankFreq.length; i++) {
            if (rankFreq[i] == cards.length) {
                switch (cards.length) {
                    case 2 :
                        return TLMNUtility.DOI;
                    case 3:
                        return TLMNUtility.BA;
                    case 4:
                        return TLMNUtility.TUQUY;
                }
            }
        }

        if (cards.length == 6) {
            for (var i = 0; i < rankFreq.length - 2; i++) {
                if (rankFreq[i] == 2 && rankFreq[i + 1] == 2 && rankFreq[i + 2] == 2) {
                    return TLMNUtility.BADOITHONG;
                }
            }
        }

        if (cards.length == 8) {
            for (var i = 0; i < rankFreq.length - 3; i++) {
                if (rankFreq[i] == 2 && rankFreq[i + 1] == 2 &&
                    rankFreq[i + 2] == 3 && rankFreq[i + 3] == 2) {
                    return TLMNUtility.BONDOITHONG;
                }
            }
        }

        var longestStreak = 0;
        var currentStreak = 0;
        for (var i = 0; i < rankFreq.length; i++) {
            if (rankFreq[i] == 1) {
                currentStreak++;
                longestStreak = longestStreak > currentStreak ? longestStreak : currentStreak;
            } else {
                currentStreak = 0;
            }
        }

        if (longestStreak == cards.length && longestStreak >= 3) {
            return TLMNUtility.DAY;
        }

        return -1;
    },

    getSuggestedCards: function (cards, handCards) {
        var suggestGroups = [];
        if (!cards) {
            suggestGroups = suggestGroups.concat(this.findSameCards(handCards, null, null, 2));
            suggestGroups = suggestGroups.concat(this.findSameCards(handCards, null, null, 3));
            suggestGroups = suggestGroups.concat(this.findSameCards(handCards, null, null, 4));
            suggestGroups = suggestGroups.concat(this.findDoiThong(handCards, null, null, 3));
            suggestGroups = suggestGroups.concat(this.findDoiThong(handCards, null, null, 4));
            for (var i = 3; i < 13; i++) {
                suggestGroups = suggestGroups.concat(this.findDay(handCards, null, null, i));
            }

            return suggestGroups;
        }
        var groupType = this.getGroupType(cards);
        if (groupType == -1) {
            return [];
        }

        var rankFreq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var suitFreq = [0, 0, 0, 0];
        for (var i = 0; i < handCards.length; i++) {
            rankFreq[handCards[i].rank]++;
            suitFreq[handCards[i].suit]++;
        }
        var preventableGroupType = this.preventable[groupType];
        for (var i = 0; i < preventableGroupType.length; i++) {
            switch (preventableGroupType[i]) {
                case TLMNUtility.DOI:
                    suggestGroups = suggestGroups.concat(this.findSameCards(handCards, rankFreq, suitFreq, 2));
                    break;
                case TLMNUtility.BA:
                    suggestGroups = suggestGroups.concat(this.findSameCards(handCards, rankFreq, suitFreq, 3));
                    break;
                case TLMNUtility.TUQUY:
                    suggestGroups = suggestGroups.concat(this.findSameCards(handCards, rankFreq, suitFreq, 4));
                    break;
                case TLMNUtility.BADOITHONG:
                    suggestGroups = suggestGroups.concat(this.findDoiThong(handCards, rankFreq, suitFreq, 3));
                    break;
                case TLMNUtility.BONDOITHONG:
                    suggestGroups = suggestGroups.concat(this.findDoiThong(handCards, rankFreq, suitFreq, 4));
                    break;
                case TLMNUtility.DAY:
                    suggestGroups = suggestGroups.concat(this.findDay(handCards, rankFreq, suitFreq, cards.length));
                    break;
            }
        }
        return suggestGroups;
    },

    findDay: function (handCards, rankFreq, suitFreq, length) {
        if (length > handCards.length)
            return [];

        if ((!rankFreq) || (!suitFreq)) {
            rankFreq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            suitFreq = [0, 0, 0, 0];
            for (var i = 0; i < handCards.length; i++) {
                rankFreq[handCards[i].rank]++;
                suitFreq[handCards[i].suit]++;
            }
        }

        var sameCards = [];
        var result = [];
        for (var i = 0; i < handCards.length; i++) {
            if (!sameCards[handCards[i].rank])
                sameCards[handCards[i].rank] = [];
            sameCards[handCards[i].rank].push(handCards[i]);
        }

        rankFreq[14] = rankFreq[1];
        for (var i = 3; i <= 15 - length; i++) {
            var isLegal = true;
            for (var j = 0; j < length; j++) {
                if (!rankFreq[i + j]) {
                    isLegal = false;
                    break;
                }
            }

            if (isLegal) {
                var fcallStr = "this.getCombination(";
                for (var j = 0; j < length; j++) {
                    fcallStr += "sameCards[" + (i + j) + "],"
                }
                fcallStr += ");";
                fcallStr = fcallStr.replace(",)", ")");

                result = result.concat(eval(fcallStr));
            }
        }

        return result;
    },

    // tim doi, bo ba, tu quy
    findSameCards: function (handCards, rankFreq, suitFreq, length) {
        if ((!rankFreq) || (!suitFreq)) {
            rankFreq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            suitFreq = [0, 0, 0, 0];
            for (var i = 0; i < handCards.length; i++) {
                rankFreq[handCards[i].rank]++;
                suitFreq[handCards[i].suit]++;
            }
        }

        var sameCards = [];
        var result = [];
        for (var i = 0; i < handCards.length; i++) {
            if (rankFreq[handCards[i].rank] >= length) {
                if (!sameCards[handCards[i].rank])
                    sameCards[handCards[i].rank] = [];
                sameCards[handCards[i].rank].push(handCards[i]);
            }
        }

        // tach cac bo, them vao ket qua
        for (var i = 0; i < sameCards.length; i++) {
            if (!sameCards[i])
                continue;
            for (var j = 0; j <= sameCards[i].length - length; j++) {
                result.push(sameCards[i].slice(j, length + j));
            }
        }

        return result;
    },

    findDoiThong: function (handCards, rankFreq, suitFreq, length) {
        if (length != 3 && length != 4) {
            return [];
        }

        if ((!rankFreq) || (!suitFreq)) {
            rankFreq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            suitFreq = [0, 0, 0, 0];
            for (var i = 0; i < handCards.length; i++) {
                rankFreq[handCards[i].rank]++;
                suitFreq[handCards[i].suit]++;
            }
        }

        var sameCards = [];
        var result = [];
        for (var i = 0; i < handCards.length; i++) {
            if (rankFreq[handCards[i].rank] >= 2) {
                if (!sameCards[handCards[i].rank])
                    sameCards[handCards[i].rank] = [];
                sameCards[handCards[i].rank].push(handCards[i]);
            }
        }

        rankFreq[14] = rankFreq[1];// A
        if (length == 3) {
            for (var i = 3; i < 13; i++) {
                if (rankFreq[i] >= 2 && rankFreq[i + 1] >= 2 && rankFreq[i + 2] >= 2) {
                    result = result.concat(this.getCombination(
                        this.getSubGroup(sameCards[i], 2),
                        this.getSubGroup(sameCards[i + 1], 2),
                        this.getSubGroup(sameCards[i + 2], 2)
                    ));
                }
            }
        }

        if (length == 4) {
            for (var i = 3; i < 12; i++) {
                if (rankFreq[i] >= 2 && rankFreq[i + 1] >= 2 && rankFreq[i + 2] >= 2 && rankFreq[i + 3] >= 2) {
                    result = result.concat(this.getCombination(
                        this.getSubGroup(sameCards[i], 2),
                        this.getSubGroup(sameCards[i + 1], 2),
                        this.getSubGroup(sameCards[i + 2], 2),
                        this.getSubGroup(sameCards[i + 3], 2)
                    ));
                }
            }
        }

        return result;
    },

    getCombination: function () {
        var result = [];
        var pre = arguments[0];
        if (arguments.length == 2) {
            var post = arguments[1].length ? arguments[1] : [arguments[1]];
            for (var i = 0; i < pre.length; i++) {
                for (var j = 0; j < post.length; j++) {
                    if (pre[i].length)
                        result.push(pre[i].concat(post[j]));
                    else
                        result.push([pre[i]].concat(post[j]));
                }
            }
            return result;
        }

        var fcallStr = "this.getCombination(";

        //build fcall
        for (var i = 1; i < arguments.length; i++)
            fcallStr += "arguments[" + i + "],";
        fcallStr += ");";
        fcallStr = fcallStr.replace(",)", ")");

        for (var i = 0; i < pre.length; i++) {
            var recursionResult = eval(fcallStr);
            for (var j = 0; j < recursionResult.length; j++) {
                if (pre[i].length)
                    result.push(pre[i].concat(recursionResult[j]));
                else
                    result.push([pre[i]].concat(recursionResult[j]));
            }
        }
        return result;
    },

    getSubGroup: function (group, length) {
        var result = [];
        for (var i = 0; i <= group.length - length; i++)
            result.push(group.slice(i, i + length));
        return result;
    }
};