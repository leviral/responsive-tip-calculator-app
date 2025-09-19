const footer = document.getElementById("footer");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            footer.classList.add("visible");
        } else {
            footer.classList.remove("visible");
        }
    });
}, {threshold: 1.0}); // 100% sichtbar

observer.observe(footer);

const resetButton = document.getElementById("reset-btn");

const billInput = document.getElementById("bill");
const amountInput = document.getElementById("number_people");
const tipInput = document.getElementById("btn-custom");

function showError(input) {
    input.classList.add("invalid");
}

function removeError(input) {
    input.classList.remove("invalid");
}

function checkError(input) {
    const errorEl = input.parentElement.parentElement.querySelector(".error-message");

    // Custom Rule: "number_people" darf nicht 0 sein
    if (input.id === "number_people" && input.value === "0") {
        input.setCustomValidity("Can't be zero");
        errorEl.textContent = "Can't be zero";
    } else {
        input.setCustomValidity("");
    }

    if (!input.validity.valid) {
        if (input.value === "") errorEl.textContent = "Can't be blank";
        if (input.validity.patternMismatch) errorEl.textContent = "Invalid number";
        showError(input);
        return false;
    } else {
        removeError(input);
        errorEl.textContent = "";
        return true;
    }
}

function validityCheck(targetOrEvent) {
    const input = targetOrEvent?.target ?? targetOrEvent;
    return checkError(input);
}

function handleInputChange() {
    if (billInput.value === "" || amountInput.value === "") {
        resetButton.classList.add("not-active");
        resetButton.setAttribute("disabled", "disabled");
    }

    if (billInput.value && amountInput.value) {
        resetButton.classList.remove("not-active");
        resetButton.removeAttribute("disabled");

        const okBill = checkError(billInput);
        const okAmount = checkError(amountInput);

        if (okBill && okAmount) {
            calcTipAmount();
        } else {
            tipAmountField.innerText = "0.00";
            totalAmountField.innerText = "0.00";
        }
    }
}

resetButton.addEventListener("click", resetInput);

function resetInput() {
    if (!resetButton.hasAttribute("disabled")) {
        billInput.value = "";
        billInput.classList.remove("invalid");
        amountInput.value = "";
        amountInput.classList.remove("invalid");
        customTipBtn.classList.remove("invalid");
        gridButtons.forEach(btn => btn.classList.remove("isSelected"))
        tipInput.value = "";
        tipAmountField.innerText = "0.00";
        totalAmountField.innerText = "0.00";
        resetButton.classList.add("not-active");
        resetButton.setAttribute("disabled", "disabled");
        document.querySelectorAll(".error-message").forEach(msg => (msg.textContent = ""));
        console.log("reset");
    }
}

billInput.addEventListener("input", (event) => {
    handleInputChange();
    validityCheck(event);
});
amountInput.addEventListener("input", (event) => {
    handleInputChange();
    validityCheck(event);
});

const gridButtons = document.querySelectorAll(".btn-style");

gridButtons.forEach(button => {
    button.addEventListener("click", () => {
        handleSelection(button);
        if (billInput.value && amountInput.value) {
            const okBill = checkError(billInput);
            const okAmount = checkError(amountInput);

            if (okBill && okAmount) {
                calcTipAmount();
            } else {
                tipAmountField.innerText = "0.00";
                totalAmountField.innerText = "0.00";
            }
        }
    })
})

function handleSelection(button) {
    const wasActive = button.classList.contains("isSelected");
    gridButtons.forEach(btn => {
        if (btn.id === "btn-custom") {
            disableTyping(button);
        }
        btn.classList.remove("isSelected")
    });
    if (!wasActive) {
        if (button.id === "btn-custom") {
            enableTyping(button);
        }
        button.classList.add("isSelected");
    }
}

function enableTyping(input) {
    input.readOnly = false;
    if (document.activeElement !== input) input.focus({preventScroll: true});
}

function disableTyping(input) {
    input.readOnly = true;
}


const tipAmountField = document.querySelector(".amount-tip");
const totalAmountField = document.querySelector(".amount-total");

function calcTipAmount(tip) {
    const selectedTip = tip ?? getTipAmount();

    const bill = Number(billInput.value);
    const personAmount = Number(amountInput.value);
    if (personAmount > 0) {
        const totalAmount = bill * selectedTip / 100 + bill;

        let tipAmountPerson = bill * selectedTip / 100 / personAmount;
        tipAmountPerson = tipAmountPerson.toFixed(2);

        let totalAmountPerson = totalAmount / personAmount;
        totalAmountPerson = totalAmountPerson.toFixed(2);

        tipAmountField.innerText = tipAmountPerson;
        totalAmountField.innerText = totalAmountPerson;
    }
}

function customErrorCheck(field) {
    if (!field.validity.valid) {
        field.classList.add("invalid");
        return false;
    } else field.classList.remove("invalid");
    return true;
}

const customTipBtn = document.getElementById("btn-custom");

customTipBtn.addEventListener("input", (event) => {
    if (customErrorCheck(event.target))
        calcTipAmount();
    else calcTipAmount(0);
})

function getTipAmount() {
    let selectedTip = null;
    gridButtons.forEach((button) => {
        if (button.classList.contains("isSelected")) {
            if (button.id === "btn-custom") {
                if (button.value === "") {
                    selectedTip = 0;
                }
                selectedTip = button.value
            } else {
                selectedTip = parseInt(button.innerText.replace("%", ""));
                customTipBtn.value = "";
            }
        } else return 0;
    })
    return selectedTip;
}


