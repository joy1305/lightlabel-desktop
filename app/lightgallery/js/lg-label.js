import fs from 'fs';
(function ($, window, document, undefined) {

    'use strict';

    var defaults = {
        label: true
    };

    var label = {
        yes: false,
        no: true,
        forehead: false,
        eyes: false,
        mouth: false,
        cheek: false
    }

    var fileName;
    var writeLabel = function () {
        fs.writeFile(fileName, JSON.stringify(label), function (err) {
            if (err) throw err;
        });
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
        if (label.yes) {
            $labelyes.addClass('lg-label-yesno-selected');
            $labelno.removeClass('lg-label-yesno-selected');
        } else if (label.no) {
            $labelyes.removeClass('lg-label-yesno-selected');
            $labelno.addClass('lg-label-yesno-selected');
        }
        if (label.forehead) {
            $labelforehead.addClass('lg-label-parts-selected');
        } else {
            $labelforehead.removeClass('lg-label-parts-selected');
        }
        if (label.eyes) {
            $labeleyes.addClass('lg-label-parts-selected');
        } else {
            $labeleyes.removeClass('lg-label-parts-selected');
        }
        if (label.mouth) {
            $labelmouth.addClass('lg-label-parts-selected');
        } else {
            $labelmouth.removeClass('lg-label-parts-selected');
        }
        if (label.cheek) {
            $labelcheek.addClass('lg-label-parts-selected');
        } else {
            $labelcheek.removeClass('lg-label-parts-selected');
        }
    }

    Label.prototype.init = function () {
        var _this = this;
        _this.core.$el.on('onBeforeSlide.lg', function (el, _prevIndex, index, fromTouch, fromThumb, src) {
            console.log("onBeforeSlide.lg; index:" + index + "; src:" + src);
            var pos = src.lastIndexOf('.');
            fileName = src.slice(0, pos) + '.json';
            fs.readFile(fileName, function (err, data) {
                if (err) {
                    writeLabel();
                } else {
                    label = JSON.parse(data);
                    _this.updateUI();
                }
            });
        });

        var labelYesNoIcons = '<div class="lg-labels-yesno-group"><span class="lg-label-yes"></span><span class="lg-label-no"></span></div>';
        var $labelBar = this.core.$outer.find('.lg-labelbar');
        $labelBar.append(labelYesNoIcons);
        var $labelyes = $labelBar.find('.lg-label-yes');
        var $labelno = $labelBar.find('.lg-label-no');
        $labelyes.on('click.lg', function () {
            console.log("label yes");
            label.yes = true;
            label.no = false;
            $labelyes.addClass('lg-label-yesno-selected');
            $labelno.removeClass('lg-label-yesno-selected');
            writeLabel();
        });
        $labelno.on('click.lg', function () {
            console.log("label no");
            label.yes = false;
            label.no = true;
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
            label.eyes = !label.eyes;
            if (label.eyes) {
                $labeleyes.addClass('lg-label-parts-selected');
            } else {
                $labeleyes.removeClass('lg-label-parts-selected');
            }
            writeLabel();
        });
        $labelmouth.on('click.lg', function () {
            console.log("label mouth");
            label.mouth = !label.mouth;
            if (label.mouth) {
                $labelmouth.addClass('lg-label-parts-selected');
            } else {
                $labelmouth.removeClass('lg-label-parts-selected');
            }
            writeLabel();
        });
        $labelcheek.on('click.lg', function () {
            console.log("label cheek");
            label.cheek = !label.cheek;
            if (label.cheek) {
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

})(jQuery, window, document);
