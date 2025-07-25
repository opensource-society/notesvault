const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file");
const preview = document.getElementById("preview");

dropZone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    handleFile(fileInput.files[0]);
  }
});

    ["dragenter", "dragover", "dragleave", "drop"].forEach(event => {
      dropZone.addEventListener(event, e => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    ["dragenter", "dragover"].forEach(event => {
      dropZone.addEventListener(event, () => {
        dropZone.classList.add("bg-blue-50", "border-blue-400", "text-blue-500");
      });
    });

    ["dragleave", "drop"].forEach(event => {
      dropZone.addEventListener(event, () => {
        dropZone.classList.remove("bg-blue-50", "border-blue-400", "text-blue-500");
      });
    });

    dropZone.addEventListener("drop", e => {
      const files = e.dataTransfer.files;
      if (files.length) {
        handleFile(files[0]);
      }
    });

    function handleFile(file) {
      preview.innerHTML = `<p class="font-medium">Selected: ${file.name}</p>`;

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          const img = document.createElement("img");
          img.src = reader.result;
          img.classList.add("mt-2", "mx-auto", "max-w-[200px]", "rounded-md", "shadow");
          preview.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    }