// Calculator with fixed error handling
document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  var initial = document.getElementById("initial-value");
  var potencial = document.getElementById("potencial-value");
  var calc_btn = document.getElementsByClassName("calc-btn")[0];
  var err_msg_calculator = document.getElementsByClassName("error-msg-calc")[0];

  // Clear any pre-filled value in the potential field
  potencial.value = "";

  // Make sure error is hidden on page load
  if (err_msg_calculator.classList.contains("d-none") === false) {
    err_msg_calculator.classList.add("d-none");
  }

  // Calculator function
  calc_btn.addEventListener("click", function () {
    // Get input value
    var initial_value = parseFloat(initial.value);

    // Clear error display state (using direct style manipulation for reliability)
    err_msg_calculator.style.display = "none";
    err_msg_calculator.classList.add("d-none");

    // Validate input is a number
    if (isNaN(initial_value)) {
      potencial.value = "";
      err_msg_calculator.textContent = "Por favor ingresa un número válido";
      err_msg_calculator.style.color = "red";
      err_msg_calculator.style.display = "block";
      err_msg_calculator.classList.remove("d-none");
      return;
    }

    // Process based on value range
    if (initial_value < 200) {
      potencial.value = "";
      err_msg_calculator.textContent = "El valor mínimo debe ser 200";
      err_msg_calculator.style.color = "red";
      err_msg_calculator.style.display = "block";
      err_msg_calculator.classList.remove("d-none");
    } else if (initial_value == 200) {
      potencial.value = (initial_value * 2.13254).toFixed(2);
    } else if (initial_value > 200 && initial_value < 500) {
      potencial.value = (initial_value * 2.51257).toFixed(2);
    } else if (initial_value >= 500 && initial_value < 1000) {
      potencial.value = (initial_value * 3.54563).toFixed(2);
    } else if (initial_value >= 1000 && initial_value < 5000) {
      potencial.value = (initial_value * 5.19874).toFixed(2);
    } else if (initial_value >= 5000) {
      potencial.value = (initial_value * 5.53647).toFixed(2);
    }

    // Handle PlexopAPI integration if available
    if (typeof $ !== "undefined" && $("#cmt").length > 0) {
      $("#cmt").text(potencial.value);

      if (typeof PlexopAPI !== "undefined") {
        PlexopAPI.setPlexopField("cmt", potencial.value);
      }
    } else {
      var cmtElement = document.getElementById("cmt");
      if (cmtElement) {
        cmtElement.textContent = potencial.value;
      }
    }
  });
});
