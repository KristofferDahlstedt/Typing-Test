
// let wordBank = [
//     "det",
//     "var",
//     "en",
//     "gang",
//     "jeg",
//     "deretter",
//     "herfra",
//     "oppover",
//     "hoppe",
//     "norge",
//     "derfor",
//     "og",
//     "også",
//     "min",
//     "din",
//     "nasjonal",
//     "disse",
//     "hvem",
//     "løper",
//     "vandre"
// ]

let goalString = []
let typedString = ""
let currentlyTyping = 0
let wordsTypedCount = 0

let typingTime = 0
let goalTypingTime = 0

let isTyping = false
let isFinished = false

let xPos = 10

let triangleHrange = 0
let triangleHdir = -1
let triangleH = 25

let triangleMoveDir = -1
let triangleMinPosY = 170
let triangleMaxPosY = 190
let triangleRelativePosY = 170

let font



function preload() {
    font = loadFont("Rubik-VariableFont_wght.ttf")
}

function setup() {
    createCanvas(500, 500)

    for (var i = 0; i < 100; i++) {
        goalString.push(wordBank[round(random(wordBank.length-1))])
    }
}

function draw() {
    background(10)
    textFont(font)
    
    if (!isFinished) {

    timeText()

    if (!isTyping) {

        setStrokeAndSize(255, 30)
        textAlign(CENTER)
        text("start typing...", width/2, height/8)
        
        let typingTimeOptions = [5, 15, 30, 60]

        typingTimeOptions.forEach((typingTime, i) => {
            typeTimeButton(typingTime, width-80, height/1.5-35*typingTimeOptions.length/2+35*i, 140, 30)
        })

        textAlign(LEFT)
        setStrokeAndSize(100, 50)        
        text(goalString[currentlyTyping], xPos, height/2+15)
        
        boppingTriangle()
        
        return
    }

    
    
    wpmText()


        if (typingTime >= goalTypingTime) {
            isFinished = true
        }
        
        typingTime += deltaTime/1000

        // line(width/2, 0, width/2, height)
        // line(0, height/2, width, height/2)

        if (typedString === goalString[currentlyTyping]) {
            currentlyTyping += 1
            wordsTypedCount += 1
            typedString = ""
        }

        typingArea()
    } else {
        setStrokeAndSize(255, 30)
        textAlign(CENTER)
        // text(`Total words typed: ${wordsTypedCount} words in ${formatTime(typingTime)}`, width/2, height/8)
        text(`Total words typed: ${wordsTypedCount}`, width/2, height/8)
        text(`Time typed: ${formatTime(typingTime)}`, width/2, height/8+32)
        text(`Words per minute: ${getWPM()}`, width/2, height/8+64)

        retryButton(width/2, height/2, 150, 50)
    }
}

function retryButton(posX, posY, w, h) {
    rectMode(CENTER)
    textAlign(CENTER)
    fill(255)
    if (mouseX > posX-w/2 && mouseX < posX+w/2) {
        if (mouseY > posY-h/2 && mouseY < posY+h/2) {
            fill(230)
            if (mouseIsPressed) {
                location.reload()
            }
        }
    }
    rect(posX, posY, w, h, 50)
    fill(0)
    textSize(30)
    text("retry", posX, posY+h/4)
}

function typingArea() {
    textSize(50)
    textAlign(LEFT)
    
    
    for(var i = -1; i <= 1; i++) {
        stroke(100)
        fill(100)
        text(goalString[currentlyTyping+i], xPos, height/2+i*50+15)
    }
    
    if (typedString === goalString[currentlyTyping].substring(0, typedString.length)) {
        stroke(255)
        fill(255)
    } else {
        stroke(255, 0, 0)
        fill(255, 0, 0)
    }

    text(typedString, xPos, height/2+15)
}

function typeTimeButton(typeTime, posX, posY, w, h) {
    rectMode(CENTER)
    textAlign(CENTER)
    fill(255)
    if (mouseX > posX-w/2 && mouseX < posX+w/2) {
        if (mouseY > posY-h/2 && mouseY < posY+h/2) {
            fill(230)
            if (mouseIsPressed) {
                goalTypingTime = typeTime
            }
        }
    }
    rect(posX, posY, w, h, 50)
    fill(0)
    textSize(20)
    text(typeTime + " seconds", posX, posY+h/4)
}

function startGame() {
    if (!isTyping  && goalTypingTime > 0) {
        isTyping = true
    }
}

function boppingTriangle() {
    setStrokeAndSize(100, 50)   
    fill(255)
    noStroke()
    let triangleRelativePosX = textWidth(goalString[currentlyTyping])/2
    let triangleW = 25
    
    if (triangleMoveDir > 0) {
        triangleRelativePosY += triangleMoveDir * (triangleMaxPosY-triangleRelativePosY)*0.05
        if (triangleRelativePosY >= triangleMaxPosY-2) {
            triangleMoveDir *= -1
        }
    } else {
        triangleRelativePosY += triangleMoveDir * -(triangleMinPosY-triangleRelativePosY)*0.05
        if (triangleRelativePosY <= triangleMinPosY+2) {
            triangleMoveDir *= -1
        }
    }

    triangle(triangleRelativePosX, triangleRelativePosY, 
            triangleRelativePosX+triangleW, triangleRelativePosY, 
            triangleRelativePosX+triangleW/2    , triangleRelativePosY+triangleH);
}

function setStrokeAndSize(strokeColor, size) {
    fill(strokeColor)
    stroke(strokeColor)
    textSize(size)
}

function timeText() {
    stroke(255)
    fill(255)
    textAlign(RIGHT)
    textSize(50)
    text("TIME", width-10, height/2-100)
    text(formatTime(goalTypingTime-typingTime), width-10, height/2-50)
}

function wpmText() {
    stroke(255)
    fill(255)
    textAlign(RIGHT)
    textSize(50)
    text("WPM", width-10, height/2+100)
    text(getWPM(), width-10, height/2+150)
}

function getWPM() {
    return round(currentlyTyping/typingTime*60)
}

function formatTime(time) {
    let mins = Math.floor(time/60)
    let secs = round(time % 60)

    let secsStr = secs.toString()
    let minsStr = mins.toString()
    if (secsStr.length == 1) { secsStr = "0"+secsStr}
    if (minsStr.length == 1) { minsStr = "0"+minsStr}
    
    return(`${minsStr}:${secsStr}`)
}

function keyPressed() {
    if (keyCode === 8) {
        typedString = typedString.substring(0, typedString.length-1)
    }

    startGame()
}

function keyTyped() {
    if (!isTyping) { return; }
    if (keyCode < 65 || keyCode > 90) {
        if (keyCode != 192 && keyCode != 221 && keyCode != 222) {
            return
        }
    }
    typedString += key
    // console.log(key, keyCode)
}

function strToList(str) {
    return (str.split(" "))
}