//hi
function main() {
    let qNum = prompt("Question Number (type 'all' for all questions at once / 'all check' to answer all and check answers): ")
    if (qNum == "") {
        console.log("No input");
        return -1;
    }
    switch (qNum.toLowerCase()) {
        //if typed in all, iterate through each question calling getAswer()
        case "all":
            for (let x=1;x<ScoreLogic.instances[0].settings.questionsExcludingNotes.length+1;++x) {
                getAnswer(x);
            }
            break;
        //if typed in all, iterate through each question calling getAswer(), then check answers
        case "all check":
            for (let x=1;x<ScoreLogic.instances[0].settings.questionsExcludingNotes.length+1;++x) {
                getAnswer(x);
            }
            checkAns();
            break;
        //otherwise only call once for the question number entered
        default:
            if (qExists(qNum))
                getAnswer(qNum);
            else {
                console.log("Question " + qNum + " does not exist in this lesson (or there was an error)");
                alert("Question " + qNum + " does not exist in this lesson (or there was an error)");
                return -2;
            }
    }
}

function getAnswer(qNum) {
    let q = ScoreLogic.instances[0].settings.questionsExcludingNotes[qNum-1];
    //if sudoku
    if (q.classes[0]=="sudoku" || q.classes[0]=="template") {
        //check if it is radio type (multiple choice of A/B/C/etc) and if so what pos the answer (varies by number of input values)
        let isRadio = -1;
        for (let i=0;i<q.contentDiv.setValueFields.length && isRadio==-1;++i) {
            if (Object.hasOwn(q.contentDiv.setValueFields[i], 'radioCups'))
                isRadio = i;
        }
        console.log(isRadio)
        //if it isn't radio
        if (isRadio==-1) {
            //for each answer box
            for (let i=0;i<Object.keys(q.commentLogic.inputsWithCommentLetters).length;++i) {
                let currLetter = Object.keys(q.commentLogic.inputsWithCommentLetters)[i];
                let id = q.commentLogic.inputsWithCommentLetters[currLetter].UID;
                //if type answer
                if (q.commentLogic.inputsWithCommentLetters[currLetter].tagName=="input") {
                    if (!isNaN(q.commentLogic.engine.allVariablesAndFunctions[currLetter]._value))
                        document.getElementById(id).value = parseFloat(parseFloat(q.commentLogic.engine.allVariablesAndFunctions[currLetter]._value).toPrecision(12));
                    else
                    document.getElementById(id).value = q.commentLogic.engine.allVariablesAndFunctions[currLetter]._value;
                    document.getElementById(id).focus();
                    ICup.cupsById[id]._events['onblur'].forEach( e=> e(event) )
                }
                //if select answer
                else if (q.commentLogic.inputsWithCommentLetters[currLetter].tagName=="select") {
                    let ans = q.commentLogic.engine.allVariablesAndFunctions[currLetter]._value;
                    ans = ans.substr(1, ans.length-2)
                    document.getElementById(id).value = ans;
                    document.getElementById(id).focus()
                    ICup.cupsById[id]._events['onchange'].forEach( e=> e(event) );
                }
            }
        }
        //if is radio
        else {
            let id = -1, ans = -1;
            //get answer
            for (let i=0;i<27 && ans==-1;++i) {
                if (Object.hasOwn(q.commentLogic.inputsWithCommentLetters, String.fromCharCode(i+97))) {
                    ans = q.commentLogic.engine.allVariablesAndFunctions[String.fromCharCode(i+97)]._value;
                }
            }
            //clear selected boxes
            for (let i=0;i<q.contentDiv.setValueFields[isRadio].radioCups.length;++i) {
                id = q.contentDiv.setValueFields[isRadio].radioCups[i].UID;
                document.getElementById(id).checked = false;
            }
            //set correct box and update it
            id = q.contentDiv.setValueFields[isRadio].radioCups[ans.charCodeAt(1)-65].UID;
            document.getElementById(id).focus()
            document.getElementById(id).checked = true;
            ICup.cupsById[id]._events['onclick'].forEach( e=> e(event) )
        }

    }
    else if (q.classes[0]=="question") {
        //if its not radio
        if (!Object.hasOwn(q.contentDiv.setValueFields[0], 'radioCups')) {
            //for each answer
            for (let i=0;i<Object.keys(q.commentLogic.engine.correctAnswers).length;++i) {
                let currLetter = Object.keys(q.commentLogic.engine.correctAnswers)[i];
                let id = q.commentLogic.inputsWithCommentLetters[currLetter].UID
                //if type answer
                if (q.commentLogic.inputsWithCommentLetters[currLetter].tagName=="input") {
                    //type answer
                    if (!isNaN(q.commentLogic.engine.correctAnswers[currLetter]))
                        document.getElementById(id).value = parseFloat(parseFloat(q.commentLogic.engine.correctAnswers[currLetter]).toPrecision(12));
                    else
                        document.getElementById(id).value = q.commentLogic.engine.correctAnswers[currLetter];
                    ICup.cupsById[id]._events['onblur'].forEach( e=> e(event) )
                }
                //if select answer
                else if (q.commentLogic.inputsWithCommentLetters[currLetter].tagName=="select") {
                    //select answer
                    let ans = q.commentLogic.engine.correctAnswers[currLetter];
                    document.getElementById(id).value = ans;
                    document.getElementById(id).focus()
                    ICup.cupsById[id]._events['onchange'].forEach( e=> e(event) );
                }
            }
        }
        //if it is radio
        else {
            let ans = q.commentLogic.engine.correctAnswers, ansPos = 0, id = "";
            //clear selected boxes
            for (let it=0;it<q.contentDiv.setValueFields.length;++it) {
                for (let i=0;i<q.contentDiv.setValueFields[it].radioCups.length;++i) {
                    let idToClear = q.contentDiv.setValueFields[it].radioCups[i].UID;
                    document.getElementById(idToClear).checked = false;
                }
                //find id of correct box and set it
                for (let i=0;i<q.contentDiv.setValueFields[it].radioCups.length && ansPos<Object.keys(q.commentLogic.engine.correctAnswers).length;++i) {
                    if (q.contentDiv.setValueFields[it].radioCups[i].letter==ans[Object.keys(q.commentLogic.inputsWithCommentLetters)[ansPos]]) {
                        id = q.contentDiv.setValueFields[it].radioCups[i].UID;
                        //select box
                        document.getElementById(id).checked = true;
                        document.getElementById(id).focus()
                        ICup.cupsById[id]._events['onclick'].forEach( e=> e(event) )
                    }
                }
                ansPos++;
            }
        }
    }
}
//function to check answers
function checkAns() {
    let subID = window.assignment.submitButtonAndFinalScoreLogic.button.UID;
    ICup.cupsById[subID]._events['onclick'].forEach( e=> e(event) );
}

function qExists(qNum) {
    return (qNum  <= ScoreLogic.instances[0].settings.questionsExcludingNotes.length && qNum >= 1);
}

main();