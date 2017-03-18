(function($, window, document, undefined) {

    'use strict';

    var defaults = {
        label: true
    };

    var Label = function(element) {

        this.core = $(element).data('lightGallery');

        this.$el = $(element);
        this.core.s = $.extend({}, defaults, this.core.s);
        if (this.core.s.label) {
            this.init();
        }

        return this;
    };

    Label.prototype.getLabel = function(file, index) {
        var _this = this;
    };

    Label.prototype.init = function() {
        var _this = this;
        var labelIcons = '<div class="lg-labels-yesno-group"><span class="lg-label-yes lg-label-icon"></span><span class="lg-label-no lg-label-icon"></span></div>';
        this.core.$outer.find('.lg-labelbar').append(labelIcons);
        var $labelyes = this.core.$outer.find('.lg-label-yes');
        var $labelno = this.core.$outer.find('.lg-label-no');
        $labelyes.on('click.lg', function() {
            console.log("label yes");
            $labelyes.addClass('lg-label-selected');
            $labelno.removeClass('lg-label-selected');
        });
        $labelno.on('click.lg', function() {
            console.log("label no");
            $labelyes.removeClass('lg-label-selected');
            $labelno.addClass('lg-label-selected');
        });
    };

    Label.prototype.destroy = function() {

    };

    $.fn.lightGallery.modules.label = Label;

})(jQuery, window, document);
