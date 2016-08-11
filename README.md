# jQueryAjaxCache
jQuery addon to allow caching of jQuery AJAX calls

#Versions
Must have jQuery > 1.5.0

There are no know issues with jQuery 1.7.2 

#Install/Download
http://www.redditchweb.co.uk/dev/ajaxCache/ajaxCache-1.2.4.js 
Just include the library JavaScript (I recommend you download it and host it your self)

#How to use

Add the cacheTime parameter to jQuery AJAX calls
The cacheTime parameter is in SECONDS

```
$.ajax({
    url: "http://www.example.com"
    ,cacheTime: 900
    , success: function(resp){
        console.log(resp);
    }
});
```
```
    cacheTime:900 
```

Please refer to jQuery's AJAX Documentation if you need further help
http://api.jquery.com/jQuery.ajax/

#How to clear users's caches
If you increment ajaxCache.versionNumber in your script after ajaxCache is loaded in, this will force anyone who has an older cache to get the new content


```
ajaxCache.versionNumber = 3;
```


#Extra info
ajaxCache utilises the localStorage API available in modern browsers
