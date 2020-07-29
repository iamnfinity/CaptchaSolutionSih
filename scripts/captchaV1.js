// Combines Both Classes
class captchaBootstrapClass {
  constructor(CaptchaUniqueID, isVerified) {
    this.captchaUID = CaptchaUniqueID;
    this.isVerified = isVerified;
  }
}

/**
 * Function To Speak out the passed message
 */
function Speak(message) {
  var msg = new SpeechSynthesisUtterance();
  msg.text = message;
  window.speechSynthesis.speak(msg);
}

// Some Global Variables Start
const modalName = "captcha-modal";
var formIDGlobal = null;

// Special Object For Bootstrap class
var bootstrap = new captchaBootstrapClass("1237162", false);

// Captcha Message placeholder
var captcha_message_placeholder = "captcha-message-placeholder";


/**
 *
 * Create Device Fingerprint
 */
async function getFingerprint() {
  console.log("Generating");
  const fingerprint = await Fingerprint2.getPromise().then(function(components) {
    var values = components.map(function(component) {
      return component.value;
    });
    var murmur = Fingerprint2.x64hash128(values.join(''), 31);
    return murmur;
  });
  return fingerprint;
}


class captchaV1 {


  showCaptcha() {
    if (this.isCapchaSolved == false) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Starts all the fuctions
   * @param {Form ID of Form} formID
   */
  constructor(formID, args) {

    // Add FormID To Global
    formIDGlobal = formID;
    // Create Form Object
    this.form = $(formID);
    this.formInputElements = $(formID + " :input");

    // Show Number of Form Inputs
    console.log("No Of Form Inputs : " + this.formInputElements.length);

    // Check If Text To Speach is Enabled In Browser
    try {
      if (args.tts) {
        if ('speechSynthesis' in window) {
          // Speech Synthesis supported 🎉
        } else {
          // Speech Synthesis Not Supported 😣
          alert("Sorry, your browser doesn't support text to speech!");
        }
      }
    } catch (error) {
      console.log();
    }

    // Bind handlers to these inputs
    this.formInputElements.each(function() {
      $(this).focus(function() {
        // Get Data To Speak Text
        var toSpeak = $(this).attr("data-toSpeak");
        // Fire To Speak Function If Text To Speak Is Allowed
        try {
          if (args.tts) {
            Speak(toSpeak);
          }
        } catch (error) {
          console.log("TTS Not Enabled");
        }

      });
    });


    // Bind Form Submit Defaults
    this.form.on('submit', function(e) {
      e.preventDefault();
      console.log(bootstrap.isVerified);
      if (bootstrap.isVerified) {
        //this.submit();
      } else {
        $("#" + modalName).modal('show');
      }
    });

    // Custom POP UP  Modal CSS
    var styles = `<style>
        .disable-touch {
            touch-action: none;
        }

        canvas {
            display: block;
        }

        .overlayText {
            position: absolute;
            z-index: -1;

        }
        .text-padding{
          padding-left: 20px;
          padding-right: 20px;
        }
        .bottom-div{
          position: absolute;
          bottom: 0px;
        }
        .padding-screen{
          padding-left: 20px;
          padding-right: 20px;
        }
        .position-fix{
          top: 0px;
          left: 0px;
          margin: 0px;
        }
        .modal-body{
            overflow-x:hidden !important;
            overflow-y:hidden !important;
        }
        .captcha-heading{
          color: #ed1e79;
        }
        .captcha-padding-sub-text{
          padding-left:20px;
          padding-right:20px;
        }
        /*
          Captcha Laoding Spinner Css
        */
        .captcha-loading-spinner {
  width: 80px;
  height: 80px;
  border-top: 8px solid aliceblue;
  border-right: 8px solid aliceblue;
  border-bottom: 8px solid aliceblue;
  border-left: 8px solid #8c618d;
  border-radius: 50%;

  animation-name: spin;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
    border-left:8px solid deeppink;
  }

  25%{
    transform: rotate(360deg);
    border-left:8px solid gold;
  }

  50%{
    transform:rotate(720deg);
    border-left:8px solid palegreen;
  }

  75%{
    transform: rotate(1080deg);
    border-left:8px solid aqua;
  }

  100% {
    transform: rotate(1440deg);
    border-left:8px solid deeppink;
  }

}



    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.0.0/animate.min.css"/>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    `;

    $('head').append(styles);


    // Custom POPUP Modal
    var captchaModal = `
        <div class="modal fade modal-fullscreen" id="captcha-modal" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">

        </div>
        <div class="modal-body" style="background-color: #eee;">
        <div class="row h-100 position-fix" style="width: 100%">
    <div style="position: absolute; z-index:1; margin-top: 20px; width: 100%" class="position-fix">
      <div class="row h-100">
        <div class="col-12 align-self-center padding-disable">
          <h2 class="text-center captcha-heading" id="result">D-CAPTCHA</h2>
          <p class="text-center text-secondary captcha-padding-sub-text"><b>Please draw random shapes in screen to prove that you are a human</b></p>
        </div>
      </div>
    </div>
      <div style="position: absolute; z-index:5; height: 100%; width: 100%" class="position-fix">
        <div class="row h-100 justify-content-center">
          <div class="align-self-center padding-disable" id="${captcha_message_placeholder}"></div>
        </div>
      </div>
      <div style="position: absolute; z-index:6; height: 100%; width: 100%" class="position-fix">
        <div class="row h-100">
          <div class="col-12 align-self-end padding-disable">
            <p class="text-center text-secondary">Keep drawing untill you see <b style="color:#4CAF50">Success</b> Message</p>
          </div>
        </div>
      </div>
      <canvas id="draw" class="disable-touch position-fix" style="width: auto; position: absolute; z-index:10 ;"></canvas>
  </div>
        </div>
        <div class="modal-footer">

        </div>
      </div>
    </div>
  </div>
        `;

    $('body').prepend(captchaModal);
  }
}

// Captcha Loading Spinner Variable
var captcha_loading_spiner = `<div class="captcha-loading-spinner container"></div>`;

// Captcha Success display
var captcha_success_display = `<p class="text-center animate__animated animate__tada" style="font-size:80px;color:#4CAF50;"><i class="fa fa-check-circle-o" aria-hidden="true"></i></p>`;

// Captcha Fail display
var captcha_fail_display = `<p class="text-center animate__animated animate__shakeX" style="font-size:80px;color:#E53935;"><i class="fa fa-times-circle-o" aria-hidden="true"></i></p>`;


// Full Screen Modal Script
"use strict";
! function(i) {
  i(function() {
    function t(i, t) {
      var n = 0;
      return t.forEach(function(t) {
        var o = i.css(t);
        o && (n += parseInt(o.match(/\d+/)[0]))
      }), n
    }

    function n(i) {
      return {
        width: t(i, ["margin-left", "margin-right", "padding-left", "padding-right", "border-left-width", "border-right-width"]),
        height: t(i, ["margin-top", "margin-bottom", "padding-top", "padding-bottom", "border-top-width", "border-bottom-width"])
      }
    }

    function o(t) {
      var o = i(window).height(),
        r = (i(window).width(), t.find(".modal-dialog"));
      r.css("width", "initial"), r.css("height", "initial"), r.css("max-width", "initial"), r.css("margin", "5px");
      var e = n(r),
        d = t.find(".modal-header"),
        a = t.find(".modal-footer"),
        s = t.find(".modal-body");
      s.css("overflow-y", "scroll");
      var h = o - d.outerHeight() - a.outerHeight() - (s.outerHeight() - s.height()) - e.height;
      s.height(h)
    }

    function r(t) {
      t.on("show.bs.modal", function(t) {
        i(t.currentTarget).css("visibility", "hidden")
      }), t.on("shown.bs.modal", function(t) {
        o(i(t.currentTarget));
        i(t.currentTarget).css("visibility", "visible")
      })
    }
    i.prototype.fullscreen = function() {
      var t = i(this);
      t.hasClass("modal-fullscreen") && r(t)
    }, i(window).resize(function() {
      o(i(".modal.modal-fullscreen.in"))
    }), r(i(".modal-fullscreen"))
  })
}(jQuery);


// Full Screen Modal Script End


// This will add scripts after elements load in page
$(document).ready(function() {

  var points_X = [];
  var points_Y = [];
  var timeStamp = [];
  var initTime = null;
  var sending = false;
  // Set up the canvas
  var canvas = document.getElementById("draw");
  var ctx = canvas.getContext("2d");
  ctx.strokeStyle = "red";
  ctx.lineWith = 2;

  // Canvas Width and Height
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;

  // Set up mouse events for drawing
  var drawing = false;
  var mousePos = {
    x: 0,
    y: 0
  };
  var lastPos = mousePos;
  canvas.addEventListener("mousedown", function(e) {
    drawing = true;

    // Set Start Time
    if (initTime == null) {
      console.log("Init Date Added");
      initTime = new Date().getTime();
    }

    lastPos = getMousePos(canvas, e);
    if (drawing) {
      points_X.push(Math.round(lastPos.x));
      points_Y.push(Math.round(lastPos.y));
      tempDate = new Date().getTime();
      timeStamp.push(tempDate - initTime);
      initTime = tempDate;
    }
    renderCanvas();
  }, false);
  canvas.addEventListener("mouseup", function(e) {
    drawing = true
  }, false);
  canvas.addEventListener("mousemove", function(e) {
    mousePos = getMousePos(canvas, e);
    if (drawing) {
      points_X.push(Math.round(mousePos.x));
      points_Y.push(Math.round(mousePos.y));
      tempDate = new Date().getTime();
      timeStamp.push(tempDate - initTime);
      initTime = tempDate;
    }
    // Send Data If 400 Points Collected
    if (points_X.length >= 100 && !sending) {
      console.log("100 Points Collected Sending Data To Server");
      sending = true;
      sendData(points_X, points_Y, timeStamp);
    }
    renderCanvas();
  }, false);

  // Set up touch events for mobile, etc
  canvas.addEventListener("touchstart", function(e) {
    mousePos = getTouchPos(canvas, e);
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
    renderCanvas();
  }, false);
  canvas.addEventListener("touchend", function(e) {
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  }, false);
  canvas.addEventListener("touchmove", function(e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
    renderCanvas();
  }, false);



  // Prevent scrolling when touching the canvas
  document.body.addEventListener("touchstart", function(e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, false);
  document.body.addEventListener("touchend", function(e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, false);
  document.body.addEventListener("touchmove", function(e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, false);

  // Get the position of the mouse relative to the canvas
  function getMousePos(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    };
  }

  // Get the position of a touch relative to the canvas
  function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    };
  }

  // Draw to the canvas
  function renderCanvas() {
    if (drawing) {
      ctx.strokeStyle = "#03DAC6";
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      lastPos = mousePos;
    }
  }
  // Clear Canvas
  function clearCanvas() {
    canvas.width = canvas.width;
  }

  // Clear Array Data
  function clearArrays() {
    points_X.splice(0, points_X.length);
    points_Y.splice(0, points_Y.length);
    timeStamp.splice(0, timeStamp.length);
    initTime = null;
  }
  window.mobileCheck = function() {
    let check = false;
    (function(a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };

  // This Module Will Clear The Captcha Message Div
  function clearCaptchaMessagePlaceholder() {
    $("#" + captcha_message_placeholder).empty();
  }

  // This Module Sends Data To Server For Verification Purpose
  // Module Start
  function sendData(dataX, dataY, timeStamps) {

    var isMobile = mobileCheck();
    // Prepare Data
    var name = localStorage.getItem("name");

    // Prepare Data end
    const data = {
      width: canvasWidth,
      height: canvasHeight,
      isMobile: isMobile,
      xPointsLength: dataX.length,
      yPointsLength: dataY.length,
      dataX: dataX,
      dataY: dataY,
      timeStamps: timeStamps
    }
    jQuery.ajax({
      url: " https://blind-captcha-v1.herokuapp.com/checkBotV1",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      dataType: "json",
      beforeSend: function(x) {
        // When Sending Data Set Is Drawing parameter to false
        drawing = false;
        $("#" + captcha_message_placeholder).append(captcha_loading_spiner);
      },
      success: function(result) {
        console.log(result);
        // Bot Show Failure Message
        if (result.isBot) {
          $("#result").text("Bot Detected");
          clearCaptchaMessagePlaceholder();
          $("#" + captcha_message_placeholder).append(captcha_fail_display);
          setTimeout(function() {
            // Submit Form After 1 Second
            $("#" + modalName).modal('hide');
          }, 1500);
        } else {
          // Show Success Tick
          clearCaptchaMessagePlaceholder();
          $("#" + captcha_message_placeholder).append(captcha_success_display);
          setTimeout(function() {
            // Submit Form After 1 Second
            $("#" + modalName).modal('hide');
            $(formIDGlobal).submit();
          }, 1500);
        }
      }
    });
  }
  // Data Send Module End

  // This will resizeCanvas to max width and height of scree
  var canvas = document.getElementById('draw'),
    context = canvas.getContext('2d');

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


  }
  resizeCanvas();
  // End Module Resize Canvas


});
