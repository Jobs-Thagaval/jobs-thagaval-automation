const fileInput =
    document.getElementById("fileInput");

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

const testUploadButton =
    document.getElementById("testUploadButton");


/* =====================================================
   APPS SCRIPT WEB APP URL
===================================================== */

const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxKSFsA3BE2iCHANGAQ1cWceucmNtIj6xBpDKHJte71_RvKzeL-BJkJZwRGklySTkyAOQ/exec";


/* =====================================================
   FILE SELECTION
===================================================== */

fileInput.addEventListener("change", function () {

    const file = fileInput.files[0];

    if (!file) {
        return;
    }


    /* FILE NAME */

    fileName.textContent = file.name;


    /* CLEAR OLD PREVIEW */

    previewContainer.innerHTML = "";


    /* CREATE TEMPORARY FILE URL */

    const fileURL =
        URL.createObjectURL(file);


    /* =================================================
       IMAGE PREVIEW
    ================================================= */

    if (file.type.startsWith("image/")) {

        const image =
            document.createElement("img");

        image.src = fileURL;

        image.alt =
            "Uploaded Job Notification";

        previewContainer.appendChild(image);

    }


    /* =================================================
       PDF PREVIEW
    ================================================= */

    else if (file.type === "application/pdf") {

        const iframe =
            document.createElement("iframe");

        iframe.src = fileURL;

        iframe.title =
            "PDF Preview";

        previewContainer.appendChild(iframe);

    }


    /* =================================================
       SHOW PREVIEW
    ================================================= */

    previewSection.classList.remove("hidden");

    continueButton.disabled = false;


    /* =================================================
       ENABLE TEMPORARY UPLOAD TEST BUTTON
    ================================================= */

    if (testUploadButton) {

        testUploadButton.disabled = false;

    }

});


/* =====================================================
   CONTINUE BUTTON
   UPLOAD → OCR → GEMINI → GOOGLE SLIDES
===================================================== */

continueButton.addEventListener(
    "click",
    async function () {

        const file =
            fileInput.files[0];


        /* -----------------------------------------
           CHECK FILE
        ----------------------------------------- */

        if (!file) {

            alert(
                "Please select a PDF or image first."
            );

            return;

        }


        continueButton.disabled =
            true;

        continueButton.textContent =
            "Uploading...";


        try {

            /* =====================================
               STEP 1 — UPLOAD FILE
            ===================================== */

            const uploadResult =
                await uploadFileToDrive(
                    file
                );


            if (
                !uploadResult ||
                !uploadResult.success
            ) {

                throw new Error(
                    "File upload failed."
                );

            }


            console.log(
                "Upload successful:",
                uploadResult
            );


            const fileId =
                uploadResult.data.fileId;


            console.log(
                "Uploaded File ID:",
                fileId
            );


            if (!fileId) {

                throw new Error(
                    "Uploaded file ID was not returned."
                );

            }


            /* =====================================
               STEP 2 — SAVE FILE ID
            ===================================== */

            window.uploadedFileId =
                fileId;


            /* =====================================
               STEP 3 — SHOW PROCESSING
            ===================================== */

            uploadSection.classList.add(
                "hidden"
            );

            processingSection.classList.remove(
                "hidden"
            );


            /* =====================================
               STEP 4 — START REAL PROCESSING
            ===================================== */

            console.log(
                "================================="
            );

            console.log(
                "STARTING OCR → GEMINI → PPT"
            );

            console.log(
                "================================="
            );


            continueButton.textContent =
                "Processing...";


            const response =
                await fetch(
                    APPS_SCRIPT_URL,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "text/plain;charset=utf-8"

                        },

                        body:
                            JSON.stringify({

                                action:
                                    "processUploadedNotification",

                                fileId:
                                    fileId

                            })

                    }
                );


            console.log(
                "Processing HTTP status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "Processing server returned HTTP " +
                    response.status
                );

            }


            const processingResult =
                await response.json();


            console.log(
                "================================="
            );

            console.log(
                "OCR → GEMINI → PPT RESULT"
            );

            console.log(
                "================================="
            );

            console.log(
                processingResult
            );


            /* =====================================
               STEP 5 — PROCESSING SUCCESS
            ===================================== */

            if (
                !processingResult.success
            ) {

                throw new Error(

                    processingResult.message ||
                    "Notification processing failed."

                );

            }


            /* =====================================
               STEP 6 — SAVE PRESENTATION DETAILS
            ===================================== */

            if (
                processingResult.data &&
                processingResult.data.presentationId
            ) {
    /* =====================================
       SAVE GENERATED GOOGLE SLIDES
    ===================================== */
                
                window.generatedPresentationId =
                    processingResult.data.presentationId;


                window.generatedPresentationUrl =
                    processingResult.data.presentationUrl;
                
/* =====================================
   SAVE FOR VIDEO CONVERSION
===================================== */

localStorage.setItem(
    "generatedPresentationId",
    processingResult.data.presentationId
);

localStorage.setItem(
    "generatedPresentationUrl",
    processingResult.data.presentationUrl
);

                   /* =====================================
       CONSOLE LOG
    ===================================== */
                
                console.log(
                    "Generated Presentation ID:",
                    window.generatedPresentationId
                );


                console.log(
                    "Generated Presentation URL:",
                    window.generatedPresentationUrl
                );

                console.log(
    "Presentation saved to localStorage."
);


            }


            /* =====================================
               STEP 7 — COMPLETE PROCESSING UI
            ===================================== */

            console.log(
                "================================="
            );

            console.log(
                "GOOGLE SLIDES GENERATED SUCCESSFULLY"
            );

            console.log(
                "================================="
            );


            startProcessing();


        } catch (error) {

            console.error(
                "Processing error:",
                error
            );


            alert(
                "Unable to process notification.\n\n" +
                error.message
            );


            processingSection.classList.add(
                "hidden"
            );

            uploadSection.classList.remove(
                "hidden"
            );


            continueButton.disabled =
                false;

            continueButton.textContent =
                "Continue →";

        }

    }
);


/* =====================================================
   PROCESSING SIMULATION
===================================================== */

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


/* =====================================================
   ACTIVATE PROCESSING STEP
===================================================== */

function activateStep(stepNumber) {

    const step =
        document.getElementById(
            "step" + stepNumber
        );

    step.classList.add("active");

}


/* =====================================================
   COMPLETE PROCESSING STEP
===================================================== */

function completeStep(stepNumber) {

    const step =
        document.getElementById(
            "step" + stepNumber
        );

    step.classList.remove("active");

    step.classList.add("completed");


    const icon =
        step.querySelector(".status-icon");

    icon.textContent = "✓";

}


/* =====================================================
   STEP 8C-3B
   DOWNLOAD MP4 FROM WEBSITE
===================================================== */

downloadButton.addEventListener("click", async function () {

    console.log("=================================");
    console.log("🎬 STEP 8C-3B - DOWNLOAD MP4");
    console.log("=================================");


    // -------------------------------------------------
    // GET VIDS ID
    // -------------------------------------------------

   const vidsId =
    window.generatedVidsId ||
    localStorage.getItem("generatedVidsId") ||
    "1hCp3hfz5j1iEfCvhwo10Mi7vENZVN2oMBDS0lXeEBHA";

    console.log(
        "Vids ID:",
        vidsId
    );


    // -------------------------------------------------
    // CHECK VIDS ID
    // -------------------------------------------------

    if (!vidsId) {

        alert(
            "Google Vids video is not available yet."
        );

        console.error(
            "❌ generatedVidsId is undefined."
        );

        return;
    }


    try {

        downloadButton.disabled =
            true;

        downloadButton.innerText =
            "⏳ Preparing MP4...";


        console.log(
            "Requesting MP4 from Apps Script..."
        );


        // -------------------------------------------------
        // SEND REQUEST TO APPS SCRIPT
        // -------------------------------------------------

        const response =
            await fetch(
                APPS_SCRIPT_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify({

                            action:
                                "downloadMP4WithoutDrive",

                            vidsId:
                                vidsId

                        })

                }
            );


        console.log(
            "Apps Script HTTP status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Apps Script returned HTTP " +
                response.status
            );

        }


        // -------------------------------------------------
        // READ RESPONSE
        // -------------------------------------------------

        const result =
            await response.json();


        console.log(
            "MP4 response:",
            result
        );


        // -------------------------------------------------
        // MP4 READY
        // -------------------------------------------------

        if (
            result.success === true &&
            result.status === "ready" &&
            result.mp4Url
        ) {

            console.log(
                "================================="
            );

            console.log(
                "🎬 MP4 READY!"
            );

            console.log(
                "================================="
            );

            console.log(
                "MP4 URL:",
                result.mp4Url
            );


            downloadButton.disabled =
                false;

            downloadButton.innerText =
                "⬇️ Download MP4";


            // -------------------------------------------------
            // OPEN MP4 DOWNLOAD
            // -------------------------------------------------

            window.open(
                result.mp4Url,
                "_blank"
            );


            return;
        }


        // -------------------------------------------------
        // STILL PROCESSING
        // -------------------------------------------------

        if (
            result.status === "processing"
        ) {

            downloadButton.disabled =
                false;

            downloadButton.innerText =
                "🎬 Download MP4";


            alert(
                "Google Vids is still preparing the MP4. Please wait and try again."
            );


            return;
        }


        // -------------------------------------------------
        // ERROR RESPONSE
        // -------------------------------------------------

        throw new Error(

            result.message ||
            "MP4 download failed."

        );


    }

    catch (error) {

        console.error(
            "❌ MP4 download error:",
            error
        );


        downloadButton.disabled =
            false;

        downloadButton.innerText =
            "⬇️ Download MP4";


        alert(
            "Unable to download MP4.\n\n" +
            error.message
        );

    }

});

/* =====================================================
   REAL FILE UPLOAD TO GOOGLE DRIVE
===================================================== */

async function uploadFileToDrive(file) {

    console.log(
        "Starting upload..."
    );

    console.log(
        "File name:",
        file.name
    );

    console.log(
        "File type:",
        file.type
    );

    console.log(
        "File size:",
        file.size
    );


    try {

        /* ---------------------------------------------
           READ FILE
        --------------------------------------------- */

        const base64Data =
            await readFileAsBase64(file);


        console.log(
            "File converted to Base64."
        );


        /* ---------------------------------------------
           PREPARE DATA
        --------------------------------------------- */

        const uploadData = {

            fileName: file.name,

            mimeType: file.type,

            fileData: base64Data

        };


        console.log(
            "Sending file to Apps Script..."
        );


        /* ---------------------------------------------
           SEND TO APPS SCRIPT
        --------------------------------------------- */

        const response =
            await fetch(
                APPS_SCRIPT_URL,
                {

                    method: "POST",

                    redirect: "follow",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(uploadData)

                }
            );


        /* ---------------------------------------------
           READ RESPONSE
        --------------------------------------------- */

        const result =
            await response.text();


        console.log(
            "Apps Script response:",
            result
        );


        /* ---------------------------------------------
           CONVERT RESPONSE TO JSON
        --------------------------------------------- */

        const data =
            JSON.parse(result);


        /* ---------------------------------------------
           CHECK RESULT
        --------------------------------------------- */

        if (data.success) {

            console.log(
                "Upload successful!",
                data
            );

            alert(
                "File uploaded successfully!"
            );

            return data;

        }


        else {

            throw new Error(
                data.message ||
                "File upload failed."
            );

        }


    }

    catch (error) {

        console.error(
            "Upload error:",
            error
        );


        alert(
            "Upload failed.\n\n" +
            error.message
        );


        throw error;

    }

}


/* =====================================================
   READ FILE AS BASE64
===================================================== */

function readFileAsBase64(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload = function () {

                try {

                    /*
                     * FileReader result:
                     *
                     * data:application/pdf;base64,XXXXXX
                     *
                     * We only need the Base64 portion.
                     */

                    const base64Data =
                        reader.result
                            .split(",")[1];


                    resolve(
                        base64Data
                    );

                }

                catch (error) {

                    reject(error);

                }

            };


            reader.onerror = function () {

                reject(
                    new Error(
                        "Unable to read the selected file."
                    )
                );

            };


            reader.readAsDataURL(file);

        }
    );

}


/* =====================================================
   TEMPORARY REAL UPLOAD TEST
===================================================== */

async function testRealUpload() {

    const file =
        fileInput.files[0];


    /* ---------------------------------------------
       CHECK FILE
    --------------------------------------------- */

    if (!file) {

        alert(
            "Please select a PDF or image first."
        );

        return;

    }


    console.log(
        "Testing real upload:",
        file.name
    );


    /* ---------------------------------------------
       UPLOAD
    --------------------------------------------- */

    await uploadFileToDrive(file);

}
function loadGeneratedPresentation() {

    const presentationId =
        localStorage.getItem(
            "generatedPresentationId"
        );

    const presentationUrl =
        localStorage.getItem(
            "generatedPresentationUrl"
        );

    if (presentationId) {

        window.generatedPresentationId =
            presentationId;

        console.log(
            "Stored Presentation ID:",
            presentationId
        );

    }

    if (presentationUrl) {

        window.generatedPresentationUrl =
            presentationUrl;

        console.log(
            "Stored Presentation URL:",
            presentationUrl
        );

    }

}
loadGeneratedPresentation();
