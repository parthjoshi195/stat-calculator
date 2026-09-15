function startUsingStatLab() {
    document.querySelector(".tools").scrollIntoView({
        behavior: "smooth"
    });
}

function openCalculator() {

    const data = prompt(
        "Enter numbers separated by commas:\nExample: 10, 20, 30, 40, 50"
    );

    if (!data) {
        return;
    }

    const numbers = data
        .split(",")
        .map(Number)
        .filter(num => !isNaN(num));

    if (numbers.length === 0) {
        alert("Please enter valid numbers.");
        return;
    }

    // Mean
    const sum = numbers.reduce((total, num) => total + num, 0);
    const mean = sum / numbers.length;

    // Sort numbers
    const sorted = [...numbers].sort((a, b) => a - b);

    // Median
    let median;

    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        median = (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
        median = sorted[middle];
    }

    // Mode
    const frequency = {};

    numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
    });

    const highestFrequency = Math.max(
        ...Object.values(frequency)
    );

    const modes = Object.keys(frequency)
        .filter(num => frequency[num] === highestFrequency);

    let mode;

    if (highestFrequency === 1) {
        mode = "No mode";
    } else {
        mode = modes.join(", ");
    }

    // Population Variance
    const variance =
        numbers.reduce(
            (total, num) => total + Math.pow(num - mean, 2),
            0
        ) / numbers.length;

    // Population Standard Deviation
    const standardDeviation = Math.sqrt(variance);

    // Show results
    alert(
        "STATISTICAL RESULTS\n\n" +

        "Data: " + numbers.join(", ") + "\n\n" +

        "Mean: " + mean.toFixed(2) + "\n" +

        "Median: " + median.toFixed(2) + "\n" +

        "Mode: " + mode + "\n" +

        "Variance: " + variance.toFixed(2) + "\n" +

        "Standard Deviation: " +
        standardDeviation.toFixed(2)
    );
}
