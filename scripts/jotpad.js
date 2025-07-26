document.addEventListener('DOMContentLoaded', () => {
    const noteArea = document.getElementById('noteArea');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');

    if (!noteArea) return; // Only run on JotPad page

    
    // Load saved content from localStorage
    noteArea.innerHTML = localStorage.getItem("jotpadContent") || "";

    // Function to save content to localStorage
    const saveContent = () => {
        localStorage.setItem("jotpadContent", noteArea.innerHTML);
    };

    // Save content on input (with a debounce to avoid excessive writes)
    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };
    noteArea.addEventListener("input", debounce(saveContent, 500));

    // PDF Download
    downloadPdfBtn.addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const content = noteArea.innerText;
        if (!content.trim()) {
            alert("Note is empty. Nothing to download.");
            return;
        }
        const doc = new jsPDF();
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(content, 10, 10, { maxWidth: 190 });
        doc.save("NotesVault_JotPad.pdf");
    });

    // Delete All
    deleteAllBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete all content? This cannot be undone.")) {
            noteArea.innerHTML = "";
            localStorage.removeItem("jotpadContent");
        }
    });
});
