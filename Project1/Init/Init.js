function Init() {
	new FAParser();
};

function openExplorer() {
  getElement('dotFile').click();
  getElement('dotFile').addEventListener('change', readFile, false);
};

function About() {
  alert("Developed by Alexandre Ribeiro, João Sousa & Luís");
};