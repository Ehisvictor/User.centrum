createAjax = function() {
    var objXMLHttp = null;
    if (window.XMLHttpRequest) {
        objXMLHttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            objXMLHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                objXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }
    return objXMLHttp;
};

doAjax = function(method, url, params, onload, onerror, withCredentials) {
    method = method.toUpperCase();
    if (method != "GET" && method != "POST") return false;
    var callurl = url;
    if (method == "GET") {
        callurl += "?" + params;
    }
    var ajax = createAjax();
    if (ajax == null) return false;
    try {
        if (typeof onload != "function") {
            onload = function() {};
        }
    } catch (ex) {
        onload = function() {};
    }
    try {
        if (typeof onerror != "function") {
            onerror = function() {};
        }
    } catch (ex) {
        onerror = function() {};
    }
    try {
        ajax.open(method, ego.url(callurl), true);
        if (typeof withCredentials !== "undefined" && withCredentials === true) ajax.withCredentials = true;
        ajax.onreadystatechange = function() {
            try {
                if (ajax.readyState == 4) {
                    if (ajax.status == 200) {
                        onload(ajax.responseText);
                    } else {
                        onerror(ajax.status, ajax.responseText);
                    }
                }
            } catch (ex) {
                onerror(ex);
            }
        };
        if (method == "POST") {
            ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            ajax.setRequestHeader("Content-Length", params.length);
            ajax.send(params);
        } else {
            ajax.send(null);
        }
    } catch (ex) {
        onerror(ex);
    }
    return true;
};

captchaRefresh = function() {
    var t = new Date();
    var caha = document.getElementById("caha").value;
    document.getElementById("captcha-img").src = "captcha.php?h=" + caha + "&r=1&t=" + t.getTime();
    return false;
};

var baseURL = window.location.href.substr(0, window.location.href.indexOf("/", 8));

function $(id) {
    return document.getElementById(id);
}

var BrowserDetect = {
    init: function() {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function(data) {
        var len = data.length;
        for (var i = 0; i < len; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1) return data[i].identity;
            } else if (dataProp) return data[i].identity;
        }
        return false;
    },
    searchVersion: function(dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [ {
        string: navigator.userAgent,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
    }, {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari"
    }, {
        prop: window.opera,
        identity: "Opera"
    }, {
        string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
    }, {
        string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
    }, {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
    }, {
        string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
    }, {
        string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
    }, {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
    }, {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
    }, {
        string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
    } ],
    dataOS: [ {
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
    }, {
        string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
    }, {
        string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
    } ]
};

BrowserDetect.init();

addEvent = function(el, ev, fn, bubble) {
    if (el.addEventListener) {
        el.addEventListener(ev, fn, bubble);
    } else if (el.attachEvent) {
        el.attachEvent("on" + ev, fn);
    }
};

removeEvent = function(el, ev, fn, bubble) {
    if (el.removeEventListener) {
        el.removeEventListener(ev, fn, bubble);
    } else if (el.detachEvent) {
        el.detachEvent("on" + ev, fn);
    }
};

prettySelectInit = function() {
    if (BrowserDetect.browser == "Explorer" && BrowserDetect.version <= 6) {
        return false;
    }
    var selects = document.getElementsByTagName("select");
    var selLength = selects.length;
    for (var i = 0; i < selLength; i++) {
        selects[i].style.display = "none";
        prettySelect(selects[i]);
    }
};

inputPlaceholderInit = function() {
    if (BrowserDetect.browser == "Explorer" && BrowserDetect.version <= 6) {
        return false;
    }
    var inputs = document.getElementsByTagName("input");
    var inpLength = inputs.length;
    var reg = new RegExp("placeholder-js");
    for (var i = 0; i < inpLength; i++) {
        if (inputs[i].className.match(reg)) {
            inputPlaceholer(inputs[i]);
        }
    }
};

function getElementsByClass(classStr, parent, nodeType) {
    var reMatches = classStr.split(/\s+/g).join("|");
    var re = new RegExp("(^|\\s+)(" + reMatches + ")(\\s+|$)", "g");
    return getElementsByClassRE(re, parent, nodeType);
}

function getElementsByClassRE(re, parent, nodeType) {
    parent = parent || document;
    var nodes = [];
    var candidateNodes = parent.getElementsByTagName(nodeType ? nodeType : "*");
    if (!candidateNodes.length && parent.all) candidateNodes = parent.all;
    var i = candidateNodes.length;
    var node = null;
    while (i--) {
        node = candidateNodes[i];
        if (node && node.className.match(re)) {
            nodes.push(node);
        }
    }
    return nodes;
}

String.prototype.reverse = function() {
    splitext = this.split("");
    revertext = splitext.reverse();
    reversed = revertext.join("");
    return reversed;
};

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

displayFieldError = function(target, msg) {
    var strClass = msg.length > 80 ? ' class="error-more-lines"' : "";
    $(target).innerHTML = '<p class="error"><span>Chyba: </span><strong' + strClass + ">" + msg + "</strong></p>";
};

hideFieldError = function(target) {
    $(target).innerHTML = "";
};

function lowercaseEmailInput() {
    $("email").value = $("email").value.toLowerCase();
}

function validatePhoneNumberWithPrefix(number, prefix) {
    number = number.replace(/\s/g, "");
    if (parseInt(number) != number) {
        return false;
    }
    if (brand === "net.hr") {
        return number.length === 9 || number.length === 8;
    }
    if (prefix === "420" || prefix === "+420") {
        return /^[6,7,9]{1}[0-9]{8}$/.test(number);
    }
    if (prefix === "421" || prefix === "+421") {
        return /^9[0-9]{8}$/.test(number);
    }
    return false;
}

hasAttribute = function(node, name) {
    if (node.hasAttribute) {
        return node.hasAttribute(name);
    }
    if (node.getAttribute) {
        return node.getAttribute(name) !== null;
    }
    return false;
};

function __gm_sendGAEvent(eventName, params) {
    if (brand !== "centrum.cz" && brand !== "atlas.cz" && brand !== "volny.cz") return true;
    window.dataLayer = window.dataLayer || [];
    var data = typeof params === "undefined" ? {} : params;
    data.event = eventName;
    data._clear = true;
    window.dataLayer.push(data);
}

inputPlaceholer = function(node) {
    try {
        var mynode = node;
        var pnode = node.parentNode;
        var onode = pnode.parentNode;
        addEvent(onode, "click", function() {
            mynode.focus();
            return false;
        }, true);
        pnode.className = pnode.className.replace(/input\-inner\-transparent/g, "");
        if (mynode.value.length == 0) {
            pnode.className += " input-inner-transparent";
        }
        addEvent(mynode, "focus", function() {
            pnode.className = pnode.className.replace(/input\-inner\-transparent/g, "");
        }, true);
        addEvent(mynode, "blur", function() {
            if (mynode.value.length == 0) {
                pnode.className += " input-inner-transparent";
            }
        }, true);
        node.className = node.className.replace(/placeholder\-js/g, "");
    } catch (e) {
        node.className = node.className.replace(/placeholder\-js/g, "");
    }
};

var pValues = new Array();

var pselectKeysInput = "";

prettySelect = function(el) {
    var options = el.children;
    var sid = el.id;
    var id = "pselect-" + sid;
    var opts = "";
    var lid = 0;
    var selected = "";
    var aclass = "";
    var len = options.length;
    var text;
    for (var j = 0; j < len; j++) {
        text = options[j].text;
        if (hasAttribute(options[j], "data-html")) {
            text = options[j].getAttribute("data-html");
        }
        if (options[j].selected) {
            selected = text;
        }
        if (options[j].className.indexOf("selectEm") > -1) {
            aclass = ' class="selectEm"';
        } else {
            aclass = "";
        }
        pValues[lid] = options[j].text.toUpperCase();
        opts += '<li id="lid-' + lid + '"><a onmousemove="this.focus();pselectKeysInput=\'\';" onkeydown="return pSelectOptionKey(this,event)" onclick="return pSelected(\'' + options[j].value + "','" + sid + "','" + text.replace(/\'/g, "&#39;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + '\');" href="#"' + aclass + ">" + text + "</a></li>";
        lid++;
    }
    if (selected == "") {
        selected = options[0].text;
        if (hasAttribute(options[0], "data-html")) {
            selected = options[0].getAttribute("data-html");
        }
    }
    var html = '<div class="ulSelectFirst" onkeydown="return pSelectShowKey(\'' + id + "', event);\" onclick=\"return pSelectShow('" + id + '\', event);"><span class="ulSelectPicked" id="pselect-text-' + sid + '" tabindex="0"';
    if ("function" == typeof el.onfocus) {
        html += " onfocus=\"$('" + sid + "').onfocus();\"";
    }
    html += ">" + selected + '</span><span class="ulSelectArrow"></span></div><div class="ulSelect" id="' + id + '" style="display: none;"><ul>';
    var html2 = "</ul></div>";
    var div = document.createElement("div");
    div.className = "ulSelectWrap";
    div.innerHTML = html + opts + html2;
    el.parentNode.appendChild(div);
};

hidePSelect = function(id) {
    var selects = getElementsByClass("ulSelect", $("pageWrap"), "div");
    var len = selects.length;
    for (var i = 0; i < len; i++) {
        try {
            selects[i].style.display = "none";
        } catch (e) {}
    }
    var sel = $(id.replace(/^pselect\-/i, ""));
    if (typeof sel.onblur == "function") {
        sel.onblur();
    }
    return false;
};

pSelectShowKey = function(id, ev) {
    var el = $(id);
    if (ev) {
        switch (ev.keyCode) {
          case 9:
            var sel = $(id.replace(/^pselect\-/i, ""));
            if (typeof sel.onblur == "function") {
                sel.onblur();
            }

          case 27:
            el.style.display = "none";
            return true;
            break;

          default:
            ev.cancelBubble = true;
            if (ev.stopPropagation) {
                ev.stopPropagation();
                ev.preventDefault();
            }
            addEvent(document.body, "click", function() {
                hidePSelect(id);
            }, false);
            el.style.display = "block";
            var eel = el.children[0].children[0].children[0];
            eel.focus();
            pSelectOptionKey(eel, ev);
            return false;
            break;
        }
    }
};

pSelectShow = function(id, ev) {
    var el = $(id);
    pselectKeysInput = "";
    if (el.style.display == "block") {
        el.style.display = "none";
        removeEvent(document.body, "click", function() {
            hidePSelect(id);
        });
    } else {
        ev.cancelBubble = true;
        if (ev.stopPropagation) {
            ev.stopPropagation();
            ev.preventDefault();
        }
        addEvent(document.body, "click", function() {
            hidePSelect(id);
        }, false);
        el.style.display = "block";
    }
    return false;
};

pSelected = function(value, id, text) {
    $("pselect-" + id).style.display = "none";
    var sel = $(id);
    sel.value = value;
    if (typeof sel.onchange == "function") {
        sel.onchange();
    }
    var selText = $("pselect-text-" + id);
    selText.innerHTML = text;
    selText.focus();
    removeEvent(document.body, "click", function() {
        hidePSelect(id);
    });
    return false;
};

pSelectOptionKey = function(el, ev) {
    var step;
    switch (ev.keyCode) {
      case 13:
      case 9:
        el.onclick();
        pselectKeysInput = "";
        break;

      case 40:
      case 39:
        if (step = el.parentNode.nextSibling) {
            step.children[0].focus();
        }
        pselectKeysInput = "";
        break;

      case 38:
      case 37:
        if (step = el.parentNode.previousSibling) {
            step.children[0].focus();
        }
        pselectKeysInput = "";
        break;

      case 33:
      case 36:
        el.parentNode.parentNode.firstChild.children[0].focus();
        pselectKeysInput = "";
        break;

      case 34:
      case 35:
        el.parentNode.parentNode.lastChild.children[0].focus();
        pselectKeysInput = "";
        break;

      case 27:
        el.parentNode.parentNode.parentNode.style.display = "none";
        pselectKeysInput = "";
        break;

      default:
        var ch = String.fromCharCode(ev.keyCode);
        var regex = /[a-z0-9Ä›ĹˇÄŤĹ™ĹľĂ˝ĂˇĂ­Ă©ÄľĹŻĹĄĹĹľĂşĂłÄŹ ]/i;
        var id;
        if (regex.test(ch)) {
            pselectKeysInput += ch;
            id = pSelectFind(pselectKeysInput);
            if (id) {
                $("lid-" + id).children[0].focus();
            }
        } else {
            pselectKeysInput = "";
        }
        break;
    }
    return false;
};

pSelectFind = function(find) {
    var len = pValues.length;
    for (var i = 0; i < len; i++) {
        if (pValues[i].indexOf(find) === 0) {
            return i;
        }
    }
    return false;
};

var checkTicker = 0;

var checkUserInProgress = false;

var lastCheckedUser = "";

var checkFreeButtonFocus = false;

var setDomain = function(domain) {
    var i, d = $("domain");
    if (d.nodeName == "SELECT") {
        var l = d.options.length;
        for (i = 0; i < l; i++) {
            if (d.options[i].value == domain) {
                d.selectedIndex = i;
                break;
            }
        }
    } else {
        d.value = domain;
    }
};

var displayCUNError = function(error) {
    $("errUsernameNormal").style.display = "block";
    displayFieldError("errUsernameNormal", error);
};

var hideCUNError = function() {
    hideFieldError("errUsernameNormal");
    $("errUsernameNormal").style.display = "none";
};

var checkUserLoad = function(data) {
    var ts = Math.round(new Date().getTime() / 1e3);
    if (checkUserInProgress >= ts) {
        window.setTimeout(function() {
            checkUserLoad(data);
        }, 500);
        return false;
    }
    try {
        var d = eval("(" + data + ")");
        setDomain(d.domain);
        if (d.status == 1) {
            __gm_sendGAEvent("user_signup_selectMail");
            $("usernameInput").style.display = "none";
            $("chosenEmail").innerHTML = d.email;
            $("chosenEmailLink").href = "/?" + (tokenId.length ? "tokid=" + tokenId + "&" : "") + "username=" + encodeURIComponent(d.username) + "&rechange=1";
            $("usernameInfo").style.display = "block";
            $("alternatives").style.display = "none";
            availableUsername = true;
            useAlternatives = false;
            lastCheckedUser = "";
            hideFieldError("errUsernameAlternative");
            hideCUNError();
            if (checkFreeButtonFocus) {
                regFocus();
            }
        } else {
            availableUsername = false;
            $("usernameInput").style.display = "block";
            $("usernameInfo").style.display = "none";
            if (d.usealts == 1) {
                useAlternatives = true;
                $("alternatives").style.display = "block";
                $("emailHolder").classList.add("emailError");
                hideCUNError();
                displayFieldError("errUsernameAlternative", d.error);
                var al = $("alterList");
                al.innerHTML = "";
                var con = "";
                var l = d.alternatives.length;
                for (i = 0; i < l; i++) {
                    con += '<li><a href="/?' + (tokenId.length ? "tokid=" + tokenId + "&" : "") + "usealternative=" + encodeURIComponent(d.alternatives[i]) + '" onclick="return selectAlternative(\'' + d.alternatives[i] + "');\">" + d.alternatives[i] + "</a></li>";
                }
                al.innerHTML = con;
            } else {
                useAlternatives = false;
                $("alternatives").style.display = "none";
                $("emailHolder").classList.remove("emailError");
                hideFieldError("errUsernameAlternative");
                displayCUNError(d.error);
            }
        }
    } catch (ex) {
        availableUsername = false;
        useAlternatives = false;
        $("usernameInput").style.display = "block";
        $("usernameInfo").style.display = "none";
        $("alternatives").style.display = "none";
        hideFieldError("errUsernameAlternative");
        hideCUNError();
    }
    $("verifyingAddress").style.display = "none";
    checkUserInProgress = false;
};

var checkUserError = function(data) {
    availableUsername = false;
    useAlternatives = false;
    $("usernameInput").style.display = "block";
    $("usernameInfo").style.display = "none";
    $("alternatives").style.display = "none";
    hideFieldError("errUsernameAlternative");
    hideCUNError();
    $("verifyingAddress").style.display = "none";
    checkUserInProgress = false;
};

var checkUser = function() {
    if (checkUserInProgress || availableUsername) {
        return false;
    }
    checkUserInProgress = Math.round(new Date().getTime() / 1e3);
    var username = $("email").value;
    var domain = "";
    var d = $("domain");
    if (d.nodeName == "SELECT") {
        domain = d.options[d.selectedIndex].value;
    } else {
        domain = d.value;
    }
    if (username.length < 3) {
        availableUsername = false;
        useAlternatives = false;
        $("usernameInput").style.display = "block";
        $("usernameInfo").style.display = "none";
        $("alternatives").style.display = "none";
        hideFieldError("errUsernameAlternative");
        if (username.length == 0) {
            displayCUNError("NejdĹ™Ă­ve zadejte vaĹˇi novou adresu.");
            if (typeof _gaq === "object") {
                _gaq.push([ "_trackEvent", "Registrace", "display", "HlĂˇĹˇka - NejdĹ™Ă­ve zadejte vaĹˇi novou adresu.", undefined, false ]);
            }
        } else {
            displayCUNError("Nezlobte se, ale mĂˇme pravidlo, Ĺľe e-maily majĂ­ mezi 3 a 64 znaky.");
        }
        checkUserInProgress = false;
        return false;
    }
    var params = "op=checkuser";
    if (tokenId.length) {
        params += "&tokid=" + encodeURIComponent(tokenId);
    }
    params += "&username=" + encodeURIComponent(username);
    params += "&domain=" + encodeURIComponent(domain);
    params += "&ticker=" + parseInt(checkTicker++);
    if (lastCheckedUser == username + "@" + domain) {
        checkUserInProgress = false;
        return false;
    }
    lastCheckedUser = username + "@" + domain;
    $("alternatives").style.display = "none";
    $("verifyingAddress").style.display = "block";
    if (!doAjax("POST", baseURL + "/ajax.php", params, checkUserLoad, checkUserError)) {
        v.style.display = "none";
        checkUserInProgress = false;
    }
};

var checkUserOnLoad = function() {
    var t = "";
    if (tokenId.length) {
        t = "tokid=" + encodeURIComponent(tokenId) + "&";
    }
    var f = $("freeButton");
    f.innerHTML = '<label class="button-v3 button-wrap" for="button"><span class="button-outer"><span class="button-inner"><input class="button-content" id="button" value="OvÄ›Ĺ™it, zda je volnĂ˝" type="button" onclick="checkUser(); typeof _gaq === \'object\' && _gaq.push([\'_trackEvent\', \'Registrace\', \'click\', \'OvÄ›Ĺ™enĂ­ dostupnosti\', undefined, false]);" onfocus="checkFreeButtonFocus=true;" onblur="checkFreeButtonFocus=false;"></span></span></label>';
    f = $("usernameInfo");
    if ($("chosenEmail") == null) {
        f.innerHTML = '<div class="chosenEmailWrap"><span class="chosenEmail" id="chosenEmail">' + $("email").value + "@" + $("domain").value + '</span><span class="ok"><span> je volnĂ˝</span></span><a class="editInput" id="chosenEmailLink" href="/?' + t + "username=" + encodeURIComponent($("email").value + "@" + $("domain").value) + '&rechange=1" onclick="return reeditUsername();">ZmÄ›nit</a></div>';
    }
    f = $("verifyingAddress");
    f.innerHTML = '<div class="msgBubbleWrap msgPointerTop"><div class="msgTop"><div></div></div><div class="msgContent"><p class="verifying">OvÄ›Ĺ™ovĂˇnĂ­</p></div><div class="msgBottom"><div></div></div><div class="msgPointer"></div></div>';
    f = $("alternatives");
    if ($("alterList") == null) {
        f.innerHTML = '<div class="msgBubbleWrap msgPointerTop"><div class="msgTop"><div></div></div><div class="msgContent"><div id="errUsernameAlternative"></div><p>Zkuste tĹ™eba</p><ul id="alterList"><li><a href="/?' + t + "usealternative=" + encodeURIComponent("alternativa@centrum.cz") + '" onclick="return selectAlternative(\'alternativa@centrum.cz\');">{$alternatives[$a]}</a></li></ul></div><div class="msgBottom"><div></div></div><div class="msgPointer"></div></div>';
    }
};

var reeditUsername = function() {
    useAlternatives = false;
    availableUsername = false;
    $("usernameInput").style.display = "block";
    $("usernameInfo").style.display = "none";
    $("alternatives").style.display = "none";
    $("emailHolder").classList.remove("emailError");
    hideFieldError("errUsernameAlternative");
    hideCUNError();
    return false;
};

var selectAlternative = function(email) {
    var u = $("email");
    var d = $("domain");
    try {
        var i = email.indexOf("@");
        if (i > -1) {
            u.value = email.substring(0, i);
            setDomain(email.substring(i + 1));
        } else {
            u.value = email;
        }
        $("usernameInput").style.display = "none";
        $("chosenEmail").innerHTML = email;
        $("chosenEmailLink").href = "/?" + (tokenId.length ? "tokid=" + tokenId + "&" : "") + "username=" + encodeURIComponent(email) + "&rechange=1";
        $("usernameInfo").style.display = "block";
        $("alternatives").style.display = "none";
        availableUsername = true;
        useAlternatives = false;
        lastCheckedUser = "";
        hideFieldError("errUsernameAlternative");
        hideCUNError();
        if (checkFreeButtonFocus) {
            regFocus();
        }
        return false;
    } catch (ex) {}
    return true;
};

var checkUsernameKey = function(e) {
    if (e.keyCode == 13) {
        checkUser();
        return false;
    }
};

var regFocus = function() {
    var i;
    i = $("email");
    if (i.value.length > 0) {
        if (availableUsername) {
            i = $("password");
            if (i.value.length > 0) {
                i = $("securityAnswer");
                if (i.value.length) {
                    i = $("submit");
                }
            }
        }
    }
    i.focus();
};

var registrationOnLoad = function() {
    regFocus();
    prettySelectInit();
};

addEvent(window, "load", registrationOnLoad, false);

var hasNewCheck = [ "centrum.cz", "atlas.cz", "volny.cz", "net.hr" ].indexOf(brand) !== -1;

var minPassLength = hasNewCheck ? 8 : 6;

formSubmit = function() {
    allowCheckUser = true;
    var errors = new Array();
    if (!availableUsername) {
        errors.push("email");
    }
    validatePassword(errors);
    var sqField;
    if (sqField = $("securityQuestion")) {
        var saField = $("securityAnswer");
        if (sqField.value == 0) {
            displayFieldError("sqerror", "Vyberte si kontrolnĂ­ otĂˇzku.");
            errors.push("securityQuestion");
        } else {
            hideFieldError("sqerror");
        }
        if (saField.value == "") {
            displayFieldError("saerror", "VyplĹte odpovÄ›ÄŹ na kontrolnĂ­ otĂˇzku.");
            errors.push("securityAnswer");
        } else if (saField.value.length < 4) {
            displayFieldError("saerror", "OdpovÄ›ÄŹ musĂ­ obsahovat alespoĹ ÄŤtyĹ™i znaky.");
            errors.push("securityAnswer");
        } else if (saField.value.length > 64) {
            displayFieldError("saerror", "OdpovÄ›ÄŹ mĹŻĹľe obsahovat nejvĂ˝Ĺˇe 64 znakĹŻ.");
            errors.push("securityAnswer");
        } else {
            hideFieldError("saerror");
        }
    }
    if (!recaptchaUsed) {
        var captchaField = $("captcha");
        if (captchaField.value == "") {
            displayFieldError("captchaerror", "VepiĹˇte znaky z obrĂˇzku.");
            errors.push("captcha");
        } else {
            hideFieldError("captchaerror");
        }
    }
    var licenseField = $("licenseTerms");
    if (!licenseField.checked) {
        displayFieldError("licenseerror", "PotĹ™ebujeme vĂˇĹˇ souhlas s podmĂ­nkami.");
        errors.push("licenseTerms");
    } else {
        hideFieldError("licenseerror");
    }
    var phoneCode = $("phoneCode");
    if (phoneCode !== null && phoneCode.value.length !== 6) {
        var errorMsg = phoneCode.value.length === 0 ? "ChybĂ­ aktivaÄŤnĂ­ kĂłd" : "NeplatnĂ˝ aktivaÄŤnĂ­ kĂłd";
        displayFieldError("phoneErrorLast", errorMsg);
        errors.push("phoneCode");
    } else {
        hideFieldError("phoneErrorLast");
    }
    if (errors.length > 0) {
        document.getElementById(errors.shift()).focus();
        return false;
    }
    var infotextField = $("infotextTerms");
    var passField = $("password");
    if (infotextField !== null && typeof _gaq === "object") {
        var securityValue = passwordSecurityValue(passField.value, $("email").value.toLowerCase() + "@" + $("domain").value.toLowerCase());
        _gaq.push([ "_trackEvent", "Registrace", "send", "Souhlas se zasĂ­lĂˇnĂ­m OS " + (infotextField.checked ? "Ano" : "Ne"), undefined, false ]);
        _gaq.push([ "_trackEvent", "Registrace", "send", "SĂ­la hesla", securityValue, false ]);
    }
    return true;
};

validatePassword = function(errors) {
    var initialLength = errors.length;
    var passField = $("password");
    var repassField = $("retypePassword");
    var passAllowedChars = /^[\!\"\#\$\%\&\'\(\)\*\+,\-\.\/0123456789\:\;\<\=\> \?\@\[\]\^\_\`abcdefghijklmnopqrstuvwxyz\{\|\}\~\\]*$/i;
    if (hasNewCheck && repassField.value.match(/[A-Z]/g) === null) {
        displayFieldError("passerror", "ChybĂ­ velkĂ© pĂ­smeno");
        errors.push("password");
    } else if (hasNewCheck && repassField.value.match(/[0-9]/g) === null) {
        displayFieldError("passerror", "ChybĂ­ ÄŤĂ­slice");
        errors.push("password");
    } else if (passField.value == "") {
        displayFieldError("passerror", "Heslo nesmĂ­ bĂ˝t prĂˇzdnĂ©.");
        errors.push("password");
    } else if (passField.value.length < minPassLength) {
        displayFieldError("passerror", "Zadejte alespoĹ 6 znakĹŻ bez diakritiky.");
        errors.push("password");
    } else if (passField.value.length > 64) {
        displayFieldError("passerror", "Heslo mĹŻĹľe obsahovat nejvĂ˝Ĺˇe 64 znakĹŻ.");
        errors.push("password");
    } else if (!passAllowedChars.test(passField.value)) {
        displayFieldError("passerror", "Heslo obsahuje nepovolenĂ© znaky, zkuste to bez nich.");
        errors.push("password");
    } else if (passField.value.trim() != passField.value) {
        displayFieldError("passerror", "Heslo obsahuje nepovolenĂ© znaky, zkuste to bez nich.");
        errors.push("password");
    } else if (passField.value != repassField.value) {
        displayFieldError("passerror2", "Hesla se neshodujĂ­.");
        errors.push("retypePassword");
    } else {
        hideFieldError("passerror");
    }
    return errors.length === initialLength;
};

sqCheck = function() {
    if ($("securityQuestion").value == 0) {
        displayFieldError("sqerror", "Vyberte si kontrolnĂ­ otĂˇzku.");
    } else {
        hideFieldError("sqerror");
    }
};

saCheck = function(isBlur) {
    var _sa = $("securityAnswer").value;
    if (isBlur) {
        if (_sa == "") {
            displayFieldError("saerror", "VyplĹte odpovÄ›ÄŹ na kontrolnĂ­ otĂˇzku.");
        } else if (_sa.length < 4) {
            displayFieldError("saerror", "OdpovÄ›ÄŹ musĂ­ obsahovat alespoĹ ÄŤtyĹ™i znaky.");
        } else if (_sa.length > 64) {
            displayFieldError("saerror", "OdpovÄ›ÄŹ mĹŻĹľe obsahovat nejvĂ˝Ĺˇe 64 znakĹŻ.");
        } else {
            hideFieldError("saerror");
        }
    } else if (_sa.length > 4) {
        hideFieldError("saerror");
    }
};

captchaCheck = function() {
    if (!recaptchaUsed) {
        if ($("captcha").value.length > 0) {
            hideFieldError("captchaerror");
        }
    }
};

termsCheck = function() {
    if ($("licenseTerms").checked) {
        hideFieldError("licenseerror");
        return true;
    }
    return false;
};

var passAllowedChars = /^[\!\"\#\$\%\&\'\(\)\*\+,\-\.\/0123456789\:\;\<\=\> \?\@\[\]\^\_\`abcdefghijklmnopqrstuvwxyz\{\|\}\~\\]*$/i;

var hasNewCheck = [ "centrum.cz", "atlas.cz", "volny.cz", "net.hr" ].indexOf(brand) !== -1;

var minPassLength = hasNewCheck ? 8 : 6;

passwordCheck = function(blur) {
    var p1 = $("retypePassword").value;
    var p2 = $("password").value;
    var pe = $("passok");
    var pe2 = $("passok2");
    hideFieldError("passerror");
    if (hasNewCheck && p2.match(/[A-Z]/g) === null) {
        pe.innerHTML = "";
        if (pe2 != null) {
            pe2.innerHTML = "";
        }
        displayFieldError("passerror", "ChybĂ­ velkĂ© pĂ­smeno");
    } else if (hasNewCheck && p2.match(/[0-9]/g) === null) {
        pe.innerHTML = "";
        if (pe2 != null) {
            pe2.innerHTML = "";
        }
        displayFieldError("passerror", "ChybĂ­ ÄŤĂ­slice");
    } else if (p2.length < 1) {
        pe.innerHTML = "";
        if (pe2 != null) {
            pe2.innerHTML = "";
        }
        displayFieldError("passerror", "Heslo nesmĂ­ bĂ˝t prĂˇzdnĂ©.");
    } else if (!passAllowedChars.test(p2)) {
        displayFieldError("passerror", "Heslo obsahuje nepovolenĂ© znaky, zkuste to bez nich.");
        pe.innerHTML = "";
        if (pe2 != null) {
            pe2.innerHTML = "";
        }
    } else if (p2.trim() != p2) {
        displayFieldError("passerror", "Heslo obsahuje nepovolenĂ© znaky, zkuste to bez nich.");
        pe.innerHTML = "";
        if (pe2 != null) {
            pe2.innerHTML = "";
        }
    } else if (p2.length < minPassLength) {
        pe.innerHTML = "";
        if (pe2 != null) {
            pe2.innerHTML = "";
        }
        displayFieldError("passerror", "Zadejte alespoĹ 6 znakĹŻ bez diakritiky.");
    } else if (p2.length > 64) {
        pe.innerHTML = "";
        if (pe2 != null) {
            pe2.innerHTML = "";
        }
        displayFieldError("passerror", "Heslo mĹŻĹľe obsahovat nejvĂ˝Ĺˇe 64 znakĹŻ.");
    } else if ((p1 != "" || blur) && p1 != p2) {
        pe.innerHTML = "";
        if (pe2 != null) {
            pe2.innerHTML = "";
        }
        displayFieldError("passerror2", "Hesla se neshodujĂ­.");
    } else if (p1 == p2) {
        pe.innerHTML = '<p class="ok"><span>Hesla odpovĂ­dajĂ­.</span></p>';
        if (pe2 != null) {
            pe2.innerHTML = '<p class="ok"><span>Hesla odpovĂ­dajĂ­.</span></p>';
        }
        hideFieldError("passerror2");
    } else {
        __gm_sendGAEvent("user_signup_selectPassword");
        pe.innerHTML = "";
        if (pe2 != null) {
            pe2.innerHTML = "";
        }
    }
};

passwordSecurityValue = function(password, email) {
    if (password === email) {
        return 1;
    }
    var counts = {
        number: [],
        small: [],
        big: [],
        special: []
    };
    var len = password.length;
    var i;
    var c;
    for (i = 0; i < len; i++) {
        c = password.charCodeAt(i);
        if (c >= 48 && c <= 57) {
            counts.number[c] = (counts.number[c] || 0) + 1;
        } else if (c >= 97 && c <= 122) {
            counts.small[c] = (counts.small[c] || 0) + 1;
        } else if (c >= 65 && c <= 90) {
            counts.big[c] = (counts.big[c] || 0) + 1;
        } else {
            counts.special[c] = (counts.special[c] || 0) + 1;
        }
    }
    var countNumber = Object.keys(counts.number).length;
    var countSmall = Object.keys(counts.small).length;
    var countBig = Object.keys(counts.big).length;
    var countSpecial = Object.keys(counts.special).length;
    var passwordLower = password.toLowerCase();
    var series = [ "heslo", "password", "01234567890", "09876543210", "qwertyuiopasdfghjklzxcvbnm", "mnbvcxzlkjhgfdsapoiuytrewq", "rtzui", "iuztr", "abcdefghijklmnoprstuvwxyz", "zyxwvutsrponmlkjihgfedcba" ];
    if (typeof email === "string") {
        series.push(email);
    }
    var lenSeries = 0;
    series.forEach(function(text) {
        var len = text.length;
        for (var i = 0; i + 2 < len; i++) {
            lenSeries += (passwordLower.match(RegExp(text.substring(i, i + 3), "g")) || []).length;
        }
    });
    var multiplicator = (1 + countNumber * .6) * (1 + countSmall * .4) * (1 + countBig * .5) * (1 + countSpecial);
    var lenScore = Math.max(1, len - 4 - lenSeries);
    return Math.floor(lenScore * multiplicator);
};

analyzePasswordStrengthObject = function(p) {
    var p = $("password").value;
    if (p.length == 0) {
        return {
            percent: 0,
            name: "Je vaĹˇe heslo bezpeÄŤnĂ©?",
            className: ""
        };
    }
    if (!passAllowedChars.test(p)) {
        return {
            percent: 0,
            name: "Heslo obsahuje nepovolenĂ© znaky, zkuste to bez nich.",
            className: "bad"
        };
    }
    if (p.trim() != p) {
        return {
            percent: 0,
            name: "Heslo obsahuje nepovolenĂ© znaky, zkuste to bez nich.",
            className: "bad"
        };
    }
    if (p.length < minPassLength) {
        return {
            percent: 0,
            name: "PĹ™Ă­liĹˇ krĂˇtkĂ© heslo",
            className: "bad"
        };
    }
    if (p.length > 64) {
        return {
            percent: 0,
            name: "Heslo mĹŻĹľe obsahovat nejvĂ˝Ĺˇe 64 znakĹŻ.",
            className: "bad"
        };
    }
    var emailValue = $("domain") === null ? $("email").value : $("email").value + "@" + $("domain").value;
    var securityValue = passwordSecurityValue(p, emailValue.toLowerCase());
    if (securityValue < 1) {
        securityValue = 1;
    }
    if (securityValue < 10) {
        return {
            percent: securityValue,
            name: "Velmi slabĂ© heslo",
            className: "bad"
        };
    }
    if (securityValue < 35) {
        return {
            percent: securityValue,
            name: "SlabĂ© heslo",
            className: "weak"
        };
    }
    if (securityValue < 65) {
        return {
            percent: securityValue,
            name: "DobrĂ© heslo",
            className: "good"
        };
    }
    if (securityValue < 100) {
        return {
            percent: securityValue,
            name: "SilnĂ© heslo",
            className: "strong"
        };
    }
    if (securityValue >= 100) {
        return {
            percent: 100,
            name: "Velmi silnĂ© heslo",
            className: "strong"
        };
    }
};

analyzePasswordStrength = function() {
    passwordCheck();
    var passwordRequirementsFullfiled = newAnalyzeCheckmarks();
    $("passwordStrength").style.display = "block";
    var err = "";
    var strength = analyzePasswordStrengthObject();
    $("pwdSGraph").style.width = strength.percent + "%";
    $("pwdSClass").title = strength.percent + "/100";
    $("pwdSCaption").innerHTML = strength.name;
    $("pwdSClass").className = "passwordStrengthCheck " + strength.className;
    if (err.length > 0 || passwordRequirementsFullfiled) {
        displayFieldError("passerror", err);
    } else {
        hideFieldError("passerror");
    }
};

newAnalyzeCheckmarks = function() {
    if (brand !== "centrum.cz" && brand !== "atlas.cz" && brand !== "volny.cz") {
        return true;
    }
    var p = $("password").value;
    var hasUppercase = p.match(/[A-Z]/g) !== null;
    setCheckmark("pwdUppercaseChar", hasUppercase);
    var hasNumber = p.match(/\d/g) !== null;
    setCheckmark("pwdNumberPresent", hasNumber);
    var hasLimit = p.length >= 8;
    setCheckmark("pwdCharLimitIcon", hasLimit);
    return hasUppercase && hasNumber && hasLimit;
};

setCheckmark = function(id, success) {
    var elem = $(id);
    if (elem === null) return;
    elem.className = "iconWrapper " + (success ? "ok" : "err");
};

showPasswordStrength = function() {
    if (!availableUsername) {
        checkUser();
    }
    var passerror = $("passerror").innerHTML;
    if (/\S+/.test(passerror) && $("password").value.length == 0) {} else {
        analyzePasswordStrength();
        $("passwordStrength").style.display = "block";
    }
};

hidePasswordStrength = function() {
    $("passwordStrength").style.display = "none";
};

!function(e, n) {
    "object" == typeof exports && "undefined" != typeof module ? n() : "function" == typeof define && define.amd ? define(n) : n();
}(0, function() {
    "use strict";
    function e(e) {
        var n = this.constructor;
        return this.then(function(t) {
            return n.resolve(e()).then(function() {
                return t;
            });
        }, function(t) {
            return n.resolve(e()).then(function() {
                return n.reject(t);
            });
        });
    }
    function n() {}
    function t(e) {
        if (!(this instanceof t)) throw new TypeError("Promises must be constructed via new");
        if ("function" != typeof e) throw new TypeError("not a function");
        this._state = 0, this._handled = !1, this._value = undefined, this._deferreds = [], 
        u(e, this);
    }
    function o(e, n) {
        for (;3 === e._state; ) e = e._value;
        0 !== e._state ? (e._handled = !0, t._immediateFn(function() {
            var t = 1 === e._state ? n.onFulfilled : n.onRejected;
            if (null !== t) {
                var o;
                try {
                    o = t(e._value);
                } catch (f) {
                    return void i(n.promise, f);
                }
                r(n.promise, o);
            } else (1 === e._state ? r : i)(n.promise, e._value);
        })) : e._deferreds.push(n);
    }
    function r(e, n) {
        try {
            if (n === e) throw new TypeError("A promise cannot be resolved with itself.");
            if (n && ("object" == typeof n || "function" == typeof n)) {
                var o = n.then;
                if (n instanceof t) return e._state = 3, e._value = n, void f(e);
                if ("function" == typeof o) return void u(function(e, n) {
                    return function() {
                        e.apply(n, arguments);
                    };
                }(o, n), e);
            }
            e._state = 1, e._value = n, f(e);
        } catch (r) {
            i(e, r);
        }
    }
    function i(e, n) {
        e._state = 2, e._value = n, f(e);
    }
    function f(e) {
        2 === e._state && 0 === e._deferreds.length && t._immediateFn(function() {
            e._handled || t._unhandledRejectionFn(e._value);
        });
        for (var n = 0, r = e._deferreds.length; r > n; n++) o(e, e._deferreds[n]);
        e._deferreds = null;
    }
    function u(e, n) {
        var t = !1;
        try {
            e(function(e) {
                t || (t = !0, r(n, e));
            }, function(e) {
                t || (t = !0, i(n, e));
            });
        } catch (o) {
            if (t) return;
            t = !0, i(n, o);
        }
    }
    var c = setTimeout;
    t.prototype["catch"] = function(e) {
        return this.then(null, e);
    }, t.prototype.then = function(e, t) {
        var r = new this.constructor(n);
        return o(this, new function(e, n, t) {
            this.onFulfilled = "function" == typeof e ? e : null, this.onRejected = "function" == typeof n ? n : null, 
            this.promise = t;
        }(e, t, r)), r;
    }, t.prototype["finally"] = e, t.all = function(e) {
        return new t(function(n, t) {
            function o(e, f) {
                try {
                    if (f && ("object" == typeof f || "function" == typeof f)) {
                        var u = f.then;
                        if ("function" == typeof u) return void u.call(f, function(n) {
                            o(e, n);
                        }, t);
                    }
                    r[e] = f, 0 == --i && n(r);
                } catch (c) {
                    t(c);
                }
            }
            if (!e || "undefined" == typeof e.length) throw new TypeError("Promise.all accepts an array");
            var r = Array.prototype.slice.call(e);
            if (0 === r.length) return n([]);
            for (var i = r.length, f = 0; r.length > f; f++) o(f, r[f]);
        });
    }, t.resolve = function(e) {
        return e && "object" == typeof e && e.constructor === t ? e : new t(function(n) {
            n(e);
        });
    }, t.reject = function(e) {
        return new t(function(n, t) {
            t(e);
        });
    }, t.race = function(e) {
        return new t(function(n, t) {
            for (var o = 0, r = e.length; r > o; o++) e[o].then(n, t);
        });
    }, t._immediateFn = "function" == typeof setImmediate && function(e) {
        setImmediate(e);
    } || function(e) {
        c(e, 0);
    }, t._unhandledRejectionFn = function(e) {
        void 0 !== console && console && console.warn("Possible Unhandled Promise Rejection:", e);
    };
    var l = function() {
        if ("undefined" != typeof self) return self;
        if ("undefined" != typeof window) return window;
        if ("undefined" != typeof global) return global;
        throw Error("unable to locate global object");
    }();
    "Promise" in l ? l.Promise.prototype["finally"] || (l.Promise.prototype["finally"] = e) : l.Promise = t;
});

var step1err = document.getElementById("step1_error_noshow");

var RESEND_DELAY = 3e4;

function toggleVisiblePassword(eyeId, inputId) {
    var inputElement = document.getElementById(inputId);
    var eyeElement = document.getElementById(eyeId);
    if (inputElement.type == "text") {
        inputElement.type = "password";
        eyeElement.className = "passwdEye";
    } else {
        inputElement.type = "text";
        eyeElement.className += " active";
    }
}

function enableButton(buttonId) {
    var button = document.getElementById(buttonId);
    var buttonLabel = document.getElementById(buttonId + "label");
    if (button !== null) {
        button.disabled = "";
    }
    if (buttonLabel !== null) {
        buttonLabel.className = buttonLabel.className.replace(/button-disabled-js/g, "").trim();
    }
}

function disableButton(buttonId) {
    var button = document.getElementById(buttonId);
    var buttonLabel = document.getElementById(buttonId + "label");
    if (button !== null) {
        button.disabled = "disabled";
    }
    if (buttonLabel !== null) {
        buttonLabel.className += " button-disabled-js";
    }
}

var enableSendButton = function() {
    hideFieldError("phoneError");
    enableButton("submit2");
};

function hide(id) {
    var elem = document.getElementById(id);
    elem.style.display = "none";
}

function show(id) {
    var elem = document.getElementById(id);
    elem.style.display = "block";
}

function displayStep2() {
    if (termsCheck() && validatePassword([]) && availableUsername) {
        hide("step1");
        hide("step3");
        show("step2");
        enableButton("resendCodeButton");
        hideFieldError("phoneErrorLast");
    } else {
        formSubmit();
    }
}

function displayStep3() {
    enableButton("submit2");
    var phone = document.getElementById("phone");
    var phonePrefix = document.getElementById("phonePrefix");
    if (availableUsername && phone.value.length > 0 && validatePhoneNumberWithPrefix(phone.value, phonePrefix.value)) {
        hide("step1");
        hide("step2");
        show("step3");
        hideFieldError("phoneErrorLast");
        var step3Phone = document.getElementById("phoneNumberText");
        step3Phone.innerText = phone.value;
    } else {
        if (availableUsername) {
            showPhoneError(phone.value);
        } else {
            formSubmit();
        }
    }
}

function sendPhoneAndDisplayStep3() {
    disableButton("submit2");
    sendPhoneCode(function() {
        displayStep3();
        displayCodeSentLast();
        disableResendWithDelay();
        __gm_sendGAEvent("user_signup_verification_send");
    }, displayPhoneError);
}

function enableResend() {
    enableButton("resendCodeButton");
}

function disableResendWithDelay() {
    disableButton("resendCodeButton");
    window.setTimeout(enableResend, RESEND_DELAY);
}

function displayPhoneError(status, text) {
    var body = JSON.parse(text);
    if (status === 429) {
        if (typeof body.errorPhoneLimit !== "undefined" && body.errorPhoneLimit === 1) {
            displayFieldError("phoneError", "K tomuto ÄŤĂ­slu je jiĹľ pĹ™ipojen maximĂˇlnĂ­ moĹľnĂ˝ poÄŤet schrĂˇnek. DalĹˇĂ­ schrĂˇnku je moĹľnĂ© ovÄ›Ĺ™it pouze jinĂ˝m telefonnĂ­m ÄŤĂ­slem.");
        } else if (typeof body.errorPhoneTries !== "undefined" && body.errorPhoneTries === 1) {
            displayFieldError("phoneError", "Pokusy pro ovÄ›Ĺ™enĂ­ byly vyÄŤerpĂˇny a telefonnĂ­ ÄŤĂ­slo se nepodaĹ™ilo ovÄ›Ĺ™it. PouĹľijte prosĂ­m jinĂ© telefonnĂ­ ÄŤĂ­slo nebo kontaktujte zĂˇkaznickou podporu.");
        }
        disableButton("submit2");
    }
}

function displayPhoneErrorLast(status, text) {
    var body = JSON.parse(text);
    if (status === 429) {
        if (typeof body.errorPhoneLimit !== "undefined" && body.errorPhoneLimit === 1) {
            displayFieldError("phoneErrorLast", "K tomuto ÄŤĂ­slu je jiĹľ pĹ™ipojen maximĂˇlnĂ­ moĹľnĂ˝ poÄŤet schrĂˇnek. DalĹˇĂ­ schrĂˇnku je moĹľnĂ© ovÄ›Ĺ™it pouze jinĂ˝m telefonnĂ­m ÄŤĂ­slem.");
        } else if (typeof body.errorPhoneTries !== "undefined" && body.errorPhoneTries === 1) {
            displayFieldError("phoneErrorLast", "Pokusy pro ovÄ›Ĺ™enĂ­ byly vyÄŤerpĂˇny a telefonnĂ­ ÄŤĂ­slo se nepodaĹ™ilo ovÄ›Ĺ™it. PouĹľijte prosĂ­m jinĂ© telefonnĂ­ ÄŤĂ­slo nebo kontaktujte zĂˇkaznickou podporu.");
        }
        disableButton("resendCodeButton");
    }
}

function displayCodeSentLast() {
    __gm_sendGAEvent("user_signup_verification_send");
    document.getElementById("phoneErrorLast").innerHTML = '<p class="error info">Na toto telefonnĂ­ ÄŤĂ­slo jsme zaslali SMS s aktivaÄŤnĂ­m kĂłdem.</p>';
}

function sendPhoneCodeLast() {
    if (document.getElementById("resendCodeButtonlabel").className.indexOf("disabled") < 0) {
        sendPhoneCode(displayCodeSentLast, displayPhoneErrorLast);
    }
}

function sendPhoneCode(successCallback, errorCallback) {
    var number = document.getElementById("phone").value;
    var phonePrefix = document.getElementById("phonePrefix").value;
    if (validatePhoneNumberWithPrefix(number, phonePrefix)) {
        var requestData = [ "phonePrefix=" + phonePrefix, "phoneNumber=" + number, "op=phone" ].join("&");
        var url = "ajax.php";
        doAjax("post", url, requestData, successCallback, errorCallback);
    } else {
        showPhoneError(number);
        if (typeof errorCallback === "function") {
            errorCallback();
        }
    }
}

function submitRegistration() {
    return new Promise(function(resolve, reject) {
        if (typeof grecaptcha === "undefined") {
            reject();
        }
        var response = grecaptcha.getResponse();
        if (!response) {
            reject();
        }
        var form = document.getElementById("regform");
        if (form.onsubmit()) {
            grecaptcha.reset();
            var recaptchaInput = document.createElement("input");
            recaptchaInput.type = "hidden";
            recaptchaInput.value = response;
            recaptchaInput.name = "g-recaptcha-response";
            form.appendChild(recaptchaInput);
            form.submit();
            resolve();
        } else {
            grecaptcha.reset();
            reject();
        }
    });
}

function showPhoneError(phone) {
    var message = typeof phone !== "undefined" && brand === "net.hr" && (phone.length === 10 || phone.length === 9) && phone[0] === "0" ? "NeplatnĂ© telefonnĂ­ ÄŤĂ­slo" : "NeplatnĂ© telefonnĂ­ ÄŤĂ­slo";
    displayFieldError("phoneError", message);
}

function updatePhonePrefix(selectElement) {
    var value = selectElement.options[selectElement.selectedIndex].value;
    var flag = value === "420" ? "cz" : "sk";
    var value = "+" + value;
    var flagElement = document.getElementById("phone-line-flag");
    var textElement = document.getElementById("phone-line-text");
    flagElement.className = "country-wrap country-wrap-" + flag;
    textElement.innerText = value;
    if (brand === "centrum.cz" || brand === "volny.cz" || brand === "atlas.cz") {
        flag === "cz" ? document.getElementById("sk-phone-warning").style.display = "none" : document.getElementById("sk-phone-warning").style.display = "block";
    }
}