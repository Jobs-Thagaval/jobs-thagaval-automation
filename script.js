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
   REAL UPLOAD → PROCESSING
===================================================== */

continueButton.addEventListener("click", async function () {

    /* ---------------------------------------------
       CHECK FILE
    --------------------------------------------- */

    const file = fileInput.files[0];

    if (!file) {

        alert(
            "Please select a PDF or image first."
        );

        return;

    }


    /* ---------------------------------------------
       DISABLE BUTTON DURING UPLOAD
    --------------------------------------------- */

    continueButton.disabled = true;

    continueButton.textContent =
        "Uploading...";


    try {

        /* -----------------------------------------
           UPLOAD FILE TO GOOGLE DRIVE
        ----------------------------------------- */

        const result =
            await uploadFileToDrive(file);


        /* -----------------------------------------
           CHECK UPLOAD RESULT
        ----------------------------------------- */

        if (!result || !result.success) {

            throw new Error(
                "File upload was not successful."
            );

        }

        /* -----------------------------------------
   SAVE GENERATED PRESENTATION DETAILS
----------------------------------------- */

if (
    result.data &&
    result.data.presentationId
) {

    window.generatedPresentationId =
        result.data.presentationId;

    window.generatedPresentationUrl =
        result.data.presentationUrl;

    console.log(
        "Generated Presentation ID:",
        window.generatedPresentationId
    );

    console.log(
        "Generated Presentation URL:",
        window.generatedPresentationUrl
    );
}

        /* -----------------------------------------
           UPLOAD SUCCESSFUL
        ----------------------------------------- */

        console.log(
            "Continue upload successful:",
            result
        );


        /* -----------------------------------------
           HIDE UPLOAD SECTION
        ----------------------------------------- */

        uploadSection.classList.add("hidden");


        /* -----------------------------------------
           SHOW PROCESSING SECTION
        ----------------------------------------- */

        processingSection.classList.remove("hidden");


        /* -----------------------------------------
           START PROCESSING
        ----------------------------------------- */

        startProcessing();


    }

    catch (error) {

        console.error(
            "Continue upload error:",
            error
        );


        alert(
            "File upload failed.\n\n" +
            error.message
        );


        /* -----------------------------------------
           RESTORE BUTTON
        ----------------------------------------- */

        continueButton.disabled = false;

        continueButton.textContent =
            "Continue →";

    }

});


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
   DOWNLOAD MP4 BUTTON
===================================================== */

downloadButton.addEventListener("click", async function () {

    console.log("=================================");
    console.log("🎬 DOWNLOAD MP4 CLICKED");
    console.log("=================================");

    const vidsId = window.generatedVidsId;

    console.log("Vids ID:", vidsId);

    if (!vidsId) {

        alert(
            "Video is not available yet. Please complete video generation first."
        );

        return;
    }

    try {

        downloadButton.disabled = true;

        downloadButton.innerText =
            "⏳ Preparing MP4...";


        console.log(
            "Requesting MP4 from Apps Script..."
        );


        const response = await fetch(
            WEB_APP_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify({

                    action:
                        "createMP4FromVids",

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
                "Server returned HTTP " +
                response.status
            );

        }


        const result =
            await response.json();
console.log("Video generation response:", result);

if (result.vidsId) {

    console.log(
        "✅ Google Vids ID stored:",
        window.generatedVidsId
    );

}

        console.log(
            "MP4 response:",
            result
        );


        /* =========================================
           MP4 READY
        ========================================= */

        if (
            result.status === "success" &&
            result.mp4Url
        ) {

            console.log(
                "🎬 MP4 READY!"
            );


            console.log(
                "MP4 URL:",
                result.mp4Url
            );


            downloadButton.innerText =
                "⬇️ Download MP4";


            downloadButton.disabled =
                false;


            /*
             * Open the temporary Google MP4
             * download URL.
             */

            window.open(
                result.mp4Url,
                "_blank"
            );


            return;

        }


        /* =========================================
           STILL PROCESSING
        ========================================= */

        if (
            result.status === "processing"
        ) {

            downloadButton.disabled =
                false;

            downloadButton.innerText =
                "🎬 Generate MP4";


            alert(
                "MP4 is still being prepared. Please wait a little and try again."
            );


            return;

        }


        /* =========================================
           ERROR
        ========================================= */

        throw new Error(

            result.message ||
            "MP4 generation failed."

        );


    } catch (error) {

        console.error(
            "❌ MP4 download error:",
            error
        );


        downloadButton.disabled =
            false;


        downloadButton.innerText =
            "🎬 Download MP4";


        alert(
            "Unable to generate MP4.\n\n" +
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
