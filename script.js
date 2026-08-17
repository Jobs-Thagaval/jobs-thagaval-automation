const fileInput = document.getElementById("fileInput");

const previewSection =
    document.getElementById("previewSection");

const previewContainer =
    document.getElementById("previewContainer");

const fileName =
    document.getElementById("fileName");

const continueButton =
    document.getElementById("continueButton");

const uploadSection =
    document.getElementById("uploadSection");

const processingSection =
    document.getElementById("processingSection");

const downloadSection =
    document.getElementById("downloadSection");

const downloadButton =
    document.getElementById("downloadButton");


/* --------------------------------
   FILE SELECTION
-------------------------------- */

fileInput.addEventListener("change", function () {

    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    fileName.textContent = file.name;

    previewContainer.innerHTML = "";

    const fileURL = URL.createObjectURL(file);


    /* IMAGE PREVIEW */

    if (file.type.startsWith("image/")) {

        const image = document.createElement("img");

        image.src = fileURL;

        image.alt = "Uploaded Job Notification";

        previewContainer.appendChild(image);

    }


    /* PDF PREVIEW */

    else if (file.type === "application/pdf") {

        const iframe = document.createElement("iframe");

        iframe.src = fileURL;

        iframe.title = "PDF Preview";

        previewContainer.appendChild(iframe);

    }


    /* SHOW PREVIEW */

    previewSection.classList.remove("hidden");

    continueButton.disabled = false;

});


/* --------------------------------
   CONTINUE BUTTON
-------------------------------- */

continueButton.addEventListener("click", function () {

    uploadSection.classList.add("hidden");

    processingSection.classList.remove("hidden");

    startProcessing();

});


/* --------------------------------
   PROCESSING SIMULATION
-------------------------------- */

function startProcessing() {

    activateStep(1);

    setTimeout(function () {

        completeStep(1);
        activateStep(2);

    }, 2000);


    setTimeout(function () {

        completeStep(2);
        activateStep(3);

    }, 4000);


    setTimeout(function () {

        completeStep(3);
        activateStep(4);

        downloadSection.classList.remove("hidden");

    }, 6000);


    setTimeout(function () {

        completeStep(4);

    }, 9000);


    setTimeout(function () {

        completeStep(5);

    }, 11000);

}


/* --------------------------------
   ACTIVATE STEP
-------------------------------- */

function activateStep(stepNumber) {

    const step =
        document.getElementById("step" + stepNumber);

    step.classList.add("active");

}


/* --------------------------------
   COMPLETE STEP
-------------------------------- */

function completeStep(stepNumber) {

    const step =
        document.getElementById("step" + stepNumber);

    step.classList.remove("active");

    step.classList.add("completed");

    const icon =
        step.querySelector(".status-icon");

    icon.textContent = "✓";

}


/* --------------------------------
   DOWNLOAD BUTTON
-------------------------------- */

downloadButton.addEventListener("click", function () {

    alert(
        "MP4 generation will be connected in a later module."
    );

});
// ============================================
// APPS SCRIPT CONNECTION TEST
// ============================================

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxKSFsA3BE2iCHANGAQ1cWceucmNtIj6xBpDKHJte71_RvKzeL-BJkJZwRGklySTkyAOQ/exec";


async function testAppsScriptConnection() {

  try {

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: "connection_test"
    });


    const result = await response.text();

    console.log("Apps Script response:", result);

    alert("Apps Script connection successful!");

  } catch (error) {

    console.error("Apps Script connection error:", error);

    alert(
      "Apps Script connection failed.\n\n" +
      error.message
    );

  }

}
