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
   STEP 8C-4E
   CLEAR PREVIOUS GOOGLE VIDS DATA
===================================================== */

window.generatedVidsId = null;
window.generatedVidsUrl = null;

localStorage.removeItem("generatedVidsId");
localStorage.removeItem("generatedVidsUrl");

console.log(
    "🧹 Previous Google Vids data cleared."
);


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

        /* =====================================================
   STEP 8C-4E
   CLEAR PREVIOUS GOOGLE VIDS DATA
===================================================== */

window.generatedVidsId = null;
window.generatedVidsUrl = null;

localStorage.removeItem("generatedVidsId");
localStorage.removeItem("generatedVidsUrl");

console.log(
    "🧹 Previous Google Vids data cleared."
);

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
   STEP 8C-4E
   WAIT FOR CORRECT GOOGLE VIDS
===================================== */

console.log(
    "================================="
);

console.log(
    "🎬 STEP 8C-4E - WAIT FOR GOOGLE VIDS"
);

console.log(
    "================================="
);


// =====================================
// CURRENT PRESENTATION
// =====================================

const currentPresentationId =
    processingResult.data.presentationId;


console.log(
    "Current Presentation ID:",
    currentPresentationId
);


// =====================================
// POLLING SETTINGS
// =====================================

const MAX_VIDS_ATTEMPTS = 120;

const VIDS_WAIT_TIME = 5000;

let currentVidsResult = null;


// =====================================
// CHECK GOOGLE VIDS
// =====================================

for (
    let attempt = 1;
    attempt <= MAX_VIDS_ATTEMPTS;
    attempt++
) {

    console.log(
        "🎬 Checking Google Vids... Attempt " +
        attempt +
        "/" +
        MAX_VIDS_ATTEMPTS
    );


    try {

        const vidsResponse =
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
                                "getVidsForPresentation",

                            presentationId:
                                currentPresentationId

                        })

                }
            );


        console.log(
            "Vids finder HTTP status:",
            vidsResponse.status
        );


        if (!vidsResponse.ok) {

            console.warn(
                "Vids finder returned HTTP status:",
                vidsResponse.status
            );

        } else {

            const vidsResult =
                await vidsResponse.json();


            console.log(
                "Google Vids finder result:",
                vidsResult
            );

            console.log(
  "🔎 FULL VIDS FINDER RESPONSE:",
  JSON.stringify(result, null, 2)
);


            // =====================================
            // CORRECT VIDS FOUND
            // =====================================

            if (
                vidsResult.success === true &&
                vidsResult.status === "ready" &&
                vidsResult.vidsId
            ) {

                currentVidsResult =
                    vidsResult;


                window.generatedVidsId =
                    vidsResult.vidsId;


                window.generatedVidsUrl =
                    vidsResult.vidsUrl;


                localStorage.setItem(
                    "generatedVidsId",
                    vidsResult.vidsId
                );


                localStorage.setItem(
                    "generatedVidsUrl",
                    vidsResult.vidsUrl
                );


                console.log(
                    "================================="
                );

                console.log(
                    "🎬 CORRECT GOOGLE VIDS FOUND!"
                );

                console.log(
                    "Vids ID:",
                    vidsResult.vidsId
                );

                console.log(
                    "Vids URL:",
                    vidsResult.vidsUrl
                );

                console.log(
                    "================================="
                );


                // Stop checking
                break;

            }

        }

    } catch (vidsError) {

        console.warn(
            "Google Vids search attempt failed:",
            vidsError
        );

    }


    // =====================================
    // WAIT BEFORE NEXT ATTEMPT
    // =====================================

    if (
        attempt <
        MAX_VIDS_ATTEMPTS
    ) {

        console.log(
            "⏳ Google Vids not ready yet."
        );

        console.log(
            "Waiting 5 seconds before next check..."
        );


        await new Promise(
            function (resolve) {

                setTimeout(
                    resolve,
                    VIDS_WAIT_TIME
                );

            }
        );

    }

}


// =====================================
// FINAL RESULT
// =====================================

if (currentVidsResult) {

    console.log(
        "🎬 Current notification Vids successfully connected."
    );

} else {

    console.log(
        "⚠️ Google Vids is still processing after all attempts."
    );

    console.log(
        "The MP4 download can be attempted later."
    );

}
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
/* =====================================================
   STEP 8C-4F
   WEBSITE → FIND CORRECT GOOGLE VIDS
===================================================== */

async function findGoogleVidsForPresentation(
    presentationId
) {

    console.log(
        "================================="
    );

    console.log(
        "🎬 STEP 8C-4F - FIND GOOGLE VIDS"
    );

    console.log(
        "================================="
    );

    console.log(
        "Presentation ID:",
        presentationId
    );


    if (!presentationId) {

        console.error(
            "❌ Presentation ID is missing."
        );

        return {
            success: false,
            status: "error",
            message: "Presentation ID is missing."
        };

    }


    try {

        console.log(
            "Requesting Google Vids from Apps Script..."
        );


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
                                "findGoogleVidsForPresentation",

                            presentationId:
                                presentationId

                        })

                }
            );


        console.log(
            "Vids finder HTTP status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Apps Script returned HTTP " +
                response.status
            );

        }


        const result =
            await response.json();


        console.log(
            "Google Vids finder result:",
            result
        );


        /* =========================================
           VIDS FOUND
        ========================================= */

        if (
            result.success === true &&
            result.vidsId
        ) {

            window.generatedVidsId =
                result.vidsId;

            window.generatedVidsUrl =
                result.vidsUrl || "";


            localStorage.setItem(
                "generatedVidsId",
                result.vidsId
            );


            if (result.vidsUrl) {

                localStorage.setItem(
                    "generatedVidsUrl",
                    result.vidsUrl
                );

            }


            console.log(
                "================================="
            );

            console.log(
                "🎬 GOOGLE VIDS FOUND!"
            );

            console.log(
                "Vids ID:",
                window.generatedVidsId
            );

            console.log(
                "Vids URL:",
                window.generatedVidsUrl
            );

            console.log(
                "================================="
            );


            return result;

        }


        /* =========================================
           VIDS STILL PROCESSING
        ========================================= */

        console.log(
            "Google Vids is not available yet."
        );

        console.log(
            "Status:",
            result.status
        );


        return result;


    } catch (error) {

        console.error(
            "❌ Google Vids finder error:",
            error
        );


        return {

            success: false,

            status: "error",

            message:
                error.message

        };

    }

}

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
        localStorage.getItem("generatedVidsId");


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

        downloadButton.disabled = true;

        downloadButton.innerText =
            "⏳ Preparing MP4...";


        console.log(
            "Requesting MP4 from Apps Script..."
        );


        // -------------------------------------------------
        // REQUEST MP4
        // -------------------------------------------------

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


            // Open temporary MP4 download URL
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
                "MP4 is still being prepared. " +
                "Please wait and try again."
            );


            return;
        }


        // -------------------------------------------------
        // SERVER ERROR
        // -------------------------------------------------

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
/* =====================================================
   STEP 8C-4A
   STORE GOOGLE VIDS ID
===================================================== */

function storeGeneratedVidsId(vidsUrl) {

    if (!vidsUrl) {

        console.error(
            "❌ Google Vids URL was not provided."
        );

        return false;
    }


    const match =
        vidsUrl.match(
            /docs\.google\.com\/videos\/d\/([^\/?]+)/
        );


    if (!match) {

        console.error(
            "❌ Unable to extract Google Vids ID."
        );

        return false;
    }


    const vidsId =
        match[1];


    window.generatedVidsId =
        vidsId;


    localStorage.setItem(
        "generatedVidsId",
        vidsId
    );


    console.log(
        "================================="
    );

    console.log(
        "✅ GOOGLE VIDS ID STORED"
    );

    console.log(
        "================================="
    );

    console.log(
        "Vids ID:",
        vidsId
    );


    return true;
}
/* =====================================================
   STEP 8C-4F
   AUTOMATIC GOOGLE VIDS POLLING
===================================================== */

async function waitForGoogleVids(
    presentationId,
    maxAttempts = 30,
    delayMs = 10000
) {

    console.log("=================================");
    console.log("🎬 STEP 8C-4F");
    console.log("WAITING FOR GOOGLE VIDS");
    console.log("=================================");

    console.log(
        "Presentation ID:",
        presentationId
    );

    for (
        let attempt = 1;
        attempt <= maxAttempts;
        attempt++
    ) {

        console.log(
            `🔎 Vids check ${attempt}/${maxAttempts}`
        );

        try {

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
                                    "findGoogleVids",

                                presentationId:
                                    presentationId

                            })

                    }
                );


            console.log(
                "Vids finder HTTP status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "Vids finder returned HTTP " +
                    response.status
                );

            }


            const result =
                await response.json();


            console.log(
                "Vids polling result:",
                result
            );


            /* =========================================
               VIDS FOUND
            ========================================= */

            if (
                result.success === true &&
                result.status === "ready" &&
                result.vidsId
            ) {

                console.log(
                    "================================="
                );

                console.log(
                    "🎬 GOOGLE VIDS FOUND!"
                );

                console.log(
                    "================================="
                );

                console.log(
                    "Vids ID:",
                    result.vidsId
                );

                console.log(
                    "Vids URL:",
                    result.vidsUrl
                );


                /* -------------------------------------
                   SAVE NEW VIDS ID
                ------------------------------------- */

                window.generatedVidsId =
                    result.vidsId;


                localStorage.setItem(
                    "generatedVidsId",
                    result.vidsId
                );


                if (result.vidsUrl) {

                    localStorage.setItem(
                        "generatedVidsUrl",
                        result.vidsUrl
                    );

                }


                console.log(
                    "✅ New Vids ID saved."
                );


                return result;

            }


            /* =========================================
               STILL PROCESSING
            ========================================= */

            if (
                result.status === "processing"
            ) {

                console.log(
                    "⏳ Google Vids not ready yet."
                );

                if (
                    attempt < maxAttempts
                ) {

                    console.log(
                        `Waiting ${delayMs / 1000} seconds...`
                    );

                    await new Promise(
                        resolve =>
                            setTimeout(
                                resolve,
                                delayMs
                            )
                    );

                }

                continue;

            }


            /* =========================================
               UNEXPECTED RESULT
            ========================================= */

            console.warn(
                "Unexpected Vids response:",
                result
            );

        } catch (error) {

            console.error(
                "❌ Vids polling error:",
                error
            );

        }


        if (
            attempt < maxAttempts
        ) {

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        delayMs
                    )
            );

        }

    }


    console.error(
        "❌ Google Vids was not found within the polling period."
    );


    return {

        success: false,

        status: "timeout",

        vidsId: null,

        vidsUrl: null

    };

}
