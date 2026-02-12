document.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded");

  const predictBtn = document.getElementById("predictBtn");

  if (!predictBtn) {
    console.error("Predict button not found");
    return;
  }

  predictBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const resultDiv = document.getElementById("result");
    resultDiv.style.display = "block";
    resultDiv.className = "result-card";
    resultDiv.innerHTML = "🔮 Predicting..."

    // ✅ FIX: properly get elements
    const rollNumber = document.getElementById("rollNumber").value;
    const gender = document.getElementById("gender").value;
    const studyTime = parseFloat(document.getElementById("studyTime").value);
    const totalClasses = parseInt(document.getElementById("totalClasses").value);
    const classesAttended = parseInt(document.getElementById("classesAttended").value);
    const tutoring = document.getElementById("tutoring").value;
    const parentalSupport = document.getElementById("parentalSupport").value;

    const data = {
      RollNumber: rollNumber,
      Gender: gender,
      StudyTimeWeekly: studyTime,
      TotalClasses: totalClasses,
      ClassesAttended: classesAttended,
      Tutoring: tutoring,
      ParentalSupport: parentalSupport
    };


    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.prediction === 1) {
        resultDiv.classList.add("pass");
        resultDiv.innerHTML = `
          ✅ Student is likely to PASS
          <br><small>📊 Attendance Ratio: ${result.attendance_ratio}</small>
        `;
      } else {
        resultDiv.classList.add("fail");
        resultDiv.innerHTML = `
          ❌ Student is likely to FAIL
          <br><small>📊 Attendance Ratio: ${result.attendance_ratio}</small>
        `;
      }

    } catch (error) {
      console.error(error);
      resultDiv.classList.add("fail");
      resultDiv.innerHTML = "⚠️ Server Error";
    }
  });
});
