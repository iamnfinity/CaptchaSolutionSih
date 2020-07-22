
/**
 * Function To Speak out the passed message
 */
function Speak(message){
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
            if(args.tts){
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
    }
}