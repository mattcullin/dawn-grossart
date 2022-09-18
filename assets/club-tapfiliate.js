/* CLUB - checks for Tapfiliate reference or cookie, inserts click ID into checkout parameters if present and valid */

window.addEventListener('DOMContentLoaded', () => {

  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function insertClickIdCheckoutAttr(click_id) {
    const club_cart_attributes = document.getElementById('club-cart-attributes');
    if(club_cart_attributes) {
        const tap_click_id_attribute = document.createElement('input');
        tap_click_id_attribute.type = 'hidden';
        tap_click_id_attribute.name = 'attributes[tap_click_id]';
        tap_click_id_attribute.value = click_id;
        club_cart_attributes.appendChild(tap_click_id_attribute);
    }
  }
     
  var url_string = window.location.href;
  var url = new URL(url_string);
  var referral_code = url.searchParams.get("ref");
  var utm_source = url.searchParams.get("utm_source");
  
  if(referral_code && utm_source=='tapfiliate') {
    var source_id = url.searchParams.get("tap_s");
    var referrer = document.referrer;
    var tap_click_id = '';

    let data = {
        referral_code: referral_code,
        source_id: source_id,
        referrer: referrer,
        landing_page: window.location.href,
        user_agent: navigator.userAgent
    };

    fetch("https://enb9004a5nnbfns.m.pipedream.net", {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
    }).then((response) => {
        if (!response.ok) {
            throw Error();
        }
        return response.json();
    }).then((responsejson) => {
        tap_click_id = responsejson.id;
        setCookie('tap_click_id', tap_click_id, 30);
        insertClickIdCheckoutAttr(tap_click_id);
    }).catch((error) => {
        console.log('Invalid ref');
    });
  	
  } else {
    tap_click_id = ("; "+document.cookie).split("; tap_click_id=").pop().split(";").shift();
    if(tap_click_id) { 
        insertClickIdCheckoutAttr(tap_click_id);
    }
  }

});