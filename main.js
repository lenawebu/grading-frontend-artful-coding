
function getGrades () {
    // first get the credentials from the input fields
    const username = $('#student').val()
    const password = $('#password').val()

    // the URL to the grading backend
    url = 'https://tantemalkah.at/2021/artful-coding/grading-backend/'

    // we have to fill in the form data into a FormData object that we
    // will use for the actual POST request (the same thing the browser
    // would do for us in a normal form, when we click on submit)
    data = new FormData()
    data.append('id', username)
    data.append('key', password)

    // we'll use this config object to configure the fetch method, so
    // that we can do a POST (instead of a GET) request and send the
    // data to the grading backend
    config = {
        method: 'POST',
        body: data,
    }

    // now we use fetch to send the request. fetch returns a promise,
    // which has a .then method which takes a function as an argument.
    // this function will be executed whenever the server responded,
    // or the request otherwise fails (e.g. when a timeout happens because
    // the server cannot be reached)
    fetch(url, config).then(processResponse)
}


function processResponse (response) {
    if (response.ok) {
        // now check if we have an OK response, and - as json() also returns
        // a promise - provide an instant function that calls our processGrades
        // function with the actual JSON data as an argument
        response.json().then(json => { processGrades(json) })
    } else {
        // similarly in case of an error we want to call the processError
        // function but provide it not only with the JSON repsonse data, but
        // all the meta info about the response as well
        response.json().then(json => { processError(response, json) })
    }
}


function processError (response, data) {
    console.log(`HTTP Error ${response.status} ${response.statusText}`)
    console.log(data)
    // so data.error is the actual message we might want to supply to the user
    alert(data.error)
}


function processGrades (data) {
    //display the container fot the grades
    $('.login-form').slideToggle(400)
    $('.container-grades').toggle()

    // now data contains our actual grades
    console.log(data)
    //$('#result').text(JSON.stringify(data))

    // so we can use parts of it as well
    $('#name').text(data.fullname)

    $('#totalpoints').text(data.total)

    $('#currentgrade').text(data.grade)

    // console.log(data.breakdown.exercises) // this is an object
    // $('#exercise').text(data.breakdown.exercises.total) // this is the .total of the object
    // // we can loop through the exercise breakdown
    // let ex_details = ''
    // for (const ex of data.breakdown.exercises.breakdown) {
    //     // console.log(ex)
    //     ex_details += `${ex.points} for ${ex.for}, `
    // }
    // // so let's update the output field
    // $('#exercise').text(`${data.breakdown.exercises.total} (${ex_details})`)

    //Points for attendance
    percentage_att = (data.breakdown.attendance.total / 25)*100
    $('#attendance-total').text(`${data.breakdown.attendance.total} points`)
    $('#progbar-attendance').css("width", `${percentage_att}%`).animate({width:'toggle', easing: "easeout"}, 1500);
    $('#attendance').append(`<p class="comment">${data.breakdown.attendance.comment}<p>`)
    $('#attendance').append(`<h4>Breakdown:</h4>`)
    
    for (const att of data.breakdown.attendance.breakdown) {
        $('#attendance').append(`<p>${att.for}: ${att.points} points</p>`)
        }

    //Points for exercises
    percentage_ex = (data.breakdown.exercises.total / 35)*100
    $('#exercise-total').text(`${data.breakdown.exercises.total} points`)
    $('#progbar-exercise').css("width", `${percentage_ex}%`).animate({width:'toggle', easing: "easeout"}, 1500);
    $('#exercise').append(`<p class="comment">${data.breakdown.exercises.comment}<p>`)
    $('#exercise').append(`<h4>Breakdown:</h4>`)
    
    for (const ex of data.breakdown.exercises.breakdown) {
        $('#exercise').append(`<p>${ex.for}: ${ex.points} points</p>`)
        }
    
    //Points for final project
    percentage_fp = (data.breakdown.final_project.total / 25)*100
    $('#final_project-total').text(`${data.breakdown.final_project.total} points`)
    $('#progbar-final_project').css("width", `${percentage_fp}%`).animate({width:'toggle', easing: "easeout"}, 1500);
    $('#final_project').append(`<p class="comment">${data.breakdown.final_project.comment}<p>`)
    $('#final_project').append(`<h4>Breakdown:</h4>`)

    for (const fp of data.breakdown.final_project.breakdown) {
        $('#final_project').append(`<p>${fp.for}: ${fp.points} points</p>`)
        }

    //Points for reviews
    percentage_re = (data.breakdown.reviews.total / 25)*100
    $('#reviews-total').text(`${data.breakdown.reviews.total} points`)
    $('#progbar-reviews').css("width", `${percentage_re}%`).animate({width:'toggle', easing: "easeout"}, 1500);
    $('#reviews').append(`<p class="comment">${data.breakdown.reviews.comment}<p>`)
    $('#reviews').append(`<h4>Breakdown:</h4>`)

    for (const re of data.breakdown.reviews.breakdown) {
        $('#reviews').append(`<p>${re.for}: ${re.points} points</p>`)
        }
}

function accordion () {
    $('.head').click(function(){
        $(this).parent().find('.content').slideToggle(280)
        if ($(this).parent().find('.arrow').text()=='^') {
            $(this).parent().find('.arrow').text('˅')
        } else {
            $(this).parent().find('.arrow').text('^')
        }
    });
}

$( document ).ready(function() {
    accordion()
});

