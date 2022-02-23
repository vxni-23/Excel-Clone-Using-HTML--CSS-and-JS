let downloadBtn = document.querySelector(".download");
let uploadBtn = document.querySelector(".upload");

//download task
downloadBtn.addEventListener("click", (e) => {
    let jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
    let file = new Blob([jsonData], { type: "application/json"});

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
})

//upload task
uploadBtn.addEventListener("click", (e) => {
    // opens file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let fr = new FileReader();
        let fileObj = input.files[0];

        fr.readAsText(fileObj);
        fr.addEventListener("load", (e) => {
            let readSheetData = JSON.parse(fr.result);

            addSheetBtn.click();

            sheetDB = readSheetData[0];
            graphComponentMatrix = readSheetData[1];
            collectedSheetDB[collectedSheetDB.length - 1] = sheetDB;
            collectedGraphComponent[collectedGraphComponent - 1] = graphComponentMatrix;

            handleSheetProperties();
        })
    })
})