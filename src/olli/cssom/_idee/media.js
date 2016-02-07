/**
 * Created by darkwolf on 20.12.2015.
 */
import {isArray,keys,isNumber,isString,isUndefined} from "../util.js";
import $MediaList from "../types/medialist.js";

export default function $Media(){
}
Object.defineProperty($Media, 'hasMedia', {get: function() {return !!(getCSSO(this).media);},enumerable:true});
Object.defineProperty($Media, 'mediaText', {
    get: function() {
        var media = getCSSO(this).media;
        return media?media.mediaText:"";
    },
    set: function(mediaText) {
        var media = getCSSO(this).media;
        if (media) {
            if (!isString(mediaText))
                mediaText = mediaText.toString();
            media.mediaText = mediaText;
        }
    },
    enumerable:true
});
$Media.mediaList = function (medium) {
    var $this = this,
        list=$MediaList();
    if (getCSSO($this).media) {
        if (isUndefined(medium)) {
            list.mediaText = $this.mediaText;
        } else {
            $this.mediaText = medium;
            list.mediaText = $this.mediaText;
        }
    }
    return list;
};
$Media.appendMedia = function(medium) {
    var $this = this;
    if (getCSSO($this).media) {
        var list = $MediaList($this.mediaText);
        if (!isString(medium))
            medium = medium.toString();
       $this.mediaText = list.add(medium).toString();
    }
    return $this;
};
$Media.removeMedia = function(media) {
    var $this = this;
    if (getCSSO($this).media) {
        var list = $MediaList($this.mediaText);
        $this.mediaText = list.remove(medium).toString();
    }
    return $this;
};