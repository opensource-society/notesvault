<?php
// ------------- Simple Backend Storage (JSON Files) -----------------
$groupName = isset($_GET['group']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['group']) : 'default';
$baseDir = __DIR__ . "/data";
if (!is_dir($baseDir)) mkdir($baseDir);

$chatFile   = "$baseDir/{$groupName}_chat.json";
$notesFile  = "$baseDir/{$groupName}_notes.json";
$gamesFile  = "$baseDir/{$groupName}_games.json";
$meetingFile= "$baseDir/{$groupName}_meeting.json";

// initialize empty JSON if not exists
foreach ([$chatFile, $notesFile, $gamesFile, $meetingFile] as $f) {
    if (!file_exists($f)) file_put_contents($f, json_encode([]));
}

// API Handling
if (isset($_GET['api'])) {
    header("Content-Type: application/json");
    $api = $_GET['api'];
    $user = isset($_POST['user']) ? $_POST['user'] : "Anonymous";

    if ($api === 'chat_send' && !empty($_POST['msg'])) {
        $msgs = json_decode(file_get_contents($chatFile), true);
        $msgs[] = ["name"=>$user,"text"=>$_POST['msg'],"time"=>date("H:i:s")];
        file_put_contents($chatFile, json_encode($msgs));
        echo json_encode(["status"=>"ok"]);
        exit;
    }
    if ($api === 'chat_get') {
        echo file_get_contents($chatFile);
        exit;
    }
    if ($api === 'note_add' && !empty($_POST['title']) && isset($_POST['content'])) {
        $notes = json_decode(file_get_contents($notesFile), true);
        $notes[] = ["title"=>$_POST['title'], "content"=>$_POST['content'], "user"=>$user, "time"=>date("Y-m-d H:i:s")];
        file_put_contents($notesFile, json_encode($notes));
        echo json_encode(["status"=>"ok"]);
        exit;
    }
    if ($api === 'note_get') {
        echo file_get_contents($notesFile);
        exit;
    }
    if ($api === 'meeting_toggle') {
        $meeting = json_decode(file_get_contents($meetingFile), true);
        if (!isset($meeting['joined'])) $meeting['joined'] = [];
        if (in_array($user, $meeting['joined'])) {
            $meeting['joined'] = array_diff($meeting['joined'], [$user]);
        } else {
            $meeting['joined'][] = $user;
        }
        file_put_contents($meetingFile, json_encode($meeting));
        echo json_encode(["status"=>"ok"]);
        exit;
    }
    if ($api === 'meeting_schedule' && !empty($_POST['datetime'])) {
        $meeting = json_decode(file_get_contents($meetingFile), true);
        if (!isset($meeting['scheduled'])) $meeting['scheduled'] = [];
        $meeting['scheduled'][] = ["datetime"=>$_POST['datetime'], "user"=>$user, "time"=>date("Y-m-d H:i:s")];
        file_put_contents($meetingFile, json_encode($meeting));
        echo json_encode(["status"=>"ok"]);
        exit;
    }
    if ($api === 'meeting_get') {
        echo file_get_contents($meetingFile);
        exit;
    }
    if ($api === 'quiz_add' && !empty($_POST['question']) && !empty($_POST['answer'])) {
        $games = json_decode(file_get_contents($gamesFile), true);
        if (!isset($games['quizzes'])) $games['quizzes'] = [];
        $games['quizzes'][] = ["question"=>$_POST['question'], "answer"=>$_POST['answer'], "user"=>$user];
        file_put_contents($gamesFile, json_encode($games));
        echo json_encode(["status"=>"ok"]);
        exit;
    }
    if ($api === 'quiz_get') {
        echo file_get_contents($gamesFile);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Group: <?php echo htmlspecialchars($groupName); ?></title>
<link rel="stylesheet" href="../styling/groupdetails.css" />
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
<h2>Group: <?php echo htmlspecialchars($groupName); ?></h2>
<div>
    <button class="tab-btn" data-tab="chat">Chat</button>
    <button class="tab-btn" data-tab="notes">Notes</button>
    <button class="tab-btn" data-tab="meeting">Meeting</button>
    <button class="tab-btn" data-tab="games">Games</button>
</div>

<!-- Chat -->
<div class="tab-content" id="chat">
    <h3>Group Chat</h3>
    <div class="chat-window" id="chatWindow"></div>
    <input type="text" id="chatInput"><button id="chatSend">Send</button>
</div>

<!-- Notes -->
<div class="tab-content" id="notes">
    <h3>Notes</h3>
    <div id="notesList"></div>
    <input type="text" id="noteTitle" placeholder="Note title">
    <textarea id="noteContent" placeholder="Note content" rows="4"></textarea>
    <button id="noteShare">Share Note</button>
</div>

<!-- Meeting -->
<div class="tab-content" id="meeting">
    <h3>Meeting</h3>
    <div id="meetingList"></div>
    <button id="meetingToggle">Join/Leave Meeting</button>
    <h4>Schedule a Meeting</h4>
    <input type="datetime-local" id="meetingDateTime">
    <button id="meetingScheduleBtn">Schedule Meeting</button>
</div>

<!-- Games -->
<div class="tab-content" id="games">
    <h3>Games</h3>
    <div id="gamesList"></div>
    <h4>Create a Quiz Question</h4>
    <input type="text" id="quizQuestion" placeholder="Question">
    <input type="text" id="quizAnswer" placeholder="Answer">
    <button id="quizAddBtn">Add Quiz Question</button>
    <h4>Play Quiz</h4>
    <button id="quizStartBtn">Start Quiz</button>
    <div class="quiz-container" id="quizContainer" style="display:none;">
        <div class="quiz-question" id="quizQuestionDisplay"></div>
        <input type="text" id="quizUserAnswer" placeholder="Your answer">
        <button id="quizSubmitBtn">Submit Answer</button>
        <div class="quiz-feedback" id="quizFeedback"></div>
    </div>
</div>

<script>
let userName = localStorage.getItem("userEmail") || "Anonymous";

$(".tab-btn").click(function(){
    $(".tab-content").removeClass("active");
    $("#" + $(this).data("tab")).addClass("active");
});

// Chat
function loadChat(){
    $.get("?group=<?php echo $groupName; ?>&api=chat_get",function(data){
        let html="";
        data.forEach(m=> {
            let cls = m.name === userName ? "you" : "other";
            html+=`<div class="chat-message ${cls}"><b>${m.name}</b>: ${m.text}<small>${m.time}</small></div>`;
        });
        $("#chatWindow").html(html);
        $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
    },"json");
}
$("#chatSend").click(function(){
    let msg=$("#chatInput").val().trim();
    if(!msg) return;
    $.post("?group=<?php echo $groupName; ?>&api=chat_send",{msg:msg, user:userName},()=>{ $("#chatInput").val(""); loadChat(); });
});
setInterval(loadChat,2000);

// Notes
function loadNotes(){
    $.get("?group=<?php echo $groupName; ?>&api=note_get",function(data){
        let html="";
        data.forEach(n=> html+=`<div class="note-item"><div class="note-title">${n.title}</div><div class="note-content">${n.content}</div><small>by ${n.user} at ${n.time}</small></div>`);
        $("#notesList").html(html);
    },"json");
}
$("#noteShare").click(function(){
    let title=$("#noteTitle").val().trim();
    let content=$("#noteContent").val().trim();
    if(!title || !content) return;
    $.post("?group=<?php echo $groupName; ?>&api=note_add",{title:title, content:content, user:userName},()=>{ $("#noteTitle").val(""); $("#noteContent").val(""); loadNotes(); });
});

// Meeting
function loadMeeting(){
    $.get("?group=<?php echo $groupName; ?>&api=meeting_get",function(data){
        let html="<h4>Joined Users:</h4>";
        if(data.joined && data.joined.length > 0){
            data.joined.forEach(u=> html+=`<div class="meeting-item">${u} is in meeting</div>`);
        } else {
            html+="<p>No one joined yet.</p>";
        }
        html+="<h4>Scheduled Meetings:</h4>";
        if(data.scheduled && data.scheduled.length > 0){
            data.scheduled.forEach(m=> html+=`<div class="meeting-item">${m.datetime} scheduled by ${m.user}</div>`);
        } else {
            html+="<p>No meetings scheduled.</p>";
        }
        $("#meetingList").html(html);
    },"json");
}
$("#meetingToggle").click(function(){
    $.post("?group=<?php echo $groupName; ?>&api=meeting_toggle",{user:userName},()=> loadMeeting());
});
$("#meetingScheduleBtn").click(function(){
    let dt=$("#meetingDateTime").val();
    if(!dt) return;
    $.post("?group=<?php echo $groupName; ?>&api=meeting_schedule",{datetime:dt, user:userName},()=>{ $("#meetingDateTime").val(""); loadMeeting(); });
});
setInterval(loadMeeting,3000);

// Games
let quizzes = [];
function loadGames(){
    $.get("?group=<?php echo $groupName; ?>&api=quiz_get",function(data){
        quizzes = data.quizzes || [];
        let html="<h4>Quiz Questions:</h4>";
        quizzes.forEach((q,i)=> html+=`<div class="game-item">Q${i+1}: ${q.question} (by ${q.user})</div>`);
        $("#gamesList").html(html);
    },"json");
}
$("#quizAddBtn").click(function(){
    let q=$("#quizQuestion").val().trim();
    let a=$("#quizAnswer").val().trim();
    if(!q || !a) return;
    $.post("?group=<?php echo $groupName; ?>&api=quiz_add",{question:q, answer:a, user:userName},()=>{ $("#quizQuestion").val(""); $("#quizAnswer").val(""); loadGames(); });
});
let currentQuizIndex = -1;
$("#quizStartBtn").click(function(){
    if(quizzes.length === 0) return alert("No quizzes available.");
    currentQuizIndex = 0;
    showQuiz();
    $("#quizContainer").show();
});
function showQuiz(){
    if(currentQuizIndex < quizzes.length){
        $("#quizQuestionDisplay").text(quizzes[currentQuizIndex].question);
        $("#quizUserAnswer").val("");
        $("#quizFeedback").text("");
    } else {
        $("#quizContainer").hide();
        alert("Quiz finished!");
    }
}
$("#quizSubmitBtn").click(function(){
    let ans = $("#quizUserAnswer").val().trim().toLowerCase();
    let correct = quizzes[currentQuizIndex].answer.toLowerCase();
    if(ans === correct){
        $("#quizFeedback").text("Correct!").css("color","green");
    } else {
        $("#quizFeedback").text("Wrong! Correct: " + quizzes[currentQuizIndex].answer).css("color","red");
    }
    setTimeout(()=>{ currentQuizIndex++; showQuiz(); }, 2000);
});

// init
loadChat(); loadNotes(); loadMeeting(); loadGames();
</script>
</body>
</html>
