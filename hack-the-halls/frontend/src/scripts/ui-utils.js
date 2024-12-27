export const createButton = () => {
  const button = document.createElement("button");

  Object.assign(button.style, {
    position: "fixed",
    top: "120px",
    right: "10px",
    zIndex: "999999",
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
  });

  button.onmouseover = () => (button.style.backgroundColor = "#0056b3");
  button.onmouseout = () => (button.style.backgroundColor = "#007bff");
  button.textContent = "Process Course";

  return button;
};

export const createStatusDiv = () => {
  const statusDiv = document.createElement("div");

  Object.assign(statusDiv.style, {
    position: "fixed",
    top: "160px",
    right: "10px",
    zIndex: "999999",
    padding: "8px",
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    display: "none",
  });

  return statusDiv;
};

export const updateStatus = (statusDiv, message) => {
  statusDiv.style.display = "block";
  statusDiv.textContent = message;
};
