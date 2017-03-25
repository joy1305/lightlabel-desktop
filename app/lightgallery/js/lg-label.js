import fs from 'fs';
import { remote } from 'electron';
(function ($, window, document, undefined) {

    'use strict';

    var curUser = "";
    var users = ["sunwei","test"];
    var userPassMap = {};

    var tucaoUncertain = ["好担心好害怕", "你给我小心点！"];
    var tucaoYes = ["原来我没有病", "你确定吗？我妈都说我有问题", "原来我很正常啊，我一直以为自己有病呢!", "太好了，给你一个赞！"];
    var tucaoNo = ["你才抑郁，你们XX都抑郁", "你确定你自己没问题吗?", "我完了,我要抑郁了!", "我要找个地方去上吊!", "我要去医闹!", "我很桑心"];
    var tucaoParts = ["就你长得好看!", "我知道了，你就是看我不顺眼", "别挑我毛病了，看看你自己就长得好吗？"];
    var initUserAccount = function () {
        userPassMap["sunwei"] = "1q2w3e4r";
        userPassMap["test"] = "1";
    }

    function randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum);
                break;
            default:
                return 0;
                break;
        }
    }

    var defaults = {
        label: true,
        tucaoMode: true,
    };

    var userData = {
        user: ""
    }

    function newLabel() {
        return {
            yes: false,
            no: false,
            forehead: false,
            eyes: false,
            mouth: false,
            cheek: false
        }
    }
    var curLabel = newLabel();

    var fileName;
    var filePath;
    var fileAll;
    var writeLabel = function () {
        fs.writeFile(fileAll, JSON.stringify(curLabel), function (err) {
            if (err) throw err;
        });
    }

    var updateFileAll = function () {
        fileAll = filePath + curUser + "_" + fileName + '.json';
    }

    var Label = function (element) {
        this.core = $(element).data('lightGallery');
        this.$el = $(element);
        this.core.s = $.extend({}, defaults, this.core.s);
        if (this.core.s.label) {
            this.init();
        }

        return this;
    };

    Label.prototype.getLabel = function (file, index) {
        var _this = this;
    };

    Label.prototype.updateUI = function () {
        var $labelBar = this.core.$outer.find('.lg-labelbar');
        var $labelyes = $labelBar.find('.lg-label-yes');
        var $labelno = $labelBar.find('.lg-label-no');
        var $labelforehead = $labelBar.find('.lg-label-forehead');
        var $labeleyes = $labelBar.find('.lg-label-eyes');
        var $labelmouth = $labelBar.find('.lg-label-mouth');
        var $labelcheek = $labelBar.find('.lg-label-cheek');
        var $labelparts = $labelBar.find('.lg-labels-parts-group');
        $labelparts.css('visibility', 'hidden');
        if (curLabel.yes) {
            $labelyes.addClass('lg-label-yesno-selected');
            $labelno.removeClass('lg-label-yesno-selected');
        } else {
            $labelyes.removeClass('lg-label-yesno-selected');
        }
        if (curLabel.no) {
            $labelyes.removeClass('lg-label-yesno-selected');
            $labelno.addClass('lg-label-yesno-selected');
            $labelparts.css('visibility', 'visible');
        } else {
            $labelno.removeClass('lg-label-yesno-selected');
        }
        if (curLabel.forehead) {
            $labelforehead.addClass('lg-label-parts-selected');
        } else {
            $labelforehead.removeClass('lg-label-parts-selected');
        }
        if (curLabel.eyes) {
            $labeleyes.addClass('lg-label-parts-selected');
        } else {
            $labeleyes.removeClass('lg-label-parts-selected');
        }
        if (curLabel.mouth) {
            $labelmouth.addClass('lg-label-parts-selected');
        } else {
            $labelmouth.removeClass('lg-label-parts-selected');
        }
        if (curLabel.cheek) {
            $labelcheek.addClass('lg-label-parts-selected');
        } else {
            $labelcheek.removeClass('lg-label-parts-selected');
        }
        this.updateTuCao(tucaoUncertain);
    }

    Label.prototype.updateTuCao = function (caoStrs) {
        if (this.core.s.tucaoMode) {
            var index = randomNum(0, caoStrs.length - 1);
            var caoStr = caoStrs[index];
            var $labelBar = this.core.$outer.find('.lg-labelbar');
            var $labelTucao = $labelBar.find('.lg-labels-tucao-text');
            $labelTucao.text(caoStr);
        }
    }

    Label.prototype.init = function () {
        var _this = this;

        initUserAccount();
        loadUser();
        _this.core.$el.on('onBeforeSlide.lg', function (el, _prevIndex, index, fromTouch, fromThumb, src) {
            console.log("onBeforeSlide.lg; index:" + index + "; src:" + src);
            var pos = src.lastIndexOf('.');
            var filePathName = src.slice(0, pos);
            pos = filePathName.lastIndexOf('/');
            fileName = filePathName.slice(pos + 1);
            filePath = filePathName.slice(0, pos + 1);
            updateFileAll();
            fs.readFile(fileAll, function (err, data) {
                if (err) {
                    curLabel = newLabel();
                    writeLabel();
                } else {
                    curLabel = JSON.parse(data);
                }
                _this.updateUI();
            });
        });

        var $labelBar = this.core.$outer.find('.lg-labelbar');
        var userName = '<div class="lg-labels-user-group">\
                            <span class = "lg-label-text">医生：</span>\
                            <br/>\
                            <span id="lg-label-user" class="lg-label-user">'+ curUser + '</span>\
                        </div>';
        var labelTucao = '<div class="lg-labels-tucao-group">\
                            <span class="lg-labels-tucao-text"></span>\
                        </div>';
        var labelYesNoIcons = '<div class="lg-labels-yesno-group">\
                                    <span class="lg-label-yes"></span>\
                                    <span class="lg-label-no"></span>\
                                </div>';
        var labelPartsIcon = '<div class="lg-labels-parts-group">\
                                    <span class="lg-label-forehead"></span>\
                                    <span class="lg-label-eyes"></span>\
                                    <span class="lg-label-mouth"></span>\
                                    <span class="lg-label-cheek"></span>\
                            </div>';
        $labelBar.append(userName);
        $labelBar.append(labelYesNoIcons);
        $labelBar.append(labelPartsIcon);
        $labelBar.append(labelTucao);
        var $labeluser = $labelBar.find('.lg-label-user');
        var $labelyes = $labelBar.find('.lg-label-yes');
        var $labelno = $labelBar.find('.lg-label-no');
        var $labelparts = $labelBar.find('.lg-labels-parts-group');
        $labeluser.on('click.lg', function () {
            console.log("label user");
            checkAccount(true);
        });
        $labelyes.on('click.lg', function () {
            console.log("label yes");
            if (checkAccount(false) === false) {
                return;
            }
            curLabel.yes = true;
            curLabel.no = false;
            $labelyes.addClass('lg-label-yesno-selected');
            $labelno.removeClass('lg-label-yesno-selected');
            _this.updateTuCao(tucaoYes);
            $labelparts.css('visibility', 'hidden');
            writeLabel();
        });
        $labelno.on('click.lg', function () {
            console.log("label no");
            if (checkAccount(false) === false) {
                return;
            }
            curLabel.yes = false;
            curLabel.no = true;
            $labelyes.removeClass('lg-label-yesno-selected');
            $labelno.addClass('lg-label-yesno-selected');
            $labelparts.css('visibility', 'visible');
            writeLabel();
            _this.updateTuCao(tucaoNo);
        });

        var $labelforehead = $labelBar.find('.lg-label-forehead');
        var $labeleyes = $labelBar.find('.lg-label-eyes');
        var $labelmouth = $labelBar.find('.lg-label-mouth');
        var $labelcheek = $labelBar.find('.lg-label-cheek');

        $labelforehead.on('click.lg', function () {
            console.log("label forehead");
            if (checkAccount(false) === false) {
                return;
            }
            curLabel.forehead = !curLabel.forehead;
            if (curLabel.forehead) {
                $labelforehead.addClass('lg-label-parts-selected');
            } else {
                $labelforehead.removeClass('lg-label-parts-selected');
            }
            writeLabel();
            _this.updateTuCao(tucaoParts);
        });
        $labeleyes.on('click.lg', function () {
            console.log("label eyes");
            if (checkAccount(false) === false) {
                return;
            }
            curLabel.eyes = !curLabel.eyes;
            if (curLabel.eyes) {
                $labeleyes.addClass('lg-label-parts-selected');
            } else {
                $labeleyes.removeClass('lg-label-parts-selected');
            }
            writeLabel();
            _this.updateTuCao(tucaoParts);
        });
        $labelmouth.on('click.lg', function () {
            console.log("label mouth");
            if (checkAccount(false) === false) {
                return;
            }
            curLabel.mouth = !curLabel.mouth;
            if (curLabel.mouth) {
                $labelmouth.addClass('lg-label-parts-selected');
            } else {
                $labelmouth.removeClass('lg-label-parts-selected');
            }
            writeLabel();
            _this.updateTuCao(tucaoParts);
        });
        $labelcheek.on('click.lg', function () {
            console.log("label cheek");
            if (checkAccount(false) === false) {
                return;
            }
            curLabel.cheek = !curLabel.cheek;
            if (curLabel.cheek) {
                $labelcheek.addClass('lg-label-parts-selected');
            } else {
                $labelcheek.removeClass('lg-label-parts-selected');
            }
            writeLabel();
            _this.updateTuCao(tucaoParts);
        });


    };

    Label.prototype.destroy = function () {

    };

    $.fn.lightGallery.modules.label = Label;

    var checkAccount = function (force) {
        if (curUser !== "" && force === false) {
            return true;
        }
        var modal = document.getElementById('login');
        modal.style.display = "block";
        // $(document).find('login-submit').on('click', function () {
        //     console.log("login submit");
        // });
        return false;
    }

    window.onclick = function (event) {
        var modal = document.getElementById('login');
        if (event.target === modal) {
            modal.style.display = "none";
        }
        var submit = document.getElementById('login-submit');
        if (event.target === submit) {
            var user = document.getElementById('login-user').value;
            var pass = document.getElementById('login-pass').value;
            if (users.indexOf(user) === -1) {
                console.log("user not found" + user);
                var x = document.getElementById("toast")
                x.className = "show";
                x.innerText = "User not found！";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
                return;
            }
            if (userPassMap[user] != pass) {
                console.log("increated password");
                var x = document.getElementById("toast")
                x.className = "show";
                x.innerText = "Increated password！";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
                return;
            }
            curUser = user;
            updateFileAll();
            console.log("login success");
            modal.style.display = "none";
            var userDom = document.getElementById('lg-label-user');
            userDom.innerText = user;
            if (document.getElementById('login-rememberme').checked === true){
                saveUser();
            }else{
                clearUser();
            }
            
        }
    }

    var app = remote.app;
    var saveUser = function() {
        userData.user = curUser;
        fs.writeFile(app.getPath('userData') + '/lg-user.json', JSON.stringify(userData), function(err) {
            if (err) throw err;
        });
    }

    var clearUser = function() {
        userData.user = "";
        fs.writeFile(app.getPath('userData') + '/lg-user.json', JSON.stringify(userData), function(err) {
            if (err) throw err;
        });
    }

    var loadUser = function(){
        fs.readFile(app.getPath('userData') + '/lg-user.json', function(err, data) {
            if (err) throw err;
            userData = JSON.parse(data);
            curUser = userData.user;
            var userDom = document.getElementById('lg-label-user');
            userDom.innerText = curUser;
        });
    }

})(jQuery, window, document);
