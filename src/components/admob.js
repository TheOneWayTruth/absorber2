/* eslint-disable */
var admobid = {};

if (/(android)/i.test(navigator.userAgent)) { // for android & amazon-fireos
    admobid = {
        banner: 'ca-app-pub-7494960732262742/9769921884', // or DFP format "/6253334/dfp_example_ad"
        interstitial: 'ca-app-pub-7494960732262742/5639105186'
    };
} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
    admobid = {
        banner: 'ca-app-pub-7494960732262742/9769921884', // or DFP format "/6253334/dfp_example_ad"
        interstitial: 'ca-app-pub-7494960732262742/5639105186'
    };
}

if (AdMob) {
    AdMob.prepareInterstitial({ adId: admobid.interstitial, autoShow: false });
    AdMob.createBanner({
        adId: admobid.banner,
        position: AdMob.AD_POSITION.TOP_CENTER,
        autoShow: true,
    });
    AdMob.showInterstitial();
}
