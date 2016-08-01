// util.ts

namespace Util {
    export function loadFile(filename: string, mimeType: string, callback: (response: string) => void) {
        let xobj = new XMLHttpRequest();
        xobj.overrideMimeType(mimeType);
        xobj.open("GET", filename, true);
        xobj.onreadystatechange = () => {
            if (xobj.readyState === 4 && xobj.status === 200) {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    } // loadFile

    export function loadFileJson(filename: string, callback: (response: string) => void) {
        loadFile(filename, "application/json", callback);
    } // loadFileJson
}

declare module "util" {
    export = Util;
}
