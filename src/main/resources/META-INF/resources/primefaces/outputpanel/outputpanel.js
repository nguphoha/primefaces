/**
 * PrimeFaces OutputPanel Widget
 */
PrimeFaces.widget.OutputPanel = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        this.cfg.global = this.cfg.global||false;
        
        if(this.cfg.deferred) {
            if(this.cfg.deferredMode === 'load') {
                this.loadContent();
            }
            else if(this.cfg.deferredMode === 'visible') {
                if(this.visible())
                    this.loadContent();
                else
                    this.bindScrollMonitor();
            }
        }
    },
            
    loadContent: function() {
        var $this = this,
        options = {
            source: this.id,
            process: this.id,
            update: this.id,
            async: true,
            ignoreAutoUpdate: true,
            global: this.cfg.global,
            params: [
                {name: this.id + '_load', value: true}
            ],
            onsuccess: function(responseXML, status, xhr) {
                PrimeFaces.ajax.Response.handle(responseXML, status, xhr, {
                        widget: $this,
                        handle: function(content) {
                            this.jq.html(content);
                        }
                    });

                return true;
            },
            onerror: function(xhr, status, errorThrown) {
                $this.jq.html('');
            }
        };
        
        if(this.cfg.delay) {
            setTimeout(function() {
                PrimeFaces.ajax.Request.handle(options);
            }, parseInt(this.cfg.delay));
        }
        else {
            PrimeFaces.ajax.Request.handle(options);
        }
    },
            
    bindScrollMonitor: function() {
        var $this = this,
        win = $(window);
        win.off('scroll.' + this.id).on('scroll.' + this.id, function() {
            if($this.visible()) {
                $this.unbindScrollMonitor();
                $this.loadContent();
            }
        });
    },
            
    visible: function() {
        var win = $(window),
        scrollTop = win.scrollTop(),
        height = win.height(),
        top = this.jq.offset().top,
        bottom = top + this.jq.innerHeight();

        if((top >= scrollTop && top <= (scrollTop + height)) || (bottom >= scrollTop && bottom <= (scrollTop + height))) {
            return true;
        }
    },
            
    unbindScrollMonitor: function() {
        $(window).off('scroll.' + this.id);
    }
});