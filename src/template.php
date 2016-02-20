<?php
/*
?uri + '.php'         call_php(uri+'.php')
?uri + '/index.html'   call_loader(uri,'index.html')
?uri + '.html'        call_loader(dirname(uri+'.html'),filename(uri+'.html'))
:error(uri);

normalized uri /dir[/dir..]/command
*/
/* Router TEST */
session_cache_limiter("public"); //This stop php’s default no-cache
require_once('php/page.php');
require_once('php/mainmenu.php');
if (isset($_GET['json']) || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')) {
    sendJSONPage();
    exit();
}
require_once('php/faker/autoload.php');
$faker = Faker\Factory::create();
sendHTMLPage();
exit();
function sendJSONPage()
{
    $page = Page::getInstance();
    $error = $page->getError();
    if ($error) {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found");
        exit();
    }
    $json = array();
    if (sendHeaders()) {
        $json['error'] = $error;
        $json['title'] = $page->getPreparedTitle();
        $json['content'] = getPageContent();
        $json['header'] = getPageHeader();
        $json['nav'] = getPageNav();
        $json['css'] = $page->getCSS();
        $json['menu'] = getSiteMenu();
    }
    header("Content-type: application/json; charset=utf-8");
    //sleep(10000);
    echo json_encode($json);
}

function sendHTMLPage()
{
    $menu = MainMenu::getInstance();
    $page = Page::getInstance();
    if ($page->getError()) {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found");
        error_page();
        exit();
    }
    header("Content-Type: text/html; charset=utf-8");
    if (sendHeaders())
        echo HTML();
}

function sendHeaders()
{
    $page = Page::getInstance();
    $status = 200;
    header("X-UA-Compatible: IE=edge");
    /*
    if ($page->dynamic === false)
    {
      $modified = max($page->getData('modified'),filemtime('template.php'));
      if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) == $modified)
         $status = 304;
      header("Last-Modified: ".gmdate("D, d M Y H:i:s", $modified )." GMT",true,$status);
      header("Cache-Control: public",true);
    }
    else
    */
    {
        header("Cache-Control: no-cache, must-revalidate", true);
        header("Expires: 0", true);
    }
    header("X-Powered-By: Olli PHP Framework");
    return ($status == 200);
}

function SiteHeader()
{
    $html = "";
    $html .= "<div class='module header'>";
    $html .= "<div class='header-logoWrapper' href='/' title='Startseite'>";
    $html .= "<a class='header-logo' href='/' title='Startseite'>";
    $html .= "<!--[if gte IE 9]><!--><img width='250' alt='F.E.O.' src='/img/olli-avatar.svg' data-fallback='/img/feo-320.png' onerror='this.src=this.getAttribute(\"data-fallback\");this.onerror=null;' /><!--<![endif]-->";
    $html .= "<!--[if lt IE 9]><img width='320' alt='F.E.O.' src='/img/feo-320.png' /><![endif]-->";
    $html .= "</a>";
    $html .= "</div>";
    $html .= "<div class='header-title'><small>Development:</small><div>OLLI.js</div></div>";
    $html .= "</div>";
    return $html;
}

function SiteMenu()
{
    $html = "";
    $html .= "<div class='module menuWrapper'>";

    $html .= "<input class='switch4sitemenu' type='checkbox' id='sitemenu' aria-hidden='true'>";
    $html .= "<label class='label4sitemenu' for='sitemenu'  aria-hidden='true' taborder='0' onclick>Menü</label>";
    $html .= "<script>document.getElementById('sitemenu').checked=false</script>";

    $html .= "<ul id='siteMenu' class='sitemenu'>" . getSiteMenu() . "</ul>";
    $html .= "</div>";
    return $html;
}

function getSiteMenu()
{
    $menu = MainMenu::getInstance()->getMenu();
    $page = Page::getInstance();

    $html = "";
    foreach ($menu as $item) {
        $lic = 'sitemenu-item';
        if ($item->grow)
            $lic .= ' sitemenu-item--grow';
        $html .= "<li class='" . $lic . "'><a class='sitemenu-button' href='" . $item->url . "'" . ($page->isRootPath($item->url) ? " am-current" : "") . " am-ripple><span>" . $item->title . "</span></a></li>";
    }
    return $html;
}

function SiteFooter()
{
    $fromYear = 2015;
    $thisYear = (int)date('Y');
    $Year = $fromYear . (($fromYear != $thisYear) ? '-' . $thisYear : '');
    $html = "";
    $html .= "<div class='module footerWrapper'>";
    $html .= "<div class='typo footer'>";
    $html .= "<p>For internal use only</p>";

    $html .= "<div class='olli clearfix'>";
    $html .= "<p>" . $_SERVER['SERVER_NAME'] . " is created and maintained with care<sup>*</sup> by <svg width='24' height='24' class='olli-avatar'><use xlink:href='#icon-olli'></use></svg><a href='http://www.oliver-eifler.info'>Olli</a></p>";
    $html .= "<p class='legende'><small>* Not recommended for or tested with IE &lt; 10 or any other legacy browser</small></p>";
    $html .= "</div>";

    $html .= "</div>";
    $html .= "</div>";

    return $html;
}

function PageHeader()
{
    //$ts = round(microtime(true)*1000);
    $page = Page::getInstance();
    $html = "";
    $html .= "<div class='pageWrapper-header'>";
    $html .= "<div id='pageHeader' class='typo pageHeader'>";
    $html .= getPageHeader();
    $html .= "</div>";
    $html .= "</div>";

    return $html;
}

function getPageHeader()
{
    //$ts = round(microtime(true)*1000);
    $page = Page::getInstance();
    $html = "";
    $html .= "<h1>" . $page->title . "</h1>";

    return $html;
}

function PageContent()
{
    $page = Page::getInstance();

    $html = "";
    $html .= "<div class='pageWrapper-content'>";
    $html .= "<div id='pageContent' class='pageContent'>";
    $html .= getPageContent();
    $html .= "</div>";
    $html .= "</div>";

    return $html;
}

function getPageContent()
{
    $page = Page::getInstance();

    $html = "";
    $html .= "<article class='typo content clearfix'>";
    $html .= $page->getHTML();
    $html .= "</article>";
    return $html;
}

function PageNav()
{
    $page = Page::getInstance();
    $menu = $page->getMenu();
    $html = "";
    $html .= "<nav class='pageWrapper-nav'>";

    $html .= "<div id='pageNav' class='pageNav'>";
    $html .= getPageNav();
    $html .= "</div>";

    $html .= "</nav>";

    return $html;
}

function getPageNav()
{
    $page = Page::getInstance();
    $menu = $page->getMenu();
    if (empty($menu))
        return "";

    $html = "";
    $html .= "<input class='switch4pagemenu' type='checkbox' id='pagemenu' aria-hidden='true'>";
    $html .= "<label class='label4pagemenu' for='pagemenu'  aria-hidden='true' taborder='0' onclick>Weitere Seiten</label>";
    $html .= "<script>document.getElementById('pagemenu').checked=false</script>";
    $html .= "<ul class='pagemenu'>";
    foreach ($menu as $item) {
        $html .= "<li class='pagemenu-item'><a class='pagemenu-button' href='" . $item->url . "'" . ($page->request_cmd == $item->url ? " am-current" : "") . ">" . $item->title . "</a></li>";
    }
    $html .= "</ul>";
    return $html;
}

function PageAds()
{
    global $faker;
    $page = Page::getInstance();

    $html = "";
    $html .= "<aside class='pageWrapper-aside'>";
    $html .= "<div class='typo pageAside'>";
    $html .= "<h3>Neuigkeiten</h3><ul>";
    for ($j = 0; $j < 3; $j++) {
        $html .= "<li><strong>" . $faker->catchPhrase . "</strong><br>";
        $html .= $faker->paragraph(1) . "</li>";
    }

    $html .= "</ul></div>";
    //$html.="<h3>Debug Data</h3>".$page->debugData();
    $html .= "</aside>";

    return $html;
}

function css($path)
{
    $file = autoversion($path . ".css");
    if ($file === false)
        return "";
    return "<link rel='stylesheet' type='text/css' href='/" . $file . "' data-noprefix>";
}

function js($path)
{
    $file = autoversion($path . ".js");
    $file = $path.".js";
    if ($file === false)
        return "";

    return "<script src='/" . $file . "'></script>";
}

function PreLoad()
{
    $html = "";
    $html .= css('css/styles');
    $html .= css('css/rule');

    /* config for js*/
    $svg = autoversion("img/icons.svg");

    $html .= "<script>_cfg={";
    $html .= "svgfile:" . ($svg === false ? "false" : "'" . $svg . "'");
    $html .= "};</script>";
    /* bootstrap scripts */
    $html .= js('_assets/js/components/html5shiv');
    $html .= js('_assets/js/components/webfontloader');
    $html .= js('_assets/js/components/modernizr-custom');
    $html .= js('_assets/js/init');
    return $html;
}

function PostLoad()
{
    $html = "";
    return $html;
}

function HTMLHeader()
{
    $page = Page::getInstance();

    $title = htmlentities($page->getPreparedTitle(), ENT_QUOTES | ENT_HTML401);
    $desc = htmlentities($page->getPreparedDescription(), ENT_QUOTES | ENT_HTML401);
    $tags = htmlentities($page->getPreparedTags(), ENT_QUOTES | ENT_HTML401);

    $html = "";
    $html .= "<head>";
    if ($page->noindex)
        $html .= "<meta name='robots' content='noindex'>";
    $html .= "<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=yes'>";
    $html .= "<meta name='format-detection' content='telephone=no'/>";
    $html .= "<title>" . $title . "</title>";
    $html .= "<meta name=\"author\" content=\"Oliver Jean Eifler\" />";
    $html .= "<meta name=\"description\" content=\"" . $desc . "\" />";
    $html .= "<meta name=\"keywords\" content=\"" . $tags . "\" />";
    $html .= PreLoad();
    $html .= Favicons();
    if ($page->request_uri != $page->request_cmd)
        $html .= "<link rel='canonical' href='" . $page->request_cmd . "' />";
    $html .= "</head>";
    return $html;
}

function Favicons()
{
    $html = "";
    $html .= "<link rel='apple-touch-icon' sizes='57x57' href='/fav/apple-touch-icon-57x57.png'>";
    $html .= "<link rel='apple-touch-icon' sizes='60x60' href='/fav/apple-touch-icon-60x60.png'>";
    $html .= "<link rel='apple-touch-icon' sizes='72x72' href='/fav/apple-touch-icon-72x72.png'>";
    $html .= "<link rel='apple-touch-icon' sizes='76x76' href='/fav/apple-touch-icon-76x76.png'>";
    $html .= "<link rel='apple-touch-icon' sizes='114x114' href='/fav/apple-touch-icon-114x114.png'>";
    $html .= "<link rel='apple-touch-icon' sizes='120x120' href='/fav/apple-touch-icon-120x120.png'>";
    $html .= "<link rel='apple-touch-icon' sizes='144x144' href='/fav/apple-touch-icon-144x144.png'>";
    $html .= "<link rel='apple-touch-icon' sizes='152x152' href='/fav/apple-touch-icon-152x152.png'>";
    $html .= "<link rel='apple-touch-icon' sizes='180x180' href='/fav/apple-touch-icon-180x180.png'>";
    $html .= "<link rel='icon' type='image/png' href='/fav/favicon-32x32.png' sizes='32x32'>";
    $html .= "<link rel='icon' type='image/png' href='/fav/favicon-194x194.png' sizes='194x194'>";
    $html .= "<link rel='icon' type='image/png' href='/fav/favicon-96x96.png' sizes='96x96'>";
    $html .= "<link rel='icon' type='image/png' href='/fav/android-chrome-192x192.png' sizes='192x192'>";
    $html .= "<link rel='icon' type='image/png' href='/fav/favicon-16x16.png' sizes='16x16'>";
    $html .= "<link rel='manifest' href='/fav/manifest.json'>";
    $html .= "<link rel='shortcut icon' href='/fav/favicon.ico'>";
    $html .= "<meta name='msapplication-TileColor' content='#116611'>";
    $html .= "<meta name='msapplication-TileImage' content='/fav/mstile-144x144.png'>";
    $html .= "<meta name='msapplication-config' content='/fav/browserconfig.xml'>";
    $html .= "<meta name='theme-color' content='#116611'>";
    return $html;
}

function HTMLBody()
{
    $page = Page::getInstance();

    $html = "<body>";
    $html .= "<div id='pageCSS'>" . $page->getCSS() . "</div>";
    $html .= "<header class='headerContainer' >";
    $html .= SiteHeader();
    $html .= "</header>";
    $html .= "<nav class='menuContainer'>";
    $html .= SiteMenu();
    $html .= "</nav>";
    $html .= "<div class='pageContainer'>";
    $html .= "<div class='module module--page pageWrapper'>";
    $html .= PageHeader();
    $html .= PageNav();
    $html .= PageContent();
    $html .= PageAds();
    $html .= "</div>";
    $html .= "</div>";
    $html .= "<footer class='footerContainer'>";
    $html .= SiteFooter();
    $html .= "</footer>";

/*
    $html .= "<script>var DEBUG = true, FORCE_PROMISE = this['Promise']?false:true;</script>";
    $html.= js('_assets/es6/vendors/browser');
    $html.= js('_assets/es6/vendors/system-polyfills');
    $html.= js('_assets/es6/vendors/system');
    $html .= "<script>";
    $html .= "System.config({";
    $html .= "    transpiler: 'babel'";
    //$html .= "    baseURL: '_assets/es6/olli'";
    $html .= "  });";
    $html .= "System.import('_assets/es6/olli/olli-test.js?cache=".time()."');";
    $html .="</script>";
*/
/*
    $html .= js('js/dist/app.min');
*/
//    /*
        $html .= "<script>var DEBUG = true, FORCE_PROMISE = this['Promise']?false:true;</script>";
        $html.= js('_assets/es6/vendors/browser');
        $html.= js('_assets/es6/vendors/system-polyfills');
        $html.= js('_assets/es6/vendors/system');
        $html .= "<script>";
        $html .= "System.config({";
        $html .= "    transpiler: 'babel'";
        //$html .= "    baseURL: '_assets/es6/olli'";
        $html .= "  });";
        $html .= "System.import('_assets/es6/app.js?cache=".time()."');";
        $html .="</script>";
//    */
    $html .= "</body>";
    return $html;
}

function HTML()
{
    $html = "<!DOCTYPE HTML>";
    $html .= "<!--[if lte IE 8]><html lang='de' class='no-cbh'><![endif]-->";
    $html .= "<!--[if gte IE 9]><!--><html  lang='de'><!--<![endif]-->";
    //$html.= "<html  lang='de'>";
    $html .= HTMLHeader();
    $html .= HTMLBody();
    $html .= "</html>";
    return $html;
}

function error_page()
{
    $menu = MainMenu::getInstance()->getMenu();

    $html = "<!DOCTYPE HTML>";
    $html .= "<head>";
    $html .= "<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=yes'>";
    $html .= "<meta name='format-detection' content='telephone=no'/>";
    $html .= "<title>Page Not Found</title>";
    $html .= "<style type='text/css'>";
    $html .= file_get_contents("css/404.css");
    $html .= "</style>";
    $html .= "</head>";
    $html .= "<body>";
    $html .= "<img src='/img/yawn.png' alt=''>";
    $html .= "<h1>Page Not Found</h1>";
    $html .= "<p>Sorry, but the page you were trying to view does not exist.</p>";
    $html .= "<p>&nbsp;</p>";
    $html .= "<p>Maybe, you try it here:</p>";
    $html .= "<ul>";
    $html .= "<li><a href='/'><strong>Start</strong></a><li>";
    foreach ($menu as $item) {
        $html .= "<li><a href='" . $item->url . "'>" . $item->title . "</a></li>";
    }
    $html .= "</ul>";
    $html .= "</body>";
    $html .= "</html>";
    $html .= "<!-- IE needs 512+ bytes: http://blogs.msdn.com/b/ieinternals/archive/2010/08/19/http-error-pages-in-internet-explorer.aspx -->";

    echo $html;
}

function utime()
{
    $utime = preg_match("/^(.*?) (.*?)$/", microtime(), $match);
    $utime = $match[2] + $match[1];
    $utime *= 1000000;
    return $utime;
}

function includelib($path, $config)
{
    $html = "";
    $libs = json_decode(file_get_contents($path . "/" . $config), true);
    if (!empty($libs["files"])) {
        foreach ($libs["files"] as $file)
            $html .= js($path . "/" . $file);
    }
    return $html;
}


?>