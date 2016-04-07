/* global stencil */
/*
@preserve stencilTemplates.js
version 1.0.0
Kingston Chan - Released under the MIT licence
*/

var stencilTemplates = stencilTemplates || {};

stencilTemplates.opts = $.extend(stencilTemplates.opts || {}, (function() {
    return {
        debug: true,
        templates: {
            path: "js/stencilTemplates",
            jsExt: ".st.js",
            stencilExt: ".st.stencil"
        }
    };
})());

stencilTemplates = $.extend(stencilTemplates, (function() {
    var loaded = {};
    var init = function init(templates) {
        if (typeof templates === "string") {
            templates = [templates];
        } else if (!Array.isArray(templates)) {
            stencilTemplates.util.log("Templates parameters are incorrect", true);
            return null;
        }

        var templateOpts = stencilTemplates.opts.templates;
        var loadTemplates = $.Deferred()
            .progress(function loadTemplatesProgress() {
                if (++loadTemplates.current === loadTemplates.total) {
                    loadTemplates.resolve();
                }
            });
        loadTemplates.total = 0;
        loadTemplates.current = 0;

        templates.forEach(function fetchJS(templateName) {
            if(loaded[templateName]) {
                return;
            } else {
                loaded[templateName] = true;
            }
            
            loadTemplates.total++;
            $.ajax({
                url: templateOpts.path + "/" + templateName + templateOpts.jsExt,
                dataType: "script"
            }).done(function onJSLoadComplete() {
                stencilTemplates.util.log(templateName + " has been loaded");
                loadTemplates.notify();
            }).fail(function onJSLoadFail(jqXHR) {
                stencilTemplates.util.log("Unable to load " + templateOpts.path + "/" + templateName + templateOpts.jsExt + " due to " + jqXHR.status + " - " + jqXHR.statusText, true);
            });
        });
        return loadTemplates.promise();
    }

    $("head").ready(function checkForStencil() {
        if (!stencil) {
            stencilTemplates.util.log("stencil.js has not been imported", true);
            return;
        }
    });

    return {
        init: init
    };
})());

stencilTemplates.util = $.extend(stencilTemplates.util || {}, (function() {
    return {
        log: function log(message, isCritical) {
            if (stencilTemplates.opts.debug) {
                console.log("[debug] Stencil Templates: " + message);
            } else if (isCritical) {
                console.log("Stencil Templates: " + message);
            }
        },
        cloneJSON: function cloneJSON(json) {
            return JSON.parse(JSON.stringify(json));
        },
    };
})());

