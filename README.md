# jQueryAjaxCache
jQuery addon to allow caching of jQuery AJAX calls

#Versions
Must have jQuery > 1.5.0

There are no know issues with jQuery 1.7.2 

#Install
Just include the library JavaScript

#How to use

Add the cacheTime parameter to jQuery AJAX calls
The cacheTime parameter is in SECONDS

```
$.ajax({
    url: "http://www.example.com"
    ,cacheTime: 900
});
```
```
    cacheTime:900 
```

Please refer to jQuery's AJAX Documentation if you need further help
http://api.jquery.com/jQuery.ajax/
