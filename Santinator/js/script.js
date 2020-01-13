//Created by Myra Keersmaekers


window.addEventListener("load", init);

var glowpower = 0.6;
var fadingOut = true;
var mousePos = {
    x: 0,
    y: 0
};
var typing = false;
var currentquestion;
var questions = [];

function init() {
    setInterval(glowLight, 20);
    moveEyes();
    startConversation();  
}


function glowLight() {
    if(fadingOut) {
        glowpower -= 0.01; //set the glowpower a bit lower
        if(glowpower < 0.2) { //if glowpower gets lower than 0.2
            fadingOut = false; 
        }
    } else {
        glowpower += 0.01; //set the glowpower a bit higher
        if(glowpower > 0.6) { //if glowpower gets higher than 0.6
            fadingOut = true;
        }
    }
    $("#glow stop:first-child").attr("stop-opacity", glowpower); //set the stop-opacity of the first <stop> of the #glow-pattern on glowpower
}



function moveEyes() {
    var santinator = $("#santinator");
    var lp = $("#leftPupil");
    var rp = $("#rightPupil");
    
    window.onmousemove = function(e) {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        mousePos.x -= santinator.offset().left;
        mousePos.y -= santinator.offset().top;
        
        var angleleft = -Math.PI/2 - Math.atan2(mousePos.x - lp.attr("cx"), mousePos.y - lp.attr("cy"));
        var angleright = -Math.PI/2 - Math.atan2(mousePos.x - rp.attr("cx"), mousePos.y - lp.attr("cy"));
        var transformstringleft = "rotate(" + toDeg(angleleft) + " " + lp.attr("cx") + " " + lp.attr("cy") + ") translate(-4 0)"
        var transformstringright = "rotate(" + toDeg(angleright) + " " + rp.attr("cx") + " " + rp.attr("cy") + ") translate(-4 0)"
        lp.attr("transform", transformstringleft);
        rp.attr("transform", transformstringright);
    }
}




function startConversation() {
    questions = [
        new Question("Hello, I am the Santinator!", "Have you been good this year?"),           //0
        new Question("Let's say i'll believe you.", "Do you want a gift for xmas?"),            //1
        new Question("I like naughty kids anyway.", "Do you like me too?"),                     //2
        new Question("Ok, that's great!", "Shall I give you chocolate?"),                       //3
        new Question("That's kinda asocial.", "Get lost in your code, dude."),                  //4 END
        new Question("Find the meaning of life.", "Then I'll give you your chocolate."),        //5 END
        new Question("You're just a horrible person.", "I hope you choke in your vegetables."), //6 END
        new Question("You shouldn't like a robot-computer.", "I am not real, you fool."),       //7 END
        new Question("Well, that's mean.", "But hey, we can still be friends?"),                //8
        new Question("Nice!", "Let's hang out sometime."),                                      //9 END
        new Question("Oh, fuck off!", "You self-centered bastard."),                            //10 END
    ]
        
    function Question(line1, line2) {
        this.line1 = line1;
        this.line2 = line2;
    }
    
    currentquestion = questions[0];
    typeWriter(currentquestion.line1, 0, currentquestion.line2, 0);
    
    window.onkeypress = function(e) {
        if(!typing) { //only allows the answer to be pressed, when the question is fully written.
            
            //check if previous question was an end question
            if(currentquestion == questions[4] || currentquestion == questions[5] || currentquestion == questions[6] || currentquestion == questions[7] || currentquestion == questions[9] || currentquestion == questions[10]) {
                currentquestion = questions[0]; //set to begin question
                typeWriter(currentquestion.line1, 0, currentquestion.line2, 0); //typewrite the question
                return;
            } 

            if(e.charCode == "121" || e.charCode == "89") {//Y or y
                switch(currentquestion) { //Select a new question, depending on the currentquestion
                    case questions[0]:
                        currentquestion = questions[1];
                        break;
                    case questions[1]:
                        currentquestion = questions[3];
                        break;
                    case questions[2]:
                        currentquestion = questions[7];
                        break;
                    case questions[3]:
                        currentquestion = questions[5];
                        break;
                    case questions[8]:
                        currentquestion = questions[9];
                        break;
                }
                typeWriter(currentquestion.line1, 0, currentquestion.line2, 0); //typewrite the question
            }
            
            if(e.charCode == "110" || e.charCode == "78") {//N or n
                switch(currentquestion) { //Select a new question, depending on the currentquestion
                    case questions[0]:
                        currentquestion = questions[2];
                        break;
                    case questions[1]:
                        currentquestion = questions[4];
                        break;
                    case questions[2]:
                        currentquestion = questions[8];
                        break;
                    case questions[3]:
                        currentquestion = questions[6];
                        break;
                    case questions[8]:
                        currentquestion = questions[10];
                        break;
                }
                typeWriter(currentquestion.line1, 0, currentquestion.line2, 0); //typewrite the question
            }
        }
    }
}

function typeWriter(text1, i1, text2, i2) { //based on https://codepen.io/voronianski/pen/aicwk - modified to fit the needs
    //text1: the text to display on <text>#line1
    //i1: the counter for text1: the amount of letters that are displayed on a specific moment, the given value is the start-amount of letters
    //text2: the text to display on <text>#line2
    //i2: the counter for text2: the amount of letters that are displayed on a specific moment, the given value is the start-amount of letters
    
    $("#santinator #lineyes").html(""); //clear the yes-text
    $("#santinator #lineno").html(""); //clear the no-text
    typing = true;
    
    if (i1 < (text1.length)) {
        $("#santinator #line2").html("");
        $("#santinator #line1").html(text1.substring(0, i1+1));
        i1++;
        setTimeout(function() {
            typeWriter(text1, i1, text2, i2)
        }, 60);
        
  } else if(i2 < (text2.length)) {
        $("#santinator #line2").html(text2.substring(0, i2+1));
        i2++;
        setTimeout(function() {
            typeWriter(text1, i1, text2, i2)
        }, 60);
  } else {
        typing = false;
        setTimeout(function() {
            if(currentquestion == questions[4] || currentquestion == questions[5] || currentquestion == questions[6] || currentquestion == questions[7] || currentquestion == questions[9] || currentquestion == questions[10]) {  //If the currentquestion is an end question
                $("#santinator #lineyes").html(""); //clear the yes-text
                $("#santinator #lineno").html("[ANY] Start Again"); //set the no-text on a "start again" message
            } else { //if it's not an end question
                $("#santinator #lineyes").html("[Y] Yes"); //set Yes
                $("#santinator #lineno").html("[N] No"); //set No
            }
        }, 150);
        
  }
}

function toDeg(rad) {
    return rad * (180/Math.PI);
}