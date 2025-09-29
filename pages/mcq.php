<!-- MCQ Page (HTML) -->
<?php
  // Database connection configuration
  $host = 'localhost';
  $dbname = 'notesvault'; // Change if your database name is different
  $username = 'root'; // Default XAMPP MySQL user
  $password = ''; // Default XAMPP MySQL password (empty)

  try {
      $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  } catch (PDOException $e) {
      die("Connection failed: " . $e->getMessage());
  }

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      $quizId = $_POST['quizId'];
      $question = $_POST['questionInput'];
      $optionA = $_POST['optionA'];
      $optionB = $_POST['optionB'];
      $optionC = $_POST['optionC'];
      $optionD = $_POST['optionD'];
      $correct = $_POST['correctOption'];

      $stmt = $pdo->prepare("INSERT INTO mcqs 
          (quiz_id, question, option_a, option_b, option_c, option_d, correct) 
          VALUES (?, ?, ?, ?, ?, ?, ?)");
      $stmt->execute([$quizId, $question, $optionA, $optionB, $optionC, $optionD, $correct]);

      echo json_encode(["success" => true]);
  }

  if (isset($_GET['quizId'])) {
    $quizId = $_GET['quizId'];
    $stmt = $pdo->prepare("SELECT * FROM mcqs WHERE quiz_id = ?");
    $stmt->execute([$quizId]);
    $mcqs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($mcqs);
  }
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NotesVault - MCQ</title>

    <!-- Favicon -->
    <link
      rel="icon"
      href="../assets/index/images/favicon.png"
      type="image/x-icon"
    />

    <!-- Font Awesome -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />

    <!-- CSS -->
    <link rel="stylesheet" href="../mcq/mcq.css" />
    <link rel="stylesheet" href="../styling/base.css" />
    <link rel="stylesheet" href="../styling/variables.css" />
  </head>

  <body>
    <!-- Header -->
    <?php include '../components/header.php'; ?>
    <!-- JavaScript -->
    <script src="../scripts/script.js"></script>

    
      <!--section-->
      <section class="quiz-hero">
        <div class="container">
          <h1>Welcome to our mcq generating section</h1>
          <ul class="subtitle">
            <li>Here you can generate your own mcq question using preffered AI tool</li>
            <li>You can create mcq question</li>
            <li>Test as you like</li>
            <li>See your performance</li>
          </ul>
        </div>
      </section>
    <!--section-->
    <div class="mcq-front">
      <div class="button-row">
        <button id="createQuizBtn" class="create-quiz-btn">
          <span>Create Quiz</span>
        </button>
        <div class="mcq-sort">
          <button>
            <span>Newest to Oldest</span>
          </button>
        </div>
      </div>
      <div id="quizCards" class="quiz-cards">
          <!-- Quiz cards will be rendered here by JS -->
      </div>
      <div id="quizSection"></div>
    </div>
      <div class="mcq-container" style="display:none;">
        <button id="backBtn" class="back-btn">< Back</button>
        <h1>Create & Practice MCQs</h1>
        <form id="quizCreateForm" class="mcq-form">
          <input type="text" id="quizName" placeholder="Quiz Name" required />
          <textarea id="quizDescription" placeholder="Description"></textarea>
          <button type="submit">Create Quiz</button>
        </form>
        <form id="mcqForm" class="mcq-form">
          <input type="text" id="questionInput" placeholder="Enter your question..." required />
          <input type="text" id="optionA" placeholder="Option A" required />
          <input type="text" id="optionB" placeholder="Option B" required />
          <input type="text" id="optionC" placeholder="Option C" required />
          <input type="text" id="optionD" placeholder="Option D" required />
          <select id="correctOption" required>
            <option value="">Select Correct Option</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          <button class="addmcq" type="submit">Add MCQ</button>
        </form>
        <div id="mcqList"></div>
      </div>
    </main>
    <?php include '../components/footer.php'; ?>
    <script src="../mcq/mcq.js"></script>
    <script src="../scripts/header.js" defer></script>
    <script src="../scripts/script.js" defer></script>
  </body>
</html>
