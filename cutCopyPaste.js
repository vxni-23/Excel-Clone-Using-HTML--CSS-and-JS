let ctrlKey;
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
})
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})

for(let r = 0; r < rows; r++){
    for(let c = 0; c < cols; c++){
        let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`);
        handleSelectedCells(cell);
    }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let rangeStorage = [];
function handleSelectedCells(cell){
    cell.addEventListener("click", (e) => {
        // select cells range
        if(!ctrlKey) return;
        if(rangeStorage.length >= 2){
            defaultSelectedCellsUI();
            rangeStorage = [];
        }

        cell.style.border = "3px solid seagreen";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);
    })
}

function defaultSelectedCellsUI(){
    for(let i = 0; i < rangeStorage.length; i++){
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid #dfe4ea";
    }
}

let copyData = [];
copyBtn.addEventListener("click", (e) => {
    if(rangeStorage.length < 2) return;
    copyData = [];

    let strRow = rangeStorage[0][0];
    let endRow = rangeStorage[1][0];
    let strCol = rangeStorage[0][1];
    let endCol = rangeStorage[1][1];

    for(let r = strRow ; r <= endRow; r++){
        let copyRow = [];
        for(let c = strCol; c <= endCol; c++){
            let cellProp = sheetDB[r][c];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    defaultSelectedCellsUI();
})

cutBtn.addEventListener("click", (e) => {
    if(rangeStorage.length < 2) return;
    copyData = [];

    let strRow = rangeStorage[0][0];
    let endRow = rangeStorage[1][0];
    let strCol = rangeStorage[0][1];
    let endCol = rangeStorage[1][1];

    for(let r = strRow ; r <= endRow; r++){
        let copyRow = [];
        for(let c = strCol; c <= endCol; c++){
            let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`);
            let cellProp = sheetDB[r][c];
            let originalCellProp = cellProp
            copyRow.push(originalCellProp);
            //db change
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = 14;
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#ecf0f1";
            cellProp.alignment = "left";
            //ui change
            cell.click();
        }
        copyData.push(copyRow);
    }
    console.log(copyData);
    defaultSelectedCellsUI();
})

pasteBtn.addEventListener("click", (e) => {
    //paste cells data
    if(rangeStorage.length < 2) return;

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    let address = addressBar.value;
    let[strow, stcol] = decodeAddress(address);

    for(let r = strow, i = 0; r <= strow + rowDiff; r++, i++){
        for(let c = stcol, j = 0; c <= stcol + colDiff; c++, j++){
            let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`);
            if(!cell) continue;

            //db change
            let data = copyData[i][j];
            let cellProp = sheetDB[r][c];
            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.alignment = data.alignment;

            //ui change
            cell.click();
        }
    }
})
