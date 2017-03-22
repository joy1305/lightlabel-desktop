import fs from 'fs';
(function ($, window, document, undefined) {

    'use strict';

    var curUser = "";
    var users = ["sunwei"];
    var userPassMap = {};
    
    var initUserAccount = function (){
        userPassMap["sunwei"] = "1q2w3e4r";
    }
    
    var defaults = {
        label: true
    };

    function newLabel(){
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
        if (curLabel.yes) {
            $labelyes.addClass('lg-label-yesno-selected');
            $labelno.removeClass('lg-label-yesno-selected');
        } else {
            $labelyes.removeClass('lg-label-yesno-selected');
        }
        if (curLabel.no) {
            $labelyes.removeClass('lg-label-yesno-selected');
            $labelno.addClass('lg-label-yesno-selected');
        }else{
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
    }

    Label.prototype.init = function () {
        var _this = this;

        initUserAccount();

        _this.core.$el.on('onBeforeSlide.lg', function (el, _prevIndex, index, fromTouch, fromThumb, src) {
            console.log("onBeforeSlide.lg; index:" + index + "; src:" + src);
            var pos = src.lastIndexOf('.');
            var filePathName = src.slice(0, pos);
            pos = filePathName.lastIndexOf('/');
            fileName = filePathName.slice(pos+1);
            filePath = filePathName.slice(0, pos+1);
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
                            <span id="lg-label-user" class="lg-label-user">'+curUser+'</span>\
                        </div>';
        var labelYesNoIcons = '<div class="lg-labels-yesno-group"><span class="lg-label-yes"></span><span class="lg-label-no"></span></div>';
        $labelBar.append(userName);
        $labelBar.append(labelYesNoIcons);
        var $labeluser = $labelBar.find('.lg-label-user');
        var $labelyes = $labelBar.find('.lg-label-yes');
        var $labelno = $labelBar.find('.lg-label-no');
        $labeluser.on('click.lg', function () {
            console.log("label user");
            checkAccount(true);
        });
        $labelyes.on('click.lg', function () {
            console.log("label yes");
            if(checkAccount(false) === false){
                return;
            }
            curLabel.yes = true;
            curLabel.no = false;
            $labelyes.addClass('lg-label-yesno-selected');
            $labelno.removeClass('lg-label-yesno-selected');
            writeLabel();
        });
        $labelno.on('click.lg', function () {
            console.log("label no");
            if(checkAccount(false) === false){
                return;
            }
            curLabel.yes = false;
            curLabel.no = true;
            $labelyes.removeClass('lg-label-yesno-selected');
            $labelno.addClass('lg-label-yesno-selected');
            writeLabel();
        });

        var labelPartsIcon = '<div class="lg-labels-parts-group">\
            <span class="lg-label-forehead"></span>\
            <span class="lg-label-eyes"></span>\
            <span class="lg-label-mouth"></span>\
            <span class="lg-label-cheek"></span>\
        </div>';
        $labelBar.append(labelPartsIcon);
        var $labelforehead = $labelBar.find('.lg-label-forehead');
        var $labeleyes = $labelBar.find('.lg-label-eyes');
        var $labelmouth = $labelBar.find('.lg-label-mouth');
        var $labelcheek = $labelBar.find('.lg-label-cheek');

        $labelforehead.on('click.lg', function () {
            console.log("label forehead");
            if(checkAccount(false) === false){
                return;
            }
            label.forehead = !label.forehead;
            if (label.forehead) {
                $labelforehead.addClass('lg-label-parts-selected');
            } else {
                $labelforehead.removeClass('lg-label-parts-selected');
            }
            writeLabel();
        });
        $labeleyes.on('click.lg', function () {
            console.log("label eyes");
            if(checkAccount(false) === false){
                return;
            }
            curLabel.eyes = !curLabel.eyes;
            if (curLabel.eyes) {
                $labeleyes.addClass('lg-label-parts-selected');
            } else {
                $labeleyes.removeClass('lg-label-parts-selected');
            }
            writeLabel();
        });
        $labelmouth.on('click.lg', function () {
            console.log("label mouth");
            if(checkAccount(false) === false){
                return;
            }
            curLabel.mouth = !curLabel.mouth;
            if (curLabel.mouth) {
                $labelmouth.addClass('lg-label-parts-selected');
            } else {
                $labelmouth.removeClass('lg-label-parts-selected');
            }
            writeLabel();
        });
        $labelcheek.on('click.lg', function () {
            console.log("label cheek");
            if(checkAccount(false) === false){
                return;
            }
            curLabel.cheek = !curLabel.cheek;
            if (curLabel.cheek) {
                $labelcheek.addClass('lg-label-parts-selected');
            } else {
                $labelcheek.removeClass('lg-label-parts-selected');
            }
            writeLabel();
        });
    };

    Label.prototype.destroy = function () {

    };

    $.fn.lightGallery.modules.label = Label;

    var checkAccount = function (force){
        if(curUser !== "" && force === false){
            return true;
        }
        var modal = document.getElementById('login');
        modal.style.display = "block";
        // $(document).find('login-submit').on('click', function () {
        //     console.log("login submit");
        // });
        return false;
    }

    window.onclick = function(event) {
        var modal = document.getElementById('login');
        if (event.target === modal) {
            modal.style.display = "none";
        }
        var submit = document.getElementById('login-submit');
        if (event.target === submit) {
            var user = document.getElementById('login-user').value;
            var pass = document.getElementById('login-pass').value;
            if(users.indexOf(user)===-1){
                console.log("user not found" + user);
                return;
            }
            if(userPassMap[user] != pass){
                console.log("increated password");
                return;
            }
            curUser = user;
            updateFileAll();
            console.log("login success");
            modal.style.display = "none";
            var userDom = document.getElementById('lg-label-user');
            userDom.innerText = user;
        }
    }

    

})(jQuery, window, document);
