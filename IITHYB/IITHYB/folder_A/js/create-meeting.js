document.getElementById("meetingForm").addEventListener("submit", function(event){

    event.preventDefault();

    alert("Meeting Created Successfully!");

    window.location.href = "meeting.html";

});