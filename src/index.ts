import "./styles.css";
import Papa from "papaparse";

async function fetchCSVData(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  } catch (error) {
    console.error("Could not fetch the CSV data:", error);
    return "";
  }
}

async function loadCSVData() {
  const csvData = await fetchCSVData(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSXBJRlF27lOOildR4m9Wxdl6YYEDytweNMLDPnyppmEp00p6BdDJaKzkFKVpi1SB2w6GTQBM8ebpyM/pub?gid=0&single=true&output=csv",
  );
  Papa.parse(csvData, {
    header: true,
    delimiter: ",",
    complete: function (results) {
      const htmlContent = generateHTMLContent(results);
      document.getElementById("qa-content")!.innerHTML = htmlContent;
    },
  });
}

loadCSVData();
function generateHTMLContent(data: Papa.ParseResult<any>) {
  return data.data.reduce((html, row) => {
    if (Object.keys(row).length >= 3) {
      const question = row["Вопрос клиента"];
      const humanAnswer = row["Ответ агента"];
      const gptAnswer = row["GPT4"];
      html += `
        <div class="qa-item">
          <h3>${question}</h3>
          <div class="answers">
            <div class="answer human">
              <span class="icon">👤</span>
              <p>${humanAnswer}</p>
            </div>
            <div class="answer gpt">
              <span class="icon">🤖</span>
              <p>${gptAnswer}</p>
            </div>
          </div>
        </div>`;
    }
    return html;
  }, "");
}
