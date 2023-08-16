const typesToHandleEqually = ['U4', 'F1', 'F8']; // 在這裡添加其他您想要相同處理的類型

const ConvertLog = (data, layer = 0) => {
    const space = 4;  // 每一層的縮進空格數，您可以根據需要調整

    return data.reduce((acc, curr) => {
        const indentation = ' '.repeat(layer * space);  // 根據當前層級計算縮進
        console.log("acc", acc);
        switch (curr.type) {

           
            case 'LIST':
                const listLength = curr.value.length;
                const nestedData = ConvertLog(curr.value, layer + 1);
                return acc + `${indentation}<L[${listLength}]\n${nestedData}${indentation}>\n`;  // 在此添加\n
            case 'A':
                const strLength = curr.value.length;
                return acc + `${indentation}<A[${strLength}] "${curr.value}">\n`;
            case 'B':
                return acc + `${indentation}<B[1] 0X${curr.value.toUpperCase()}>\n`;
            default:
                if (typesToHandleEqually.includes(curr.type)) {
                    return acc + `${indentation}<${curr.type}[1] ${curr.value}>\n`;
                }
                return acc;


        }
    }, "");
}

export { ConvertLog }
