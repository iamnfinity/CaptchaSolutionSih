/**
 * Function To Speak out the passed message
 */
function Speak(message) {
    var msg = new SpeechSynthesisUtterance();
    msg.text = message;
    window.speechSynthesis.speak(msg);
}

class captchaV1 {
    /**
     * Starts all the fuctions
     * @param {Form ID of Form} formID 
     */
    constructor(formID, args) {
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
        this.formInputElements.each(function () {
            $(this).focus(function () {
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


        
        // Create Browser Finger Print
        this.deviceFingerPrint = null;
        if (window.requestIdleCallback) {
            requestIdleCallback(function () {
                new Fingerprint2.get(function (components) {
                    var values = components.map(function (component) {
                        return component.value;
                    });
                    var murmur = Fingerprint2.x64hash128(values.join(''), 31);
                    console.log(murmur);
                    this.deviceFingerPrint = murmur;
                });
            });
        } else {
            setTimeout(function () {
                new Fingerprint2.get(function (components) {
                    var values = components.map(function (component) {
                        return component.value;
                    });
                    var murmur = Fingerprint2.x64hash128(values.join(''), 31);
                    console.log(murmur);
                    this.deviceFingerPrint = murmur;
                });
            }, 500);
        }


        // Add Solve Captcha Button at end of the form
        var button = `<button type="button" id="captchaV1" class="btn btn-danger">Are You A Human?</button>`;
        this.isCaptchaSolved = false;
        try {
            if (args.tts) {
                var button = `<button type="button" id="captchaV1" class="btn btn-danger" data-toSpeak="Please Solve Captcha">Are You A Human?</button>`;
                this.form.append(button);
            } else {
                this.form.append(button);
            }
        } catch (error) {
            console.log();
        }

        // Text To Speak For Captcha Button 
        try {
            if (args.tts) {
                $("#captchaV1").click(function () {
                    Speak("Please Solve Captcha");
                });
            }
        } catch (error) {
            console.log(error);
        }


    }
}