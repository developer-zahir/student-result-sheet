const search_section = document.querySelector(".search_section");
const search_result_form = document.getElementById("search_result_form");
const sheet = document.querySelector(".markSheet_container");
const preloder = document.querySelector(".preloder");

search_result_form.onsubmit = (e) => {
  e.preventDefault();
  const form_data = new FormData(e.target);
  const data = Object.fromEntries(form_data.entries());
  preloder.style.display = "block";
  let oldData = getData("students");
  const studentResult = oldData.find((item) => item.roll === data.roll && item.reg === data.reg);

  setTimeout(() => {
    preloder.style.display = "none";
    const body = document.querySelector("body");
    body.style.backgroundColor = "#f4fdffe0";
    let content;
    if (studentResult) {
      search_section.style.display = "none";
      sheet.style.display = "block";
      content = `
      <div class="for_print_section">
      <div class="card my-4 mt-5 px-3">
      <div class="card-body student-result-sheet table-responsive-md table-responsive-sm">
        <div class="student-info mt-3">
        <div class="row">
        <div class="col-lg-3"> 
          <img style="width:200px; height:160px; object-fit:cover;" src="${studentResult.photo}" />
          <h3 class="mt-3">${studentResult.name}</h3>
          <p class="m-0">Roll : ${studentResult.roll} | Reg: ${studentResult.reg}</p>
        </div>
       
        <div class="col-lg-9"> 
          <div class="result_status text-end" >
          ${
            getFinalResult({
              bangla: studentResult.result.bangla,
              english: studentResult.result.english,
              math: studentResult.result.math,
              science: studentResult.result.science,
              social_science: studentResult.result.social_science,
              religion: studentResult.result.religion,
            }).result === "F"
              ? '<span class="res_status f">Failed</span>'
              : '<span class="res_status ">Passed</span>'
          }
          </div>
         
        </div>
      </div>
  
      <hr />
      <table class="table table-bordered table-striped">
        <tr>
          <td>Subject</td>
          <td>Marks</td>
          <td>GPA</td>
          <td>Grade</td>
          <td>CGPA</td>
          <td>Final Result</td>
        </tr>
        <tr>
          <td>Bangla</td>
          <td>${studentResult.result.bangla}</td>
          <td>${getGpaGrade(studentResult.result.bangla).gpa}</td>
          <td>${getGpaGrade(studentResult.result.bangla).grade}</td>
          <td rowspan="6">${getFinalResult({
            bangla: studentResult.result.bangla,
            english: studentResult.result.english,
            math: studentResult.result.math,
            science: studentResult.result.science,
            social_science: studentResult.result.social_science,
            religion: studentResult.result.religion,
          }).cgpa.toFixed(2)}</td>
          <td rowspan="6">${
            getFinalResult({
              bangla: studentResult.result.bangla,
              english: studentResult.result.english,
              math: studentResult.result.math,
              science: studentResult.result.science,
              social_science: studentResult.result.social_science,
              religion: studentResult.result.religion,
            }).result
          }</td>
        </tr>
        <tr>
          <td>English</td>
          <td>${studentResult.result.english}</td>
          <td>${getGpaGrade(studentResult.result.english).gpa}</td>
          <td>${getGpaGrade(studentResult.result.english).grade}</td>
        </tr>
        <tr>
          <td>Math</td>
          <td>${studentResult.result.math}</td>
          <td>${getGpaGrade(studentResult.result.math).gpa}</td>
          <td>${getGpaGrade(studentResult.result.math).grade}</td>
        </tr>
        <tr>
          <td>Science</td>
          <td>${studentResult.result.science}</td>
          <td>${getGpaGrade(studentResult.result.science).gpa}</td>
          <td>${getGpaGrade(studentResult.result.science).grade}</td>
        </tr>
        <tr>
          <td>Social Science</td>
          <td>${studentResult.result.social_science}</td>
          <td>${getGpaGrade(studentResult.result.social_science).gpa}</td>
          <td>${getGpaGrade(studentResult.result.social_science).grade}</td>
        </tr>
        <tr>
          <td>Religion</td>
          <td>${studentResult.result.religion}</td>
          <td>${getGpaGrade(studentResult.result.religion).gpa}</td>
          <td>${getGpaGrade(studentResult.result.religion).grade}</td>
        </tr>
      </table>
    </div>
    </div>
    </div>
   </div>
  
    <div class="border rounded-3 p-4 d-flex gap-3 bg-white">
     <button type="button" class="btn btn-primary px-5" onclick="printMarkSheet()">Print</button> 
     <button type="button" class="btn btn-danger px-5" onclick="try_again()">Try again</button> 
    </div>
  
      `;
    } else {
      content = `
      <div class="card my-4 mt-0">
      <div class="card-body student-result-sheet bg-danger-subtle text-center">
        <div class="student-info">
        Result not found 
        </div>
        </div>
        </div>
      
      `;
    }

    sheet.innerHTML = content;
  }, 3000);
};

// Define the print function
const printMarkSheet = () => {
  // sheet.querySelector(".result_status").style.display = "none";
  const printContent = document.querySelector(".markSheet_container .for_print_section").innerHTML;
  const originalContent = document.body.innerHTML;
  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
};

// const try_again = doucment.querySelector('.try_again');
const try_again = () => {
  window.location.reload();
};
