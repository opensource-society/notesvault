<!-- JotPad (HTML) -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NotesVault - JotPad</title>

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
    <link rel="stylesheet" href="../styling/jotpad.css" />
    <link rel="stylesheet" href="../styling/base.css" />
    <link rel="stylesheet" href="../styling/variables.css" />
  </head>

  <body>
    <!-- Header -->
    <div id="header-placeholder"></div>

    <!-- Hero Section -->
    <section class="jotpad-hero">
      <div class="container">
        <h1>JotPad</h1>
        <p class="subtitle">A Clean, Real Time Note Taking Editor!</p>
      </div>
    </section>

    <div class="editor-wrapper">
      <div class="editor-container">
        <div class="mode-toggle">
          <button class="mode-btn active" id="textModeBtn">Text Mode</button>
          <button class="mode-btn" id="drawModeBtn">Draw Mode</button>
        </div>
        <!-- Toolbar -->
    <div class="toolbar">
      <button onclick="formatText('bold')"><i class="fas fa-bold"></i></button>
      <button onclick="formatText('italic')"><i class="fas fa-italic"></i></button>
      <button onclick="formatText('underline')"><i class="fas fa-underline"></i></button>

      <!-- font style changing -->
    <select id="fontSelector">
      <option value="Arial" style="font-family: Arial;">Arial</option>
      <option value="Verdana" style="font-family: Verdana;">Verdana</option>
      <option value="Tahoma" style="font-family: Tahoma;">Tahoma</option>
      <option value="Georgia" style="font-family: Georgia;">Georgia</option>
      <option value="Courier New" style="font-family: 'Courier New';">Courier New</option>
      <option value="Times New Roman" style="font-family: 'Times New Roman';">Times New Roman</option>
    </select>

    </div>

        <div class="drawing-container">
          <div
            class="note-box empty"
            contenteditable="true"
            id="noteArea"
            spellcheck="true"
          ></div>
          <canvas id="drawingCanvas"></canvas>
        </div>

        <div class="button-wrapper">
          <button class="download-btn" onclick="downloadPDF()">
            Download as PDF
          </button>
          <button class="delete-btn" onclick="deleteAll()">Delete All</button>
          <button
            class="download-btn"
            id="saveDrawingBtn"
            style="display: none"
          >
            Save Drawing
          </button>
          <button class="delete-btn" id="clearDrawingBtn" style="display: none">
            Clear Drawing
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div id="footer-placeholder"></div>

    <!-- JavaScript -->
    <script src="../scripts/script.js"></script>
    <script src="../scripts/jotpad.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  </body>
</html>
